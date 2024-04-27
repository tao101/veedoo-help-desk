import { eq } from "drizzle-orm";
import { db } from "..";
import { CompanyInsert, companies } from "../schema/companies";

export async function addOrUpdateCompany(
  id: string,
  name: string,
  hasActiveProjects: boolean
) {
  let company = await db.query.companies.findFirst({
    where: eq(companies.id, id),
  });

  if (!company) {
    company = await addCompany(id, name, hasActiveProjects);
  } else {
    company = await updateCompany(id, name, hasActiveProjects);
  }

  return company;
}

export async function addCompany(
  id: string,
  name: string,
  hasActiveProjects: boolean
) {
  let newCompany: CompanyInsert = {
    id: id,
    name: name,
    hasActiveProjects: hasActiveProjects,
  };

  let company = await db.insert(companies).values(newCompany).returning();
  return company?.length > 0 ? company[0] : undefined;
}

export async function updateCompany(
  id: string,
  name: string,
  hasActiveProjects: boolean
) {
  let company = await db
    .update(companies)
    .set({
      name: name,
      hasActiveProjects: hasActiveProjects,
    })
    .where(eq(companies.id, id))
    .returning();
  return company?.length > 0 ? company[0] : undefined;
}
