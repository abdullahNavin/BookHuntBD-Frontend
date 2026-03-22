"use client";

import Link from "next/link";
import { useSession, signOut } from "@/lib/auth";
import { BookOpen, Heart, Bell, LogIn, UserPlus, LogOut, User, ChevronDown } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const { data: session, isPending } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setDropdownOpen(false);
  };

  return (
    <nav
      className="sticky top-0 z-50 border-b"
      style={{
        backgroundColor: "var(--color-bg-card)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-lg transition-opacity hover:opacity-80"
          style={{ color: "var(--color-text-primary)" }}
        >
          <BookOpen className="w-5 h-5" style={{ color: "var(--color-primary)" }} />
          <span>BookHuntBD</span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-1">
          {isPending ? (
            <div
              className="w-24 h-8 rounded-lg animate-pulse"
              style={{ backgroundColor: "var(--color-bg-muted)" }}
              aria-hidden="true"
            />
          ) : session ? (
            <>
              <Link
                href="/wishlist"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:opacity-80"
                style={{ color: "var(--color-text-secondary)" }}
              >
                <Heart className="w-4 h-4" />
                <span className="hidden sm:inline">Wishlist</span>
              </Link>
              <Link
                href="/alerts"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:opacity-80"
                style={{ color: "var(--color-text-secondary)" }}
              >
                <Bell className="w-4 h-4" />
                <span className="hidden sm:inline">Alerts</span>
              </Link>

              {/* Avatar dropdown */}
              <div className="relative ml-2">
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: "var(--color-bg-muted)",
                    color: "var(--color-text-secondary)",
                  }}
                  aria-haspopup="true"
                  aria-expanded={dropdownOpen}
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline max-w-[100px] truncate">
                    {session.user?.name ?? session.user?.email ?? "Account"}
                  </span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                {dropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setDropdownOpen(false)}
                    />
                    <div
                      className="absolute right-0 mt-1 w-44 rounded-xl border shadow-xl z-20 overflow-hidden"
                      style={{
                        backgroundColor: "var(--color-bg-card)",
                        borderColor: "var(--color-border)",
                      }}
                    >
                      <button
                        onClick={handleSignOut}
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-sm transition-colors hover:opacity-80"
                        style={{ color: "var(--color-danger)" }}
                      >
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-80"
                style={{ color: "var(--color-text-secondary)" }}
              >
                <LogIn className="w-4 h-4" />
                Login
              </Link>
              <Link
                href="/auth/register"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium"
                style={{
                  backgroundColor: "var(--color-primary)",
                  color: "#fff",
                }}
              >
                <UserPlus className="w-4 h-4" />
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
