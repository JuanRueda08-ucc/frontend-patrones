const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
}

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly body?: unknown,
    public readonly retryAfterSeconds?: number
  ) {
    super(message);
    this.name = "HttpError";
  }
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, headers = {} } = options;

  const config: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  if (body !== undefined) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    let responseBody: unknown;
    try {
      responseBody = await response.json();
    } catch {
      responseBody = undefined;
    }
    const message =
      responseBody &&
      typeof responseBody === "object" &&
      "message" in responseBody
        ? String((responseBody as Record<string, unknown>).message)
        : `HTTP ${response.status}: ${response.statusText}`;

    const retryAfterHeader = response.headers.get("Retry-After");
    let retryAfterSeconds: number | undefined;
    if (retryAfterHeader) {
      const parsed = Number.parseInt(retryAfterHeader, 10);
      if (!Number.isNaN(parsed) && parsed >= 0) {
        retryAfterSeconds = parsed;
      }
    }

    throw new HttpError(response.status, message, responseBody, retryAfterSeconds);
  }

  return response.json() as Promise<T>;
}

export const apiClient = {
  get: <T>(endpoint: string, headers?: Record<string, string>) =>
    request<T>(endpoint, { method: "GET", headers }),

  post: <T>(endpoint: string, body: unknown, headers?: Record<string, string>) =>
    request<T>(endpoint, { method: "POST", body, headers }),

  put: <T>(endpoint: string, body: unknown, headers?: Record<string, string>) =>
    request<T>(endpoint, { method: "PUT", body, headers }),

  patch: <T>(endpoint: string, body: unknown, headers?: Record<string, string>) =>
    request<T>(endpoint, { method: "PATCH", body, headers }),

  delete: <T>(endpoint: string, headers?: Record<string, string>) =>
    request<T>(endpoint, { method: "DELETE", headers }),
};
