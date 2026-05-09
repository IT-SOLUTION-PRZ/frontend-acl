import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { generateLesson } from "@/lib/api";
import { useGeneratedLessonStore } from "@/store/generatedLessonStore";
import { toast } from "sonner";

const PROGRESS_MESSAGES = [
  "Preparing the magical chalk...",
  "Thinking of fun ideas...",
  "Drawing the pictures...",
  "Adding fun colors...",
  "Recording the teacher's voice...",
  "Sprinkling some magic dust...",
];

export function useLessonGenerator() {
  const router = useRouter();
  const { setLessonData } = useGeneratedLessonStore();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [prompt, setPrompt] = useState("");
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startGeneration = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setProgress(0);
    setMessageIndex(0);

    // Start simulated progress
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        // Cap simulated progress at 90% until API finishes
        const next = prev + Math.random() * 5;
        return next > 90 ? 90 : next;
      });

      if (Math.random() > 0.4) {
        setMessageIndex((prev) =>
          prev < PROGRESS_MESSAGES.length - 1 ? prev + 1 : prev
        );
      }
    }, 800);

    try {
      const data = await generateLesson(prompt);
      
      // Store the generated lesson data globally
      setLessonData(data);
      
      // Complete the progress
      setProgress(100);
      setMessageIndex(PROGRESS_MESSAGES.length - 1);
      
      // Small delay for UI smoothness
      setTimeout(() => {
        router.push(`/lesson/${data.id}`);
      }, 500);
      
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to generate lesson. The topic might be invalid.";
      toast.error(message);
      setIsGenerating(false);
      setProgress(0);
    } finally {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  };

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return {
    isGenerating,
    progress,
    message: PROGRESS_MESSAGES[messageIndex],
    prompt,
    setPrompt,
    startGeneration,
  };
}
