export type GameStatus = "idle" | "running" | "finished";

export type GameResultData = {
  completionTime: number;
  correctCharacters: number;
  wrongAttempts: number;
  penaltyTime: number;
};

export type GameResult = GameResultData & {
  id: string;
  createdAt: string;
};

export type TypingGameState = {
  letters: string[];
  currentIndex: number;
  correctCharacters: number;
  wrongAttempts: number;
  penaltyTime: number;
  completionTime: number;
  status: GameStatus;
};
