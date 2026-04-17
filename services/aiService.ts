import { apiClient } from "@/services/apiClient";
import type { GenerationRequest, GenerationResponse } from "@/types/api";

export async function generateText(request: GenerationRequest): Promise<GenerationResponse> {
  return apiClient.post<GenerationResponse>("/api/ai/generate", request);
}
