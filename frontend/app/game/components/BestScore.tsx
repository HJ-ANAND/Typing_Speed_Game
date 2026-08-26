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
    <section className="card side-card best-score-card">
      <div className="side-card-header">
        <span className="card-badge-icon">👑</span>
        <h3 className="side-card-title">Personal Best</h3>
      </div>

      {!score ? (
        <div className="empty-state-box">
          <p className="muted">No score yet. Complete your first run to set a record!</p>
        </div>
      ) : (
        <div className="pb-stats-group">
          <div className="pb-hero-time">
            <span className="pb-label">RECORD TIME</span>
            <span className="pb-value">{score.completionTime.toFixed(2)}s</span>
          </div>
          <div className="pb-details-row">
            <div className="pb-detail-item">
              <span className="detail-name">Correct</span>
              <span className="detail-val">{score.correctCharacters}</span>
            </div>
            <div className="pb-detail-item">
              <span className="detail-name">Errors</span>
              <span className="detail-val text-danger">{score.wrongAttempts}</span>
            </div>
            <div className="pb-detail-item">
              <span className="detail-name">Penalty</span>
              <span className="detail-val">+{score.penaltyTime.toFixed(2)}s</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
