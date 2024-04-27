import { db } from "@/src/db";
import { ProjectForInsert, projectFor } from "@/src/db/schema/projectFor";
import { User } from "@/src/db/schema/users";
import {
  WorksForInsert,
  worksFor as worksForTable,
} from "@/src/db/schema/worksFor";
import { addOrUpdateCompany } from "@/src/db/utils/companyUtils";
import { addOrUpdateContact } from "@/src/db/utils/contactUtils";
import { addOrUpdateProject } from "@/src/db/utils/projectUtils";
import { FIBERY_CRM_API_URL } from "@/src/utils/consts";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    console.log("invite-contact");
    let fiberyToken = process.env.FIBERY_TOKEN;

    if (!fiberyToken) {
      console.error("Sync contacts Fibery token is not set");
      return Response.json({
        status: false,
        message: "Fibery token is not set",
      });
    }
    let { fiberyIds } = await request.json();

    if (!fiberyIds || (Array.isArray(fiberyIds) && fiberyIds.length === 0)) {
      return Response.json({
        status: false,
        message: "No Fibery IDs provided",
      });
    }

    for (let i = 0; i < fiberyIds.length; i++) {
      let fiberyId = fiberyIds[i];
      let findContactsQuery = `{
        findContacts(id: { is: "${fiberyId}" }  ) {
          id
          workEMail
          name
          firstName
          lastName
          
          worksFor {
            id
            name
            hasActiveProjects
          }
          projects {
            id
            name
              companyOrClient {
              id
              name
            }
            
          }
          state {
            id
            name
          }
        }
      }`;

      const response = await fetch(FIBERY_CRM_API_URL, {
        method: "POST",
        body: JSON.stringify({ query: findContactsQuery }),
        headers: {
          "Content-Type": `application/json`,
          Authorization: `Token ${fiberyToken}`,
        },
      });

      const result = await response.json();

      let contacts = result.data.findContacts;

      if (!contacts) {
        return Response.json({
          status: false,
          message: "Contacts are undefined or null",
        });
      }

      if (contacts.length === 0) {
        return Response.json({
          status: false,
          message: "No contacts found",
        });
      }

      for (let i = 0; i < contacts.length; i++) {
        let { id, workEMail, name, firstName, lastName, worksFor, projects } =
          contacts[i];

        if (!id || !workEMail) {
          continue;
        }

        let contact: User | undefined = await addOrUpdateContact(
          id,
          workEMail,
          name,
          firstName,
          lastName
        );

        if (!contact) {
          continue;
        }

        let workForPromises = [];
        for (let j = 0; j < worksFor?.length; j++) {
          let company = worksFor[j];
          workForPromises.push(
            addOrUpdateCompany(
              company.id,
              company.name,
              company.hasActiveProjects.includes("Yes")
            )
          );
        }
        let projectsPromises = [];
        for (let j = 0; j < projects?.length; j++) {
          let project = projects[j];
          projectsPromises.push(addOrUpdateProject(project.id, project.name));
        }

        let contactCompanies = await Promise.all(workForPromises);
        let contactProjects = await Promise.all(projectsPromises);

        let relations: any[] = [];
        console.log("contactCompanies", contactCompanies);
        contactCompanies?.forEach((company) => {
          if (company) {
            let newRelation: WorksForInsert = {
              companyId: company?.id,
              userId: contact.id,
            };
            relations.push(db.insert(worksForTable).values(newRelation));
          }
        });
        console.log("contactProjects", contactProjects);
        contactProjects?.forEach((project) => {
          if (project) {
            let newRelation: ProjectForInsert = {
              projectId: project.id,
              userId: contact.id,
            };

            relations.push(db.insert(projectFor).values(newRelation));
          }
        });
        const Mailjet = require("node-mailjet");

        const mailjet = new Mailjet({
          apiKey: process.env.MAILJET_API_KEY ?? "",
          apiSecret: process.env.MAILJET_SECRET_KEY ?? "",
        });
        const request = mailjet.post("send", { version: "v3.1" }).request({
          Messages: [
            {
              From: {
                Email: "support@veedoo.io",
                Name: "Veedoo Support",
              },
              To: [
                {
                  Email:
                    process.env.NODE_ENV == "production"
                      ? contact.email
                      : "taoufiq@veedoo.io",
                  Name: contact.name,
                },
              ],
              TemplateID: 5917862,
              TemplateLanguage: true,
              Subject: "Veedoo Help desk invite",
              Variables: {
                name: contact.name,
                link:
                  process.env.NEXT_PUBLIC_BASE_URL +
                  "/create-account/" +
                  contact.id,
                email: contact.email,
              },
            },
          ],
        });
        request
          .then((result: any) => {
            //console.log(result.body);
          })
          .catch((err: any) => {
            console.log(
              "error sending email in invite-contact ",
              err.statusCode
            );
          });
        await Promise.all(relations);
      }
    }

    return Response.json({
      status: true,
    });
  } catch (e: any) {
    console.error("error in invite contact ", e);
    return Response.json({
      status: false,
      message: e.message,
    });
  }
}

export const OPTIONS = async (request: NextRequest) => {
  // Return Response
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: getCorsHeaders(request.headers.get("origin") || ""),
    }
  );
};

const getCorsHeaders = (origin: string) => {
  // Default options
  const headers = {
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Origin": `[${process.env.NEXT_PUBLIC_BASE_URL},'https://veedoo.fibery.io','https://fibery.io']`,
  };

  // If no allowed origin is set to default server origin
  if (!process.env.NEXT_PUBLIC_BASE_URL || !origin) return headers;

  // If allowed origin is set, check if origin is in allowed origins
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_BASE_URL,
    "https://veedoo.fibery.io",
    "https://fibery.io",
  ];

  // Validate server origin
  if (allowedOrigins.includes("*")) {
    headers["Access-Control-Allow-Origin"] = "*";
  } else if (allowedOrigins.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }

  // Return result
  return headers;
};
