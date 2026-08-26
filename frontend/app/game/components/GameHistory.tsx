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
      <h2>Game History</h2>

      {history.length === 0 ? (
        <p>No games played yet.</p>
      ) : (
        <ul>
          {history.map((game) => (
            <li key={game.id}>
              {game.completionTime.toFixed(2)}s
              {" — "}
              {game.correctCharacters} correct
              {" — "}
              {game.wrongAttempts} wrong
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
