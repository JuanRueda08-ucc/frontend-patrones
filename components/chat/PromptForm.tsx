"use client";

import { useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import styles from "./PromptForm.module.css";

interface PromptFormProps {
  userId: string;
  onUserIdChange: (value: string) => void;
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
}

export default function PromptForm({
  userId,
  onUserIdChange,
  onSubmit,
  isLoading,
}: PromptFormProps) {
  const [prompt, setPrompt] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const canSubmit = prompt.trim().length > 0 && userId.trim().length > 0 && !isLoading;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit(prompt.trim());
    setPrompt("");
    textareaRef.current?.focus();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canSubmit) {
        onSubmit(prompt.trim());
        setPrompt("");
      }
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.userRow}>
        <label htmlFor="userId" className={styles.userLabel}>
          User ID
        </label>
        <input
          id="userId"
          type="text"
          className={styles.userInput}
          value={userId}
          onChange={(e) => onUserIdChange(e.target.value)}
          disabled={isLoading}
          autoComplete="off"
          spellCheck={false}
        />
      </div>

      <div className={styles.promptRow}>
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter a prompt..."
          rows={2}
          disabled={isLoading}
          autoFocus
          spellCheck={false}
        />
        <button type="submit" className={styles.button} disabled={!canSubmit}>
          {isLoading ? "..." : "Send"}
        </button>
      </div>

      <span className={styles.hint}>Enter to send · Shift+Enter for new line</span>
    </form>
  );
}
