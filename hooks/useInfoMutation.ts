"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getVideoInfo } from "@/lib/api";
import { notifyApiError } from "@/lib/errors";

export function useInfoMutation() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (url: string) => client.fetchQuery({
      queryKey: ["video-info", url],
      queryFn: ({ signal }) => getVideoInfo(url, signal),
      staleTime: 5 * 60 * 1000,
    }),
    onError: notifyApiError,
  });
}
