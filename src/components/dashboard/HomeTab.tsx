"use client";

import { Clock, Play, Wand2 } from "lucide-react";
import Link from "next/link";
import { useLessonGenerator } from "@/hooks/useLessonGenerator";
import { formatCreatedAt, formatDuration, useMyLessons } from "@/hooks/useMyLessons";

interface HomeTabProps {
  displayName: string;
}

export function HomeTab({ displayName }: HomeTabProps) {
  const {
    isGenerating,
    progress,
    message,
    prompt,
    setPrompt,
    startGeneration,
  } = useLessonGenerator();
  const { lessons: recentLessons, loading: recentLoading, error: recentError } = useMyLessons(3);

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex justify-between items-center mb-4 md:mb-8 mt-2 md:mt-0">
        <h2 className="text-2xl md:text-3xl font-bold text-indigo-900">
          Welcome back, {displayName}!
        </h2>
      </div>

      <div className="clay-card p-5 md:p-8 bg-white relative mt-6 md:mt-0">
        <div className="absolute -top-4 md:-top-5 left-4 md:left-8 bg-amber-400 text-amber-900 px-4 py-1 rounded-full font-bold text-xs md:text-sm border-2 border-amber-200 transform -rotate-2 shadow-sm whitespace-nowrap">
          Ask the AI Teacher!
        </div>

        {!isGenerating ? (
          <div>
            <div className="space-y-4 mb-6 mt-2 md:mt-0">
              <label className="block text-base md:text-lg font-bold text-indigo-900">
                What do you want to learn today?
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                className="w-full clay-input py-3 px-4 md:py-4 md:px-6 text-lg md:text-xl font-comic placeholder-slate-400 resize-none"
                placeholder="e.g. Why is the sky blue?"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={startGeneration}
                className="clay-btn-primary w-full md:w-auto px-8 py-3 md:py-4 flex items-center justify-center gap-2 text-lg"
              >
                Generate
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-20 h-20 mx-auto bg-indigo-500 rounded-full flex items-center justify-center animate-bounce mb-6">
              <Wand2 className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-indigo-900 mb-2">
              Creating your lesson...
            </h3>
            <p className="text-slate-500 font-comic mb-8">{message}</p>

            <div className="w-full max-w-md mx-auto h-6 progress-container">
              <div
                className="progress-bar"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-12">
        <h3 className="text-2xl font-bold text-indigo-900 mb-6 flex items-center gap-2">
          <Clock className="text-emerald-500 w-6 h-6" />
          Recent Lessons
        </h3>

        {recentLoading ? (
          <div className="text-center py-8 text-indigo-500 font-comic">Loading recent lessons...</div>
        ) : recentError ? (
          <div className="text-center py-8 text-rose-500 font-comic">Failed to load recent lessons.</div>
        ) : recentLessons.length === 0 ? (
          <div className="bg-white rounded-2xl border-2 border-slate-100 p-6 text-center">
            <p className="text-slate-500 font-comic">
              Generated lessons will show up here after you create them.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentLessons.map((lesson, index) => {
              const colors = [
                "bg-indigo-100 text-indigo-400 group-hover:text-indigo-600",
                "bg-rose-100 text-rose-400 group-hover:text-rose-600",
                "bg-amber-100 text-amber-400 group-hover:text-amber-600",
              ];
              const color = colors[index % colors.length];

              return (
                <Link
                  key={lesson.id}
                  href={`/lesson/${lesson.id}`}
                  className="flex gap-4 items-center p-4 bg-white rounded-2xl border-2 border-slate-100 hover:border-indigo-300 transition-colors cursor-pointer group"
                >
                  <div className={`w-20 h-16 rounded-xl flex items-center justify-center relative overflow-hidden flex-shrink-0 ${color}`}>
                    <Play className="w-6 h-6" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4 className="font-bold text-indigo-900 text-md truncate">
                      {lesson.lessonTitle}
                    </h4>
                    <p className="text-sm text-slate-500 font-comic">
                      {formatCreatedAt(lesson.created_at)} - {formatDuration(lesson.duration)}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
