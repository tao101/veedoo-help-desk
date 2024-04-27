import { eq } from "drizzle-orm";
import { db } from "..";
import { ProjectInsert, projects } from "../schema/projects";

export async function addOrUpdateProject(id: string, name: string) {
  let project = await db.query.projects.findFirst({
    where: eq(projects.id, id),
  });

  if (!project) {
    project = await addProject(id, name);
  } else {
    project = await updateProject(id, name);
  }

  return project;
}
export async function addProject(id: string, name: string) {
  let newProject: ProjectInsert = {
    id: id,
    name: name,
  };

  let project = await db.insert(projects).values(newProject).returning();
  return project?.length > 0 ? project[0] : undefined;
}
export async function updateProject(id: string, name: string) {
  let project = await db
    .update(projects)
    .set({
      name: name,
    })
    .where(eq(projects.id, id))
    .returning();
  return project?.length > 0 ? project[0] : undefined;
}
