import Link from "next/link";
import { Sparkles, Home, FolderHeart, Settings, LogOut } from "lucide-react";

export function Sidebar() {
  return (
    <aside className="w-full md:w-64 bg-white/80 backdrop-blur-sm border-b-2 md:border-b-0 md:border-r-2 border-indigo-100 flex flex-col p-4 md:p-6 sticky top-0 z-50 md:h-screen shrink-0">
      <div className="flex items-center justify-between md:mb-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center border-2 border-indigo-200 shrink-0">
            <Sparkles className="text-indigo-500 w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-indigo-900 tracking-wide hidden md:block">
            EduAI
          </h1>
        </div>

        {/* Mobile user profile */}
        <div className="flex md:hidden items-center gap-3">
          <p className="font-bold text-indigo-900 text-sm">Alex</p>
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=b6e3f4"
            alt="User Avatar"
            className="w-10 h-10 rounded-full border-2 border-emerald-300"
          />
        </div>
      </div>

      <nav className="flex md:flex-col gap-2 overflow-x-auto mt-4 md:mt-0 md:space-y-3 flex-grow pb-2 md:pb-0 hide-scrollbar">
        <Link
          href="/dashboard"
          className="flex items-center justify-center md:justify-start gap-3 px-4 py-3 bg-indigo-50 text-indigo-700 rounded-xl font-bold border-2 border-indigo-200 whitespace-nowrap flex-1 md:flex-none"
        >
          <Home className="w-5 h-5 shrink-0" />{" "}
          <span className="hidden md:inline">Dashboard</span>
        </Link>
        <Link
          href="#"
          className="flex items-center justify-center md:justify-start gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 rounded-xl font-semibold transition-colors whitespace-nowrap flex-1 md:flex-none"
        >
          <FolderHeart className="w-5 h-5 shrink-0" />{" "}
          <span className="hidden md:inline">My Lessons</span>
        </Link>
        <Link
          href="#"
          className="flex items-center justify-center md:justify-start gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 rounded-xl font-semibold transition-colors whitespace-nowrap flex-1 md:flex-none"
        >
          <Settings className="w-5 h-5 shrink-0" />{" "}
          <span className="hidden md:inline">Settings</span>
        </Link>
        <Link
          href="/"
          className="flex md:hidden items-center justify-center gap-3 px-4 py-3 text-slate-600 hover:bg-rose-50 hover:text-rose-500 rounded-xl font-semibold transition-colors whitespace-nowrap flex-1"
        >
          <LogOut className="w-5 h-5 shrink-0" />
        </Link>
      </nav>

      <div className="hidden md:flex mt-auto pt-6 border-t-2 border-slate-100 items-center gap-3">
        <img
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=b6e3f4"
          alt="User Avatar"
          className="w-10 h-10 rounded-full border-2 border-emerald-300"
        />
        <div>
          <p className="font-bold text-indigo-900 text-sm">Alex</p>
          <Link href="/" className="text-xs text-slate-500 hover:text-rose-500">
            Log out
          </Link>
        </div>
      </div>
    </aside>
  );
}
