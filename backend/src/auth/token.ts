import { SignJWT, jwtVerify } from "jose";

import { env } from "../config/env.js";

const secret = new TextEncoder().encode(env.jwtSecret);

const TOKEN_EXPIRATION = "7d";

export type AuthTokenPayload = {
  userId: string;
};

export async function createAuthToken(userId: string): Promise<string> {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRATION)
    .sign(secret);
}

export async function verifyAuthToken(
  token: string,
): Promise<AuthTokenPayload> {
  const { payload } = await jwtVerify(token, secret);

  if (typeof payload.userId !== "string") {
    throw new Error("Invalid authentication token");
  }

  return {
    userId: payload.userId,
  };
}
