import type { Metadata } from "next";
import { Baloo_2, Comic_Neue, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/providers/AuthProvider";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
});

const comicNeue = Comic_Neue({
  weight: ["300", "400", "700"],
  variable: "--font-comic-neue",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EduAI - Animated Lesson Creator",
  description: "Magical Animated Lessons!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", baloo.variable, comicNeue.variable, "font-sans", geist.variable)}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col font-baloo bg-[#F5F3FF] text-[#1E1B4B]">
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
