import {
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const testTable = pgTable(
  "testTable",
  {
    id: serial("id").primaryKey(),
    name: text("name"),
    updatedAt: timestamp("updated_at", {
      mode: "date",
    }).defaultNow(),
    createdAt: timestamp("created_at", {
      mode: "date",
    }).defaultNow(),
  },
  (table) => {
    return {
      testTableIdIndex: uniqueIndex("test_table_id_index").on(table.id),
    };
  }
);

export type TestTable = typeof testTable.$inferSelect;
export type TestTableInsert = typeof testTable.$inferInsert;
