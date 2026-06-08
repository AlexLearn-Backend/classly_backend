import { config } from "dotenv";

config({
  path: '.env'
})

export const {
  PORT, DATABASE_URL,
  FRONTEND_URL,
} = process.env;