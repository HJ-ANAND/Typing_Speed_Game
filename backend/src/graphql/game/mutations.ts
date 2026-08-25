import { GraphQLError } from "graphql";

import { saveGameResult } from "../../game/game.service.js";

type Context = {
  auth: {
    userId: string;
  } | null;
};

export const mutations = {
  saveGameResult: async (
    _: unknown,
    { input }: { input: {
      completionTime: number;
      correctCharacters: number;
      wrongAttempts: number;
      penaltyTime: number;
    } },
    context: Context,
  ) => {
    if (!context.auth) {
      throw new GraphQLError("Authentication required", {
        extensions: {
          code: "UNAUTHENTICATED",
        },
      });
    }

    return saveGameResult({
      userId: context.auth.userId,
      ...input,
    });
  },
};
