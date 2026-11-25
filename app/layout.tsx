import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@fontsource-variable/manrope";
import "@fontsource-variable/jetbrains-mono";
import { Providers } from "@/components/Providers";
import "./globals.css";

const siteName = "YouTube → MP3 Converter";
const siteDescription = "Ubah video YouTube menjadi MP3 dengan bitrate pilihan, metadata ID3 yang bisa diedit, dan cover art otomatis.";

export const metadata: Metadata = {
  title: siteName,
  description: siteDescription,
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName,
    title: siteName,
    description: siteDescription,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
