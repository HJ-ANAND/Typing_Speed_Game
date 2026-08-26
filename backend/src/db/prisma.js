import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client.js";
import { Pool } from "pg";
import { env } from "../config/env.js";
const isProduction = process.env.NODE_ENV === "production";
const pool = new Pool({
    connectionString: env.databaseUrl,
    ...(isProduction && { ssl: { rejectUnauthorized: false } }),
});
const adapter = new PrismaPg(pool);
export const prisma = new PrismaClient({
    adapter,
});
