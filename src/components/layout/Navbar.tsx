import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Navbar() {
  return (
    <nav className="p-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center clay-card px-8 py-4 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center border-2 border-indigo-200">
            <Sparkles className="text-indigo-500 w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-indigo-900 tracking-wide">
            EduAI
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="clay-btn-primary px-6 py-2 text-sm no-underline inline-block text-center"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
