import { boolean, pgTable, text, uniqueIndex } from "drizzle-orm/pg-core";

export const companies = pgTable(
  "companies",
  {
    id: text("id").primaryKey(),
    name: text("name"),
    hasActiveProjects: boolean("has_active_projects"),
  },
  (table) => {
    return {
      companyIdIndex: uniqueIndex("companies_id_index").on(table.id),
    };
  }
);
