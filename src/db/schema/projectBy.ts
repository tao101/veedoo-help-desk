import { index, pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import { users } from "./users";
import { projects } from "./projects";
import { companies } from "./companies";

export const projectBy = pgTable(
  "projectBy",
  {
    companyId: text("company_id")
      .notNull()
      .references(() => companies.id),
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.companyId, table.projectId] }),
      companyIdIndex: index("projectBy_company_id_index").on(table.companyId),
      projectIdIndex: index("projectBy_project_id_index").on(table.projectId),
    };
  }
);
