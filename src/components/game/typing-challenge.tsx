"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Timer } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Progress } from '../ui/progress';

interface Word {
  id: string;
  text: string;
  x: number;
  y: number;
}

interface TypingChallengeProps {
  word: Word;
  onSuccess: (word: Word, timeBonus: number) => void;
  onFailure: (word: Word) => void;
}

const MAX_TIME = 15; // 15 seconds per challenge

export function TypingChallenge({ word, onSuccess, onFailure }: TypingChallengeProps) {
  const [inputValue, setInputValue] = useState('');
  const [startTime, setStartTime] = useState(0);
  const [timeLeft, setTimeLeft] = useState(MAX_TIME);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<number>();
  const { toast } = useToast();

  const handleFailure = useCallback(() => {
    toast({
        title: "Time's up!",
        description: `The word was "${word.text}". Better luck next time!`,
        variant: "destructive",
    });
    onFailure(word);
  }, [word, onFailure, toast]);

  useEffect(() => {
    inputRef.current?.focus();
    setStartTime(Date.now());
    setTimeLeft(MAX_TIME);

    const interval = setInterval(() => {
        setTimeLeft(prev => {
            const nextTime = prev - 0.05;
            if (nextTime <= 0) {
                clearInterval(interval);
                handleFailure();
                return 0;
            }
            return nextTime;
        });
    }, 50);
    timerRef.current = window.setTimeout(() => clearInterval(interval), MAX_TIME * 1000);

    return () => {
        clearInterval(interval);
        if(timerRef.current) clearTimeout(timerRef.current);
    }
  }, [word, handleFailure]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const typedValue = e.target.value.trim();
    setInputValue(typedValue);

    if (typedValue.toLowerCase() === word.text.toLowerCase()) {
      if(timerRef.current) clearTimeout(timerRef.current);
      const timeTaken = (Date.now() - startTime) / 1000;
      const timeBonus = Math.max(0, (MAX_TIME - timeTaken) * 10);
      onSuccess(word, timeBonus);
    }
  };

  const handleGiveUp = () => {
    if(timerRef.current) clearTimeout(timerRef.current);
    toast({
        title: "Challenge Skipped",
        description: `The word was "${word.text}".`,
        variant: "destructive"
    });
    onFailure(word);
  }
  
  const renderWord = () => {
    return word.text.split('').map((char, index) => {
      let className = 'text-muted-foreground/50';
      if (index < inputValue.length) {
        className = inputValue[index].toLowerCase() === char.toLowerCase() ? 'word-correct' : 'word-incorrect';
      }
      return <span key={index} className={`text-5xl font-bold transition-colors duration-200 ${className}`}>{char}</span>;
    });
  };

  return (
    <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 bg-background/80 backdrop-blur-md flex flex-col items-center justify-center z-20"
    >
      <div className="bg-card p-8 rounded-xl shadow-2xl border border-primary/30 w-full max-w-2xl text-center relative overflow-hidden">
        <div className="absolute top-4 right-4 flex items-center gap-2 text-accent font-semibold bg-accent/10 px-3 py-1 rounded-full text-sm">
            <Timer className="w-4 h-4"/>
            <span>{Math.ceil(timeLeft)}s</span>
        </div>
        <p className="text-muted-foreground text-lg mb-4">Type the word!</p>
        <div className="mb-6 h-16 flex items-center justify-center gap-1 font-headline tracking-wider">
            {renderWord()}
        </div>
        <Input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          className="text-center text-3xl h-16 tracking-widest font-mono"
          placeholder="..."
        />
        <div className="mt-6">
            <Button variant="ghost" onClick={handleGiveUp}>
                Skip Word
            </Button>
        </div>
        <Progress value={(timeLeft / MAX_TIME) * 100} className="absolute bottom-0 left-0 w-full h-1 rounded-none" />
      </div>
    </motion.div>
  );
}
