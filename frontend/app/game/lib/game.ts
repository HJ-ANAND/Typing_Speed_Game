import type { GameResultData } from "./types";

export const TOTAL_LETTERS = 20;

export type GameStats = GameResultData;

export function generateRandomLetter(): string {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  return alphabet[Math.floor(Math.random() * alphabet.length)];
}

export function generateLetters(
  count: number = TOTAL_LETTERS
): string[] {
  return Array.from({ length: count }, () =>
    generateRandomLetter()
  );
}

export function calculatePenalty(
  wrongAttempts: number
): number {
  return wrongAttempts * 0.5;
}
