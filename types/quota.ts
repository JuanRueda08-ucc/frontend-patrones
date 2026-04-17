export interface QuotaStatus {
  userId: string;
  plan: string;
  tokensUsed: number;
  remainingMonthlyTokens: number;
  monthlyTokenLimit: number;
  requestsUsedInWindow: number;
  remainingRequestsInWindow: number;
  rateLimitResetAt: string;
  quotaResetDate: string;
}
