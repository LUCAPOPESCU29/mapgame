import { motion } from "framer-motion";

interface TextGenerateProps {
  text: string;
  className?: string;
  speed?: number;
}

const containerVariants = {
  hidden: {},
  visible: (speed: number) => ({
    transition: {
      staggerChildren: speed,
    },
  }),
};

const wordVariants = {
  hidden: {
    opacity: 0,
    y: 8,
    filter: "blur(8px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.35,
      ease: "easeOut" as const,
    },
  },
};

export function TextGenerate({ text, className, speed = 0.025 }: TextGenerateProps) {
  const words = text.split(" ");

  return (
    <motion.p
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      custom={speed}
    >
      {words.map((word, i) => (
        <motion.span key={i} variants={wordVariants} style={{ display: "inline-block", marginRight: "0.25em" }}>
          {word}
        </motion.span>
      ))}
    </motion.p>
  );
}
