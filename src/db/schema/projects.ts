import { boolean, pgTable, text, uniqueIndex } from "drizzle-orm/pg-core";

export const projects = pgTable(
  "projects",
  {
    id: text("id").primaryKey(),
    name: text("name"),
  },
  (table) => {
    return {
      projectIdIndex: uniqueIndex("projects_id_index").on(table.id),
    };
  }
);
