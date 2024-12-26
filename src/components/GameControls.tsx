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
      if (parseInt(newValue) <= 30) { // Prevent unreasonable values
        onGuessChange(newValue);
      }
    }
  };

  const showInputs = gameState === 'playing';

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
      {feedback && (
        <p className="whitespace-pre-line mb-4 text-lg font-medium">{feedback}</p>
      )}
      
      {showInputs && !feedback && (
        <div>
          <h3 className="text-lg font-semibold mb-4">What's your hand value?</h3>
          <div className="flex flex-col items-center gap-4">
            <div className="w-24 h-12 border rounded flex items-center justify-center text-lg font-medium bg-gray-50">
              {userGuess || '0'}
            </div>
            <div className="grid grid-cols-3 gap-2 w-full max-w-xs">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <button
                  key={num}
                  onClick={() => handleNumberClick(num)}
                  className="p-4 bg-gray-100 rounded hover:bg-gray-200 text-lg font-medium"
                >
                  {num}
                </button>
              ))}
              <button
                onClick={() => handleNumberClick('backspace')}
                className="p-4 bg-gray-200 rounded hover:bg-gray-300 text-lg font-medium"
              >
                ←
              </button>
              <button
                onClick={() => handleNumberClick(0)}
                className="p-4 bg-gray-100 rounded hover:bg-gray-200 text-lg font-medium"
              >
                0
              </button>
              <button
                onClick={onCheck}
                className="p-4 bg-blue-500 text-white rounded hover:bg-blue-600 text-lg font-medium"
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
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 
                         transition-colors text-lg font-medium flex-1"
              >
                Hit
              </button>
            )}
            {onStay && (
              <button
                onClick={onStay}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 
                         transition-colors text-lg font-medium flex-1"
              >
                Stay
              </button>
            )}
            {canSplit && onSplit && (
              <button
                onClick={onSplit}
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 
                         transition-colors text-lg font-medium flex-1"
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