import { mutations } from "./mutations.js";
import { queries } from "./queries.js";
export const resolvers = {
    Query: queries,
    Mutation: mutations,
};
