"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth";
import { Loader2 } from "lucide-react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/auth/login");
    }
  }, [isPending, session, router]);

  if (isPending || !session) {
    return (
      <div
        className="flex flex-1 items-center justify-center h-64"
        role="status"
        aria-live="polite"
      >
        <Loader2
          className="w-6 h-6 animate-spin"
          aria-hidden="true"
          style={{ color: "var(--color-primary)" }}
        />
        <span className="sr-only">Checking your session…</span>
      </div>
    );
  }

  return <>{children}</>;
}
