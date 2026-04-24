export interface Lesson {
  id: string;
  title: string;
  slides: Slide[];
  duration: number;
}

export interface Slide {
  id: string;
  type: "content" | "quiz" | "interactive";
  title: string;
  content: string;
  audioUrl?: string;
}