import { AudioLines, Disc3, ShieldCheck, SlidersHorizontal, Tag } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { WizardContainer } from "@/components/wizard/WizardContainer";

const features = [
  { Icon: SlidersHorizontal, title: "Bitrate fleksibel", detail: "Hingga 320 kbps" },
  { Icon: Tag, title: "Metadata ID3", detail: "Edit detail lagu" },
  { Icon: Disc3, title: "Cover art", detail: "Ditambahkan otomatis" },
];

export default function Home() {
  return (
    <>
      <Header />
      <main id="main-content" className="studio-main" tabIndex={-1}>
        <div className="studio-grid" aria-hidden="true" />
        <div className="studio-art studio-art-left" aria-hidden="true">
          <svg width="215" height="180" viewBox="0 0 215 180" fill="none">
            <path d="M2 90h211M106 13v154" className="art-axis" />
            <path d="M17 85v10m13-17v24m13-18v12m13-24v36m13-51v66m13-50v34m13-69v104m13-125v146m13-115v84m13-65v46m13-58v70m13-49v28m13-20v12m13-15v18m13-12v6" className="art-wave" />
            <path d="M2 19v-8h8m195 0h8v8M2 161v8h8m195 0h8v-8" className="art-frame" />
          </svg>
          <span>FIG. 01 / WAVEFORM</span>
        </div>
        <div className="studio-art studio-art-right" aria-hidden="true">
          <svg width="215" height="180" viewBox="0 0 215 180" fill="none">
            <path d="M2 90h211M108 13v154" className="art-axis" />
            <circle cx="108" cy="90" r="67" className="art-frame" />
            <circle cx="108" cy="90" r="58" className="art-frame" />
            <circle cx="108" cy="90" r="48" className="art-frame" />
            <circle cx="108" cy="90" r="37" className="art-frame" />
            <circle cx="108" cy="90" r="23" className="art-wave" />
            <circle cx="108" cy="90" r="4" fill="currentColor" />
            <path d="M155 43l31-31h27M2 19v-8h8M2 161v8h8m195 0h8v-8" className="art-frame" />
          </svg>
          <span>FIG. 02 / AUDIO DISC</span>
        </div>
        <section className="studio-hero" aria-labelledby="product-title">
          <div className="studio-kicker"><AudioLines size={15} aria-hidden="true" /> STUDIO AUDIO WEB</div>
          <h1 id="product-title">YouTube <span className="hero-arrow">→</span> <span className="hero-accent">MP3</span> <span className="hero-last">Converter</span></h1>
          <p>Ubah video YouTube menjadi MP3 dengan metadata yang bisa diedit dan cover art otomatis.</p>
        </section>
        <WizardContainer />
        <p className="rights-note"><ShieldCheck size={15} aria-hidden="true" /> Gunakan hanya video yang kamu miliki atau diizinkan untuk diunduh.</p>
        <ul className="feature-strip" aria-label="Fitur konverter">
          {features.map(({ Icon, title, detail }) => (
            <li key={title}>
              <span className="feature-icon"><Icon size={18} aria-hidden="true" /></span>
              <span><strong>{title}</strong><span className="feature-detail">{detail}</span></span>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </>
  );
}
