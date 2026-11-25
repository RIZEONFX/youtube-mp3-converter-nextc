"use client";

import { useMutation } from "@tanstack/react-query";
import { startProcess } from "@/lib/api";
import { notifyApiError } from "@/lib/errors";

export function useProcessMutation() {
  return useMutation({ mutationFn: startProcess, onError: notifyApiError });
}
