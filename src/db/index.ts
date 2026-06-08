import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import { DATABASE_URL } from "../config/env";

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

const sql = neon(DATABASE_URL);
export const db = drizzle(sql);