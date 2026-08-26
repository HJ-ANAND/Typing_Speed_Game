import { GameStats } from "../lib/game";

type GameResultProps = {
  result: GameStats;
};

export function GameResult({ result }: GameResultProps) {
  return (
    <div>
      <h2>Result</h2>

      <p>Time: {result.completionTime.toFixed(2)}s</p>
      <p>Correct characters: {result.correctCharacters}</p>
      <p>Wrong attempts: {result.wrongAttempts}</p>
      <p>Penalty time: {result.penaltyTime.toFixed(2)}s</p>
    </div>
  );
}
