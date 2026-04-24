import Link from "next/link";
import { PlayCircle } from "lucide-react";

interface LessonCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  colorScheme: "indigo" | "rose" | "amber";
}

export function LessonCard({
  id,
  title,
  description,
  category,
  duration,
  colorScheme,
}: LessonCardProps) {
  const colorStyles = {
    indigo: {
      bg: "bg-indigo-100",
      border: "border-indigo-200",
      icon: "text-indigo-400 group-hover:text-indigo-600",
      badge: "text-indigo-600",
      tagBg: "bg-emerald-100",
      tagText: "text-emerald-700",
      tagBorder: "border-emerald-200",
    },
    rose: {
      bg: "bg-rose-100",
      border: "border-rose-200",
      icon: "text-rose-400 group-hover:text-rose-600",
      badge: "text-rose-600",
      tagBg: "bg-blue-100",
      tagText: "text-blue-700",
      tagBorder: "border-blue-200",
    },
    amber: {
      bg: "bg-amber-100",
      border: "border-amber-200",
      icon: "text-amber-400 group-hover:text-amber-600",
      badge: "text-amber-600",
      tagBg: "bg-purple-100",
      tagText: "text-purple-700",
      tagBorder: "border-purple-200",
    },
  };

  const style = colorStyles[colorScheme];

  return (
    <Link
      href={`/lesson/${id}`}
      className="clay-card block overflow-hidden group hover:-translate-y-2 transition-transform duration-300"
    >
      <div
        className={`aspect-video ${style.bg} relative flex items-center justify-center p-4`}
      >
        <div
          className={`w-full h-full bg-white/50 rounded-xl border-2 ${style.border} border-dashed flex flex-col items-center justify-center`}
        >
          <PlayCircle
            className={`w-16 h-16 transition-colors group-hover:scale-110 duration-300 ${style.icon}`}
          />
        </div>
        <div
          className={`absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-xs font-bold clay-card shadow-sm border-2 ${style.badge}`}
        >
          {duration}
        </div>
      </div>
      <div className="p-6 space-y-3">
        <div className="flex gap-2 mb-2">
          <span
            className={`${style.tagBg} ${style.tagText} px-3 py-1 rounded-full text-xs font-bold border ${style.tagBorder}`}
          >
            {category}
          </span>
        </div>
        <h4 className="text-xl font-bold text-indigo-900">{title}</h4>
        <p className="text-slate-500 text-sm font-comic line-clamp-2">
          {description}
        </p>
      </div>
    </Link>
  );
}
