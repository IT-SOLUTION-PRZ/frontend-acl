"use client";

import { Compass } from "lucide-react";
import { LessonCard } from "@/components/home/LessonCard";
import { useExploreLessons } from "@/hooks/useExploreLessons";

export function ExploreSection() {
  const { lessons, loading, error } = useExploreLessons();

  return (
    <div className="mt-16">
      <div className="flex justify-between items-end mb-8">
        <h3 className="text-3xl font-bold text-indigo-900 flex items-center gap-2">
          <Compass className="text-emerald-500 w-8 h-8" />
          Explore Lessons
        </h3>
        <div className="flex gap-2">
          <button className="clay-btn-secondary px-4 py-2 text-sm">Science</button>
          <button className="clay-btn-secondary px-4 py-2 text-sm">Math</button>
          <button className="clay-btn-secondary px-4 py-2 text-sm">History</button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-indigo-500 font-comic">Loading lessons...</div>
      ) : error ? (
        <div className="text-center py-10 text-rose-500 font-comic">
          Failed to load lessons. Make sure the API is running!
        </div>
      ) : lessons.length === 0 ? (
        <div className="text-center py-10 text-slate-500 font-comic">No lessons found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {lessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              id={lesson.id}
              title={lesson.title}
              description={lesson.description}
              category={lesson.category}
              duration={lesson.duration}
              colorScheme={lesson.colorScheme}
            />
          ))}
        </div>
      )}
    </div>
  );
}
