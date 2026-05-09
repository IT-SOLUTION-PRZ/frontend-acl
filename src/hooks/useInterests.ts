"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { updateInterests } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

/**
 * Encapsulates interests save logic (backend API + Supabase user metadata).
 * Used by both the Onboarding page and the Settings tab.
 */
export function useInterests() {
  const { user } = useAuthStore();
  const [isSaving, setIsSaving] = useState(false);

  const initialInterests: string[] = user?.user_metadata?.interests || [];

  const saveInterests = async (
    interests: string[],
    options?: { markOnboardingComplete?: boolean }
  ) => {
    if (!user) return;
    setIsSaving(true);

    try {
      await updateInterests(interests);

      const metadata: Record<string, unknown> = { interests };
      if (options?.markOnboardingComplete) {
        metadata.onboarding_completed = true;
      }

      const { error } = await supabase.auth.updateUser({ data: metadata });
      if (error) throw error;

      toast.success(
        options?.markOnboardingComplete
          ? "Profile setup complete! Let's learn something new."
          : "Interests updated successfully!"
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to save interests.";
      toast.error(message);
      throw error; // re-throw so caller can handle (e.g. skip redirect)
    } finally {
      setIsSaving(false);
    }
  };

  return { initialInterests, isSaving, saveInterests };
}
