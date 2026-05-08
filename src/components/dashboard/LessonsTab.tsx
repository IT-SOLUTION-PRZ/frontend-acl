"use client";

import { FolderHeart, Play } from "lucide-react";
import Link from "next/link";

export function LessonsTab() {
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          href="/lesson/dinosaurs"
          className="clay-card p-5 bg-white space-y-4 hover:border-indigo-300 transition-colors"
        >
          <div className="h-40 bg-indigo-50 border-2 border-indigo-100 rounded-2xl flex items-center justify-center">
            <Play className="w-12 h-12 text-indigo-400" />
          </div>
          <div>
            <h3 className="font-bold text-indigo-900 text-xl">Dinosaurs!</h3>
            <p className="text-sm text-slate-400 font-comic">Created yesterday</p>
          </div>
        </Link>

        <Link
          href="/lesson/airplanes"
          className="clay-card p-5 bg-white space-y-4 hover:border-indigo-300 transition-colors"
        >
          <div className="h-40 bg-rose-50 border-2 border-rose-100 rounded-2xl flex items-center justify-center">
            <Play className="w-12 h-12 text-rose-400" />
          </div>
          <div>
            <h3 className="font-bold text-indigo-900 text-xl">How airplanes fly</h3>
            <p className="text-sm text-slate-400 font-comic">Created 3 days ago</p>
          </div>
        </Link>

        <Link
          href="/lesson/solar-system"
          className="clay-card p-5 bg-white space-y-4 hover:border-indigo-300 transition-colors"
        >
          <div className="h-40 bg-amber-50 border-2 border-amber-100 rounded-2xl flex items-center justify-center">
            <Play className="w-12 h-12 text-amber-400" />
          </div>
          <div>
            <h3 className="font-bold text-indigo-900 text-xl">The Solar System</h3>
            <p className="text-sm text-slate-400 font-comic">Public • 1 week ago</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
