"use client";

import { redirect } from "next/navigation";
import { useSession } from "@/lib/auth";
import { Loader2 } from "lucide-react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();

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
    redirect("/auth/login");
  }

  return <>{children}</>;
}
