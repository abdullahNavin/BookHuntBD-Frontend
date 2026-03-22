"use client";

import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorMessage({
  message = "Something went wrong. Check your connection and try again.",
  onRetry,
}: ErrorMessageProps) {
  return (
    <div
      className="flex flex-col items-center gap-4 py-16 text-center"
      role="alert"
    >
      <AlertCircle
        className="w-12 h-12"
        style={{ color: "var(--color-danger)" }}
      />
      <p style={{ color: "var(--color-text-secondary)" }}>{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{
            backgroundColor: "var(--color-bg-muted)",
            color: "var(--color-text-primary)",
            border: "1px solid var(--color-border)",
          }}
        >
          <RefreshCw className="w-4 h-4" />
          Try again
        </button>
      )}
    </div>
  );
}
