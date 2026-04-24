// src/components/player/PlayerControls.tsx
'use client';

import { usePlayerStore } from '@/store/usePlayerStore';

export default function PlayerControls() {
  const { isPlaying, togglePlay, currentSlide, setSlide, lessonId } = usePlayerStore();

  if (!lessonId) return null;

  const prevSlide = () => setSlide(Math.max(0, currentSlide - 1));
  const nextSlide = () => setSlide(currentSlide + 1);

  return (
    <div className="flex gap-4 items-center p-4 bg-gray-100 rounded-lg shadow-md mt-4">
      <button 
        onClick={prevSlide}
        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
      >
        Poprzedni
      </button>
      
      <button 
        onClick={togglePlay}
        className="px-6 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700"
      >
        {isPlaying ? 'Pauza ⏸' : 'Odtwórz ▶️'}
      </button>

      <button 
        onClick={nextSlide}
        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
      >
        Następny
      </button>
    </div>
  );
}