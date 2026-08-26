import type { Metadata } from "next";
import Navbar from "./components/Navbar";
import ThemeToggle from "./components/ThemeToggle";
import "./globals.css";

export const metadata: Metadata = {
  title: "Typing Speed Game",
  description: "Typing speed game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="site-shell">
          <Navbar />
          <ThemeToggle />
          {children}
        </div>
      </body>
    </html>
  );
}
