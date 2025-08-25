"use client";

import { motion } from 'framer-motion';

interface ScoreboardProps {
  score: number;
}

export function Scoreboard({ score }: ScoreboardProps) {
  return (
    <motion.div
      className="absolute top-4 right-4 z-10 bg-background/50 backdrop-blur-sm p-3 rounded-lg shadow-md border border-primary/20"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-sm font-semibold text-muted-foreground">SCORE</h2>
      <p className="text-3xl font-bold text-primary text-right tabular-nums">{score}</p>
    </motion.div>
  );
}
