import type { UsageDay } from "@/types/history";
import styles from "./UsageHistory.module.css";

interface UsageHistoryProps {
  userId: string;
  days: UsageDay[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Shows a simple table for the last 7 calendar days, oldest → newest.
 */
export function UsageHistory({ userId, days, isLoading, error }: UsageHistoryProps) {
  if (!userId.trim()) {
    return (
      <section className={styles.panel} aria-label="Usage history">
        <header className={styles.header}>
          <h2 className={styles.title}>Usage (7 days)</h2>
        </header>
        <p className={styles.placeholder}>Enter a user ID to load history.</p>
      </section>
    );
  }

  const rows = prepareLast7Days(days);

  return (
    <section className={styles.panel} aria-label="Usage history">
      <header className={styles.header}>
        <h2 className={styles.title}>Usage (7 days)</h2>
      </header>

      {isLoading && <p className={styles.muted}>Loading history…</p>}
      {error && !isLoading && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      {!isLoading && !error && (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Tokens</th>
                <th scope="col">Requests</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.date}>
                  <td>{formatDate(row.date)}</td>
                  <td>{formatNumber(row.tokensConsumed)}</td>
                  <td>{formatNumber(row.requestsCount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function prepareLast7Days(days: UsageDay[]): UsageDay[] {
  const start = startOfDay(new Date());
  start.setDate(start.getDate() - 6);

  const byDate = new Map<string, UsageDay>();
  for (const d of days) {
    if (!d?.date) continue;
    const key = normalizeDateKey(d.date);
    if (!key) continue;
    byDate.set(key, { ...d, date: key });
  }

  const result: UsageDay[] = [];
  for (let i = 0; i < 7; i++) {
    const cursor = new Date(start);
    cursor.setDate(cursor.getDate() + i);
    const key = toDateKey(cursor);
    const existing = byDate.get(key);
    result.push(
      existing ?? {
        date: key,
        tokensConsumed: 0,
        requestsCount: 0,
      }
    );
  }

  return result;
}

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function normalizeDateKey(raw: string): string | null {
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return null;
  return toDateKey(startOfDay(parsed));
}

function formatDate(isoDay: string): string {
  const d = new Date(`${isoDay}T00:00:00`);
  if (Number.isNaN(d.getTime())) return isoDay;
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(d);
}

function formatNumber(n: number): string {
  if (!Number.isFinite(n)) return "0";
  return n.toLocaleString("en-US");
}
