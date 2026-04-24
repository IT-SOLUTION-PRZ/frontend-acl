// src/lib/api.ts
import type { Lesson } from "@/types/lesson";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export async function getLesson(id: string): Promise<Lesson> {
  const res = await fetch(`${BASE_URL}/lessons/${id}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`Failed to fetch lesson ${id}`);
  return res.json();
}

export async function getLessons(): Promise<Lesson[]> {
  const res = await fetch(`${BASE_URL}/lessons`);
  if (!res.ok) throw new Error("Failed to fetch lessons");
  return res.json();
}