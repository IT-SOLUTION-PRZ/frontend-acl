import { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F5F3FF] flex flex-col md:flex-row">
      <Sidebar />
      {children}
    </div>
  );
}
