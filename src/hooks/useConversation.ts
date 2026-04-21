import { useState, useCallback, useRef } from "react";
import type { Message } from "../types";
import { streamHistoricalResponse, buildUserMessage, parseResponse } from "../lib/anthropic";

export interface StreamState {
  isStreaming: boolean;
  streamedText: string;
  summary: string;
  facts: string[];
  error: string | null;
}

const emptyStream: StreamState = {
  isStreaming: false, streamedText: "", summary: "", facts: [], error: null,
};

export function useConversation() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [streamState, setStreamState] = useState<StreamState>(emptyStream);
  const abortRef = useRef(false);

  const reset = useCallback(() => {
    abortRef.current = true;
    setMessages([]);
    setStreamState(emptyStream);
  }, []);

  async function stream(msgs: Message[]) {
    abortRef.current = false;
    setStreamState({ ...emptyStream, isStreaming: true });
    let accumulated = "";

    try {
      for await (const _ of streamHistoricalResponse(msgs, (chunk) => {
        if (abortRef.current) return;
        accumulated += chunk;
        setStreamState((p) => ({ ...p, streamedText: accumulated }));
      })) {
        if (abortRef.current) break;
      }

      const { summary, facts } = parseResponse(accumulated);
      setStreamState({ isStreaming: false, streamedText: accumulated, summary, facts, error: null });

      const assistantMsg: Message = { role: "assistant", content: accumulated };
      setMessages([...msgs, assistantMsg]);
    } catch (e) {
      setStreamState((p) => ({
        ...p, isStreaming: false,
        error: e instanceof Error ? e.message : "Unknown error",
      }));
    }
  }

  const ask = useCallback(
    async (country: string, region: string, era: string) => {
      const userContent = buildUserMessage(country, region, era);
      const userMsg: Message = { role: "user", content: userContent };
      const newMessages = [...messages, userMsg];
      setMessages(newMessages);
      await stream(newMessages);
    },
    [messages]
  );

  const followUp = useCallback(
    async (question: string) => {
      const userMsg: Message = { role: "user", content: question };
      const newMessages = [...messages, userMsg];
      setMessages(newMessages);
      await stream(newMessages);
    },
    [messages]
  );

  return { streamState, ask, followUp, reset, hasHistory: messages.length > 0 };
}
