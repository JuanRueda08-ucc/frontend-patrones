"use client";

import { useEffect, useRef, useState } from "react";
import type { ChatMessageModel } from "@/types/chat";
import { generateText } from "@/services/aiService";
import ChatMessage from "./ChatMessage";
import PromptForm from "./PromptForm";
import styles from "./ChatContainer.module.css";

export default function ChatContainer() {
  const [messages, setMessages] = useState<ChatMessageModel[]>([]);
  const [userId, setUserId] = useState("user-free-1");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  async function handleSubmit(prompt: string) {
    setError(null);

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
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error. Please try again.";
      setError(message);
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

        {error && (
          <div className={styles.errorBanner}>
            ERROR — {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <PromptForm
        userId={userId}
        onUserIdChange={setUserId}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
