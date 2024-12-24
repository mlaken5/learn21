import React from 'react';
import { Brain } from 'lucide-react';

interface GameHeaderProps {
  onNewHand: () => void;
  gameState: string;
}

export function GameHeader({ onNewHand, gameState }: GameHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
      <div className="flex items-center">
        <Brain className="w-8 h-8 text-white mr-2" />
        <h1 className="text-3xl font-bold text-white">Blackjack Trainer</h1>
      </div>
      <button
        onClick={onNewHand}
        className="w-16 h-16 rounded-full bg-gradient-to-br from-red-600 to-red-700 text-white 
                 shadow-lg hover:from-red-500 hover:to-red-600 transition-all transform 
                 hover:scale-105 flex items-center justify-center border-4 border-white"
      >
        <span className="text-sm font-bold">
          {gameState !== 'initial' ? 'New' : 'Start'}
        </span>
      </button>
    </div>
  );
}