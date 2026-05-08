"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { getDisplayName } from "@/lib/utils";

export function Navbar() {
  const { user } = useAuthStore();
  
  const displayName = getDisplayName(user, "User");
  const avatarSeed = encodeURIComponent(displayName);

  return (
    <nav className="p-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center clay-card px-8 py-4 bg-white/80 backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center border-2 border-indigo-200">
            <Sparkles className="text-indigo-500 w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-indigo-900 tracking-wide">
            EduAI
          </h1>
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity group">
              <span className="font-bold text-indigo-900 text-sm hidden sm:block group-hover:text-indigo-600 transition-colors">
                {displayName}
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}&backgroundColor=b6e3f4`}
                alt="User Avatar"
                className="w-10 h-10 rounded-full border-2 border-emerald-300"
              />
            </Link>
          ) : (
            <Link
              href="/login"
              className="clay-btn-primary px-6 py-2 text-sm no-underline inline-block text-center"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
