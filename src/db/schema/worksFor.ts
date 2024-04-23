import { index, pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import { users } from "./users";
import { companies } from "./companies";

export const worksFor = pgTable(
  "works_for",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    companyId: text("company_id")
      .notNull()
      .references(() => companies.id),
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
