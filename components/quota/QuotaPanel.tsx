import type { QuotaStatus } from "@/types/quota";
import { PlanBadge } from "./PlanBadge";
import { RequestsInfo } from "./RequestsInfo";
import { UsageProgress } from "./UsageProgress";
import styles from "./QuotaPanel.module.css";

interface QuotaPanelProps {
  userId: string;
  quota: QuotaStatus | null;
  isLoading: boolean;
  error: string | null;
}

export function QuotaPanel({ userId, quota, isLoading, error }: QuotaPanelProps) {
  if (!userId.trim()) {
    return (
      <section className={styles.panel} aria-label="Quota">
        <header className={styles.panelHeader}>
          <h2 className={styles.panelTitle}>Quota</h2>
        </header>
        <p className={styles.placeholder}>Enter a user ID to load quota.</p>
      </section>
    );
  }

  return (
    <section className={styles.panel} aria-label="Quota">
      <header className={styles.panelHeader}>
        <h2 className={styles.panelTitle}>Quota</h2>
        {quota && <PlanBadge plan={quota.plan} />}
      </header>

      {isLoading && <p className={styles.muted}>Loading quota…</p>}
      {error && !isLoading && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      {!isLoading && !error && quota && (
        <div className={styles.panelBody}>
          <UsageProgress
            plan={quota.plan}
            tokensUsed={quota.tokensUsed}
            remainingMonthlyTokens={quota.remainingMonthlyTokens}
            monthlyTokenLimit={quota.monthlyTokenLimit}
          />
          <RequestsInfo
            remainingRequestsInWindow={quota.remainingRequestsInWindow}
            requestsUsedInWindow={quota.requestsUsedInWindow}
            rateLimitResetAt={quota.rateLimitResetAt}
            quotaResetDate={quota.quotaResetDate}
          />
        </div>
      )}
    </section>
  );
}
