import { ReactNode, Suspense } from "react";
import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F5F3FF] flex flex-col md:flex-row">
      <Suspense fallback={<div className="w-full md:w-64 shrink-0 bg-white/80 border-r-2 border-indigo-100 p-6">Loading Menu...</div>}>
        <Sidebar />
      </Suspense>
      {children}
    </div>
  );
}
