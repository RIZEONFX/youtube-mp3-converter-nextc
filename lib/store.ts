import { create } from "zustand";
import type { Bitrate, JobResult, VideoInfo } from "@/lib/api";
import type { TrackMetadata } from "@/lib/validators";

type WizardData = {
  step: 1 | 2 | 3 | 4;
  url: string;
  video: VideoInfo | null;
  metadata: TrackMetadata | null;
  bitrate: Bitrate;
  jobId: string | null;
  jobStartedAt: number;
  result: JobResult | null;
};

type WizardStore = WizardData & {
  setUrl: (url: string) => void;
  receiveVideo: (url: string, video: VideoInfo) => void;
  saveDraft: (metadata: TrackMetadata, bitrate: Bitrate) => void;
  returnToUrl: () => void;
  returnToMetadata: () => void;
  beginJob: (jobId: string) => void;
  finishJob: (jobId: string, result: JobResult) => void;
  reset: () => void;
};

const initialState: WizardData = {
  step: 1,
  url: "",
  video: null,
  metadata: null,
  bitrate: "auto",
  jobId: null,
  jobStartedAt: 0,
  result: null,
};

export const useWizard = create<WizardStore>()((set) => ({
  ...initialState,
  setUrl: (url) => set({ url }),
  receiveVideo: (url, video) => set((state) => {
    const sameVideo = state.video?.videoId === video.videoId;
    return {
      step: 2,
      url,
      video,
      metadata: sameVideo && state.metadata ? state.metadata : {
        title: video.title, artist: video.artist, album: video.album, genre: video.genre,
      },
      bitrate: sameVideo && typeof state.bitrate === "number" && video.availableBitrates.includes(state.bitrate)
        ? state.bitrate : "auto",
    };
  }),
  saveDraft: (metadata, bitrate) => set({ metadata, bitrate }),
  returnToUrl: () => set({ step: 1 }),
  returnToMetadata: () => set({ step: 2, jobId: null, jobStartedAt: 0, result: null }),
  beginJob: (jobId) => set({ step: 3, jobId, jobStartedAt: Date.now(), result: null }),
  finishJob: (jobId, result) => set((state) => state.step === 3 && state.jobId === jobId ? { step: 4, result } : state),
  reset: () => set(initialState),
}));
