"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    const nextTheme =
      savedTheme ??
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const frameId = window.requestAnimationFrame(() => setTheme(nextTheme));

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  function toggleTheme() {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    document.documentElement.dataset.theme = nextTheme;
  }

  return (
    <button
      className="icon-button theme-toggle"
      type="button"
      onClick={toggleTheme}
      aria-label={"Switch to " + (theme === "light" ? "dark" : "light") + " theme"}
      title="Toggle theme"
    >
      {theme === "light" ? "◐" : "☀"}
    </button>
  );
}
