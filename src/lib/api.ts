// src/lib/api.ts
import { Lesson } from '../types/lesson';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function generateLesson(topic: string): Promise<Lesson> {
  const response = await fetch(`${API_URL}/api/generate-lesson`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ topic }),
  });

  if (!response.ok) {
    throw new Error('Nie udało się wygenerować lekcji');
  }

  return response.json();
}