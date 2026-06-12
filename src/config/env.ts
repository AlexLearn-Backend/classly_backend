import { config } from "dotenv";

config({
  path: '.env'
})

export const {
  PORT, DATABASE_URL,
  FRONTEND_URL,
  ARCJET_KEY, ARCJET_ENV,
  BETTER_AUTH_SECRET,
  BETTER_AUTH_URL,
  NODE_ENV,
} = process.env;