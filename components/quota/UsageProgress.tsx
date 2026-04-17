import { isUnlimited } from "@/utils/planLimits";
import { computeTokenUsagePercent } from "@/utils/tokenUsage";
import styles from "./QuotaPanel.module.css";

interface UsageProgressProps {
  plan: string;
  tokensUsed: number;
  remainingMonthlyTokens: number;
  monthlyTokenLimit?: number;
}

export function UsageProgress({
  plan,
  tokensUsed,
  remainingMonthlyTokens,
  monthlyTokenLimit,
}: UsageProgressProps) {
  if (isUnlimited(plan)) {
    return (
      <div className={styles.usageBlock}>
        <div className={styles.usageHeader}>
          <span className={styles.usageLabel}>Tokens</span>
          <span className={styles.usageValue}>Unlimited</span>
        </div>
        <p className={styles.usageHint}>Enterprise plan has no monthly token cap.</p>
      </div>
    );
  }

  const pct = computeTokenUsagePercent(
    plan,
    tokensUsed,
    remainingMonthlyTokens,
    monthlyTokenLimit
  );
  const width = pct == null ? 0 : pct;

  return (
    <div className={styles.usageBlock}>
      <div className={styles.usageHeader}>
        <span className={styles.usageLabel}>Tokens</span>
        <span className={styles.usageValue}>
          {formatNumber(tokensUsed)} used · {formatNumber(remainingMonthlyTokens)} left
        </span>
      </div>
      <div className={styles.progressTrack} role="progressbar" aria-valuenow={width} aria-valuemin={0} aria-valuemax={100}>
        <div className={styles.progressFill} style={{ width: `${width}%` }} />
      </div>
      {pct != null && (
        <span className={styles.progressMeta}>{width.toFixed(0)}% of monthly allocation</span>
      )}
    </div>
  );
}

function formatNumber(n: number): string {
  if (!Number.isFinite(n)) return "0";
  return n.toLocaleString("en-US");
}
