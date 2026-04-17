export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  message?: string;
}

export interface ApiError {
  message: string;
  status: number;
  details?: unknown;
}

export interface GenerationRequest {
  userId: string;
  prompt: string;
}

export interface GenerationResponse {
  userId: string;
  prompt: string;
  generatedText: string;
  tokensConsumed: number;
  plan: string;
  remainingRequestsInWindow: number;
  remainingMonthlyTokens: number;
  timestamp: string;
}
