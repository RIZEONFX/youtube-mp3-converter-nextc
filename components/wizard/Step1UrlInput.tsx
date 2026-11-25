"use client";

import { useRef, type FormEvent } from "react";
import { ArrowRight, ClipboardPaste, Info, Link2, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { StepHeading } from "@/components/wizard/StepHeading";
import { useInfoMutation } from "@/hooks/useInfoMutation";
import { useWizard } from "@/lib/store";
import { youtubeUrlSchema } from "@/lib/validators";

export function Step1UrlInput() {
  const url = useWizard((state) => state.url);
  const setUrl = useWizard((state) => state.setUrl);
  const receiveVideo = useWizard((state) => state.receiveVideo);
  const info = useInfoMutation();
  const input = useRef<HTMLInputElement>(null);
  const parsed = youtubeUrlSchema.safeParse(url);
  const invalid = url.trim().length > 0 && !parsed.success;
  const message = info.error?.message ?? (invalid ? "Masukkan link video YouTube yang valid." : null);

  function changeUrl(value: string) {
    if (useWizard.getState().step !== 1) return;
    if (info.isError) info.reset();
    setUrl(value);
  }

  async function pasteUrl() {
    try {
      const value = await navigator.clipboard.readText();
      if (value.trim()) changeUrl(value.trim());
      else toast.info("Clipboard kosong.");
    } catch {
      toast.info("Tempel link langsung di kolom URL.");
    }
    input.current?.focus();
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!parsed.success || info.isPending) return;
    info.mutate(parsed.data, { onSuccess: (video, videoUrl) => receiveVideo(videoUrl, video) });
  }

  return (
    <>
      <StepHeading icon={Link2} step={1} title="Masukkan link video" description="Ambil informasi video sebelum mengubahnya ke MP3." />
      <form className="url-form" onSubmit={submit} noValidate>
        <Label htmlFor="youtube-url">URL Video YouTube</Label>
        <div className="url-control">
          <Link2 size={19} className="url-icon" aria-hidden="true" />
          <Input
            ref={input}
            id="youtube-url"
            type="url"
            inputMode="url"
            autoComplete="off"
            spellCheck={false}
            aria-label="URL Video YouTube"
            aria-describedby={message ? "url-help url-error" : "url-help"}
            aria-invalid={invalid}
            placeholder="https://youtube.com/watch?v=..."
            value={url}
            onChange={(event) => changeUrl(event.target.value)}
            disabled={info.isPending}
          />
          <Button type="button" variant="outline" className="paste-button" aria-label="Tempel link dari clipboard" onClick={pasteUrl} disabled={info.isPending}>
            <ClipboardPaste aria-hidden="true" /><span>Tempel</span>
          </Button>
        </div>
        <p id="url-help" className="url-help"><Info size={14} aria-hidden="true" /> Mendukung link youtube.com dan youtu.be</p>
        {message && <p id="url-error" className="inline-error" role={info.isError ? "alert" : undefined}>{message}</p>}
        <Button type="submit" className="primary-action" disabled={!parsed.success || info.isPending}>
          {info.isPending && <LoaderCircle className="spin" aria-hidden="true" />}
          {info.isPending ? "Mengambil informasi…" : "Ambil Informasi"}
          {!info.isPending && <ArrowRight aria-hidden="true" />}
        </Button>
        {info.isPending && (
          <div className="info-skeleton" role="status" aria-label="Mengambil informasi video">
            <Skeleton className="skeleton-thumb" />
            <div><Skeleton className="skeleton-line" /><Skeleton className="skeleton-line skeleton-short" /></div>
          </div>
        )}
      </form>
    </>
  );
}
