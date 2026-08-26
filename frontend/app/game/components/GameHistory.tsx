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
    <section>
      <h2>Game history</h2>

      {history.length === 0 ? (
        <p className="muted">No completed games yet.</p>
      ) : (
        <ul className="history-list">
          {history.map((game) => (
            <li className="history-row" key={game.id}>
              <span>{game.correctCharacters} correct · {game.wrongAttempts} wrong</span>
              <strong>{game.completionTime.toFixed(2)}s</strong>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
