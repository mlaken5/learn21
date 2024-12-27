import React, { KeyboardEvent } from 'react';
import type { GameState } from '../utils/blackjack';

interface GameControlsProps {
  userGuess: string;
  onGuessChange: (guess: string) => void;
  onCheck: () => void;
  onHit?: () => void;
  onStay?: () => void;
  onSplit?: () => void;
  feedback: string;
  gameState: GameState;
  canSplit: boolean;
  onDouble?: () => void;
  canDouble: boolean;
}

export function GameControls({
  userGuess,
  onGuessChange,
  onCheck,
  onHit,
  onStay,
  onSplit,
  feedback,
  gameState,
  canSplit,
  onDouble,
  canDouble,
}: GameControlsProps) {
  const handleNumberClick = (num: number | 'backspace') => {
    if (num === 'backspace') {
      onGuessChange(userGuess.slice(0, -1));
    } else {
      const newValue = userGuess + num.toString();
      if (parseInt(newValue) <= 30) {
        onGuessChange(newValue);
      }
    }
  };

  const showInputs = gameState === 'playing';

  return (
    <div className="bg-transparent p-2 rounded-lg">
      {feedback && (
        <p className="whitespace-pre-line mb-4 text-lg font-medium text-white">{feedback}</p>
      )}
      
      {showInputs && !feedback && (
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-4 w-full justify-center">
            <h3 className="text-lg font-semibold text-white">Hand value:</h3>
            <div className="w-24 h-12 border-2 border-white rounded flex items-center justify-center 
                          text-lg font-medium bg-white/20 text-white shadow-inner">
              {userGuess || '0'}
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 w-[200px]">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <button
                key={num}
                onClick={() => handleNumberClick(num)}
                className="w-14 h-14 bg-white/20 rounded-lg hover:bg-white/30 
                         text-white text-lg font-medium shadow-sm
                         active:bg-white/40 transition-colors"
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => handleNumberClick('backspace')}
              className="w-14 h-14 bg-white/30 rounded-lg hover:bg-white/40 
                       text-white text-lg font-medium shadow-sm
                       active:bg-white/50 transition-colors"
            >
              ←
            </button>
            <button
              onClick={() => handleNumberClick(0)}
              className="w-14 h-14 bg-white/20 rounded-lg hover:bg-white/30 
                       text-white text-lg font-medium shadow-sm
                       active:bg-white/40 transition-colors"
            >
              0
            </button>
            <button
              onClick={onCheck}
              className="w-14 h-14 bg-emerald-500/90 rounded-lg hover:bg-emerald-600/90 
                       text-white text-lg font-medium shadow-sm
                       active:bg-emerald-700/90 transition-colors"
            >
              ✓
            </button>
          </div>
        </div>
      )}

      {gameState === 'playing' && feedback && (
        <div className="flex flex-col gap-2 mt-4">
          {onHit && (
            <button
              onClick={onHit}
              className="px-4 py-2 bg-green-500/80 text-white rounded hover:bg-green-600/80 
                       transition-colors text-lg font-medium"
            >
              Hit
            </button>
          )}
          {onStay && (
            <button
              onClick={onStay}
              className="px-4 py-2 bg-red-500/80 text-white rounded hover:bg-red-600/80 
                       transition-colors text-lg font-medium"
            >
              Stay
            </button>
          )}
          {canDouble && onDouble && (
            <button
              onClick={onDouble}
              className="px-4 py-2 bg-yellow-500/80 text-white rounded hover:bg-yellow-600/80 
                       transition-colors text-lg font-medium"
            >
              Double
            </button>
          )}
          {canSplit && onSplit && (
            <button
              onClick={onSplit}
              className="px-4 py-2 bg-purple-500/80 text-white rounded hover:bg-purple-600/80 
                       transition-colors text-lg font-medium"
            >
              Split
            </button>
          )}
        </div>
      )}
    </div>
  );
}