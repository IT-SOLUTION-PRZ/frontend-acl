"use client";

import { FolderHeart, Play, Wand2 } from "lucide-react";
import Link from "next/link";
import { formatCreatedAt, formatDuration, useMyLessons } from "@/hooks/useMyLessons";

const colors = [
  "bg-indigo-50 border-indigo-100 text-indigo-400",
  "bg-rose-50 border-rose-100 text-rose-400",
  "bg-amber-50 border-amber-100 text-amber-400",
];

export function LessonsTab() {
  const { lessons, loading, error } = useMyLessons();

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center gap-3">
        <FolderHeart className="text-indigo-600 w-8 h-8" />
        <h2 className="text-2xl md:text-3xl font-bold text-indigo-900">
          My Lessons
        </h2>
      </div>
      <p className="text-slate-500 font-comic">
        All your generated creative and educational lessons in one place.
      </p>

      {loading ? (
        <div className="text-center py-12 text-indigo-500 font-comic">Loading your lessons...</div>
      ) : error ? (
        <div className="text-center py-12 text-rose-500 font-comic">
          Failed to load your lessons.
        </div>
      ) : lessons.length === 0 ? (
        <div className="clay-card bg-white p-8 text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-indigo-100 rounded-2xl flex items-center justify-center border-2 border-indigo-200">
            <Wand2 className="w-8 h-8 text-indigo-500" />
          </div>
          <h3 className="text-xl font-bold text-indigo-900">No saved lessons yet</h3>
          <p className="text-slate-500 font-comic">
            Generate your first lesson from the Dashboard and it will appear here.
          </p>
          <Link href="/dashboard" className="clay-btn-primary inline-flex px-6 py-3">
            Create a lesson
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson, index) => {
            const color = colors[index % colors.length];
            return (
              <Link
                key={lesson.id}
                href={`/lesson/${lesson.id}`}
                className="clay-card p-5 bg-white space-y-4 hover:border-indigo-300 transition-colors"
              >
                <div className={`h-40 border-2 rounded-2xl flex items-center justify-center ${color}`}>
                  <Play className="w-12 h-12" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-indigo-900 text-xl line-clamp-2">
                    {lesson.lessonTitle}
                  </h3>
                  <p className="text-sm text-slate-500 font-comic line-clamp-2">
                    {lesson.previewText}
                  </p>
                  <p className="text-sm text-slate-400 font-comic">
                    Created {formatCreatedAt(lesson.created_at)} - {formatDuration(lesson.duration)}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
