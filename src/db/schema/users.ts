import { pgTable, primaryKey, text, uniqueIndex } from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey(),
    email: text("email").unique().notNull(),
    hashed_password: text("hashed_password"),
    name: text("name"),
    firstName: text("first_name"),
    lastName: text("last_name"),
    state: text("state"),
    phone: text("phone"),
    tmpResetPasswordToken: text("tmp_reset_password_token"),
  },
  (table) => {
    return {
      userIdIndex: uniqueIndex("users_id_index").on(table.id),
      userEmailIndex: uniqueIndex("users_email_index").on(table.email),
    };
  }
);

export type User = typeof users.$inferSelect;
export type UserInsert = typeof users.$inferInsert;
