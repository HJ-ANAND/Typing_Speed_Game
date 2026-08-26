"use client";

import { useCallback, useEffect, useState } from "react";
import { calculateStats, GameStats } from "../lib/game";
import { saveGameResult } from "../lib/game.api";

const SAMPLE_TEXT = "The quick brown fox jumps over the lazy dog.";

type GameStatus = "idle" | "running" | "finished";

export function useTypingGame() {
  const [targetText] = useState(SAMPLE_TEXT);
  const [typedText, setTypedText] = useState("");

  const [status, setStatus] = useState<GameStatus>("idle");
  const [elapsedTime, setElapsedTime] = useState(0);
  const [result, setResult] = useState<GameStats | null>(null);

  const startGame = useCallback(() => {
    setTypedText("");
    setElapsedTime(0);
    setResult(null);
    setStatus("running");
  }, []);

  const handleTyping = useCallback(
    async (value: string) => {
      if (status !== "running") {
        return;
      }

      setTypedText(value);

      if (value.length >= targetText.length) {
        const stats = calculateStats(targetText, value, elapsedTime);

        setResult(stats);
        setStatus("finished");

        try {
          await saveGameResult(stats);
        } catch (error) {
          console.error("Failed to save game result:", error);
        }
      }
    },
    [status, targetText, elapsedTime],
  );

  useEffect(() => {
    if (status !== "running") {
      return;
    }

    const startTime = Date.now();

    const timer = setInterval(() => {
      setElapsedTime((Date.now() - startTime) / 1000);
    }, 100);

    return () => {
      clearInterval(timer);
    };
  }, [status]);

  return {
    targetText,
    typedText,
    status,
    elapsedTime,
    result,
    startGame,
    handleTyping,
  };
}
