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
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const timelineFinishedRef = useRef(false);
  const speechFinishedRef = useRef(false);

  const currentIdxRef = useRef(currentIdx);
  currentIdxRef.current = currentIdx;

  const isStartedRef = useRef(isStarted);
  isStartedRef.current = isStarted;

  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  const speechEnabledRef = useRef(speechEnabled);
  speechEnabledRef.current = speechEnabled;

  const totalScenes = lessonData?.scenes?.length || 0;

  // --- LOGIKA PRZEWIJANIA ---
  const tryAdvanceScene = useCallback(() => {
    // Jeśli animacja lub dźwięk jeszcze trwają - nie rób nic
    if (!timelineFinishedRef.current || !speechFinishedRef.current) {
      console.log("Czekam na:", { 
        animacja: timelineFinishedRef.current, 
        dzwiek: speechFinishedRef.current 
      });
      return;
    }

    const idx = currentIdxRef.current;
    if (idx < (lessonData?.scenes?.length || 0) - 1) {
      console.log("Przełączam na slajd:", idx + 1);
      setCurrentIdx(idx + 1);
    } else {
      console.log("Koniec lekcji");
      setIsPlaying(false);
      setIsStarted(false);
    }
  }, [lessonData]);

  // --- LOGIKA AUDIO ---
  const playAudio = useCallback((url: string) => {
    speechFinishedRef.current = false;
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }

    const audio = new Audio(url);
    audioRef.current = audio;
    audio.muted = !speechEnabledRef.current;

    audio.onended = () => {
      console.log("Dźwięk zakończony");
      speechFinishedRef.current = true;
      tryAdvanceScene();
    };

    audio.onerror = () => {
      console.error("Błąd pliku audio, pomijam...");
      speechFinishedRef.current = true;
      tryAdvanceScene();
    };

    audio.play().catch(e => {
      console.warn("Blokada autoodtwarzania audio, kliknij Play.");
      // Jeśli przeglądarka blokuje dźwięk, nie możemy zablokować lekcji
      // ale pozwalamy użytkownikowi kliknąć Play później
    });
  }, [tryAdvanceScene]);

  const renderScene = useCallback(
    (index: number, autoPlay: boolean) => {
      if (!lessonData?.scenes?.[index] || !containerRef.current) return;
      const scene = lessonData.scenes[index];

      // Resetujemy flagi przed nowym slajdem
      timelineFinishedRef.current = false;
      
      // Jeśli dźwięk jest wyłączony lub go nie ma - uznajemy go za zakończony od razu
      speechFinishedRef.current = !autoPlay || !speechEnabledRef.current || !scene.audioUrl;

      // Sprzątanie po poprzednim slajdzie
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (tlRef.current) tlRef.current.kill();
      if (containerRef.current) {
        gsap.killTweensOf(containerRef.current.querySelectorAll("*"));
      }

      // Wstrzyknięcie SVG
      containerRef.current.innerHTML = scene.svgCode;

      // KaTeX
      const mathElements = containerRef.current.querySelectorAll(".math-tex");
      mathElements.forEach((el) => {
        let formulaText = el.textContent || "";
        formulaText = formulaText.replace(/(?:\\+|\b)(sqrt|frac|circ|cdot|times|div|pm|mp|int|sum|prod|alpha|beta|gamma|delta|Delta|pi|theta|infty|approx|leq|geq|neq|sin|cos|tan|text|vec|xrightarrow)\b/g, "\\$1");
        try {
          katex.render(formulaText, el as HTMLElement, { throwOnError: false, displayMode: true });
        } catch (e) {}
      });

      // Animacje GSAP
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
          console.log("Animacja zakończona");
          timelineFinishedRef.current = true;
          tryAdvanceScene();
        },
      });

      tlRef.current = tl;
      tl.to({}, { duration: scene.duration || 5 }); // Minimalny czas trwania slajdu

      scene.animations?.forEach((anim: any) => {
        if (!containerRef.current) return;
        const targets = containerRef.current.querySelectorAll(anim.target);
        if (targets.length > 0) {
          if (anim.type === "timeline") {
            tl.to(targets, anim.props, anim.start || 0);
          } else if (anim.type === "loop") {
            gsap.to(targets, { ...anim.props, repeat: -1 });
          }
        }
      });

      // Start dźwięku
      if (autoPlay && scene.audioUrl && speechEnabledRef.current) {
        playAudio(scene.audioUrl);
      }
    },
    [lessonData, playAudio, tryAdvanceScene]
  );

  useEffect(() => {
    if (!lessonData?.scenes?.length) return;
    renderScene(currentIdx, isStartedRef.current);
  }, [currentIdx, lessonData, renderScene]);

  useEffect(() => {
    if (lessonData?.scenes?.length) {
      setCurrentIdx(0);
      setSceneTitle(lessonData.lessonTitle || "Lekcja");
      setIsStarted(false);
      setIsPlaying(false);
    }
  }, [lessonData]);

  const togglePlay = useCallback(() => {
    if (!tlRef.current || !lessonData) return;

    if (!isStartedRef.current) {
      setIsStarted(true);
      setIsPlaying(true);
      
      const scene = lessonData.scenes[currentIdxRef.current];
      if (speechEnabledRef.current && scene.audioUrl) {
        playAudio(scene.audioUrl);
      }
      tlRef.current.play();
      return;
    }

    if (tlRef.current.paused()) {
      tlRef.current.play();
      if (audioRef.current) audioRef.current.play();
      setIsPlaying(true);
    } else {
      tlRef.current.pause();
      if (audioRef.current) audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [lessonData, playAudio]);

  const toggleSpeech = useCallback(() => {
    const next = !speechEnabledRef.current;
    setSpeechEnabled(next);
    if (audioRef.current) audioRef.current.muted = !next;
    
    // Jeśli włączamy dźwięk, a slajd już trwa, spróbujmy go odpalić
    if (next && isPlayingRef.current && audioRef.current?.paused) {
      audioRef.current.play();
    }
  }, []);

  const seek = useCallback((val: number) => {
    if (tlRef.current) {
      tlRef.current.progress(val / 100);
      tlRef.current.pause();
      if (audioRef.current) {
        const target = (val / 100) * (audioRef.current.duration || 0);
        if (!isNaN(target)) audioRef.current.currentTime = target;
        audioRef.current.pause();
      }
      setIsPlaying(false);
    }
  }, []);

  return {
    containerRef, sceneTitle, isStarted, isPlaying, speechEnabled,
    progress, currentTime, totalTime, currentSceneIdx: currentIdx, 
    totalScenes, togglePlay, toggleSpeech, seek
  };
}