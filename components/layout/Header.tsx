"use client";

import Link from "next/link";
import { AudioLines, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function Header() {
  const { resolvedTheme, setTheme } = useTheme();

  function toggleTheme() {
    const dark = resolvedTheme === "dark" || (!resolvedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setTheme(dark ? "light" : "dark");
  }

  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">Langsung ke konverter</a>
      <div className="site-header-inner">
        <Link href="/" className="wordmark" aria-label="Wavecut, halaman utama">
          <span className="brand-mark"><AudioLines size={20} strokeWidth={2} aria-hidden="true" /></span>
          <span>wavecut<span className="brand-dot">.</span></span>
        </Link>
        <div className="header-controls">
          <span className="header-caption">ALAT KONVERSI AUDIO</span>
          <Button type="button" variant="outline" size="icon" className="theme-toggle" onClick={toggleTheme} aria-label="Ganti tema terang atau gelap" title="Ganti tema">
            <Moon className="theme-moon" aria-hidden="true" />
            <Sun className="theme-sun" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </header>
  );
}
