import { mutations } from "./mutations.js";
import { queries } from "./queries.js";
export const resolvers = {
    Query: {
        health: () => "API is healthy",
        ...queries,
    },
    Mutation: mutations,
};
