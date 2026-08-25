import { GraphQLError } from "graphql";

import { prisma } from "../../db/prisma.js";

export const queries = {
  me: async (
    _: unknown,
    __: unknown,
    context: {
      auth: {
        userId: string;
      } | null;
    },
  ) => {
    if (!context.auth) {
      throw new GraphQLError("Authentication required", {
        extensions: {
          code: "UNAUTHENTICATED",
        },
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: context.auth.userId,
      },
    });

    if (!user) {
      throw new GraphQLError("User not found", {
        extensions: {
          code: "NOT_FOUND",
        },
      });
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  },
};
