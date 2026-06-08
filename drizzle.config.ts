import { defineConfig } from "drizzle-kit";
import { DATABASE_URL } from "./src/config/env.ts"


if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined")
}

export default defineConfig({
  schema: "./src/db/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL
  }
})