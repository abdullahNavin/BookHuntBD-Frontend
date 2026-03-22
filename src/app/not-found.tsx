import Link from "next/link";
import { Ghost } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] px-4 text-center">
      <Ghost className="w-20 h-20 mb-6" style={{ color: "var(--color-primary)" }} />
      <h1 className="text-4xl font-bold mb-2" style={{ color: "var(--color-text-primary)" }}>
        404 - Page Not Found
      </h1>
      <p className="text-lg max-w-md mx-auto mb-8" style={{ color: "var(--color-text-secondary)" }}>
        We couldn't find the page you were looking for. The book might have been moved or the URL is incorrect.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-xl font-medium transition-opacity hover:opacity-90 text-sm"
        style={{ backgroundColor: "var(--color-primary)", color: "#fff" }}
      >
        Return to Home
      </Link>
    </div>
  );
}
