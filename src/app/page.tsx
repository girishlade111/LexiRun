import { GameClient } from '@/components/game/game-client';

export default function Home() {
  return (
    <main className="flex h-screen flex-col items-center justify-center overflow-hidden">
      <GameClient />
    </main>
  );
}
