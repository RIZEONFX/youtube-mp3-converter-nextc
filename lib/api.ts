
import { z } from "zod";
import type { TrackMetadata } from "@/lib/validators";

const bitrateSchema = z.number().int().positive();

const infoSchema = z.object({
  videoId: z.string().min(1),
  title: z.string(),
  artist: z.string(),
  album: z.string(),
  genre: z.string(),
  duration: z.number().nonnegative(),
  thumbnailUrl: z.string(),
  audio: z.object({
    codec: z.string(),
    bitrate: bitrateSchema.nullable(),
    sampleRate: z.number().int().positive(),
    suggestedBitrate: bitrateSchema,
  }),
  availableBitrates: z.array(bitrateSchema),
});

const startJobSchema = z.object({
  jobId: z.string().min(1),
  status: z.literal("queued"),
});

const jobResultSchema = z.object({
  fileName: z.string(),
  fileSize: z.number().nonnegative(),
  bitrate: bitrateSchema,
  downloadUrl: z.string().min(1),
});

const jobSchema = z.object({
  jobId: z.string().min(1),
  status: z.enum([
    "queued",
    "downloading",
    "converting",
    "tagging",
    "completed",
    "failed",
  ]),
  progress: z.number().min(0).max(100),
  stage: z.string(),
  result: jobResultSchema.nullable(),
  error: z.string().nullable(),
});

export type VideoInfo = z.infer<typeof infoSchema>;
export type Bitrate = number | "auto";
export type JobStatus = z.infer<typeof jobSchema>;
export type JobResult = z.infer<typeof jobResultSchema>;

export type ProcessRequest = {
  url: string;
  metadata: TrackMetadata;
  bitrate: Bitrate;
};

type ErrorKind =
  | "network"
  | "timeout"
  | "client"
  | "server"
  | "config"
  | "response";

export class ApiError extends Error {
  constructor(
    public readonly kind: ErrorKind,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const configuredBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL;

const configuredTimeout = Number(
  process.env.NEXT_PUBLIC_API_TIMEOUT_MS
);

const timeoutMs =
  Number.isSafeInteger(configuredTimeout) &&
  configuredTimeout > 0 &&
  configuredTimeout <= 2_147_483_647
    ? configuredTimeout
    : 60_000;

function getBaseUrl() {
  try {
    const url = new URL(configuredBaseUrl ?? "");

    if (
      !/^https?:$/.test(url.protocol) ||
      url.username ||
      url.password ||
      url.search ||
      url.hash
    ) {
      throw new Error("Invalid API base URL");
    }

    return url.href.replace(/\/+$/, "");
  } catch {
    throw new ApiError(
      "config",
      "Konverter belum terhubung ke server pemrosesan."
    );
  }
}

async function requestJson<Output>(
  path: string,
  schema: z.ZodType<Output>,
  body?: unknown,
  signal?: AbortSignal
) {
  const url = `${getBaseUrl()}${path}`;

  const controller = new AbortController();

  const abort = () => controller.abort(signal?.reason);

  let timedOut = false;

  const timeout = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);

  if (signal?.aborted) {
    abort();
  } else {
    signal?.addEventListener("abort", abort, {
      once: true,
    });
  }

  try {
    const response = await fetch(url, {
      method: body === undefined ? "GET" : "POST",

      cache: "no-store",

      // Header untuk melewati halaman peringatan ngrok
      headers: {
        "ngrok-skip-browser-warning": "1",

        ...(body === undefined
          ? {}
          : {
              "Content-Type": "application/json",
            }),
      },

      body:
        body === undefined
          ? undefined
          : JSON.stringify(body),

      signal: controller.signal,
    });

    if (response.status >= 500) {
      throw new ApiError(
        "server",
        "Server sedang bermasalah, coba lagi"
      );
    }

    let data: unknown;

    try {
      data = await response.json();
    } catch (error) {
      if (!(error instanceof SyntaxError)) {
        throw error;
      }
    }

    if (!response.ok) {
      const failure = z
        .object({
          error: z.string().trim().min(1),
        })
        .safeParse(data);

      throw new ApiError(
        "client",
        failure.success
          ? failure.data.error
          : `Permintaan gagal (${response.status}).`
      );
    }

    const parsed = schema.safeParse(data);

    if (!parsed.success) {
      throw new ApiError(
        "response",
        "Respons server tidak sesuai. Coba lagi."
      );
    }

    return parsed.data;

  } catch (error) {
    if (error instanceof ApiError || signal?.aborted) {
      throw error;
    }

    if (timedOut) {
      throw new ApiError(
        "timeout",
        "Server tidak merespons tepat waktu. Coba lagi."
      );
    }

    throw new ApiError(
      "network",
      "Gagal menghubungi server"
    );

  } finally {
    clearTimeout(timeout);

    signal?.removeEventListener("abort", abort);
  }
}

export function getVideoInfo(
  url: string,
  signal?: AbortSignal
) {
  return requestJson(
    "/api/info",
    infoSchema,
    { url },
    signal
  );
}

export function startProcess(body: ProcessRequest) {
  return requestJson(
    "/api/process",
    startJobSchema,
    body
  );
}

export function getJobStatus(
  jobId: string,
  signal?: AbortSignal
) {
  return requestJson(
    `/api/jobs/${encodeURIComponent(jobId)}`,
    jobSchema,
    undefined,
    signal
  );
}

export function getDownloadUrl(path: string) {
  try {
    const base = getBaseUrl();

    if (
      !path.startsWith("/") ||
      /^\/[\/\\]/.test(path)
    ) {
      return null;
    }

    const url = new URL(`${base}${path}`);

    if (url.origin !== new URL(base).origin) {
      return null;
    }

    return url.href;

  } catch {
    return null;
  }
}

export function isTerminal(
  status: JobStatus["status"] | undefined
) {
  return (
    status === "completed" ||
    status === "failed"
  );
}
