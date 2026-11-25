import { toast } from "sonner";
import { ApiError } from "@/lib/api";

export function notifyApiError(error: Error) {
  if (error instanceof ApiError && ["network", "server", "timeout"].includes(error.kind)) {
    toast.error(error.message, { id: `api-${error.kind}` });
  }
}
