import Link from "next/link";
import { BookOpen } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="border-t mt-auto py-6"
      style={{
        borderColor: "var(--color-border)",
        backgroundColor: "var(--color-bg-card)",
      }}
    >
      <div
        className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3"
        style={{ color: "var(--color-text-muted)" }}
      >
        <div className="flex items-center gap-2 text-sm">
          <BookOpen className="w-4 h-4" style={{ color: "var(--color-primary)" }} />
          <span className="font-medium" style={{ color: "var(--color-text-secondary)" }}>
            BookHuntBD
          </span>
        </div>
        <p className="text-xs text-center">
          &copy; {year} BookHuntBD. Compare prices across Bangladeshi bookshops.
        </p>
        <div className="flex gap-4 text-xs">
          <Link href="/" className="hover:opacity-80 transition-opacity">Home</Link>
          <Link href="/auth/login" className="hover:opacity-80 transition-opacity">Login</Link>
        </div>
      </div>
    </footer>
  );
}
