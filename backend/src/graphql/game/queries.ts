import { GraphQLError } from "graphql";

import {
  getBestScore,
  getGameHistory,
  getLeaderboard,
} from "../../game/game.service.js";

type Context = {
  auth: {
    userId: string;
  } | null;
};

function requireAuth(context: Context) {
  if (!context.auth) {
    throw new GraphQLError("Authentication required", {
      extensions: {
        code: "UNAUTHENTICATED",
      },
    });
  }

  return context.auth.userId;
}

export const queries = {
  myGameHistory: async (_: unknown, __: unknown, context: Context) => {
    const userId = requireAuth(context);

    return getGameHistory(userId);
  },

  myBestScore: async (_: unknown, __: unknown, context: Context) => {
    const userId = requireAuth(context);

    return getBestScore(userId);
  },

  leaderboard: async (
    _: unknown,
    { limit }: { limit?: number },
    context: Context,
  ) => {
    requireAuth(context);

    const requestedLimit = limit ?? 10;

    if (
      !Number.isInteger(requestedLimit) ||
      requestedLimit < 1 ||
      requestedLimit > 100
    ) {
      throw new GraphQLError(
        "Leaderboard limit must be an integer between 1 and 100",
        {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        },
      );
    }

    return getLeaderboard(requestedLimit);
  },
};
