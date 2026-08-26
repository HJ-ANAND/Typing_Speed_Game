"use client";

import AuthGuard from "@/app/components/AuthGuard";
import { useCallback, useEffect, useState } from "react";
import CurrentLetter from "./components/CurrentLetter";
import { GameResult } from "./components/GameResult";
import { GameHistory } from "./components/GameHistory";
import { BestScore } from "./components/BestScore";
import { useTypingGame } from "./hooks/useTypingGame";
import { getBestScore, getGameHistory } from "./lib/game.api";
import type { GameResult as GameRecord } from "./lib/types";

export default function GamePage() {
  return (
    <AuthGuard>
      <GameContent />
    </AuthGuard>
  );
}

function GameContent() {
  const [history, setHistory] = useState<GameRecord[]>([]);
  const [bestScore, setBestScore] = useState<GameRecord | null>(null);

  const loadStats = useCallback(async () => {
    try {
      const [gameHistory, score] = await Promise.all([
        getGameHistory(),
        getBestScore(),
      ]);

      setHistory(gameHistory);
      setBestScore(score);
    } catch (error) {
      console.error("Failed to load game statistics:", error);
    }
  }, []);

  const {
    currentLetter,
    currentIndex,
    totalLetters,
    correctCharacters,
    wrongAttempts,
    penaltyTime,
    status,
    result,
    isSaving,
    saveError,
    startGame,
  } = useTypingGame({ onSaveSuccess: loadStats });

  useEffect(() => {
    async function init() {
      await loadStats();
    }
    void init();
  }, [loadStats]);

  const progressPercent = Math.min(100, Math.round(((currentIndex) / totalLetters) * 100));

  return (
    <main className="page-container">
      <header className="page-header-banner">
        <div>
          <span className="eyebrow">Interactive Speed Arena</span>
          <h1 className="page-heading">Keyflow Rush</h1>
        </div>
        <button className="button button-primary game-cta-btn" onClick={startGame}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          {status === "running" ? "Restart Run" : "Start New Run"}
        </button>
      </header>

      <div className="game-layout">
        <div className="game-main-area">
          <section className="card game-card">
            {status === "idle" && (
              <div className="game-start-hero">
                <div className="hero-keycap-illustration">⌨️</div>
                <h2>Ready to test your speed?</h2>
                <p className="muted">
                  Type <strong>20 random letters</strong> as fast as you can. Every wrong attempt adds a <strong>+0.5s penalty</strong>.
                </p>
                <button className="button button-large start-big-btn" onClick={startGame}>
                  Start Speed Test
                </button>
              </div>
            )}

            {status === "running" && (
              <>
                <div className="game-top-bar">
                  <div className="progress-info">
                    <span className="progress-label">PROGRESS</span>
                    <span className="progress-count">
                      Letter <strong>{currentIndex + 1}</strong> / {totalLetters}
                    </span>
                  </div>
                  <div className="progress-bar-track">
                    <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
                  </div>
                </div>

                <CurrentLetter letter={currentLetter} />

                <div className="game-stats-grid">
                  <div className="game-stat-card">
                    <span className="stat-card-label">CORRECT</span>
                    <span className="stat-card-value text-success">{correctCharacters}</span>
                  </div>
                  <div className="game-stat-card">
                    <span className="stat-card-label">WRONG</span>
                    <span className="stat-card-value text-danger">{wrongAttempts}</span>
                  </div>
                  <div className="game-stat-card">
                    <span className="stat-card-label">PENALTY</span>
                    <span className="stat-card-value">+{penaltyTime.toFixed(2)}s</span>
                  </div>
                </div>
              </>
            )}

            {status === "finished" && result && (
              <div className="game-finished-container">
                <GameResult result={result} />

                {isSaving && <p className="saving-status-text">💾 Saving run to global leaderboard...</p>}
                {saveError && <p className="form-error">{saveError}</p>}

                <div className="finished-actions">
                  <button className="button button-large play-again-btn" onClick={startGame}>
                    ⚡ Play Again
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>

        <aside className="game-side-stack">
          <BestScore score={bestScore} />
          <GameHistory history={history} />
        </aside>
      </div>
    </main>
  );
}
