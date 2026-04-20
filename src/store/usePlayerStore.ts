import { create } from 'zustand';
import { Lesson } from '../types/lesson';

interface PlayerState {
  currentLesson: Lesson | null;
  currentSlideIndex: number;
  isPlaying: boolean;
  
  setLesson: (lesson: Lesson) => void;
  play: () => void;
  pause: () => void;
  nextSlide: () => void;
  prevSlide: () => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  currentLesson: null,
  currentSlideIndex: 0,
  isPlaying: false,

  setLesson: (lesson) => set({ currentLesson: lesson, currentSlideIndex: 0, isPlaying: false }),
  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  nextSlide: () => set((state) => ({ 
    currentSlideIndex: Math.min(state.currentSlideIndex + 1, (state.currentLesson?.slides.length || 1) - 1) 
  })),
  prevSlide: () => set((state) => ({ 
    currentSlideIndex: Math.max(state.currentSlideIndex - 1, 0) 
  })),
}));