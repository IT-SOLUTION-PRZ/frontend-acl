"use client";

import { Settings, UserCircle } from "lucide-react";
import { InterestsPicker } from "@/components/shared/InterestsPicker";
import { useInterests } from "@/hooks/useInterests";

interface SettingsTabProps {
  displayName: string;
  email: string;
}

export function SettingsTab({ displayName, email }: SettingsTabProps) {
  const { initialInterests, isLoadingInterests, isSaving, saveInterests } = useInterests();

  const handleSave = async (interests: string[]) => {
    await saveInterests(interests);
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center gap-3">
        <Settings className="text-indigo-600 w-8 h-8" />
        <h2 className="text-2xl md:text-3xl font-bold text-indigo-900">
          Settings
        </h2>
      </div>

      <div className="clay-card p-6 md:p-8 bg-white space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-indigo-100 text-indigo-500 rounded-full flex items-center justify-center border-2 border-indigo-200">
            <UserCircle className="w-10 h-10" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-indigo-900">{displayName}</h3>
            <p className="text-slate-500 font-comic">{email}</p>
          </div>
        </div>

        <hr className="border-slate-100" />

        <div>
          <h4 className="text-lg font-bold text-indigo-900 mb-2">Learning Interests</h4>
          <p className="text-slate-500 font-comic mb-6 text-sm">
            Update your interests to get better personalized lesson suggestions.
          </p>
          
          {isLoadingInterests ? (
            <div className="min-h-[160px] flex items-center text-slate-500 font-comic">
              Loading interests...
            </div>
          ) : (
            <InterestsPicker
              initialInterests={initialInterests}
              onSave={handleSave}
              isLoading={isSaving}
            />
          )}
        </div>
      </div>
    </div>
  );
}
