"use client";

export default function HomePage() {
  return (
    <main style={styles.main}>
      <div style={styles.container}>
        <div style={styles.badge}>v1.0 — BETA</div>

        <h1 style={styles.title}>
          AI Proxy<br />
          <span style={styles.titleAccent}>Platform</span>
        </h1>

        <p style={styles.subtitle}>
          Simulated AI consumption infrastructure
        </p>

        <div style={styles.divider} />

        <div style={styles.statusRow}>
          <span style={styles.statusDot} />
          <span style={styles.statusText}>System operational</span>
        </div>
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "var(--bg-primary)",
    padding: "2rem",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
    maxWidth: "480px",
    width: "100%",
  },
  badge: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.7rem",
    fontWeight: 500,
    letterSpacing: "0.12em",
    color: "var(--accent-green)",
    background: "var(--accent-green-dim)",
    border: "1px solid var(--accent-green)",
    borderRadius: "var(--radius-sm)",
    padding: "0.25rem 0.6rem",
    width: "fit-content",
    textTransform: "uppercase",
  },
  title: {
    fontFamily: "var(--font-mono)",
    fontSize: "clamp(2.5rem, 6vw, 4rem)",
    fontWeight: 300,
    lineHeight: 1.1,
    color: "var(--text-primary)",
    letterSpacing: "-0.02em",
  },
  titleAccent: {
    color: "var(--accent-green)",
    fontWeight: 600,
  },
  subtitle: {
    fontFamily: "var(--font-sans)",
    fontSize: "0.95rem",
    fontWeight: 300,
    color: "var(--text-secondary)",
    letterSpacing: "0.01em",
  },
  divider: {
    height: "1px",
    background: "var(--border)",
    width: "100%",
  },
  statusRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
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
    fontSize: "0.75rem",
    color: "var(--text-secondary)",
    letterSpacing: "0.05em",
  },
};
