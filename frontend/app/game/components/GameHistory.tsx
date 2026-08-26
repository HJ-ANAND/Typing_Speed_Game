type GameResult = {
  id: string;
  completionTime: number;
  correctCharacters: number;
  wrongAttempts: number;
  penaltyTime: number;
  createdAt: string;
};

type GameHistoryProps = {
  history: GameResult[];
};

export function GameHistory({ history }: GameHistoryProps) {
  return (
    <section className="card side-card game-history-card">
      <div className="side-card-header">
        <span className="card-badge-icon">⏳</span>
        <h3 className="side-card-title">Recent History</h3>
      </div>

      {history.length === 0 ? (
        <div className="empty-state-box">
          <p className="muted">No completed games yet.</p>
        </div>
      ) : (
        <ul className="history-list">
          {history.map((game, index) => (
            <li className="history-item-row" key={game.id || index}>
              <div className="history-item-meta">
                <span className="history-run-tag">Run #{history.length - index}</span>
                <span className="history-item-sub">
                  {game.correctCharacters} correct · {game.wrongAttempts} wrong
                </span>
              </div>
              <span className="history-item-time">{game.completionTime.toFixed(2)}s</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
