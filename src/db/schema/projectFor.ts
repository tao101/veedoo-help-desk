import { index, pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import { users } from "./users";
import { projects } from "./projects";

export const projectFor = pgTable(
  "projectFor",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId, table.projectId] }),
      projectForUserIdIndex: index("projectFor_user_id_index").on(table.userId),
      projectForProjectIdIndex: index("projectFor_project_id_index").on(
        table.projectId
      ),
    };
  }
);
