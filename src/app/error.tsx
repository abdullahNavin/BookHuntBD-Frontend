"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] px-4 text-center">
      <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: "color-mix(in srgb, var(--color-danger) 10%, transparent)" }}>
        <AlertTriangle className="w-8 h-8" style={{ color: "var(--color-danger)" }} />
      </div>
      
      <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--color-text-primary)" }}>
        Something went wrong!
      </h1>
      
      <p className="max-w-md mx-auto mb-8 text-sm" style={{ color: "var(--color-text-secondary)" }}>
        {error.message || "An unexpected error occurred while loading this page."}
      </p>
      
      <button
        onClick={() => reset()}
        className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-colors hover:opacity-80 border"
        style={{
          backgroundColor: "var(--color-bg-muted)",
          borderColor: "var(--color-border)",
          color: "var(--color-text-primary)",
        }}
      >
        <RefreshCw className="w-4 h-4" />
        Try again
      </button>
    </div>
  );
}
