"use client";

import { useState } from "react";
import { X, Plus, Wand2 } from "lucide-react";

interface InterestsPickerProps {
  initialInterests?: string[];
  onSave: (interests: string[]) => void;
  onSkip?: () => void;
  isLoading?: boolean;
}

export function InterestsPicker({
  initialInterests = [],
  onSave,
  onSkip,
  isLoading = false,
}: InterestsPickerProps) {
  const [interests, setInterests] = useState<string[]>(initialInterests);
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    const val = inputValue.trim();
    if (val && !interests.includes(val) && interests.length < 10) {
      setInterests([...interests, val]);
      setInputValue("");
    }
  };

  const handleRemove = (interestToRemove: string) => {
    setInterests(interests.filter((i) => i !== interestToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="space-y-4">
        <label className="block text-lg font-bold text-indigo-900">
          Add your interests (up to 10)
        </label>
        
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-grow clay-input py-3 px-4 font-comic"
            placeholder="e.g. Space, Dinosaurs, Programming..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={interests.length >= 10 || isLoading}
          />
          <button
            onClick={handleAdd}
            disabled={!inputValue.trim() || interests.length >= 10 || isLoading}
            className="clay-btn-secondary px-4 py-2 flex items-center justify-center disabled:opacity-50"
            type="button"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 min-h-[50px]">
        {interests.length === 0 ? (
          <p className="text-slate-400 font-comic text-sm py-2">
            No interests added yet.
          </p>
        ) : (
          interests.map((interest) => (
            <span
              key={interest}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-100 text-indigo-700 font-comic rounded-full border-2 border-indigo-200"
            >
              {interest}
              <button
                onClick={() => handleRemove(interest)}
                className="hover:bg-indigo-200 rounded-full p-0.5 transition-colors"
                disabled={isLoading}
                type="button"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))
        )}
      </div>

      <div className="flex items-center justify-between pt-4">
        {onSkip ? (
          <button
            onClick={onSkip}
            disabled={isLoading}
            className="text-slate-500 font-comic hover:text-slate-700 hover:underline px-4 py-2"
            type="button"
          >
            Skip for now
          </button>
        ) : <div />}
        
        <button
          onClick={() => onSave(interests)}
          disabled={isLoading}
          className="clay-btn-primary px-8 py-3 flex items-center gap-2 font-bold"
          type="button"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Wand2 className="w-5 h-5 animate-spin" /> Saving...
            </span>
          ) : (
            "Save Interests"
          )}
        </button>
      </div>
    </div>
  );
}
