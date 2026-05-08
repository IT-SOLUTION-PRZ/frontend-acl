"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useInterests } from "@/hooks/useInterests";
import { InterestsPicker } from "@/components/shared/InterestsPicker";
import { Navbar } from "@/components/layout/Navbar";
import { Sparkles } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isLoading } = useAuthStore();
  const { isSaving, saveInterests } = useInterests();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    } else if (!isLoading && user?.user_metadata?.onboarding_completed) {
      router.replace("/dashboard");
    }
  }, [user, isLoading, router]);

  const handleComplete = async (interests: string[]) => {
    try {
      await saveInterests(interests, { markOnboardingComplete: true });
      router.push("/dashboard");
    } catch {
      // Error toast is handled inside useInterests — don't redirect on failure
    }
  };

  const handleSkip = () => {
    handleComplete([]);
  };

  if (isLoading || !user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 relative pb-20">
      <Navbar />

      <main className="max-w-2xl mx-auto px-6 mt-16">
        <div className="clay-card p-8 bg-white relative">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-16 h-16 bg-amber-300 rounded-full flex items-center justify-center border-4 border-white shadow-md z-10">
            <Sparkles className="w-8 h-8 text-amber-600" />
          </div>

          <div className="text-center mt-8 mb-10">
            <h1 className="text-3xl md:text-4xl font-baloo text-indigo-900 mb-3">
              What do you love?
            </h1>
            <p className="font-comic text-slate-500 text-lg">
              Tell us your favorite topics so we can create amazing, personalized lessons just for you!
            </p>
          </div>

          <InterestsPicker
            initialInterests={[]}
            onSave={handleComplete}
            onSkip={handleSkip}
            isLoading={isSaving}
          />
        </div>
      </main>
    </div>
  );
}
