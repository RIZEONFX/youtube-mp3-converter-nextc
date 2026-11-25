"use client";

import { Check, Download, FileAudio, Link2, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { StepHeading } from "@/components/wizard/StepHeading";
import { getDownloadUrl, type JobResult } from "@/lib/api";
import { useWizard } from "@/lib/store";
import { formatBytes, sanitizeFilename } from "@/lib/utils";

export function Step4Result({ result }: { result: JobResult }) {
  const reset = useWizard((state) => state.reset);
  const filename = sanitizeFilename(result.fileName);
  const downloadUrl = getDownloadUrl(result.downloadUrl);

  async function copyLink() {
    if (!downloadUrl) return;
    try {
      await navigator.clipboard.writeText(downloadUrl);
      toast.success("Link download disalin.");
    } catch {
      toast.error("Gagal menyalin link download.");
    }
  }

  return (
    <>
      <StepHeading icon={Check} step={4} title="Selesai!" description="MP3 dengan metadata dan cover art siap diunduh." />
      <div className="result-panel">
        <span className="result-check"><Check size={30} strokeWidth={2.5} aria-hidden="true" /></span>
        <div className="result-file">
          <span className="result-file-icon"><FileAudio size={21} aria-hidden="true" /></span>
          <div>
            <p className="result-filename">{filename}</p>
            <dl className="audio-badges">
              <div><dt className="sr-only">Ukuran</dt><dd>{formatBytes(result.fileSize)}</dd></div>
              <div><dt className="sr-only">Bitrate</dt><dd>{result.bitrate} kbps</dd></div>
              <div><dt className="sr-only">Format</dt><dd>MP3</dd></div>
            </dl>
          </div>
        </div>
      </div>
      {downloadUrl ? (
        <Button asChild className="primary-action result-download">
          <a href={downloadUrl} download={filename}><Download aria-hidden="true" /> Download MP3</a>
        </Button>
      ) : <p className="inline-error" role="alert">Link download dari server tidak valid.</p>}
      <div className="result-actions">
        <Button type="button" variant="outline" className="secondary-action" onClick={reset}><RotateCcw aria-hidden="true" /> Convert Lagu Lain</Button>
        {downloadUrl && <Button type="button" variant="ghost" className="secondary-action result-copy" onClick={copyLink}><Link2 aria-hidden="true" /> Salin Link</Button>}
      </div>
    </>
  );
}
