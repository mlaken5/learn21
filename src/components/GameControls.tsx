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
    <div className="bg-[#f5f7f6] bg-opacity-95 p-4 sm:p-6 rounded-lg shadow-md">
      {feedback && (
        <p className="whitespace-pre-line mb-4 text-lg font-medium text-[#2c3e50]">{feedback}</p>
      )}
      
      {showInputs && !feedback && (
        <div className="flex flex-row items-start justify-between gap-8">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-4 text-[#2c3e50]">What's your hand value?</h3>
            <div className="w-24 h-12 border-2 border-[#34495e] rounded flex items-center justify-center 
                          text-lg font-medium bg-white shadow-inner">
              {userGuess || '0'}
            </div>
          </div>
          
          <div className="flex-none">
            <div className="grid grid-cols-3 gap-2 w-[200px]">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <button
                  key={num}
                  onClick={() => handleNumberClick(num)}
                  className="w-14 h-14 bg-white bg-opacity-80 rounded-lg hover:bg-[#e8f5e9] 
                           text-[#2c3e50] text-lg font-medium shadow-sm
                           active:bg-[#c8e6c9] transition-colors"
                >
                  {num}
                </button>
              ))}
              <button
                onClick={() => handleNumberClick('backspace')}
                className="w-14 h-14 bg-[#eceff1] bg-opacity-90 rounded-lg hover:bg-[#cfd8dc] 
                         text-[#2c3e50] text-lg font-medium shadow-sm
                         active:bg-[#b0bec5] transition-colors"
              >
                ←
              </button>
              <button
                onClick={() => handleNumberClick(0)}
                className="w-14 h-14 bg-white bg-opacity-80 rounded-lg hover:bg-[#e8f5e9] 
                         text-[#2c3e50] text-lg font-medium shadow-sm
                         active:bg-[#c8e6c9] transition-colors"
              >
                0
              </button>
              <button
                onClick={onCheck}
                className="w-14 h-14 bg-[#4caf50] bg-opacity-90 rounded-lg hover:bg-[#43a047] 
                         text-white text-lg font-medium shadow-sm
                         active:bg-[#388e3c] transition-colors"
              >
                ✓
              </button>
            </div>
          </div>
        </div>
      )}

      {gameState === 'playing' && feedback && (
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="flex-1 flex flex-col sm:flex-row gap-4">
            {onHit && (
              <button
                onClick={onHit}
                className="px-4 py-2 bg-[#81c784] text-[#1b5e20] rounded hover:bg-[#66bb6a] 
                         transition-colors text-lg font-medium flex-1 shadow-sm"
              >
                Hit
              </button>
            )}
            {onStay && (
              <button
                onClick={onStay}
                className="px-4 py-2 bg-[#90caf9] text-[#0d47a1] rounded hover:bg-[#64b5f6] 
                         transition-colors text-lg font-medium flex-1 shadow-sm"
              >
                Stay
              </button>
            )}
            {canSplit && onSplit && (
              <button
                onClick={onSplit}
                className="px-4 py-2 bg-[#b39ddb] text-[#4527a0] rounded hover:bg-[#9575cd] 
                         transition-colors text-lg font-medium flex-1 shadow-sm"
              >
                Split
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}