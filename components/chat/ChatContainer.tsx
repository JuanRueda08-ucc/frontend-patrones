"use client";

import { useEffect, useRef, useState } from "react";
import type { ChatMessageModel } from "@/types/chat";
import { generateText } from "@/services/aiService";
import {
  resolveChatApiError,
  type ResolvedChatApiError,
} from "@/services/chatErrorResolver";
import ChatMessage from "./ChatMessage";
import PromptForm from "./PromptForm";
import styles from "./ChatContainer.module.css";

interface ChatContainerProps {
  userId: string;
  onUserIdChange: (value: string) => void;
  onGenerationSuccess?: () => void;
}

export default function ChatContainer({
  userId,
  onUserIdChange,
  onGenerationSuccess,
}: ChatContainerProps) {
  const [messages, setMessages] = useState<ChatMessageModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [resolvedError, setResolvedError] = useState<ResolvedChatApiError | null>(null);
  const [rateLimitDeadline, setRateLimitDeadline] = useState<number | null>(null);
  const [, setTick] = useState(0);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    setResolvedError(null);
    setRateLimitDeadline(null);
  }, [userId]);

  useEffect(() => {
    if (!rateLimitDeadline) return;
    const id = window.setInterval(() => setTick((t) => t + 1), 1000);
    return () => window.clearInterval(id);
  }, [rateLimitDeadline]);

  const secondsLeft =
    rateLimitDeadline != null
      ? Math.max(0, Math.ceil((rateLimitDeadline - Date.now()) / 1000))
      : 0;

  useEffect(() => {
    if (rateLimitDeadline && secondsLeft <= 0) {
      setRateLimitDeadline(null);
      setResolvedError((prev) => (prev?.code === "RATE_LIMIT" ? null : prev));
    }
  }, [secondsLeft, rateLimitDeadline]);

  const errorBannerText = (() => {
    if (!resolvedError) return null;
    if (resolvedError.code === "RATE_LIMIT") {
      return `Too many requests. Try again in ${secondsLeft} seconds`;
    }
    return resolvedError.message;
  })();

  const sendBlocked =
    resolvedError?.code === "QUOTA_EXCEEDED" ||
    (resolvedError?.code === "RATE_LIMIT" && secondsLeft > 0);

  async function handleSubmit(prompt: string) {
    setResolvedError(null);
    setRateLimitDeadline(null);

    const userMessage: ChatMessageModel = {
      id: crypto.randomUUID(),
      role: "user",
      content: prompt,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await generateText({ userId, prompt });

      const assistantMessage: ChatMessageModel = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: response.generatedText,
        timestamp: new Date(),
        metadata: {
          tokensConsumed: response.tokensConsumed,
          plan: response.plan,
          remainingRequestsInWindow: response.remainingRequestsInWindow,
          remainingMonthlyTokens: response.remainingMonthlyTokens,
        },
      };

      setMessages((prev) => [...prev, assistantMessage]);
      onGenerationSuccess?.();
    } catch (err) {
      const resolved = resolveChatApiError(err);
      setResolvedError(resolved);

      if (resolved.code === "RATE_LIMIT" && resolved.retryAfterSeconds > 0) {
        setRateLimitDeadline(Date.now() + resolved.retryAfterSeconds * 1000);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.conversation}>
        {messages.length === 0 && !isLoading && (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>_</span>
            <span className={styles.emptyText}>Send a prompt to begin</span>
          </div>
        )}

        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {isLoading && (
          <div className={styles.loadingRow}>
            <div className={styles.loadingDots}>
              <span className={styles.dot} />
              <span className={styles.dot} />
              <span className={styles.dot} />
            </div>
            <span className={styles.loadingText}>Generating response...</span>
          </div>
        )}

        {errorBannerText && (
          <div className={styles.errorBanner} role="alert">
            ERROR — {errorBannerText}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <PromptForm
        userId={userId}
        onUserIdChange={onUserIdChange}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        sendBlocked={sendBlocked}
      />
    </div>
  );
}
