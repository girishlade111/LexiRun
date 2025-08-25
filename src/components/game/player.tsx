"use client";

import { motion } from 'framer-motion';
import { PlayerIcon } from '@/components/icons/player-icon';

interface PlayerProps {
  position: { x: number; y: number };
  isDucking: boolean;
}

export function Player({ position, isDucking }: PlayerProps) {
  return (
    <motion.div
      className="absolute"
      style={{
        width: 50,
        height: 50,
        left: position.x,
        top: position.y,
      }}
      animate={{
        scaleY: isDucking ? 0.6 : 1,
        y: isDucking ? position.y + 20 : position.y,
      }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
    >
      <PlayerIcon className="w-full h-full text-primary-foreground fill-current" />
    </motion.div>
  );
}
