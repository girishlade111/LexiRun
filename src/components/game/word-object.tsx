"use client";

import { motion } from 'framer-motion';

interface Word {
  id: string;
  text: string;
  x: number;
  y: number;
}

interface WordObjectProps {
  word: Word;
}

export function WordObject({ word }: WordObjectProps) {
  return (
    <motion.div
      layoutId={word.id}
      className="absolute flex items-center justify-center px-4 py-2 bg-primary/20 border-2 border-dashed border-primary/50 rounded-lg"
      style={{
        left: word.x,
        top: word.y,
      }}
      initial={{ opacity: 0, y: word.y + 20 }}
      animate={{ opacity: 1, y: word.y }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.5 }}
    >
      <span className="text-xl font-medium text-primary-foreground select-none">
        {word.text}
      </span>
    </motion.div>
  );
}
