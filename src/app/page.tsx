// src/app/page.tsx
'use client';

import { useState } from 'react';
import { generateLesson } from '@/lib/api';
import { usePlayerStore } from '@/store/usePlayerStore';
import PlayerControls from '@/components/player/PlayerControls';

export default function Home() {
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setLesson, currentLesson, currentSlideIndex } = usePlayerStore();

  const handleGenerate = async () => {
    if (!topic) return;
    setIsLoading(true);
    try {
      const lessonData = await generateLesson(topic);
      setLesson(lessonData);
    } catch (error) {
      console.error(error);
      alert('Błąd podczas generowania lekcji.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center p-8 bg-white text-black">
      <h1 className="text-3xl font-bold mb-8">Animated Lesson Creator 🎓</h1>

      <div className="flex gap-2 mb-8">
        <input 
          type="text" 
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Czego chcesz się nauczyć?"
          className="border p-2 rounded w-80"
        />
        <button 
          onClick={handleGenerate}
          disabled={isLoading}
          className="bg-green-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          {isLoading ? 'Generowanie (AI)...' : 'Stwórz Lekcję'}
        </button>
      </div>

      {currentLesson && (
        <div className="w-full max-w-3xl border-2 border-dashed border-gray-300 p-8 min-h-[400px] flex flex-col items-center justify-center relative">
          <h2 className="text-xl font-bold mb-4">{currentLesson.topic}</h2>
          
          {/* Tu w przyszłości będzie komponent Board z animacjami GSAP */}
          <div className="text-center p-6 bg-blue-50 w-full rounded-lg">
            <p className="text-lg">
              {currentLesson.slides[currentSlideIndex]?.content || 'Ładowanie slajdu...'}
            </p>
            <p className="text-sm text-gray-500 mt-4 italic">
              Lektor: "{currentLesson.slides[currentSlideIndex]?.voiceoverText}"
            </p>
          </div>

          <div className="absolute bottom-4 left-4">
            Slajd: {currentSlideIndex + 1} / {currentLesson.slides.length}
          </div>
        </div>
      )}

      <PlayerControls />
    </main>
  );
}