"use client";

import { useCallback, useState } from "react";
import ChatContainer from "@/components/chat/ChatContainer";
import { QuotaPanel } from "@/components/quota/QuotaPanel";
import { UsageHistory } from "@/components/history/UsageHistory";
import { useQuota } from "@/hooks/useQuota";
import { useHistory } from "@/hooks/useHistory";

export default function HomePage() {
  const [userId, setUserId] = useState("user-free-1");
  const { quota, isLoading: quotaLoading, error: quotaError, refresh: refreshQuota } =
    useQuota(userId);
  const {
    history,
    isLoading: historyLoading,
    error: historyError,
    refresh: refreshHistory,
  } = useHistory(userId);

  const handleGenerationSuccess = useCallback(() => {
    void refreshQuota();
    void refreshHistory();
  }, [refreshQuota, refreshHistory]);

  return (
    <div style={layout.page}>
      <header style={layout.header}>
        <div style={layout.headerLeft}>
          <span style={layout.logo}>AI Proxy Platform</span>
          <span style={layout.badge}>BETA</span>
        </div>
        <div style={layout.statusRow}>
          <span style={layout.statusDot} />
          <span style={layout.statusText}>System operational</span>
        </div>
      </header>

      <div style={layout.main}>
        <aside style={layout.sidebar}>
          <QuotaPanel userId={userId} quota={quota} isLoading={quotaLoading} error={quotaError} />
          <UsageHistory
            userId={userId}
            days={history}
            isLoading={historyLoading}
            error={historyError}
          />
        </aside>

        <main style={layout.chatArea}>
          <ChatContainer
            userId={userId}
            onUserIdChange={setUserId}
            onGenerationSuccess={handleGenerationSuccess}
          />
        </main>
      </div>
    </div>
  );
}

const layout: Record<string, React.CSSProperties> = {
  page: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 1.5rem",
    height: "56px",
    borderBottom: "1px solid var(--border)",
    background: "var(--bg-secondary)",
    flexShrink: 0,
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  logo: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.9rem",
    fontWeight: 600,
    color: "var(--text-primary)",
    letterSpacing: "0.02em",
  },
  badge: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.62rem",
    fontWeight: 600,
    letterSpacing: "0.12em",
    color: "var(--accent-green)",
    background: "var(--accent-green-dim)",
    border: "1px solid var(--accent-green)",
    borderRadius: "var(--radius-sm)",
    padding: "0.15rem 0.45rem",
  },
  statusRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
  },
  statusDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "var(--accent-green)",
    boxShadow: "0 0 6px var(--accent-green)",
    flexShrink: 0,
  },
  statusText: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.68rem",
    color: "var(--text-muted)",
    letterSpacing: "0.05em",
  },
  main: {
    flex: 1,
    display: "flex",
    minHeight: 0,
    overflow: "hidden",
  },
  sidebar: {
    width: "min(360px, 38vw)",
    flexShrink: 0,
    borderRight: "1px solid var(--border)",
    background: "var(--bg-secondary)",
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    overflowY: "auto",
  },
  chatArea: {
    flex: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
  },
};
