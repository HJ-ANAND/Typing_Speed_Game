"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getLeaderboard } from "@/app/game/lib/game.api";
import AuthGuard from "@/app/components/AuthGuard";

type LeaderboardEntry = {
  userId: string;
  name: string;
  completionTime: number;
  correctCharacters: number;
  wrongAttempts: number;
  penaltyTime: number;
  createdAt: string;
};

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
      <main>
        <h1>Leaderboard</h1>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : leaderboard.length === 0 ? (
            <p>No scores yet.</p>
            ) : (
                <ol>
            {leaderboard.map((entry) => (
                <li key={entry.userId}>
                <strong>{entry.name}</strong>
                {" — "}
                {entry.completionTime.toFixed(2)}s
                {" — "}
                {entry.correctCharacters} correct
                {" — "}
                {entry.wrongAttempts} wrong
                </li>
            ))}
            </ol>
        )}

        <hr />

        <Link href="/">Back to Dashboard</Link>
        <br />
        <Link href="/game">Play Game</Link>
        </main>
    </AuthGuard>
  );
}
