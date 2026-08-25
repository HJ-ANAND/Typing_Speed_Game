import { prisma } from "../db/prisma.js";
import { validateGameResult } from "./game.validation.js";

export type SaveGameResultInput = {
  userId: string;
  completionTime: number;
  correctCharacters: number;
  wrongAttempts: number;
  penaltyTime: number;
};

export async function saveGameResult(input: SaveGameResultInput) {
  validateGameResult(input);

  return prisma.gameResult.create({
    data: {
      userId: input.userId,
      completionTime: input.completionTime,
      correctCharacters: input.correctCharacters,
      wrongAttempts: input.wrongAttempts,
      penaltyTime: input.penaltyTime,
    },
  });
}

export async function getGameHistory(userId: string) {
  return prisma.gameResult.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getBestScore(userId: string) {
  return prisma.gameResult.findFirst({
    where: {
      userId,
    },
    orderBy: {
      completionTime: "asc",
    },
  });
}

export async function getLeaderboard(limit = 10) {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      gameResults: {
        orderBy: {
          completionTime: "asc",
        },
        take: 1,
        select: {
          completionTime: true,
          correctCharacters: true,
          wrongAttempts: true,
          penaltyTime: true,
          createdAt: true,
        },
      },
    },
  });

  return users
    .filter((user) => user.gameResults.length > 0)
    .map((user) => {
      const bestScore = user.gameResults[0];

      return {
        userId: user.id,
        name: user.name,
        completionTime: bestScore.completionTime,
        correctCharacters: bestScore.correctCharacters,
        wrongAttempts: bestScore.wrongAttempts,
        penaltyTime: bestScore.penaltyTime,
        createdAt: bestScore.createdAt.toISOString(),
      };
    })
    .sort((a, b) => a.completionTime - b.completionTime)
    .slice(0, limit);
}
