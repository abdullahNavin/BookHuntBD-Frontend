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

  if (isPending) {
    return (
      <div className="flex flex-1 items-center justify-center h-64">
        <Loader2
          className="w-6 h-6 animate-spin"
          style={{ color: "var(--color-primary)" }}
        />
      </div>
    );
  }

  if (!session) {
    // Still show spinner while redirect is in-flight
    return (
      <div className="flex flex-1 items-center justify-center h-64">
        <Loader2
          className="w-6 h-6 animate-spin"
          style={{ color: "var(--color-primary)" }}
        />
      </div>
    );
  }

  return <>{children}</>;
}
