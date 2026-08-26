"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/app/components/AuthGuard";
import {
  saveGameResult,
  getGameHistory,
  getBestScore,
} from "./lib/game.api";

import { GameHistory } from "./components/GameHistory";
import { BestScore } from "./components/BestScore";

import type { GameResult } from "./lib/types";

const SENTENCE = "The quick brown fox jumps over the lazy dog.";

function getCurrentTimestamp() {
  return Date.now();
}

export default function GamePage() {
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [time, setTime] = useState(0);

  const [correctCharacters, setCorrectCharacters] = useState(0);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [penaltyTime, setPenaltyTime] = useState(0);

  const [gameFinished, setGameFinished] = useState(false);

  const [history, setHistory] = useState<GameResult[]>([]);
  const [bestScore, setBestScore] = useState<GameResult | null>(null);

  // Load history and best score when page opens
  useEffect(() => {
    async function loadStats() {
      try {
        const [historyData, bestScoreData] = await Promise.all([
          getGameHistory(),
          getBestScore(),
        ]);

        setHistory(historyData);
        setBestScore(bestScoreData);
      } catch (error) {
        console.error("Failed to load game statistics:", error);
      }
    }

    loadStats();
  }, []);

  // Timer
  useEffect(() => {
    if (startTime === null || gameFinished) {
      return;
    }

    const interval = setInterval(() => {
      setTime((Date.now() - startTime) / 1000);
    }, 100);

    return () => clearInterval(interval);
  }, [startTime, gameFinished]);

  function handleInputChange(value: string) {
    // Start timer on first character
    if (startTime === null && value.length > 0) {
      setStartTime(getCurrentTimestamp());
    }

    // Don't allow typing beyond the sentence
    if (value.length > SENTENCE.length) {
      return;
    }

    const previousLength = input.length;

    if (value.length > previousLength) {
      const typedCharacter = value[value.length - 1];
      const expectedCharacter = SENTENCE[value.length - 1];

      if (typedCharacter === expectedCharacter) {
        setCorrectCharacters((current) => current + 1);
      } else {
        setWrongAttempts((current) => current + 1);
        setPenaltyTime((current) => current + 0.5);
      }
    }

    setInput(value);

    // Game completed
    if (value === SENTENCE) {
      finishGame();
    }
  }

  async function finishGame() {
    if (gameFinished) {
      return;
    }

    const endTime = Date.now();

    const completionTime =
      startTime === null ? 0 : (endTime - startTime) / 1000;

    setTime(completionTime);
    setGameFinished(true);

    try {
      const result = await saveGameResult({
        completionTime,
        correctCharacters,
        wrongAttempts,
        penaltyTime,
      });

      console.log("Game result saved:", result);

      // Refresh history and best score
      const [historyData, bestScoreData] = await Promise.all([
        getGameHistory(),
        getBestScore(),
      ]);

      setHistory(historyData);
      setBestScore(bestScoreData);
    } catch (error) {
      console.error("Failed to save game result:", error);
    }
  }

  function playAgain() {
    setInput("");
    setStartTime(null);
    setTime(0);

    setCorrectCharacters(0);
    setWrongAttempts(0);
    setPenaltyTime(0);

    setGameFinished(false);
  }

  return (
    <AuthGuard>
        <main>
        <h1>Typing Speed Game</h1>

        {!gameFinished ? (
            <>
            <p>Time: {time.toFixed(2)}s</p>

            <p>{SENTENCE}</p>

            <textarea
                value={input}
                onChange={(event) => handleInputChange(event.target.value)}
                placeholder="Start typing..."
                autoFocus
            />

            <p>
                Correct characters: {correctCharacters}
            </p>

            <p>
                Wrong attempts: {wrongAttempts}
            </p>

            <p>
                Penalty time: {penaltyTime.toFixed(2)}s
            </p>
            </>
        ) : (
            <>
            <h2>Result</h2>

            <p>
                Time: {time.toFixed(2)}s
            </p>

            <p>
                Correct characters: {correctCharacters}
            </p>

            <p>
                Wrong attempts: {wrongAttempts}
            </p>

            <p>
                Penalty time: {penaltyTime.toFixed(2)}s
            </p>

            <button onClick={playAgain}>
                Play Again
            </button>
            </>
        )}

        <hr />

        <BestScore score={bestScore} />

        <hr />

        <GameHistory history={history} />
        </main>
    </AuthGuard>
  );
}
