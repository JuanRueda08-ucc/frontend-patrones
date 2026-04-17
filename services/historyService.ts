import { apiClient } from "@/services/apiClient";
import type { UsageDay } from "@/types/history";

export async function getUsageHistory(userId: string): Promise<UsageDay[]> {
  return apiClient.get<UsageDay[]>(`/api/quota/history?userId=${encodeURIComponent(userId)}`);
}
