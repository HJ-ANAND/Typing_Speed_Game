"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname.startsWith("/authentication/")) {
    return null;
  }

  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/authentication/login");
  }

  return (
    <nav>
      <Link href="/">Dashboard</Link>
      {" | "}
      <Link href="/game">Game</Link>
      {" | "}
      <Link href="/leaderboard">Leaderboard</Link>
      {" | "}
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
}
