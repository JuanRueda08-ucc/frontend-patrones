import ChatContainer from "@/components/chat/ChatContainer";

export default function HomePage() {
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

      <ChatContainer />
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
};
