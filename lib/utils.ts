import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(bytes: number) {
  return `${(bytes / 1024 ** 2).toFixed(2)} MB`;
}

export function formatDuration(seconds: number) {
  const total = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const remainder = String(total % 60).padStart(2, "0");

  return hours > 0
    ? `${hours}:${String(minutes).padStart(2, "0")}:${remainder}`
    : `${minutes}:${remainder}`;
}

export function sanitizeFilename(name: string) {
  const stem = name.trim().replace(/\.mp3$/i, "");
  const clean = stem.replace(/[\\/*?:"<>|]/g, "").trim().slice(0, 150) || "audio";
  return `${clean}.mp3`;
}
