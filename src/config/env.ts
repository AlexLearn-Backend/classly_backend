import { config } from "dotenv";

config({
  path: '.env'
})

export const {
  PORT, DATABASE_URL,
  FRONTEND_URL,
  ARCJET_KEY, ARCJET_ENV,
  NODE_ENV,
} = process.env;