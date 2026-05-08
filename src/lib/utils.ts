import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { User } from "@supabase/supabase-js"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Extracts a human-readable display name from a Supabase User object.
 * Falls back through: full_name → email prefix → fallback string.
 */
export function getDisplayName(user: User | null, fallback = "there"): string {
  if (!user) return fallback;
  return (
    user.user_metadata?.full_name
    ?? user.email?.split("@")[0]
    ?? fallback
  );
}
