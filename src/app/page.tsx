import { GameClient } from '@/components/game/game-client';
import { Github, Instagram, Linkedin, Mail, Code, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex h-[100svh] w-full flex-col items-center justify-center bg-background p-4 lg:p-8 font-sans">
      <div className="flex w-full max-w-7xl flex-1 flex-col gap-8">
        <header className="text-center">
            <h1 className="text-4xl font-bold tracking-tighter text-primary font-headline sm:text-5xl md:text-6xl">
                LexiRun
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                A dynamic side-scrolling typing game. Run, jump, and type your way through a world of words.
            </p>
        </header>
        <div className="flex-1 w-full h-full min-h-[400px]">
          <GameClient />
        </div>
      </div>
       <footer className="mt-8 text-center text-muted-foreground">
        <div className="flex justify-center gap-4 mb-2">
            <Link href="https://www.instagram.com/girish_lade_/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram className="h-6 w-6 hover:text-primary transition-colors" />
            </Link>
            <Link href="https://www.linkedin.com/in/girish-lade-075bba201/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <Linkedin className="h-6 w-6 hover:text-primary transition-colors" />
            </Link>
            <Link href="https://github.com/girishlade111" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <Github className="h-6 w-6 hover:text-primary transition-colors" />
            </Link>
            <Link href="https://codepen.io/Girish-Lade-the-looper" target="_blank" rel="noopener noreferrer" aria-label="Codepen">
                 <Code className="h-6 w-6 hover:text-primary transition-colors" />
            </Link>
            <Link href="mailto:girishlade111@gmail.com" aria-label="Email">
                <Mail className="h-6 w-6 hover:text-primary transition-colors" />
            </Link>
        </div>
        <p className="text-sm">
          Built by Girish Lade.
        </p>
      </footer>
    </main>
  );
}
