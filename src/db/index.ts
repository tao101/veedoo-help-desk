import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";

import * as schema from "./schema/schema";

let DB_URL = process.env.DB_URL;
if (!DB_URL) {
  throw new Error("DB_URL is required");
}

const pool = new Pool({ connectionString: DB_URL });
const db = drizzle(pool, {
  schema: schema,
});

export { db, schema };
