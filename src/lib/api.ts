import { supabase } from "@/lib/supabase";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001/api/v1";
const API_ROOT = BASE_URL.replace(/\/v1$/, "");

export interface SavedLessonSummary {
  id: string;
  topic: string;
  lessonTitle: string;
  created_at: string;
  duration: number;
  previewText: string;
}

export interface SavedLesson extends SavedLessonSummary {
  scenes?: unknown[];
}

async function getAuthHeaders(): Promise<HeadersInit> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) {
    throw new Error("You need to be logged in.");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session.access_token}`,
  };
}

async function readError(res: Response, fallback: string): Promise<Error> {
  const errorData = await res.json().catch(() => ({}));
  return new Error(errorData.detail || fallback);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getItems(data: unknown): unknown[] {
  if (!isRecord(data) || !Array.isArray(data.items)) return [];
  return data.items;
}

export async function getLesson(id: string): Promise<unknown | null> {
  if (id !== "new") {
    const myLesson = await getMyLesson(id).catch(() => null);
    if (myLesson) return myLesson;
  }

  const res = await fetch(`${BASE_URL}/lessons`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch lesson ${id}`);
  const data = await res.json();
  const items = getItems(data);

  const idx = parseInt(id);
  if (!Number.isNaN(idx) && items[idx]) {
    return items[idx];
  }

  return items.find((lesson) => isRecord(lesson) && lesson.id === id) || null;
}

export async function getLessons(): Promise<unknown[]> {
  const res = await fetch(`${BASE_URL}/lessons`);
  if (!res.ok) throw new Error("Failed to fetch lessons");
  const data = await res.json();
  return getItems(data);
}

export async function getMyLessons(): Promise<SavedLessonSummary[]> {
  const res = await fetch(`${BASE_URL}/my-lessons`, {
    headers: await getAuthHeaders(),
    cache: "no-store",
  });

  if (!res.ok) throw await readError(res, "Failed to fetch your lessons");
  const data = await res.json();
  return getItems(data) as SavedLessonSummary[];
}

export async function getMyLesson(id: string): Promise<SavedLesson> {
  const res = await fetch(`${BASE_URL}/my-lessons/${id}`, {
    headers: await getAuthHeaders(),
    cache: "no-store",
  });

  if (!res.ok) throw await readError(res, "Failed to fetch your lesson");
  return res.json();
}

export async function updateInterests(interests: string[]): Promise<{ message: string }> {
  const res = await fetch(`${API_ROOT}/update-interests`, {
    method: "POST",
    headers: await getAuthHeaders(),
    body: JSON.stringify({ interests }),
  });

  if (!res.ok) throw await readError(res, "Failed to update interests");
  return res.json();
}

export async function getInterests(): Promise<string[]> {
  const res = await fetch(`${API_ROOT}/interests`, {
    headers: await getAuthHeaders(),
    cache: "no-store",
  });

  if (!res.ok) throw await readError(res, "Failed to fetch interests");
  const data = await res.json();
  return isRecord(data) && Array.isArray(data.interests) ? data.interests : [];
}

export async function generateLesson(topic: string): Promise<SavedLesson> {
  const res = await fetch(`${API_ROOT}/generate-lesson`, {
    method: "POST",
    headers: await getAuthHeaders(),
    body: JSON.stringify({ topic }),
  });

  if (!res.ok) throw await readError(res, "Failed to generate lesson");
  return res.json();
}
