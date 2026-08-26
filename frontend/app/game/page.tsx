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

  return (
    <main>
      <h1>Typing Speed Game</h1>

      {status === "running" && (
        <>
          <p>
            Letter {currentIndex + 1} of {totalLetters}
          </p>

          <CurrentLetter letter={currentLetter} />

          <p>Correct: {correctCharacters}</p>
          <p>Wrong attempts: {wrongAttempts}</p>
          <p>Penalty time: {penaltyTime.toFixed(2)}s</p>

          <p>Type the displayed letter using your keyboard.</p>
        </>
      )}

      {status === "finished" && result && (
        <>
          <GameResult result={result} />

          {isSaving && <p className="muted">Saving game result...</p>}
          {saveError && <p className="form-error">{saveError}</p>}

          <button onClick={startGame}>Play Again</button>
        </>
      )}

      <hr />

      <BestScore score={bestScore} />

      <hr />

      <GameHistory history={history} />
    </main>
  );
}
