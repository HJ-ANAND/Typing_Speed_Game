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
        <div className="card content-card loading-box">
          <div className="spinner"></div>
          <p className="muted">Loading your dashboard...</p>
        </div>
      ) : error ? (
        <div className="card content-card">
          <p className="form-error">{error}</p>
        </div>
      ) : (
        <>
          <header className="dashboard-hero">
            <div>
              <span className="eyebrow">Personal Dashboard</span>
              <h1 className="page-heading">{history.length > 0 ? "Welcome Back" : `Welcome${user?.name ? `, ${user.name}` : ""}`}</h1>
              <p className="page-subtitle">
                {history.length > 0
                  ? "Track your speed statistics and push for a new record."
                  : "Test your typing speed and record your first run on the leaderboard."}
              </p>
            </div>
            {user && (
              <div className="profile-chip">
                <div className="user-avatar-large">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="user-info-text">
                  <strong className="user-name">{user.name}</strong>
                  <span className="user-email">{user.email}</span>
                </div>
              </div>
            )}
          </header>

          {/* MAIN HERO FEATURE: GAME LAUNCH BANNER */}
          <section className="card main-game-hero-banner">
            <div className="hero-banner-content">
              <div className="hero-badge-pill">
                <span className="live-dot"></span>
                {history.length > 0 ? "KEYBOARD SPEED TEST" : "FIRST SPEED TEST"}
              </div>
              <h2 className="hero-banner-title">
                {history.length > 0 ? "Ready for another run?" : "Ready to test your speed?"}
              </h2>
              <p className="hero-banner-sub">
                {history.length > 0
                  ? "Type 20 random uppercase letters as fast as you can. Minimal errors = maximum speed score!"
                  : "Type 20 random uppercase letters as fast as you can to set your personal best score!"}
              </p>
              <div className="hero-cta-wrapper">
                <a className="button button-large hero-start-btn" href="/game">
                  <span>Start Playing Game</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="hero-banner-visual">
              <div className="hero-3d-keycap">⌨️</div>
            </div>
          </section>

          <section className="metric-grid">
            <article className="card metric-card featured">
              <div className="metric-card-header">
                <span className="metric-label">Best Completion</span>
                <span className="metric-icon">⚡</span>
              </div>
              <p className="metric-value">{bestScore ? bestScore.completionTime.toFixed(2) + "s" : "—"}</p>
              <p className="metric-detail">Your fastest recorded run</p>
            </article>

            <article className="card metric-card">
              <div className="metric-card-header">
                <span className="metric-label">Best Accuracy</span>
                <span className="metric-icon">🎯</span>
              </div>
              <p className="metric-value">{bestScore ? `${bestScore.correctCharacters} / ${bestScore.correctCharacters + bestScore.wrongAttempts}` : "—"}</p>
              <p className="metric-detail">Correct keys vs total attempts</p>
            </article>

            <article className="card metric-card">
              <div className="metric-card-header">
                <span className="metric-label">Total Speed Runs</span>
                <span className="metric-icon">🎮</span>
              </div>
              <p className="metric-value">{history.length}</p>
              <p className="metric-detail">Completed games in history</p>
            </article>
          </section>

          <section className="card content-card full-activity-card">
            <div className="card-header">
              <h2 className="section-title">Recent Activity</h2>
              <span className="badge-pill">Last 5 Games</span>
            </div>
            {history.length === 0 ? (
              <div className="empty-state-box">
                <p className="empty-state">No games played yet. Click &quot;Start Playing Game&quot; above to build your history!</p>
              </div>
            ) : (
              <ul className="history-list">
                {history.slice(0, 5).map((game, index) => (
                  <li className="history-row" key={game.id || index}>
                    <div className="history-row-left">
                      <span className="history-run-tag">Run #{history.length - index}</span>
                      <span className="history-row-sub">
                        {game.correctCharacters} correct · {game.wrongAttempts} wrong (+{(game.penaltyTime ?? game.wrongAttempts * 0.5).toFixed(2)}s)
                      </span>
                    </div>
                    <span className="history-time-badge">{game.completionTime.toFixed(2)}s</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
      </main>
    </AuthGuard>
  );
}
