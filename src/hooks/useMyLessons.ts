import { useEffect, useState } from "react";
import { getMyLessons, type SavedLessonSummary } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

export type MyLessonSummary = SavedLessonSummary;

export function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function formatCreatedAt(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function useMyLessons(limit?: number) {
  const { user, isLoading: authLoading } = useAuthStore();
  const [lessons, setLessons] = useState<MyLessonSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadLessons() {
      if (authLoading) {
        setLoading(true);
        return;
      }

      if (!user) {
        setLessons([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const items = await getMyLessons();
        if (!isMounted) return;
        setLessons(typeof limit === "number" ? items.slice(0, limit) : items);
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err : new Error("Failed to load lessons"));
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadLessons();

    return () => {
      isMounted = false;
    };
  }, [user, authLoading, limit]);

  return { lessons, loading, error };
}
