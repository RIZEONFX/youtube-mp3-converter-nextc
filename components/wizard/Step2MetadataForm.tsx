"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Clock3, ImageOff, LoaderCircle, SlidersHorizontal, Sparkles } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { StepHeading } from "@/components/wizard/StepHeading";
import { useProcessMutation } from "@/hooks/useProcessMutation";
import type { Bitrate, VideoInfo } from "@/lib/api";
import { useWizard } from "@/lib/store";
import { formatDuration } from "@/lib/utils";
import { metadataSchema, type TrackMetadata } from "@/lib/validators";

const metadataFields = [
  { name: "title", label: "Judul", required: true },
  { name: "artist", label: "Artis", required: true },
  { name: "album", label: "Album", required: false },
  { name: "genre", label: "Genre", required: false },
] as const;

function VideoPreview({ video }: { video: VideoInfo }) {
  const [imageStatus, setImageStatus] = useState<"loading" | "ready" | "failed">(
    /^https?:\/\//i.test(video.thumbnailUrl) ? "loading" : "failed",
  );

  return (
    <div className="video-preview">
      <div className="video-thumbnail">
        {imageStatus === "loading" && <Skeleton className="thumbnail-skeleton" />}
        {imageStatus === "failed" ? (
          <span className="thumbnail-fallback" role="img" aria-label="Thumbnail tidak tersedia"><ImageOff size={26} aria-hidden="true" /></span>
        ) : (
          <Image
            src={video.thumbnailUrl}
            alt="Thumbnail video"
            fill
            sizes="(min-width: 540px) 165px, calc(100vw - 100px)"
            loading="lazy"
            unoptimized
            data-ready={imageStatus === "ready"}
            onLoad={() => setImageStatus("ready")}
            onError={() => setImageStatus("failed")}
          />
        )}
        <span className="thumbnail-duration"><Clock3 size={12} aria-hidden="true" /> {formatDuration(video.duration)}</span>
      </div>
      <div className="video-info">
        <p className="technical-label">VIDEO SUMBER</p>
        <h3>{video.title}</h3>
        <div className="audio-badges" aria-label="Informasi audio sumber">
          <span>{video.audio.codec.toUpperCase()}</span>
          <span>{video.audio.bitrate === null ? "Bitrate tidak diketahui" : `${video.audio.bitrate} kbps`}</span>
          <span>{video.audio.sampleRate / 1_000} kHz</span>
        </div>
      </div>
    </div>
  );
}

export function Step2MetadataForm({ video, draft }: { video: VideoInfo; draft: TrackMetadata }) {
  const url = useWizard((state) => state.url);
  const initialBitrate = useWizard((state) => state.bitrate);
  const saveDraft = useWizard((state) => state.saveDraft);
  const returnToUrl = useWizard((state) => state.returnToUrl);
  const beginJob = useWizard((state) => state.beginJob);
  const [bitrate, setBitrate] = useState<Bitrate>(initialBitrate);
  const form = useForm<TrackMetadata>({ resolver: zodResolver(metadataSchema), defaultValues: draft });
  const process = useProcessMutation();
  const options = [...new Set(video.availableBitrates)].sort((first, second) => first - second);

  function submit(metadata: TrackMetadata) {
    if (process.isPending) return;
    saveDraft(metadata, bitrate);
    process.mutate({ url, metadata, bitrate }, { onSuccess: ({ jobId }) => beginJob(jobId) });
  }

  function goBack() {
    saveDraft(form.getValues(), bitrate);
    returnToUrl();
  }

  return (
    <>
      <StepHeading icon={SlidersHorizontal} step={2} title="Edit metadata audio" description="Atur detail lagu dan kualitas MP3 sebelum memproses." />
      <VideoPreview video={video} />
      <Form {...form}>
        <form className="metadata-form" noValidate onSubmit={form.handleSubmit(submit)}>
          <fieldset disabled={process.isPending} className="metadata-fieldset">
            <legend>Metadata ID3</legend>
            <div className="metadata-fields">
              {metadataFields.map(({ name, label, required }) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name}
                  render={({ field }) => (
                    <FormItem className="metadata-field">
                      <FormLabel>{label} {required ? <span className="required-marker" aria-hidden="true">*</span> : <span className="optional-label">Opsional</span>}</FormLabel>
                      <FormControl>
                        <Input {...field} aria-label={label} required={required} maxLength={name === "title" ? 150 : undefined} autoComplete="off" />
                      </FormControl>
                      <FormMessage role="alert" />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </fieldset>
          <div className="bitrate-section">
            <h3 id="bitrate-heading">Bitrate MP3</h3>
            <RadioGroup className="bitrate-grid" aria-labelledby="bitrate-heading" value={String(bitrate)} onValueChange={(value) => setBitrate(value === "auto" ? value : Number(value))} disabled={process.isPending} orientation="horizontal">
              <label className="bitrate-option bitrate-auto" data-selected={bitrate === "auto"}>
                <RadioGroupItem value="auto" aria-label={`Auto (${video.audio.suggestedBitrate} kbps)`} />
                <Sparkles size={15} className="auto-icon" aria-hidden="true" />
                <span>Auto <span className="bitrate-detail">({video.audio.suggestedBitrate} kbps)</span></span>
                <span className="source-badge">Sumber: {video.audio.bitrate === null ? "tidak diketahui" : `${video.audio.bitrate} kbps`}</span>
              </label>
              {options.map((option) => (
                <label key={option} className="bitrate-option" data-selected={bitrate === option}>
                  <RadioGroupItem value={String(option)} aria-label={`${option} kbps`} />
                  <span>{option} <span className="bitrate-detail">kbps</span></span>
                </label>
              ))}
            </RadioGroup>
          </div>
          {process.error && <p className="inline-error" role="alert">{process.error.message}</p>}
          <div className="action-row">
            <Button type="button" variant="outline" className="secondary-action" onClick={goBack} disabled={process.isPending}><ArrowLeft aria-hidden="true" /> Kembali</Button>
            <Button type="submit" className="primary-action" disabled={process.isPending}>
              {process.isPending && <LoaderCircle className="spin" aria-hidden="true" />}
              {process.isPending ? "Memulai proses…" : "Proses"}
              {!process.isPending && <ArrowRight aria-hidden="true" />}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
