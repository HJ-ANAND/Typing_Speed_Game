import "dotenv/config";

const jwtSecret = process.env.JWT_SECRET;
const databaseUrl = process.env.DATABASE_URL;

if (!jwtSecret) {
  throw new Error("JWT_SECRET is not configured");
}

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not configured");
}

export const env = {
  jwtSecret,
  databaseUrl,
};
