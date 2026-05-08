

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export async function getLesson(id: string): Promise<any> {
  const res = await fetch(`${BASE_URL}/lessons`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to fetch lesson ${id}`);
  const data = await res.json();
  // Look up by index, or fall back to matching by id field
  const idx = parseInt(id);
  if (!isNaN(idx) && data.items && data.items[idx]) {
    return data.items[idx];
  }

  return data.items?.find((l: any) => l.id === id) || null;
}

export async function getLessons(): Promise<any> {
  const res = await fetch(`${BASE_URL}/lessons`);
  if (!res.ok) throw new Error("Failed to fetch lessons");
  const data = await res.json();
  return data.items || [];
}

export async function updateInterests(userId: string, interests: string[]): Promise<any> {
  // Use the root /api path since the backend route is just /update-interests and mounted on /api
  const url = BASE_URL.replace('/v1', '') + '/update-interests';
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, interests })
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to update interests");
  }
  
  return res.json();
}