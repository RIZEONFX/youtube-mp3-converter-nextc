import { z } from "zod";

const youtubeHost = /^(?:(?:www|m|music)\.)?youtube\.com$/i;
const shortHost = /^(?:www\.)?youtu\.be$/i;
const videoIdPattern = /^[A-Za-z0-9_-]{11}$/;

export const youtubeUrlSchema = z.string().trim().refine((value) => {
  try {
    const url = new URL(value);
    if (!/^https?:$/.test(url.protocol) || url.username || url.password || url.port) return false;
    if (shortHost.test(url.hostname)) return /^\/[A-Za-z0-9_-]{11}\/?$/.test(url.pathname);
    if (!youtubeHost.test(url.hostname)) return false;
    if (/^\/watch\/?$/.test(url.pathname)) return videoIdPattern.test(url.searchParams.get("v") ?? "");
    return /^\/(?:shorts|live|embed|v)\/[A-Za-z0-9_-]{11}\/?$/.test(url.pathname);
  } catch {
    return false;
  }
}, "Masukkan link video YouTube yang valid.");

export const metadataSchema = z.object({
  title: z.string().trim().min(1, "Judul wajib diisi.").max(150, "Judul maksimal 150 karakter."),
  artist: z.string().trim().min(1, "Artis wajib diisi."),
  album: z.string().trim(),
  genre: z.string().trim(),
});

export type TrackMetadata = z.infer<typeof metadataSchema>;
