"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getCurrentUser } from "@/app/game/lib/game.api";

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function verifyAuthentication() {
      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/authentication/login");
        return;
      }

      try {
        await getCurrentUser();
        setChecking(false);
      } catch {
        localStorage.removeItem("token");
        router.replace("/authentication/login");
      }
    }

    verifyAuthentication();
  }, [router, pathname]);

  if (checking) {
    return <p>Checking authentication...</p>;
  }

  return <>{children}</>;
}
