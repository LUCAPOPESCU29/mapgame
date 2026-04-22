import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { AIChatInput } from "./ui/ai-chat-input";
import { BorderBeam } from "./ui/border-beam";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  think: boolean;
  deepSearch: boolean;
}

type IconProps = {
  className?: string;
};

function CloseIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <path d="M6.75 6.75 17.25 17.25M17.25 6.75 6.75 17.25" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ScriptoriumIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <path d="M5.25 6.75c2.15-.95 4.28-.88 6.4.18.23.12.47.12.7 0 2.12-1.06 4.25-1.13 6.4-.18v10.4c-2.15-.95-4.28-.88-6.4.18a.77.77 0 0 1-.7 0c-2.12-1.06-4.25-1.13-6.4-.18V6.75Z" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 7.35v10.3M8.1 10.1h1.85M14.05 10.1h1.85" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
    </svg>
  );
}

function FlameIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <path d="M12.45 3.7c.35 2.9-1.45 4.15-3.1 5.95-1.17 1.27-2.1 2.65-2.1 4.65 0 3.05 2.25 5.45 4.75 5.45s4.75-2.4 4.75-5.45c0-2.75-1.6-4.65-4.3-10.6Z" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12.1 16.65c1.02-.35 1.75-1.15 1.75-2.25 0-1.05-.62-1.85-1.52-3.2-.28 1.25-1.28 1.9-2.03 2.78-.42.5-.65 1.02-.65 1.62 0 1.2.98 2.15 2.45 1.05Z" fill="currentColor" opacity=".45" />
    </svg>
  );
}

function LensIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <circle cx="10.7" cy="10.7" r="5.35" stroke="currentColor" strokeWidth="1.7" />
      <path d="m15.05 15.05 3.9 3.9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M8.3 10.7h4.8M10.7 8.3v4.8" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" opacity=".7" />
    </svg>
  );
}

function SparkIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <path d="M12 4.75v3.1M12 16.15v3.1M19.25 12h-3.1M7.85 12h-3.1M16.95 7.05l-2.18 2.18M9.23 14.77l-2.18 2.18M16.95 16.95l-2.18-2.18M9.23 9.23 7.05 7.05" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="12" r="2.15" fill="currentColor" opacity=".35" />
    </svg>
  );
}

function ArchiveMark({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <path d="M5.5 8.1h13v10.15H5.5V8.1Z" stroke="currentColor" strokeWidth="1.65" strokeLinejoin="round" />
      <path d="M8.1 8.1V5.75h7.8V8.1M4.3 8.1h15.4M9.15 12.15h5.7" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" />
    </svg>
  );
}

const EMPTY_PROMPTS = [
  {
    label: "Rome's last century",
    detail: "Power, grain, borders",
    question: "Why did Rome fall?",
  },
  {
    label: "Viking sea routes",
    detail: "Raids, trade, settlement",
    question: "Who were the Vikings?",
  },
  {
    label: "The Crusader call",
    detail: "Faith, land, politics",
    question: "What caused the Crusades?",
  },
];

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
    <div className="mb-1.5 flex items-center gap-1.5">
      {think && (
        <span className="inline-flex items-center gap-1 rounded-full border border-gold/20 bg-gold/10 px-2 py-0.5 font-cinzel text-[8px] uppercase tracking-[0.16em] text-gold/80">
          <FlameIcon className="h-2.5 w-2.5" /> Think
        </span>
      )}
      {deepSearch && (
        <span className="inline-flex items-center gap-1 rounded-full border border-gold/20 bg-white/[0.04] px-2 py-0.5 font-cinzel text-[8px] uppercase tracking-[0.16em] text-parchment-400">
          <LensIcon className="h-2.5 w-2.5 text-gold/70" /> Deep
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
  const renderInline = (source: string) => {
    const parts = source.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((p, j) =>
      p.startsWith("**") && p.endsWith("**")
        ? <strong key={j} className="font-semibold text-gold">{p.slice(2, -2)}</strong>
        : <span key={j}>{p}</span>
    );
  };

  return (
    <div className="space-y-1.5 break-words font-garamond text-[14px] leading-relaxed text-parchment-100">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-1" />;
        const trimmed = line.trimStart();
        const isBullet = trimmed.startsWith("- ") || trimmed.startsWith("* ") || trimmed.charCodeAt(0) === 8226;
        if (isBullet) {
          const bulletText = trimmed.charCodeAt(0) === 8226 ? trimmed.slice(1).trimStart() : trimmed.slice(2);
          return (
            <div key={i} className="grid grid-cols-[9px_1fr] gap-2">
              <span className="mt-[0.58em] h-1 w-1 rounded-full bg-gold/60" />
              <span>{renderInline(bulletText)}</span>
            </div>
          );
        }
        return <div key={i}>{renderInline(line)}</div>;
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
      for await (const chunkFlush of streamChatResponse(history, think, deep, (chunk) => {
        setMessages((prev) =>
          prev.map((m) => m.id === assistantId ? { ...m, content: m.content + chunk } : m)
        );
      })) {
        void chunkFlush;
      }
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
          className="fixed bottom-0 right-0 z-50 w-full sm:bottom-5 sm:right-5 sm:w-[460px]"
          variants={panelVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div
            className="relative flex flex-col overflow-hidden rounded-t-[28px] border border-gold/20 shadow-[0_-18px_70px_rgba(6,4,2,0.78)] sm:rounded-[28px]"
            style={{
              background: "linear-gradient(180deg, rgba(22,17,10,0.98) 0%, rgba(12,9,5,0.985) 56%, rgba(9,7,4,0.995) 100%)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              boxShadow: "0 0 0 1px rgba(245,232,196,0.035) inset, 0 24px 80px rgba(0,0,0,0.72)",
              height: "min(760px, calc(100dvh - 20px))",
            }}
          >
            <BorderBeam
              size={280}
              duration={12}
              delay={0}
              colorFrom="#C9A84C"
              colorTo="transparent"
            />
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-36"
              style={{ background: "radial-gradient(ellipse at 20% 0%, rgba(201,168,76,0.16) 0%, transparent 58%)" }}
            />
            <div className="pointer-events-none absolute inset-0 bg-parchment-grain opacity-[0.025]" />

            <div
              className="relative flex flex-shrink-0 items-center gap-3 border-b border-gold/10 px-4 py-3.5"
              style={{ background: "linear-gradient(135deg, rgba(245,232,196,0.035) 0%, rgba(201,168,76,0.03) 48%, transparent 100%)" }}
            >
              <div className="relative flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl border border-gold/25 bg-gold/10 shadow-[inset_0_1px_0_rgba(245,232,196,0.08)]">
                <motion.div
                  className="absolute inset-1 rounded-[14px] border border-gold/10"
                  animate={{ opacity: [0.35, 0.75, 0.35] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                />
                <ArchiveMark className="relative h-5 w-5 text-gold" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <h3 className="font-cinzel text-[15px] font-bold leading-tight tracking-[0.08em] text-gold">
                    Historicus AI
                  </h3>
                  <span className="h-1 w-1 rounded-full bg-gold/70" />
                  <span className="font-cinzel text-[8px] uppercase tracking-[0.22em] text-parchment-700">Live archive</span>
                </div>
                <p className="truncate font-garamond text-[11px] italic text-parchment-600">
                  Primary context, vivid answers, less textbook dust.
                </p>
              </div>

              <div className="hidden items-center gap-1.5 min-[390px]:flex">
                <AnimatePresence>
                  {thinkActive && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                      className="flex items-center gap-1 rounded-full border border-gold/25 bg-gold/10 px-2 py-0.5"
                    >
                      <FlameIcon className="h-2.5 w-2.5 text-gold" />
                      <span className="font-cinzel text-[8px] uppercase tracking-[0.16em] text-gold">Think</span>
                    </motion.div>
                  )}
                  {deepSearchActive && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                      className="flex items-center gap-1 rounded-full border border-gold/20 bg-white/[0.045] px-2 py-0.5"
                    >
                      <LensIcon className="h-2.5 w-2.5 text-gold/70" />
                      <span className="font-cinzel text-[8px] uppercase tracking-[0.16em] text-parchment-500">Deep</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.button
                onClick={onClose}
                aria-label="Close Historicus chat"
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-transparent text-parchment-600 transition-all hover:border-gold/15 hover:bg-gold/10 hover:text-gold active:scale-[0.98]"
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.94 }}
                transition={{ type: "spring", stiffness: 230, damping: 18 }}
              >
                <CloseIcon className="h-4 w-4" />
              </motion.button>
            </div>

            <AnimatePresence>
              {(thinkActive || deepSearchActive) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  className="relative flex-shrink-0 overflow-hidden"
                >
                  <div className="flex items-center gap-2 border-b border-gold/10 bg-gradient-to-r from-gold/10 via-white/[0.02] to-transparent px-4 py-2.5">
                    <SparkIcon className="h-3.5 w-3.5 flex-shrink-0 text-gold/70" />
                    <p className="font-garamond text-[11px] italic text-parchment-500">
                      {thinkActive && deepSearchActive
                        ? "Full scholarly mode: slower, broader, and more careful."
                        : thinkActive
                        ? "Think mode: weighs causes, tradeoffs, and rival explanations."
                        : "Deep mode: wider context across politics, culture, and economy."}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">
              <div
                className="pointer-events-none absolute inset-x-4 top-5 h-40 rounded-full opacity-50 blur-3xl"
                style={{ background: "radial-gradient(ellipse, rgba(201,168,76,0.055) 0%, transparent 70%)" }}
              />
              {messages.length === 0 && (
                <motion.div
                  className="relative grid min-h-full content-center py-8"
                  initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                >
                  <div className="mx-auto w-full max-w-[360px]">
                    <div className="mb-5 grid grid-cols-[64px_1fr] gap-4">
                      <div className="relative h-16 w-16">
                        <motion.div
                          className="absolute inset-0 rounded-3xl bg-gold/10"
                          animate={{ scale: [1, 1.18, 1], opacity: [0.45, 0.85, 0.45] }}
                          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <div className="relative flex h-16 w-16 items-center justify-center rounded-3xl border border-gold/20 bg-white/[0.04] shadow-[inset_0_1px_0_rgba(245,232,196,0.08)]">
                          <ScriptoriumIcon className="h-8 w-8 text-gold/75" />
                        </div>
                      </div>
                      <div className="min-w-0 pt-1 text-left">
                        <p className="mb-2 font-cinzel text-[10px] uppercase tracking-[0.28em] text-gold/50">Open scriptorium</p>
                        <h4 className="font-cinzel text-[22px] font-semibold leading-none tracking-tight text-parchment-100">
                          Ask the chronicles
                        </h4>
                        <p className="mt-3 max-w-[26ch] font-garamond text-[13px] italic leading-relaxed text-parchment-600">
                          Trace battles, dynasties, rituals, trade routes, and the quiet choices behind loud events.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-[1.08fr_0.92fr] gap-2.5">
                      {EMPTY_PROMPTS.map((item, index) => (
                        <motion.button
                          key={item.question}
                          type="button"
                          onClick={() => handleSend(item.question, thinkActive, deepSearchActive)}
                          disabled={isStreaming}
                          className={`group relative overflow-hidden rounded-2xl border border-gold/15 bg-white/[0.035] px-3.5 py-3 text-left transition-all hover:border-gold/30 hover:bg-gold/10 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 ${index === 2 ? "col-span-2 ml-[18%]" : ""}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.08 + index * 0.06, type: "spring", stiffness: 120, damping: 20 }}
                        >
                          <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 beam-gradient" />
                          <span className="relative block font-cinzel text-[11px] font-semibold leading-tight text-parchment-300 transition-colors group-hover:text-gold">
                            {item.label}
                          </span>
                          <span className="relative mt-1 block font-garamond text-[11px] italic text-parchment-700">
                            {item.detail}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {messages.map((msg) => {
                const isAssistant = msg.role === "assistant";
                const isError = isAssistant && msg.content.startsWith("Error:");
                return (
                  <motion.div
                    key={msg.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 180, damping: 22 }}
                    className={`relative flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {isAssistant && (
                      <div className="mr-2.5 mt-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl border border-gold/20 bg-gold/10 shadow-[inset_0_1px_0_rgba(245,232,196,0.06)]">
                        <ArchiveMark className="h-3.5 w-3.5 text-gold/80" />
                      </div>
                    )}

                    <div className={`flex max-w-[86%] flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                      {isAssistant && <ModeIndicator think={msg.think} deepSearch={msg.deepSearch} />}

                      <div className={`relative overflow-hidden rounded-[20px] px-3.5 py-3 shadow-[inset_0_1px_0_rgba(245,232,196,0.05)] ${
                        msg.role === "user"
                          ? "rounded-tr-md border border-gold/25 bg-[linear-gradient(135deg,rgba(201,168,76,0.18),rgba(201,168,76,0.07))]"
                          : isError
                          ? "rounded-tl-md border border-red-400/20 bg-red-950/20"
                          : "rounded-tl-md border border-white/[0.07] bg-white/[0.045]"
                      }`}>
                        {msg.role === "user" && (
                          <div className="pointer-events-none absolute inset-0 opacity-45 beam-gradient" />
                        )}
                        <div className="relative min-w-0">
                          {msg.role === "user" ? (
                            <p className="break-words font-garamond text-[14px] leading-relaxed text-parchment-100">{msg.content}</p>
                          ) : msg.content === "" && streamingId === msg.id ? (
                            <TypingDots />
                          ) : (
                            <FormattedMessage text={msg.content} />
                          )}

                          {msg.role === "assistant" && streamingId === msg.id && msg.content && (
                            <motion.span
                              className="ml-0.5 inline-block h-3.5 w-0.5 align-middle bg-gold"
                              animate={{ opacity: [1, 0] }}
                              transition={{ duration: 0.6, repeat: Infinity }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              <div ref={bottomRef} />
            </div>

            <div className="relative flex-shrink-0 border-t border-gold/10 p-3.5">
              <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
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
