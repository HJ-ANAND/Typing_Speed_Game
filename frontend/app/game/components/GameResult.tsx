import { GameStats } from "../lib/game";

type GameResultProps = {
  result: GameStats;
};

export function GameResult({ result }: GameResultProps) {
  const accuracy = Math.max(
    0,
    Math.round(
      (result.correctCharacters / (result.correctCharacters + result.wrongAttempts || 1)) * 100
    )
  );

  return (
    <div className="result-card-celebration">
      <div className="celebration-header">
        <div className="trophy-icon-glow">🏆</div>
        <h3>Run Complete!</h3>
        <p className="celebration-sub">Here is your performance breakdown</p>
      </div>

      <div className="result-metrics-grid">
        <div className="result-stat-box primary">
          <span className="stat-label">Final Time</span>
          <span className="stat-value">{result.completionTime.toFixed(2)}s</span>
          <span className="stat-note">Includes penalty</span>
        </div>

        <div className="result-stat-box">
          <span className="stat-label">Accuracy</span>
          <span className="stat-value">{accuracy}%</span>
          <span className="stat-note">{result.correctCharacters} / {result.correctCharacters + result.wrongAttempts} total</span>
        </div>

        <div className="result-stat-box">
          <span className="stat-label">Wrong Attempts</span>
          <span className="stat-value text-danger">{result.wrongAttempts}</span>
          <span className="stat-note">+{result.penaltyTime.toFixed(2)}s penalty</span>
        </div>

        <div className="result-stat-box">
          <span className="stat-label">Correct Keys</span>
          <span className="stat-value text-success">{result.correctCharacters}</span>
          <span className="stat-note">100% verified</span>
        </div>
      </div>
    </div>
  );
}
