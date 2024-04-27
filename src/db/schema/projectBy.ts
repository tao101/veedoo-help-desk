import { index, pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import { users } from "./users";
import { projects } from "./projects";
import { companies } from "./companies";

export const projectBy = pgTable(
  "projectBy",
  {
    companyId: text("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.companyId, table.projectId] }),
      companyIdIndex: index("projectBy_company_id_index").on(table.companyId),
      projectIdIndex: index("projectBy_project_id_index").on(table.projectId),
    };
  }
);

export type ProjectBy = typeof projectBy.$inferSelect;
export type ProjectByInsert = typeof projectBy.$inferInsert;
