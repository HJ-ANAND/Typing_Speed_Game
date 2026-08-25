import { createSchema } from "graphql-yoga";

import { user } from "./graphql/user/index.js";
import { game } from "./graphql/game/index.js";

const baseTypeDefs = /* GraphQL */ `
  type Query {
    health: String!
  }

  type Mutation {
    _empty: Boolean
  }
`;

export const schema = createSchema({
  typeDefs: [
    baseTypeDefs,
    user.typeDefs,
    game.typeDefs,
  ],
  resolvers: [
    {
      Query: {
        health: () => "API is healthy",
      },
    },
    user.resolvers,
    game.resolvers,
  ],
});
