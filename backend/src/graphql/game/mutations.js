import { GraphQLError } from "graphql";
import { saveGameResult } from "../../game/game.service.js";
export const mutations = {
    saveGameResult: async (_, { input }, context) => {
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
