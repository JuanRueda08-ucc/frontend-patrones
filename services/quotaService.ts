import { apiClient } from "@/services/apiClient";
import type { QuotaStatus } from "@/types/quota";

export async function getQuotaStatus(userId: string): Promise<QuotaStatus> {
  return apiClient.get<QuotaStatus>(`/api/quota/status?userId=${encodeURIComponent(userId)}`);
}
