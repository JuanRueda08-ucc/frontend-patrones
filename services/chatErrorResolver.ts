import { HttpError } from "@/services/apiClient";

export type ChatApiErrorCode =
  | "RATE_LIMIT"
  | "QUOTA_EXCEEDED"
  | "NOT_FOUND"
  | "SERVER_ERROR"
  | "UNKNOWN";

export interface ResolvedChatApiError {
  code: ChatApiErrorCode;
  /** Static message template; callers may append countdown for rate limits. */
  message: string;
  blocksSending: boolean;
  /** Seconds to wait before retrying (429). */
  retryAfterSeconds: number;
}

const DEFAULT_RETRY_SECONDS = 60;

function parseRetryAfterFromBody(body: unknown): number | undefined {
  if (!body || typeof body !== "object") return undefined;
  const record = body as Record<string, unknown>;
  const candidates = ["retryAfter", "retry_after", "retryAfterSeconds"];
  for (const key of candidates) {
    const v = record[key];
    if (typeof v === "number" && Number.isFinite(v) && v >= 0) return Math.floor(v);
    if (typeof v === "string") {
      const n = Number.parseInt(v, 10);
      if (!Number.isNaN(n) && n >= 0) return n;
    }
  }
  return undefined;
}

/**
 * Maps HTTP / network failures from the AI generate endpoint into UI-ready metadata.
 * Centralizes status handling so chat components stay thin.
 */
export function resolveChatApiError(error: unknown): ResolvedChatApiError {
  if (error instanceof HttpError) {
    const fromBody = parseRetryAfterFromBody(error.body);
    const retryAfter =
      error.retryAfterSeconds ?? fromBody ?? (error.status === 429 ? DEFAULT_RETRY_SECONDS : 0);

    if (error.status === 429) {
      return {
        code: "RATE_LIMIT",
        message: "Too many requests. Try again in X seconds",
        blocksSending: true,
        retryAfterSeconds: Math.max(1, retryAfter),
      };
    }

    if (error.status === 402) {
      return {
        code: "QUOTA_EXCEEDED",
        message: "Monthly quota exceeded. Upgrade your plan",
        blocksSending: true,
        retryAfterSeconds: 0,
      };
    }

    if (error.status === 404) {
      return {
        code: "NOT_FOUND",
        message: "The requested resource was not found.",
        blocksSending: false,
        retryAfterSeconds: 0,
      };
    }

    if (error.status >= 500) {
      return {
        code: "SERVER_ERROR",
        message: "Something went wrong on the server. Please try again later.",
        blocksSending: false,
        retryAfterSeconds: 0,
      };
    }

    return {
      code: "UNKNOWN",
      message: error.message || "Request failed.",
      blocksSending: false,
      retryAfterSeconds: 0,
    };
  }

  if (error instanceof Error) {
    return {
      code: "UNKNOWN",
      message: error.message,
      blocksSending: false,
      retryAfterSeconds: 0,
    };
  }

  return {
    code: "UNKNOWN",
    message: "Unexpected error. Please try again.",
    blocksSending: false,
    retryAfterSeconds: 0,
  };
}
