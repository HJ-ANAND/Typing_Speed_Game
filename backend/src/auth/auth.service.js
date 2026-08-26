import { GraphQLError } from "graphql";
import { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../db/prisma.js";
import { hashPassword, verifyPassword } from "./password.js";
import { createAuthToken } from "./token.js";
export async function register(input) {
    const name = input.name.trim();
    const email = input.email.trim().toLowerCase();
    if (!name) {
        throw new GraphQLError("Name is required", {
            extensions: {
                code: "BAD_USER_INPUT",
            },
        });
    }
    if (!email) {
        throw new GraphQLError("Email is required", {
            extensions: {
                code: "BAD_USER_INPUT",
            },
        });
    }
    if (input.password.length < 8) {
        throw new GraphQLError("Password must be at least 8 characters", {
            extensions: {
                code: "BAD_USER_INPUT",
            },
        });
    }
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });
    if (existingUser) {
        throw new GraphQLError("An account with this email already exists", {
            extensions: {
                code: "CONFLICT",
            },
        });
    }
    const passwordHash = await hashPassword(input.password);
    try {
        const user = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash,
            },
        });
        const token = await createAuthToken(user.id);
        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        };
    }
    catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002") {
            throw new GraphQLError("An account with this email already exists", {
                extensions: {
                    code: "CONFLICT",
                },
            });
        }
        throw error;
    }
}
export async function login(input) {
    const email = input.email.trim().toLowerCase();
    if (!email || !input.password) {
        throw new GraphQLError("Email and password are required", {
            extensions: {
                code: "BAD_USER_INPUT",
            },
        });
    }
    const user = await prisma.user.findUnique({
        where: { email },
    });
    if (!user) {
        throw new GraphQLError("Invalid email or password", {
            extensions: {
                code: "UNAUTHENTICATED",
            },
        });
    }
    const passwordValid = await verifyPassword(input.password, user.passwordHash);
    if (!passwordValid) {
        throw new GraphQLError("Invalid email or password", {
            extensions: {
                code: "UNAUTHENTICATED",
            },
        });
    }
    const token = await createAuthToken(user.id);
    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        },
    };
}
