import { db } from "@/src/db";
import { Company } from "@/src/db/schema/companies";
import { ProjectForInsert, projectFor } from "@/src/db/schema/projectFor";
import { Project } from "@/src/db/schema/projects";
import { User } from "@/src/db/schema/users";
import {
  worksFor as worksForTable,
  WorksForInsert,
} from "@/src/db/schema/worksFor";
import { addOrUpdateCompany } from "@/src/db/utils/companyUtils";
import { addOrUpdateContact } from "@/src/db/utils/contactUtils";
import { addOrUpdateProject } from "@/src/db/utils/projectUtils";
import { FIBERY_CRM_API_URL } from "@/src/utils/consts";
import sleep from "@/src/utils/sleep";

export async function GET(request: Request) {
  try {
    let fiberyToken = process.env.FIBERY_TOKEN;

    if (!fiberyToken) {
      console.error("Sync contacts Fibery token is not set");
      return Response.json({
        status: false,
        message: "Fibery token is not set",
      });
    }

    let findContactsQuery = `{
        findContacts {
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
      await Promise.all(relations);
    }

    return Response.json({
      status: true,
      contactsLength: contacts.length,
      contacts,
    });
  } catch (error: any) {
    console.error("Error in sync contacts", error);
    return Response.json(
      {
        status: false,
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
