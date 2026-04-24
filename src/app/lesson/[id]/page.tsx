import { ArrowLeft, Sparkles, Download, Globe } from "lucide-react";
import Link from "next/link";
import { LessonPlayer } from "@/components/player/LessonPlayer";
import { getLesson } from "@/lib/api";

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let lessonData = null;
  try {
    lessonData = await getLesson(id);
  } catch (error) {
    console.error(error);
  }

  return (
    <div className="min-h-screen bg-[#F5F3FF] flex flex-col">
      {/* Top Navbar for Lesson view */}
      <nav className="p-4 md:p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center clay-card px-4 md:px-6 py-3 bg-white/80 backdrop-blur-sm">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-colors"
          >
            <ArrowLeft className="w-5 h-5 shrink-0" />{" "}
            <span className="hidden md:inline">Back to Dashboard</span>
          </Link>

          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-100 rounded-xl flex items-center justify-center border-2 border-indigo-200">
              <Sparkles className="text-indigo-500 w-4 h-4 md:w-5 md:h-5 shrink-0" />
            </div>
            <h1 className="text-lg md:text-xl font-bold text-indigo-900 tracking-wide hidden sm:block">
              EduAI
            </h1>
          </div>

          <div className="flex gap-2 md:gap-3">
            <button className="clay-btn-secondary px-3 md:px-4 py-2 flex items-center gap-2 text-sm">
              <Download className="w-4 h-4 shrink-0" />{" "}
              <span className="hidden md:inline">MP4</span>
            </button>
            <button className="clay-btn-cta px-3 md:px-4 py-2 flex items-center gap-2 text-sm">
              <Globe className="w-4 h-4 shrink-0" />{" "}
              <span className="hidden md:inline">Share</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-grow flex flex-col justify-center p-4 md:p-6 max-w-7xl mx-auto w-full">
        {lessonData ? (
          <LessonPlayer lessonData={lessonData} />
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-rose-500 mb-4">Lesson not found</h2>
            <p className="text-slate-500 font-comic">Make sure the backend API is running and this lesson exists.</p>
            <Link href="/" className="clay-btn-secondary inline-block mt-8 px-6 py-3">
              Go back home
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
