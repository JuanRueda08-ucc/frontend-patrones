import styles from "./QuotaPanel.module.css";

interface RequestsInfoProps {
  remainingRequestsInWindow: number;
  requestsUsedInWindow: number;
  rateLimitResetAt: string;
  quotaResetDate: string;
}

export function RequestsInfo({
  remainingRequestsInWindow,
  requestsUsedInWindow,
  rateLimitResetAt,
  quotaResetDate,
}: RequestsInfoProps) {
  return (
    <dl className={styles.metaGrid}>
      <div className={styles.metaRow}>
        <dt>Requests left (window)</dt>
        <dd>{formatInt(remainingRequestsInWindow)}</dd>
      </div>
      <div className={styles.metaRow}>
        <dt>Requests used (window)</dt>
        <dd>{formatInt(requestsUsedInWindow)}</dd>
      </div>
      <div className={styles.metaRow}>
        <dt>Rate limit resets</dt>
        <dd>{formatDateTime(rateLimitResetAt)}</dd>
      </div>
      <div className={styles.metaRow}>
        <dt>Quota reset</dt>
        <dd>{formatDateTime(quotaResetDate)}</dd>
      </div>
    </dl>
  );
}

function formatInt(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return String(Math.max(0, Math.floor(n)));
}

function formatDateTime(iso: string): string {
  if (!iso?.trim()) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}
