import { useEffect, useState, useRef } from "react";

interface TypewriterTextProps {
  text: string;
  isStreaming: boolean;
  className?: string;
  speed?: number;
}

export function TypewriterText({
  text,
  isStreaming,
  className = "",
  speed = 12,
}: TypewriterTextProps) {
  const [displayed, setDisplayed] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const indexRef = useRef(0);
  const prevTextRef = useRef("");

  // When streaming, just show all streamed text directly (already incremental)
  useEffect(() => {
    if (isStreaming) {
      setDisplayed(text);
      return;
    }

    // When streaming stops, run typewriter if text changed
    if (text !== prevTextRef.current) {
      prevTextRef.current = text;
      indexRef.current = 0;
      setDisplayed("");

      const interval = setInterval(() => {
        indexRef.current += Math.ceil(speed / 10);
        if (indexRef.current >= text.length) {
          setDisplayed(text);
          clearInterval(interval);
        } else {
          setDisplayed(text.slice(0, indexRef.current));
        }
      }, 16);

      return () => clearInterval(interval);
    }
  }, [text, isStreaming, speed]);

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  const paragraphs = displayed.split("\n\n").filter(Boolean);

  return (
    <div className={`history-prose ${className}`}>
      {paragraphs.map((para, i) => (
        <p key={i} className="text-parchment-100 font-garamond text-base leading-relaxed">
          {para}
          {isStreaming && i === paragraphs.length - 1 && (
            <span
              className="inline-block w-0.5 h-4 bg-gold ml-0.5 align-middle"
              style={{ opacity: cursorVisible ? 1 : 0, transition: "opacity 0.1s" }}
            />
          )}
        </p>
      ))}
      {!displayed && isStreaming && (
        <span
          className="inline-block w-0.5 h-4 bg-gold align-middle"
          style={{ opacity: cursorVisible ? 1 : 0 }}
        />
      )}
    </div>
  );
}
