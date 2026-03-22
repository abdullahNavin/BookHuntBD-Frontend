"use client";

import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { AlertCard } from "@/components/alerts/AlertCard";
import { SkeletonCard } from "@/components/shared/SkeletonCard";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { useAlerts } from "@/hooks/useAlerts";
import { Bell, BellOff } from "lucide-react";
import Link from "next/link";

function AlertsEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-4">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
        style={{ backgroundColor: "var(--color-bg-muted)" }}
      >
        <BellOff className="w-8 h-8" style={{ color: "var(--color-text-muted)" }} />
      </div>
      <h2
        className="text-xl font-semibold mb-2"
        style={{ color: "var(--color-text-primary)" }}
      >
        No active price alerts
      </h2>
      <p
        className="text-sm max-w-sm mb-8"
        style={{ color: "var(--color-text-secondary)" }}
      >
        Set a price alert on any book to get notified when its price drops below your target.
      </p>
      <Link
        href="/"
        className="px-6 py-2.5 rounded-xl text-sm font-medium transition-opacity hover:opacity-90"
        style={{ backgroundColor: "var(--color-primary)", color: "#fff" }}
      >
        Find books
      </Link>
    </div>
  );
}

export default function AlertsPage() {
  const { data: alerts, isLoading, error, refetch } = useAlerts();

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center gap-3 mb-8">
          <Bell className="w-8 h-8" style={{ color: "var(--color-warning)" }} fill="currentColor" />
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>Price Alerts</h1>
            <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
              Manage notifications for book price drops.
            </p>
          </div>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {error && !isLoading && (
          <ErrorMessage 
            message={error.message || "Failed to load price alerts."} 
            onRetry={() => refetch()} 
          />
        )}

        {alerts && alerts.length === 0 && !isLoading && (
          <AlertsEmpty />
        )}

        {alerts && alerts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {alerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
