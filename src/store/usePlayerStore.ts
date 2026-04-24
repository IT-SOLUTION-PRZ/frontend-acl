import { create } from "zustand";

interface PlayerState {
  currentSlide: number;
  isPlaying: boolean;
  lessonId: string | null;
  setSlide: (index: number) => void;
  togglePlay: () => void;
  setLesson: (id: string) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  currentSlide: 0,
  isPlaying: false,
  lessonId: null,
  setSlide: (index) => set({ currentSlide: index }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setLesson: (id) => set({ lessonId: id }),
}));