import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/index.js";
import {
  BETTER_AUTH_SECRET, FRONTEND_URL,
  BETTER_AUTH_URL
} from "../config/env.js";
import * as schema from "../db/schema/auth.js"


if (!BETTER_AUTH_SECRET || !FRONTEND_URL || !BETTER_AUTH_URL)
  throw new Error("Please define required variables in .env file!")


export const auth = betterAuth({
  baseURL: BETTER_AUTH_URL!,
  secret: BETTER_AUTH_SECRET!,
  trustedOrigins: [FRONTEND_URL!],
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: 'string', required: true, defaultValue: 'student', input: true 
      },
      imageCldPubId: {
        type: 'string', required: false, input: true
      }
    }
  }
});