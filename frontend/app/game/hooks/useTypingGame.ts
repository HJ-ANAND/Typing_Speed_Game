import { useCallback, useEffect, useRef, useState } from "react";
import {
  calculatePenalty,
  generateLetters,
  TOTAL_LETTERS,
} from "../lib/game";
import { saveGameResult } from "../lib/game.api";
import type {
  GameResultData,
  GameStatus,
} from "../lib/types";

export type UseTypingGameOptions = {
  onSaveSuccess?: () => void;
};

export function useTypingGame(options: UseTypingGameOptions = {}) {
  const { onSaveSuccess } = options;
  const onSaveSuccessRef = useRef(onSaveSuccess);

  useEffect(() => {
    onSaveSuccessRef.current = onSaveSuccess;
  }, [onSaveSuccess]);

  const [letters, setLetters] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCharacters, setCorrectCharacters] = useState(0);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [status, setStatus] = useState<GameStatus>("idle");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [completionTime, setCompletionTime] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const startGame = useCallback(() => {
    setLetters(generateLetters(TOTAL_LETTERS));
    setCurrentIndex(0);
    setCorrectCharacters(0);
    setWrongAttempts(0);
    setCompletionTime(0);
    setStartTime(Date.now());
    setStatus("running");
    setIsSaving(false);
    setSaveError(null);
  }, []);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(startGame);

    return () => window.cancelAnimationFrame(frameId);
  }, [startGame]);

  useEffect(() => {
    if (status !== "running") {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.length !== 1) {
        return;
      }

      const pressedKey = event.key.toUpperCase();
      const currentLetter = letters[currentIndex];

      if (!currentLetter) {
        return;
      }

      if (pressedKey === currentLetter) {
        const newCorrectCount = correctCharacters + 1;

        setCorrectCharacters(newCorrectCount);

        if (currentIndex + 1 >= letters.length) {
          const endTime = Date.now();
          const time = (endTime - (startTime ?? endTime)) / 1000;
          const finalPenaltyTime = calculatePenalty(wrongAttempts);

          setCompletionTime(time);
          setStatus("finished");
          setIsSaving(true);
          setSaveError(null);

          saveGameResult({
            completionTime: time,
            correctCharacters: newCorrectCount,
            wrongAttempts,
            penaltyTime: finalPenaltyTime,
          })
            .then(() => {
              setIsSaving(false);
              onSaveSuccessRef.current?.();
            })
            .catch((error) => {
              setIsSaving(false);
              console.error("Failed to save game result:", error);
              setSaveError("Failed to save game result.");
            });
        } else {
          setCurrentIndex((index) => index + 1);
        }
      } else {
        setWrongAttempts((attempts) => attempts + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    status,
    letters,
    currentIndex,
    correctCharacters,
    wrongAttempts,
    startTime,
  ]);

  const penaltyTime = calculatePenalty(wrongAttempts);

  const result: GameResultData | null =
    status === "finished"
      ? {
          completionTime,
          correctCharacters,
          wrongAttempts,
          penaltyTime,
        }
      : null;

  return {
    currentLetter: letters[currentIndex] ?? "",
    currentIndex,
    totalLetters: TOTAL_LETTERS,
    correctCharacters,
    wrongAttempts,
    penaltyTime,
    completionTime,
    status,
    result,
    isSaving,
    saveError,
    startGame,
  };
}
