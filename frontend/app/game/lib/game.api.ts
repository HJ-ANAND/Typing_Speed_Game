import { graphqlRequest } from "@/app/lib/graphql/client";
import { GameStats } from "./game";

const SAVE_GAME_RESULT_MUTATION = `
  mutation SaveGameResult($input: SaveGameResultInput!) {
    saveGameResult(input: $input) {
      id
      completionTime
      correctCharacters
      wrongAttempts
      penaltyTime
    }
  }
`;

type SaveGameResultResponse = {
  saveGameResult: {
    id: string;
    completionTime: number;
    correctCharacters: number;
    wrongAttempts: number;
    penaltyTime: number;
  };
};

export async function saveGameResult(stats: GameStats) {
  const data = await graphqlRequest<SaveGameResultResponse>(
    SAVE_GAME_RESULT_MUTATION,
    {
      input: stats,
    }
  );

  return data.saveGameResult;
}

const GAME_HISTORY_QUERY = `
  query MyGameHistory {
    myGameHistory {
      id
      completionTime
      correctCharacters
      wrongAttempts
      penaltyTime
      createdAt
    }
  }
`;

const BEST_SCORE_QUERY = `
  query MyBestScore {
    myBestScore {
      id
      completionTime
      correctCharacters
      wrongAttempts
      penaltyTime
      createdAt
    }
  }
`;

type GameResult = {
  id: string;
  completionTime: number;
  correctCharacters: number;
  wrongAttempts: number;
  penaltyTime: number;
  createdAt: string;
};

type GameHistoryResponse = {
  myGameHistory: GameResult[];
};

type BestScoreResponse = {
  myBestScore: GameResult | null;
};

export async function getGameHistory() {
  const data = await graphqlRequest<GameHistoryResponse>(
    GAME_HISTORY_QUERY
  );

  return data.myGameHistory;
}

export async function getBestScore() {
  const data = await graphqlRequest<BestScoreResponse>(
    BEST_SCORE_QUERY
  );

  return data.myBestScore;
}

const ME_QUERY = `
  query Me {
    me {
      id
      name
      email
    }
  }
`;

type MeResponse = {
  me: {
    id: string;
    name: string;
    email: string;
  };
};

export async function getCurrentUser() {
  const data = await graphqlRequest<MeResponse>(ME_QUERY);

  return data.me;
}

const LEADERBOARD_QUERY = `
  query Leaderboard($limit: Int) {
    leaderboard(limit: $limit) {
      userId
      name
      completionTime
      correctCharacters
      wrongAttempts
      penaltyTime
      createdAt
    }
  }
`;

type LeaderboardEntry = {
  userId: string;
  name: string;
  completionTime: number;
  correctCharacters: number;
  wrongAttempts: number;
  penaltyTime: number;
  createdAt: string;
};

type LeaderboardResponse = {
  leaderboard: LeaderboardEntry[];
};

export async function getLeaderboard(limit = 10) {
  const data = await graphqlRequest<LeaderboardResponse>(
    LEADERBOARD_QUERY,
    { limit }
  );

  return data.leaderboard;
}
