import { useState, useEffect } from "react";
import { getLessons } from "@/lib/api";

export interface FormattedLesson {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  colorScheme: "indigo" | "rose" | "amber";
}

export function useExploreLessons() {
  const [lessons, setLessons] = useState<FormattedLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadLessons() {
      try {
        const data = await getLessons();
        
        const colors: Array<"indigo" | "rose" | "amber"> = ["indigo", "rose", "amber"];
        
        // Transform the data inside the hook
        const formatted = data.map((lesson: any, index: number) => {
          let title = lesson.lessonTitle || "Untitled Lesson";
          let category = "General";
          
          if (title.includes(": ")) {
             const parts = title.split(": ");
             category = parts[0];
             title = parts.slice(1).join(": ");
          }
          
          const totalSeconds = lesson.scenes?.reduce((acc: number, scene: any) => acc + (scene.duration || 0), 0) || 0;
          const minutes = Math.floor(totalSeconds / 60);
          const seconds = Math.floor(totalSeconds % 60);
          const durationStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;
          
          const description = lesson.scenes?.[0]?.speechText || "Learn something new today!";
          const colorScheme = colors[index % colors.length];
          // Use array index as lesson ID
          const id = index.toString(); 

          return {
            id,
            title,
            description,
            category,
            duration: durationStr,
            colorScheme
          };
        });
        
        setLessons(formatted);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setLoading(false);
      }
    }
    
    loadLessons();
  }, []);

  return { lessons, loading, error };
}
