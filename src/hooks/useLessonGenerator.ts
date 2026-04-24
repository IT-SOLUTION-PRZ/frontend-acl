import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const PROGRESS_MESSAGES = [
  "Preparing the magical chalk...",
  "Drawing the pictures...",
  "Adding fun colors...",
  "Recording the teacher's voice...",
  "Sprinkling some magic dust...",
];

export function useLessonGenerator() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [prompt, setPrompt] = useState("");

  const startGeneration = () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setProgress(0);
    setMessageIndex(0);
  };

  useEffect(() => {
    if (!isGenerating) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 15;
        return next > 100 ? 100 : next;
      });

      if (Math.random() > 0.6) {
        setMessageIndex((prev) =>
          prev < PROGRESS_MESSAGES.length - 1 ? prev + 1 : prev
        );
      }
    }, 400);

    return () => clearInterval(interval);
  }, [isGenerating]);

  useEffect(() => {
    if (progress === 100) {
      const timer = setTimeout(() => {
        router.push("/lesson/new");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [progress, router]);

  return {
    isGenerating,
    progress,
    message: PROGRESS_MESSAGES[messageIndex],
    prompt,
    setPrompt,
    startGeneration,
  };
}
