import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { X, Bot, Lightbulb, Globe, Zap, BookOpen } from "lucide-react";
import { AIChatInput } from "./ui/ai-chat-input";
import { BorderBeam } from "./ui/border-beam";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  think: boolean;
  deepSearch: boolean;
}

function getChatSystemPrompt(think: boolean, deepSearch: boolean): string {
  if (think && deepSearch) {
    return `You are Historicus — an expert historian and scholar AI.
Reason step by step through the question before answering.
Provide thorough, scholarly responses with:
- Deep historical context and multiple perspectives
- Key figures, dates, and cause-effect relationships
- Historiographical debate where relevant
- Connections to broader historical patterns
Structure your answer clearly. Be comprehensive but engaging.
You may use markdown-style formatting (bold, lists) for clarity.`;
  }
  if (think) {
    return `You are Historicus — a thoughtful historical guide.
Reason carefully before responding. Structure your answer with clear analysis,
consider multiple angles, and provide insight beyond surface facts.
Give analytical, well-reasoned historical responses.`;
  }
  if (deepSearch) {
    return `You are Historicus — a comprehensive historical researcher.
Provide detailed, richly informative responses covering:
- Primary historical evidence and key events
- Social, cultural, economic and political dimensions
- Lesser-known but important facts
- Broad temporal and geographic context
Be thorough and specific.`;
  }
  return `You are Historicus — a knowledgeable and engaging historical guide.
Give clear, accurate, and vivid answers to historical questions.
Be concise but insightful. Use compelling historical detail.`;
}

async function* streamChatResponse(
  messages: { role: "user" | "assistant"; content: string }[],
  think: boolean,
  deepSearch: boolean,
  onChunk: (t: string) => void
): AsyncGenerator<void> {
  const key = import.meta.env.VITE_GROQ_API_KEY;
  if (!key) throw new Error("VITE_GROQ_API_KEY not set");

  const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      max_tokens: think && deepSearch ? 2048 : deepSearch ? 1536 : think ? 1024 : 768,
      temperature: think ? 0.6 : deepSearch ? 0.5 : 0.75,
      stream: true,
      messages: [
        { role: "system", content: getChatSystemPrompt(think, deepSearch) },
        ...messages,
      ],
    }),
  });

  if (!resp.ok) throw new Error(`Groq ${resp.status}: ${await resp.text()}`);

  const reader = resp.body!.getReader();
  const dec = new TextDecoder();
  let buf = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    const lines = buf.split("\n");
    buf = lines.pop() ?? "";
    for (const line of lines) {
      const t = line.trim();
      if (!t.startsWith("data: ")) continue;
      const payload = t.slice(6);
      if (payload === "[DONE]") return;
      try {
        const delta = JSON.parse(payload)?.choices?.[0]?.delta?.content ?? "";
        if (delta) { onChunk(delta); yield; }
      } catch { /* partial */ }
    }
  }
}

function ModeIndicator({ think, deepSearch }: { think: boolean; deepSearch: boolean }) {
  if (!think && !deepSearch) return null;
  return (
    <div className="flex items-center gap-1.5 mb-1">
      {think && (
        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-400/20 text-amber-400 font-cinzel text-[9px]">
          <Lightbulb className="w-2.5 h-2.5 fill-amber-400" /> Think
        </span>
      )}
      {deepSearch && (
        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-400 font-cinzel text-[9px]">
          <Globe className="w-2.5 h-2.5" /> Deep Search
        </span>
      )}
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 py-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-gold/60"
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}

// Format assistant message: handle **bold** and bullet lists
function FormattedMessage({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="font-garamond text-sm text-parchment-100 leading-relaxed space-y-1">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-1" />;
        // Bold: **text**
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        const rendered = parts.map((p, j) =>
          p.startsWith("**") && p.endsWith("**")
            ? <strong key={j} className="text-gold font-semibold">{p.slice(2, -2)}</strong>
            : <span key={j}>{p}</span>
        );
        // Bullet
        if (line.trimStart().startsWith("- ") || line.trimStart().startsWith("• ")) {
          return (
            <div key={i} className="flex gap-2">
              <span className="text-gold/60 mt-0.5 flex-shrink-0">•</span>
              <span>{rendered}</span>
            </div>
          );
        }
        return <div key={i}>{rendered}</div>;
      })}
    </div>
  );
}

const panelVariants: Variants = {
  hidden: { y: "100%", opacity: 0, scale: 0.97 },
  visible: { y: 0, opacity: 1, scale: 1, transition: { type: "spring" as const, stiffness: 260, damping: 28 } },
  exit: { y: "100%", opacity: 0, scale: 0.97, transition: { duration: 0.22 } },
};

interface ChatbotProps {
  open: boolean;
  onClose: () => void;
}

export function Chatbot({ open, onClose }: ChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const [thinkActive, setThinkActive] = useState(false);
  const [deepSearchActive, setDeepSearchActive] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingId]);

  async function handleSend(text: string, think: boolean, deep: boolean) {
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      think,
      deepSearch: deep,
    };

    const assistantId = crypto.randomUUID();
    const assistantMsg: ChatMessage = {
      id: assistantId,
      role: "assistant",
      content: "",
      think,
      deepSearch: deep,
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setStreamingId(assistantId);

    const history = [
      ...messages.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
      { role: "user" as const, content: text },
    ];

    try {
      for await (const _ of streamChatResponse(history, think, deep, (chunk) => {
        setMessages((prev) =>
          prev.map((m) => m.id === assistantId ? { ...m, content: m.content + chunk } : m)
        );
      })) { /* stream */ }
    } catch (e) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: e instanceof Error ? `Error: ${e.message}` : "Something went wrong." }
            : m
        )
      );
    } finally {
      setStreamingId(null);
    }
  }

  const isStreaming = streamingId !== null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed bottom-0 right-0 z-50 w-full sm:w-[420px] sm:bottom-5 sm:right-5"
          variants={panelVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div
            className="relative flex flex-col rounded-t-2xl sm:rounded-2xl overflow-hidden border border-gold/20 shadow-[0_-8px_60px_rgba(0,0,0,0.8)]"
            style={{ background: "rgba(13,10,6,0.97)", backdropFilter: "blur(20px)", height: "clamp(480px, 70vh, 680px)" }}
          >
            {/* BorderBeam traveling around the chatbot panel */}
            <BorderBeam
              size={250}
              duration={9}
              delay={0}
              colorFrom="#C9A84C"
              colorTo="transparent"
            />

            {/* ── Header ─────────────────────────────── */}
            <div
              className="relative flex items-center gap-3 px-4 py-3 border-b border-gold/10 flex-shrink-0"
              style={{ background: "linear-gradient(135deg, rgba(201,168,76,0.05) 0%, transparent 60%)" }}
            >
              <div className="w-8 h-8 rounded-xl bg-gold/15 border border-gold/25 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-gold" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-cinzel text-sm font-bold text-gold leading-tight">
                  Historicus AI
                </h3>
                <p className="font-garamond text-[10px] text-parchment-600 italic">
                  Ask anything about history
                </p>
              </div>

              {/* Mode badges */}
              <div className="flex items-center gap-1.5">
                <AnimatePresence>
                  {thinkActive && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-400/25"
                    >
                      <Lightbulb className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                      <span className="font-cinzel text-[9px] text-amber-400">Think</span>
                    </motion.div>
                  )}
                  {deepSearchActive && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-400/25"
                    >
                      <Globe className="w-2.5 h-2.5 text-blue-400" />
                      <span className="font-cinzel text-[9px] text-blue-400">Deep</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.button
                onClick={onClose}
                className="p-1.5 rounded-lg text-parchment-600 hover:text-gold hover:bg-gold/10 transition-all flex-shrink-0"
                whileHover={{ rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            {/* ── Mode info bar ───────────────────────── */}
            <AnimatePresence>
              {(thinkActive || deepSearchActive) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden flex-shrink-0 relative"
                >
                  <div className="px-4 py-2 bg-gradient-to-r from-gold/5 to-transparent border-b border-gold/8 flex items-center gap-2">
                    <Zap className="w-3 h-3 text-gold/60 flex-shrink-0" />
                    <p className="font-garamond text-[11px] text-parchment-600 italic">
                      {thinkActive && deepSearchActive
                        ? "Full scholarly mode — deep analysis with chain-of-thought reasoning"
                        : thinkActive
                        ? "Think mode — analytical, multi-perspective responses"
                        : "Deep Search mode — comprehensive historical research"}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Messages ────────────────────────────── */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 min-h-0 relative">
              {messages.length === 0 && (
                <motion.div
                  className="h-full flex flex-col items-center justify-center gap-4 text-center py-8"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                >
                  {/* Pulsing glow around the icon */}
                  <div className="relative">
                    <motion.div
                      className="absolute -inset-3 rounded-2xl"
                      style={{ background: "radial-gradient(circle, rgba(201,168,76,0.2) 0%, transparent 70%)" }}
                      animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <div className="relative w-14 h-14 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                      <BookOpen className="w-7 h-7 text-gold/60" />
                    </div>
                  </div>
                  <div>
                    <p className="font-cinzel text-sm font-semibold text-parchment-400 mb-1">Ask the chronicles</p>
                    <p className="font-garamond text-xs text-parchment-700 max-w-[260px] italic">
                      Ask anything — why empires fell, how battles were won, what ordinary people ate, who shaped history.
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 mt-2">
                    {["Why did Rome fall?", "Who were the Vikings?", "What caused the Crusades?"].map((q) => (
                      <button
                        key={q}
                        onClick={() => handleSend(q, thinkActive, deepSearchActive)}
                        className="relative overflow-hidden px-3 py-1.5 rounded-full border border-gold/20 bg-gold/5 text-parchment-500 font-garamond text-xs hover:border-gold/40 hover:text-gold transition-all group"
                      >
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity beam-gradient pointer-events-none" />
                        <span className="relative">{q}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-6 h-6 rounded-lg bg-gold/15 border border-gold/20 flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
                      <Bot className="w-3 h-3 text-gold" />
                    </div>
                  )}

                  <div className={`max-w-[85%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col`}>
                    {msg.role === "assistant" && <ModeIndicator think={msg.think} deepSearch={msg.deepSearch} />}

                    <div className={`relative overflow-hidden rounded-2xl px-3.5 py-2.5 ${
                      msg.role === "user"
                        ? "bg-gold/15 border border-gold/25 rounded-tr-sm"
                        : "bg-white/[0.04] border border-white/[0.07] rounded-tl-sm"
                    }`}>
                      {/* Subtle shimmer on user messages */}
                      {msg.role === "user" && (
                        <div className="absolute inset-0 beam-gradient pointer-events-none opacity-50" />
                      )}
                      <div className="relative">
                        {msg.role === "user" ? (
                          <p className="font-garamond text-sm text-parchment-100">{msg.content}</p>
                        ) : msg.content === "" && streamingId === msg.id ? (
                          <TypingDots />
                        ) : (
                          <FormattedMessage text={msg.content} />
                        )}

                        {/* Streaming cursor */}
                        {msg.role === "assistant" && streamingId === msg.id && msg.content && (
                          <motion.span
                            className="inline-block w-0.5 h-3.5 bg-gold ml-0.5 align-middle"
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              <div ref={bottomRef} />
            </div>

            {/* ── Input ───────────────────────────────── */}
            <div className="flex-shrink-0 p-3 border-t border-gold/10 relative">
              <AIChatInput
                onSend={handleSend}
                disabled={isStreaming}
                thinkActive={thinkActive}
                deepSearchActive={deepSearchActive}
                onThinkToggle={() => setThinkActive((v) => !v)}
                onDeepSearchToggle={() => setDeepSearchActive((v) => !v)}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
