import { getTokenLimit, isUnlimited } from "@/utils/planLimits";

/**
 * Returns usage percentage [0, 100] for progress UI, or null when unlimited / indeterminate.
 */
export function computeTokenUsagePercent(
  plan: string,
  tokensUsed: number,
  remainingMonthlyTokens: number,
  apiMonthlyLimit?: number
): number | null {
  if (isUnlimited(plan)) return null;

  const ruleCap = getTokenLimit(plan);
  const cap =
    ruleCap ??
    (typeof apiMonthlyLimit === "number" && apiMonthlyLimit > 0 ? apiMonthlyLimit : null);
  if (cap == null || cap <= 0) return null;

  const used = Math.max(0, tokensUsed);
  const inferredTotal = used + Math.max(0, remainingMonthlyTokens);
  const denominator = Math.max(cap, inferredTotal, 1);
  const pct = (used / denominator) * 100;

  if (!Number.isFinite(pct)) return 0;
  return Math.min(100, Math.max(0, pct));
}
