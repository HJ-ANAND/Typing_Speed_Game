export const typeDefs = /* GraphQL */ `
  type GameResult {
    id: ID!
    completionTime: Float!
    correctCharacters: Int!
    wrongAttempts: Int!
    penaltyTime: Float!
    createdAt: String!
  }

  type LeaderboardEntry {
    userId: ID!
    name: String!
    completionTime: Float!
    correctCharacters: Int!
    wrongAttempts: Int!
    penaltyTime: Float!
    createdAt: String!
  }

  input SaveGameResultInput {
    completionTime: Float!
    correctCharacters: Int!
    wrongAttempts: Int!
    penaltyTime: Float!
  }

  extend type Query {
    myGameHistory: [GameResult!]!
    myBestScore: GameResult
    leaderboard(limit: Int): [LeaderboardEntry!]!
  }

  extend type Mutation {
    saveGameResult(input: SaveGameResultInput!): GameResult!
  }
`;
