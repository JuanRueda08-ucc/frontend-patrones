"use client";

import { useCallback, useEffect, useState } from "react";
import { getQuotaStatus } from "@/services/quotaService";
import type { QuotaStatus } from "@/types/quota";

interface UseQuotaResult {
  quota: QuotaStatus | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useQuota(userId: string): UseQuotaResult {
  const [quota, setQuota] = useState<QuotaStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!userId.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getQuotaStatus(userId);
      setQuota(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load quota.");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { quota, isLoading, error, refresh };
}
