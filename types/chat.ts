export interface ChatMessageModel {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  metadata?: ChatMessageMetadata;
}

export interface ChatMessageMetadata {
  tokensConsumed: number;
  plan: string;
  remainingRequestsInWindow: number;
  remainingMonthlyTokens: number;
}
