"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getJobStatus, isTerminal } from "@/lib/api";

const pollInterval = 1_500;
const pollLimit = 10 * 60 * 1000;

export function useJobStatus(jobId: string, startedAt: number) {
  const deadline = startedAt + pollLimit;
  const [timedOut, setTimedOut] = useState(() => Date.now() >= deadline);

  useEffect(() => {
    if (timedOut) return;
    const timer = window.setTimeout(() => setTimedOut(true), Math.max(0, deadline - Date.now()));
    return () => window.clearTimeout(timer);
  }, [deadline, timedOut]);

  const query = useQuery({
    queryKey: ["job", jobId],
    queryFn: ({ signal }) => getJobStatus(jobId, signal),
    staleTime: 0,
    enabled: !timedOut,
    refetchInterval: (current) => Date.now() >= deadline || isTerminal(current.state.data?.status) ? false : pollInterval,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return { query, timedOut };
}
