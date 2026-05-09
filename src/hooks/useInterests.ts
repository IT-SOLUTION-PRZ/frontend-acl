"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { getInterests, updateInterests } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

/**
 * Encapsulates interests save logic (backend API + Supabase user metadata).
 * Used by both the Onboarding page and the Settings tab.
 */
export function useInterests() {
  const { user, setUser } = useAuthStore();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingInterests, setIsLoadingInterests] = useState(false);
  const [interests, setInterests] = useState<string[]>([]);

  useEffect(() => {
    const metadataInterests: string[] = user?.user_metadata?.interests || [];
    setInterests(metadataInterests);
    setIsLoadingInterests(Boolean(user));

    if (!user) {
      setIsLoadingInterests(false);
      return;
    }

    let isCurrent = true;
    getInterests()
      .then((savedInterests) => {
        if (!isCurrent) return;

        setInterests(
          savedInterests.length > 0 || metadataInterests.length === 0
            ? savedInterests
            : metadataInterests
        );
      })
      .catch(() => {
        if (isCurrent) setInterests(metadataInterests);
      })
      .finally(() => {
        if (isCurrent) setIsLoadingInterests(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [user]);

  const saveInterests = async (
    nextInterests: string[],
    options?: { markOnboardingComplete?: boolean }
  ) => {
    if (!user) return;
    setIsSaving(true);

    try {
      await updateInterests(nextInterests);

      const metadata: Record<string, unknown> = { interests: nextInterests };
      if (options?.markOnboardingComplete) {
        metadata.onboarding_completed = true;
      }

      const { data, error } = await supabase.auth.updateUser({ data: metadata });
      if (error) throw error;
      if (data.user) setUser(data.user);
      setInterests(nextInterests);

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

  return { initialInterests: interests, isLoadingInterests, isSaving, saveInterests };
}
