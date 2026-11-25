"use client";

import { useEffect, useRef } from "react";
import { Activity, AlertCircle, AudioLines, LoaderCircle, RefreshCw, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StepHeading } from "@/components/wizard/StepHeading";
import { useJobStatus } from "@/hooks/useJobStatus";
import type { JobStatus } from "@/lib/api";
import { notifyApiError } from "@/lib/errors";
import { useWizard } from "@/lib/store";

function stageLabel(status: JobStatus["status"] | undefined, bitrate?: number) {
  switch (status) {
    case "queued": return "Menunggu giliran…";
    case "downloading": return "Mengunduh audio dari YouTube…";
    case "converting": return `Mengonversi ke MP3${bitrate === undefined ? "" : ` (${bitrate} kbps)`}…`;
    case "tagging": return "Menulis metadata & cover art…";
    case "completed": return "Selesai!";
    case "failed": return "Gagal";
    default: return "Menyiapkan pemrosesan…";
  }
}

export function Step3Progress({ jobId, startedAt }: { jobId: string; startedAt: number }) {
  const { query, timedOut } = useJobStatus(jobId, startedAt);
  const job = query.data;
  const finishJob = useWizard((state) => state.finishJob);
  const returnToMetadata = useWizard((state) => state.returnToMetadata);
  const reset = useWizard((state) => state.reset);
  const bitrate = useWizard((state) => state.bitrate);
  const suggestedBitrate = useWizard((state) => state.video?.audio.suggestedBitrate);
  const notifiedError = useRef<string | null>(null);
  const failed = job?.status === "failed" || (job?.status === "completed" && !job.result);
  const progress = Math.round(job?.progress ?? 0);
  const label = stageLabel(job?.status, bitrate === "auto" ? suggestedBitrate : bitrate);

  useEffect(() => {
    if (job?.status === "completed" && job.result) finishJob(jobId, job.result);
  }, [job, finishJob, jobId]);

  useEffect(() => {
    if (query.error && notifiedError.current !== query.error.message) notifyApiError(query.error);
    notifiedError.current = query.error?.message ?? null;
  }, [query.error]);

  return (
    <>
      <StepHeading icon={failed ? AlertCircle : Activity} step={3} title={failed ? "Konversi gagal" : "Memproses audio"} description={failed ? "Metadata yang kamu edit tetap tersimpan di wizard." : "Pantau proses konversi di halaman ini."} />
      {failed ? (
        <>
          <p className="inline-error" role="alert">{job?.error || (job?.status === "completed" ? "Server tidak mengirimkan file hasil." : "Konversi tidak berhasil. Coba proses kembali.")}</p>
          <div className="action-row">
            <Button type="button" variant="outline" className="secondary-action" onClick={reset}><RotateCcw aria-hidden="true" /> Mulai Ulang</Button>
            <Button type="button" className="primary-action" onClick={returnToMetadata}>Coba Lagi</Button>
          </div>
        </>
      ) : (
        <div className="progress-panel">
          <div className="progress-orbit" data-paused={timedOut}><AudioLines size={32} aria-hidden="true" /></div>
          <div className="progress-readout">
            <p role="status">{!timedOut && job?.status !== "completed" && <LoaderCircle size={16} className="spin" aria-hidden="true" />}{label}</p>
            <span aria-hidden="true">{progress}%</span>
          </div>
          <Progress className="conversion-progress" value={progress} aria-label="Progres konversi" />
          {timedOut && <p className="status-note" role="status">Proses terlalu lama, periksa manual</p>}
          {query.error && <p className="inline-error" role="alert">{query.error.message}</p>}
          {(timedOut || query.error) && (
            <Button type="button" variant="outline" className="secondary-action" onClick={() => void query.refetch({ cancelRefetch: false })} disabled={query.isFetching}>
              {query.isFetching ? <LoaderCircle className="spin" aria-hidden="true" /> : <RefreshCw aria-hidden="true" />}
              {query.isFetching ? "Memeriksa…" : "Cek Status"}
            </Button>
          )}
        </div>
      )}
    </>
  );
}
