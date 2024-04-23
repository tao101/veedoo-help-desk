import { pgTable, primaryKey, text, uniqueIndex } from "drizzle-orm/pg-core";
import { companies } from "./companies";
import { user } from "@nextui-org/react";

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
  },
  (table) => {
    return {
      userIdIndex: uniqueIndex("users_id_index").on(table.id),
      userEmailIndex: uniqueIndex("users_email_index").on(table.email),
    };
  }
);
