
export type AnimationType = 'fade-in' | 'slide-left' | 'draw-svg' | 'show-formula';

export interface Slide {
  id: string;
  content: string;
  voiceoverText: string;
  voiceoverAudioUrl?: string; 
  animationType: AnimationType;
  durationInSeconds: number;
}

export interface Lesson {
  topic: string;
  slides: Slide[];
}