type GameResult = {
  completionTime: number;
  correctCharacters: number;
  wrongAttempts: number;
  penaltyTime: number;
};

type BestScoreProps = {
  score: GameResult | null;
};

export function BestScore({ score }: BestScoreProps) {
  return (
    <section>
      <h2>Best Score</h2>

      {!score ? (
        <p>No score yet.</p>
      ) : (
        <div>
          <p>Time: {score.completionTime.toFixed(2)}s</p>
          <p>Correct: {score.correctCharacters}</p>
          <p>Wrong: {score.wrongAttempts}</p>
          <p>Penalty: {score.penaltyTime.toFixed(2)}s</p>
        </div>
      )}
    </section>
  );
}
