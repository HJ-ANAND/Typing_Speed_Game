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
        <header className="page-header-banner">
          <div>
            <span className="eyebrow">Global Speed Champions</span>
            <h1 className="page-heading">Hall of Fame</h1>
            <p className="page-subtitle">The cleanest, quickest runs across all players worldwide.</p>
          </div>
          <div className="trophy-badge-banner">
            <span>👑 Top Speed Demons</span>
          </div>
        </header>

        {loading ? (
          <div className="card content-card loading-box">
            <div className="spinner"></div>
            <p className="muted">Fetching global rankings...</p>
          </div>
        ) : error ? (
          <div className="card content-card">
            <p className="form-error">{error}</p>
          </div>
        ) : leaderboard.length === 0 ? (
          <section className="card content-card empty-leaderboard-hero">
            <div className="empty-trophy-icon">🏆</div>
            <h3>No Scores Logged Yet</h3>
            <p className="empty-state">Be the first legend to complete a speed run and claim the #1 spot!</p>
          </section>
        ) : (
          <section className="card leaderboard-card">
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Player</th>
                  <th>Best Time</th>
                  <th>Correct Keys</th>
                  <th>Errors</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, index) => {
                  const rankMedal = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`;
                  const initial = entry.name ? entry.name.charAt(0).toUpperCase() : "P";
                  return (
                    <tr key={entry.userId} className={index < 3 ? `top-rank-row rank-${index + 1}` : ""}>
                      <td className="rank-cell">
                        <span className={`rank-badge ${index < 3 ? `medal-${index + 1}` : "rank-number"}`}>
                          {rankMedal}
                        </span>
                      </td>
                      <td className="player-cell">
                        <div className="player-info">
                          <span className="player-avatar">{initial}</span>
                          <span className="player-name">{entry.name}</span>
                        </div>
                      </td>
                      <td className="score-time-cell">
                        <span className="score-time-pill">{entry.completionTime.toFixed(2)}s</span>
                      </td>
                      <td>
                        <span className="stat-pill success">{entry.correctCharacters} correct</span>
                      </td>
                      <td>
                        <span className="stat-pill danger">{entry.wrongAttempts} wrong (+{(entry.penaltyTime ?? (entry.wrongAttempts * 0.5)).toFixed(2)}s)</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>
        )}
      </main>
    </AuthGuard>
  );
}
