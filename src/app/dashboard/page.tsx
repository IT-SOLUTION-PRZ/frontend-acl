"use client";

import { useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useDashboardTab } from "@/hooks/useDashboardTab";
import { getDisplayName } from "@/lib/utils";
import { HomeTab } from "@/components/dashboard/HomeTab";
import { LessonsTab } from "@/components/dashboard/LessonsTab";
import { SettingsTab } from "@/components/dashboard/SettingsTab";

function DashboardContent() {
  const { user } = useAuthStore();
  const router = useRouter();
  const activeTab = useDashboardTab();

  useEffect(() => {
    if (user && !user.user_metadata?.onboarding_completed) {
      router.replace("/onboarding");
    }
  }, [user, router]);

  const displayName = getDisplayName(user);

  return (
    <main className="flex-grow p-4 md:p-8 max-w-5xl mx-auto space-y-6 md:space-y-8 w-full">
      {activeTab === "dashboard" && <HomeTab displayName={displayName} />}
      {activeTab === "lessons" && <LessonsTab />}
      {activeTab === "settings" && (
        <SettingsTab displayName={displayName} email={user?.email ?? ""} />
      )}
    </main>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading Dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
