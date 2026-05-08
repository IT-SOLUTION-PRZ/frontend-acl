"use client";

import { useSearchParams } from "next/navigation";

export type DashboardTab = "dashboard" | "lessons" | "settings";

/**
 * Reads the active dashboard tab from URL search params.
 * Defaults to "dashboard" when no ?tab= is present.
 */
export function useDashboardTab(): DashboardTab {
  const searchParams = useSearchParams();
  const raw = searchParams.get("tab");

  if (raw === "lessons" || raw === "settings") return raw;
  return "dashboard";
}
