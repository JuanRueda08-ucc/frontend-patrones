"use client";

import type { ChatMessageModel } from "@/types/chat";
import styles from "./ChatMessage.module.css";

interface ChatMessageProps {
  message: ChatMessageModel;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const timeLabel = message.timestamp.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={styles.message}>
      <div className={styles.header}>
        <span
          className={`${styles.roleLabel} ${
            isUser ? styles.roleLabelUser : styles.roleLabelAssistant
          }`}
        >
          {isUser ? "USER" : "SYSTEM"}
        </span>
        <span className={styles.timestamp}>{timeLabel}</span>
      </div>

      <p className={`${styles.content} ${isUser ? styles.contentUser : ""}`}>
        {message.content}
      </p>

      {!isUser && message.metadata && (
        <div className={styles.metadata}>
          <span className={styles.metaItem}>
            <span className={styles.metaKey}>tokens</span>
            <span className={styles.metaValue}>{message.metadata.tokensConsumed}</span>
          </span>
          <span className={styles.metaItem}>
            <span className={styles.metaKey}>plan</span>
            <span className={styles.metaValue}>{message.metadata.plan}</span>
          </span>
          <span className={styles.metaItem}>
            <span className={styles.metaKey}>requests left</span>
            <span className={styles.metaValue}>{message.metadata.remainingRequestsInWindow}</span>
          </span>
          <span className={styles.metaItem}>
            <span className={styles.metaKey}>monthly tokens</span>
            <span className={styles.metaValue}>{message.metadata.remainingMonthlyTokens.toLocaleString()}</span>
          </span>
        </div>
      )}
    </div>
  );
}
