import {
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const sessions = pgTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    expiresAt: timestamp("expires_at", {
      withTimezone: true,
      mode: "date",
    }).notNull(),
  },
  (table) => {
    return {
      sessionsIdIndex: uniqueIndex("sessions_id_index").on(table.id),
      sessionsUserIdIndex: index("sessions_user_id_index").on(table.userId),
    };
  }
);

export type Session = typeof sessions.$inferSelect;

export type SessionInsert = typeof sessions.$inferInsert;
