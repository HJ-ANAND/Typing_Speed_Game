"use client";

import { useEffect, useState } from "react";
import {
  getCurrentUser,
  getGameHistory,
  getBestScore,
} from "@/app/game/lib/game.api";
import type { GameResult } from "@/app/game/lib/types";
import AuthGuard from "@/app/components/AuthGuard";

type User = {
  id: string;
  name: string;
  email: string;
};

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [history, setHistory] = useState<GameResult[]>([]);
  const [bestScore, setBestScore] = useState<GameResult | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [currentUser, gameHistory, best] = await Promise.all([
          getCurrentUser(),
          getGameHistory(),
          getBestScore(),
        ]);

        setUser(currentUser);
        setHistory(gameHistory);
        setBestScore(best);
      } catch (error) {
        console.error("Failed to load dashboard:", error);
        setError("Unable to load dashboard.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  return (
    <AuthGuard>
      <main className="page-container">

      {loading ? (
        <p className="muted">Loading your dashboard...</p>
      ) : error ? (
        <p className="form-error">{error}</p>
      ) : (
        <>
          <header className="dashboard-hero">
            <div>
              <p className="eyebrow">Personal dashboard</p>
              <h1 className="page-heading">Ready for another run?</h1>
              <p className="page-subtitle">Every keystroke gets you closer to a new personal best.</p>
            </div>
            {user && (
              <div className="profile-chip">
                <strong>{user.name}</strong>
                <span>{user.email}</span>
              </div>
            )}
          </header>

          <section className="metric-grid">
            <article className="card metric-card featured">
              <p className="metric-label">Best completion</p>
              <p className="metric-value">{bestScore ? bestScore.completionTime.toFixed(2) + "s" : "—"}</p>
              <p className="metric-detail">Your fastest recorded run</p>
            </article>
            <article className="card metric-card">
              <p className="metric-label">Characters</p>
              <p className="metric-value">{bestScore?.correctCharacters ?? 0}</p>
              <p className="metric-detail">Correct in your best game</p>
            </article>
            <article className="card metric-card">
              <p className="metric-label">Recent runs</p>
              <p className="metric-value">{history.length}</p>
              <p className="metric-detail">Games in your history</p>
            </article>
          </section>

          <section className="dashboard-grid">
            <article className="card content-card">
              <div className="card-header">
                <h2 className="section-title">Recent activity</h2>
                <span className="muted">Last 5 games</span>
              </div>
              {history.length === 0 ? (
                <p className="empty-state">No games played yet. Start a game to build your history.</p>
              ) : (
                <ul className="history-list">
                  {history.slice(0, 5).map((game) => (
                    <li className="history-row" key={game.id}>
                      <span>{game.correctCharacters} correct · {game.wrongAttempts} wrong</span>
                      <strong>{game.completionTime.toFixed(2)}s</strong>
                    </li>
                  ))}
                </ul>
              )}
            </article>
            <article className="card content-card">
              <div className="card-header">
                <h2 className="section-title">Next challenge</h2>
              </div>
              <p className="page-subtitle">Keep your hands on the keyboard and aim for a clean, quick run.</p>
              <a className="button" href="/game">Start typing →</a>
            </article>
          </section>

        </>
      )}
      </main>
    </AuthGuard>
  );
}
