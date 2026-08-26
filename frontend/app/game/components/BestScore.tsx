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
      <h2>Personal best</h2>

      {!score ? (
        <p className="muted">No score yet. Your first run starts the record.</p>
      ) : (
        <div className="history-list">
          <div className="history-row"><span>Completion</span><strong>{score.completionTime.toFixed(2)}s</strong></div>
          <div className="history-row"><span>Accuracy</span><strong>{score.correctCharacters} correct</strong></div>
          <div className="history-row"><span>Penalty</span><strong>{score.penaltyTime.toFixed(2)}s</strong></div>
        </div>
      )}
    </section>
  );
}
