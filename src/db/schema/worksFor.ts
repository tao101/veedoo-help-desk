import { index, pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import { users } from "./users";
import { companies } from "./companies";

export const worksFor = pgTable(
  "works_for",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    companyId: text("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId, table.companyId] }),
      worksForUserIdIndex: index("worksFor_user_id_index").on(table.userId),
      worksForCompanyIdIndex: index("worksFor_company_id_index").on(
        table.companyId
      ),
    };
  }
);

export type WorksFor = typeof worksFor.$inferSelect;
export type WorksForInsert = typeof worksFor.$inferInsert;
