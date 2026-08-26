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
    <nav className="navbar">
      <Link className="brand" href="/">
        <span className="brand-mark">⌁</span>
        Keyflow
      </Link>
      <div className="nav-links">
        <Link className={"nav-link " + (pathname === "/" ? "active" : "")} href="/">
          Dashboard
        </Link>
        <Link className={"nav-link " + (pathname === "/game" ? "active" : "")} href="/game">
          Game
        </Link>
        <Link className={"nav-link " + (pathname === "/leaderboard" ? "active" : "")} href="/leaderboard">
          Leaderboard
        </Link>
        <button className="button button-quiet" type="button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
