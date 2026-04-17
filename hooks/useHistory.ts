"use client";

import { useCallback, useEffect, useState } from "react";
import { getUsageHistory } from "@/services/historyService";
import type { UsageDay } from "@/types/history";

interface UseHistoryResult {
  history: UsageDay[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useHistory(userId: string): UseHistoryResult {
  const [history, setHistory] = useState<UsageDay[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!userId.trim()) {
      setHistory([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await getUsageHistory(userId);
      setHistory(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load usage history.");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { history, isLoading, error, refresh };
}
