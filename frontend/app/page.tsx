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
      <main>
      <h1>Typing Speed Game</h1>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          {user && (
        <>
          <h2>Welcome, {user.name}</h2>
          <p>{user.email}</p>
        </>
      )}

      <hr />

      <section>
        <h2>Best Score</h2>

        {bestScore ? (
          <>
            <p>
              Completion time:{" "}
              {bestScore.completionTime.toFixed(2)}s
            </p>
            <p>
              Correct characters: {bestScore.correctCharacters}
            </p>
            <p>
              Wrong attempts: {bestScore.wrongAttempts}
            </p>
            <p>
              Penalty time: {bestScore.penaltyTime.toFixed(2)}s
            </p>
          </>
        ) : (
          <p>No games played yet.</p>
        )}
      </section>

      <hr />

      <section>
        <h2>Recent Games</h2>

        {history.length === 0 ? (
          <p>No games played yet.</p>
        ) : (
          <ul>
            {history.slice(0, 5).map((game) => (
              <li key={game.id}>
                {game.completionTime.toFixed(2)}s —{" "}
                {game.correctCharacters} correct —{" "}
                {game.wrongAttempts} wrong
              </li>
            ))}
          </ul>
        )}
      </section>

      <hr />

        </>
      )}
      </main>
    </AuthGuard>
  );
}
