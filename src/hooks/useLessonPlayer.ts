import { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import katex from "katex";

export function useLessonPlayer(lessonData: any) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [sceneTitle, setSceneTitle] = useState("");

  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const timelineFinishedRef = useRef(false);
  const speechFinishedRef = useRef(false);

  // Mirror state values in refs for use inside GSAP/SpeechSynthesis callbacks
  const currentIdxRef = useRef(currentIdx);
  currentIdxRef.current = currentIdx;

  const isStartedRef = useRef(isStarted);
  isStartedRef.current = isStarted;

  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  const speechEnabledRef = useRef(speechEnabled);
  speechEnabledRef.current = speechEnabled;

  const totalScenes = lessonData?.scenes?.length || 0;

  // Initialize SpeechSynthesis on client side only
  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;
      synthRef.current.cancel();
      return () => {
        if (synthRef.current) synthRef.current.cancel();
        if (tlRef.current) tlRef.current.kill();
      };
    }
  }, []);

  // ---- Core engine functions ----

  const speakText = useCallback((text: string) => {
    speechFinishedRef.current = false;
    if (synthRef.current) synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "pl-PL";
    utterance.rate = 1.0;

    utterance.onend = () => {
      speechFinishedRef.current = true;
      tryAdvanceScene();
    };

    utterance.onerror = () => {
      speechFinishedRef.current = true;
      tryAdvanceScene();
    };

    utteranceRef.current = utterance;
    if (synthRef.current) synthRef.current.speak(utterance);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tryAdvanceScene = useCallback(() => {
    if (!timelineFinishedRef.current || !speechFinishedRef.current) return;
    if (!lessonData?.scenes) return;

    const idx = currentIdxRef.current;
    if (idx < lessonData.scenes.length - 1) {
      setCurrentIdx(idx + 1);
    } else {
      // Lesson finished
      setIsPlaying(false);
      setIsStarted(false);
    }
  }, [lessonData]);

  const renderScene = useCallback(
    (index: number, autoPlay: boolean) => {
      if (!lessonData?.scenes?.[index] || !containerRef.current) return;
      const scene = lessonData.scenes[index];

      // Reset transition flags
      timelineFinishedRef.current = false;
      speechFinishedRef.current =
        !speechEnabledRef.current || !scene.speechText;

      // Stop previous speech & animations
      if (synthRef.current) synthRef.current.cancel();
      if (containerRef.current) {
        gsap.killTweensOf(containerRef.current.querySelectorAll("*"));
      }
      if (tlRef.current) tlRef.current.kill();

      // Inject SVG
      containerRef.current.innerHTML = scene.svgCode;

      // Render math with KaTeX
      const mathElements =
        containerRef.current.querySelectorAll(".math-tex");
      mathElements.forEach((el) => {
        let formulaText = el.textContent || "";
        formulaText = formulaText.replace(
          /(?:\\+|\b)(sqrt|frac|circ|cdot|times|div|pm|mp|int|sum|prod|alpha|beta|gamma|delta|Delta|pi|theta|infty|approx|leq|geq|neq|sin|cos|tan|text|vec|xrightarrow)\b/g,
          "\\$1"
        );
        try {
          katex.render(formulaText, el as HTMLElement, {
            throwOnError: false,
            displayMode: true,
          });
        } catch {
          // Silently ignore rendering errors
        }
      });

      // Build GSAP timeline
      const tl = gsap.timeline({
        paused: !autoPlay,
        onUpdate: () => {
          if (tlRef.current) {
            setProgress(tlRef.current.progress() * 100);
            setCurrentTime(tlRef.current.time());
            setTotalTime(tlRef.current.duration());
          }
        },
        onComplete: () => {
          timelineFinishedRef.current = true;
          tryAdvanceScene();
        },
      });

      tlRef.current = tl;

      // Base duration tween for the scene timeline
      tl.to({}, { duration: scene.duration });

      // Add animations
      scene.animations?.forEach((anim: any) => {
        if (!containerRef.current) return;
        const targets = containerRef.current.querySelectorAll(anim.target);
        if (targets.length === 0) return;

        if (anim.type === "timeline") {
          tl.to(targets, anim.props, anim.start || 0);
        } else if (anim.type === "loop") {
          gsap.to(targets, { ...anim.props, repeat: -1 });
        }
      });

      // Start speech if autoPlay
      if (autoPlay && speechEnabledRef.current && scene.speechText) {
        speakText(scene.speechText);
      }
    },
    [lessonData, speakText, tryAdvanceScene]
  );

  // Re-render scene when currentIdx or lessonData changes
  useEffect(() => {
    if (!lessonData?.scenes?.length) return;
    renderScene(currentIdx, isStartedRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIdx, lessonData]);

  // Reset when lessonData changes
  useEffect(() => {
    if (lessonData?.scenes?.length) {
      setCurrentIdx(0);
      setSceneTitle(lessonData.lessonTitle || "Lekcja");
      setIsStarted(false);
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
      setTotalTime(0);
    }
  }, [lessonData]);

  // ---- Public actions ----

  const togglePlay = useCallback(() => {
    if (!tlRef.current || !lessonData) return;

    if (!isStartedRef.current) {
      // First start or replay
      setIsStarted(true);
      setIsPlaying(true);

      if (
        currentIdxRef.current >= lessonData.scenes.length - 1 &&
        timelineFinishedRef.current
      ) {
        // Replay from the beginning
        setCurrentIdx(0);
      } else {
        const scene = lessonData.scenes[currentIdxRef.current];
        if (speechEnabledRef.current && scene.speechText) {
          speakText(scene.speechText);
        }
        tlRef.current.play();
      }
      return;
    }

    // Toggle pause / resume
    if (tlRef.current.paused()) {
      tlRef.current.play();
      if (synthRef.current) synthRef.current.resume();
      setIsPlaying(true);
    } else {
      tlRef.current.pause();
      if (synthRef.current) synthRef.current.pause();
      setIsPlaying(false);
    }
  }, [lessonData, speakText]);

  const toggleSpeech = useCallback(() => {
    const next = !speechEnabledRef.current;
    setSpeechEnabled(next);
    if (!next) {
      if (synthRef.current) synthRef.current.cancel();
      speechFinishedRef.current = true;
      tryAdvanceScene();
    }
  }, [tryAdvanceScene]);

  const seek = useCallback((val: number) => {
    if (tlRef.current) {
      tlRef.current.progress(val / 100);
      tlRef.current.pause();
      if (synthRef.current) synthRef.current.cancel();
      timelineFinishedRef.current = false;
      setIsPlaying(false);
    }
  }, []);

  return {
    containerRef,
    sceneTitle,
    isStarted,
    isPlaying,
    speechEnabled,
    progress,
    currentTime,
    totalTime,
    currentSceneIdx: currentIdx,
    totalScenes,
    togglePlay,
    toggleSpeech,
    seek,
  };
}
