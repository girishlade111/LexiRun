"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { getWordsForGame } from '@/app/actions';
import { Player } from '@/components/game/player';
import { WordObject } from '@/components/game/word-object';
import { TypingChallenge } from '@/components/game/typing-challenge';
import { Scoreboard } from '@/components/game/scoreboard';
import { Loader2, AlertTriangle, Play } from 'lucide-react';

interface Word {
  id: string;
  text: string;
  x: number;
  yOffset: number;
  width: number;
}

type ActiveWord = Word & { y: number };

type GameState = 'loading' | 'ready' | 'playing' | 'typing' | 'error' | 'finished_level';

const PLAYER_SPEED = 5;
const JUMP_HEIGHT = 12;
const GRAVITY = 0.6;
const WORLD_WIDTH = 4000;
const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 50;

export function GameClient() {
  const [gameState, setGameState] = useState<GameState>('loading');
  const [score, setScore] = useState(0);
  const [words, setWords] = useState<Word[]>([]);
  const [activeWord, setActiveWord] = useState<ActiveWord | null>(null);

  const [playerPosition, setPlayerPosition] = useState({ x: 100, y: 0 });
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const [viewHeight, setViewHeight] = useState(0);
  const gameLoopRef = useRef<number>();

  const groundY = viewHeight > 0 ? viewHeight - PLAYER_HEIGHT : 0;
  
  useEffect(() => {
    const updateLayout = () => {
      if (gameAreaRef.current) {
        setViewHeight(gameAreaRef.current.clientHeight);
      }
    };
    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, []);

  const fetchWords = useCallback(async () => {
    if (viewHeight === 0) return; // Don't fetch if layout is not ready
    setGameState('loading');
    try {
      const numberOfWords = 5 + Math.floor(score / 100);
      const newWordsText = await getWordsForGame({ score, numberOfWords });
      const newWords = newWordsText.map((text, index) => ({
        id: `${Date.now()}-${index}`,
        text,
        x: 600 + index * (Math.random() * 400 + 300),
        yOffset: -(Math.random() * 150 + 20),
        width: text.length * 12, 
      }));
      setWords(newWords);
      setGameState('ready');
    } catch (e) {
      console.error(e);
      setGameState('error');
    }
  }, [score, viewHeight]);

  useEffect(() => {
    if (viewHeight > 0) {
      fetchWords();
    }
  }, [viewHeight]); // Initial fetch when viewHeight is known

  const resetPlayer = useCallback(() => {
    if (groundY > 0) {
      setPlayerPosition({ x: 100, y: groundY });
      setVelocity({ x: 0, y: 0 });
    }
  }, [groundY]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'typing' && ['w', 'a', 'd', 's'].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
      keysPressed.current[e.key.toLowerCase()] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (gameState !== 'typing' && ['w', 'a', 'd', 's'].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
      keysPressed.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameState]);

  const gameLoop = useCallback(() => {
    if (gameState !== 'playing' || groundY === 0) return;

    setPlayerPosition(prevPos => {
      let newY = prevPos.y + velocity.y;
      let newX = prevPos.x;

      // Gravity
      let newVelY = velocity.y + GRAVITY;

      if (keysPressed.current['a']) newX -= PLAYER_SPEED;
      if (keysPressed.current['d']) newX += PLAYER_SPEED;

      // Jump
      if ((keysPressed.current['w'] || keysPressed.current[' ']) && newY >= groundY - 1) {
        newVelY = -JUMP_HEIGHT;
      }
      
      // Ground detection
      if (newY > groundY) {
        newY = groundY;
        newVelY = 0;
      }

      // World boundaries
      newX = Math.max(0, Math.min(newX, WORLD_WIDTH - PLAYER_WIDTH));
      
      setVelocity(prevVel => ({...prevVel, y: newVelY}));

      // Collision detection
      for (const word of words) {
        const wordY = groundY + word.yOffset;
        if (
          newX < word.x + word.width &&
          newX + PLAYER_WIDTH > word.x &&
          newY < wordY + 20 &&
          newY + PLAYER_HEIGHT > wordY
        ) {
          setActiveWord({ ...word, y: wordY });
          setGameState('typing');
          return prevPos; // Stop movement
        }
      }

      return { x: newX, y: newY };
    });

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, velocity.y, words, groundY]);

  useEffect(() => {
    if (gameState === 'playing') {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    } else {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    }
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    }
  }, [gameState, gameLoop]);
  
  const handleTypingSuccess = (word: ActiveWord, timeBonus: number) => {
    const points = Math.max(10, Math.floor(word.text.length * 5 + timeBonus));
    setScore(prev => prev + points);
    setWords(prev => prev.filter(w => w.id !== word.id));
    setActiveWord(null);
    if(words.length <= 1) {
        setGameState('finished_level');
    } else {
        setGameState('playing');
    }
  };

  const handleTypingFailure = (word: ActiveWord) => {
    setWords(prev => prev.filter(w => w.id !== word.id));
    setActiveWord(null);
    if(words.length <= 1) {
        setGameState('finished_level');
    } else {
        setGameState('playing');
    }
  };

  const startGame = () => {
    resetPlayer();
    setGameState('playing');
  };
  
  const nextLevel = () => {
    fetchWords();
    resetPlayer();
  }
  
  const cameraX = viewHeight > 0 ? Math.max(0, Math.min(playerPosition.x - window.innerWidth / 2, WORLD_WIDTH - window.innerWidth)) : 0;
  
  return (
    <div ref={gameAreaRef} className="w-full h-full bg-background overflow-hidden relative border-4 border-primary/20 rounded-lg shadow-2xl">
      <AnimatePresence>
        {(gameState === 'loading' || viewHeight === 0) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center z-50">
            <Loader2 className="w-16 h-16 animate-spin text-primary" />
            <p className="mt-4 text-lg font-semibold">Loading LexiRun...</p>
          </motion.div>
        )}
        {gameState === 'error' && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center z-50">
             <AlertTriangle className="w-16 h-16 text-destructive" />
             <p className="mt-4 text-lg font-semibold">Oops! Something went wrong.</p>
             <button onClick={fetchWords} className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md">Try Again</button>
           </motion.div>
        )}
        {(gameState === 'ready' || gameState === 'finished_level') && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center z-50 backdrop-blur-sm">
             <h1 className="text-6xl font-bold text-primary mb-2 font-headline">{gameState === 'ready' ? 'LexiRun' : 'Level Complete!'}</h1>
             <p className="text-xl text-muted-foreground mb-8 max-w-md text-center">{gameState === 'ready' ? `Use 'A' and 'D' to run, and 'W' or Space to jump. Collide with words to start a typing challenge.` : `Your score is ${score}. Ready for the next challenge?`}</p>
             <button onClick={gameState === 'ready' ? startGame : nextLevel} className="text-2xl mt-4 px-8 py-4 bg-primary text-primary-foreground rounded-lg shadow-lg hover:bg-primary/90 transition-transform hover:scale-105 flex items-center gap-2">
                <Play/>
                {gameState === 'ready' ? 'Start Game' : 'Next Level'}
             </button>
           </motion.div>
        )}
      </AnimatePresence>

      <Scoreboard score={score} />
      
      {groundY > 0 && (
        <motion.div
          className="h-full relative"
          style={{ width: WORLD_WIDTH }}
          animate={{ x: -cameraX }}
          transition={{ duration: 0.5, ease: 'linear' }}
        >
          <div className="absolute bottom-0 left-0 w-full h-12 bg-green-200/20 dark:bg-yellow-200/5" style={{top: groundY + PLAYER_HEIGHT - 12}}/>
          <Player position={playerPosition} isDucking={keysPressed.current['s']} />
          {words.map(word => (
            <WordObject key={word.id} word={{...word, y: groundY + word.yOffset}} />
          ))}
        </motion.div>
      )}


      <AnimatePresence>
        {gameState === 'typing' && activeWord && (
          <TypingChallenge
            word={activeWord}
            onSuccess={handleTypingSuccess}
            onFailure={handleTypingFailure}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
