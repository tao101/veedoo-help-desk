import * as dotenv from "dotenv";
dotenv.config({
  path: ".env.local",
});

import { defineConfig } from "drizzle-kit";

let DB_URL = process.env.DB_URL;
if (!DB_URL) {
  throw new Error("DB_URL is required");
}

export default defineConfig({
  schema: "./src/db/schema/*",
  driver: "pg",
  dbCredentials: {
    connectionString: DB_URL,
  },
  verbose: true,
  strict: true,
  out: "./drizzle",
});
