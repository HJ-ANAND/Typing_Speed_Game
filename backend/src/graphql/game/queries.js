import { GraphQLError } from "graphql";
import { getBestScore, getGameHistory, getLeaderboard, } from "../../game/game.service.js";
function requireAuth(context) {
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
    myGameHistory: async (_, __, context) => {
        const userId = requireAuth(context);
        return getGameHistory(userId);
    },
    myBestScore: async (_, __, context) => {
        const userId = requireAuth(context);
        return getBestScore(userId);
    },
    leaderboard: async (_, { limit }, context) => {
        requireAuth(context);
        const requestedLimit = limit ?? 10;
        if (!Number.isInteger(requestedLimit) ||
            requestedLimit < 1 ||
            requestedLimit > 100) {
            throw new GraphQLError("Leaderboard limit must be an integer between 1 and 100", {
                extensions: {
                    code: "BAD_USER_INPUT",
                },
            });
        }
        return getLeaderboard(requestedLimit);
    },
};
