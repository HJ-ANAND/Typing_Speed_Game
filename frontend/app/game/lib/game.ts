export type GameStats = {
  completionTime: number;
  correctCharacters: number;
  wrongAttempts: number;
  penaltyTime: number;
};

export function calculateStats(
  target: string,
  typed: string,
  elapsedTime: number
): GameStats {
  let correctCharacters = 0;
  let wrongAttempts = 0;

  for (let i = 0; i < typed.length; i++) {
    if (typed[i] === target[i]) {
      correctCharacters++;
    } else {
      wrongAttempts++;
    }
  }

  const penaltyTime = wrongAttempts * 0.5;

  return {
    completionTime: elapsedTime + penaltyTime,
    correctCharacters,
    wrongAttempts,
    penaltyTime,
  };
}
