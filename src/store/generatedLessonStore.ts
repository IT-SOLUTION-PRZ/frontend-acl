import { create } from "zustand";

interface GeneratedLessonState {
  lessonData: any | null;
  setLessonData: (data: any) => void;
  clearLessonData: () => void;
}

export const useGeneratedLessonStore = create<GeneratedLessonState>((set) => ({
  lessonData: null,
  setLessonData: (data) => set({ lessonData: data }),
  clearLessonData: () => set({ lessonData: null }),
}));
