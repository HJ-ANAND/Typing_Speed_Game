"use client";

import { useEffect, useState } from "react";
import { getLeaderboard, type LeaderboardEntry } from "@/app/game/lib/game.api";
import AuthGuard from "@/app/components/AuthGuard";

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        const data = await getLeaderboard(10);
        setLeaderboard(data);
      } catch (error) {
        console.error("Failed to load leaderboard:", error);
        setError("Unable to load leaderboard.");
      } finally {
        setLoading(false);
      }
    }

    loadLeaderboard();
  }, []);

  return (
    <AuthGuard>
      <main className="page-container">
        <header className="dashboard-hero">
          <div>
            <p className="eyebrow">Global rankings</p>
            <h1 className="page-heading">Leaderboard</h1>
            <p className="page-subtitle">The cleanest, quickest runs rise to the top.</p>
          </div>
        </header>

        {loading ? (
          <p className="muted">Loading leaderboard...</p>
        ) : error ? (
          <p className="form-error">{error}</p>
        ) : leaderboard.length === 0 ? (
          <section className="card content-card">
            <p className="empty-state">No scores yet. Be the first to set the pace.</p>
          </section>
        ) : (
          <section className="card leaderboard-card">
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Player</th>
                  <th>Best time</th>
                  <th>Accuracy</th>
                  <th>Penalties</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, index) => (
                  <tr key={entry.userId}>
                    <td className={"rank " + (index < 3 ? "rank-top" : "")}>#{index + 1}</td>
                    <td className="player-name">{entry.name}</td>
                    <td className="score-time">{entry.completionTime.toFixed(2)}s</td>
                    <td>{entry.correctCharacters} correct</td>
                    <td>{entry.wrongAttempts} wrong</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      </main>
    </AuthGuard>
  );
}
