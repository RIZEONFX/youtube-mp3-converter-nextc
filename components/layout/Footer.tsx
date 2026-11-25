import { AudioLines } from "lucide-react";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <span className="footer-brand"><AudioLines size={15} aria-hidden="true" /> wavecut.</span>
        <p>Tidak berafiliasi dengan YouTube.</p>
      </div>
    </footer>
  );
}
