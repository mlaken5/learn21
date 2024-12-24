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
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onCheck();
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
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <input
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              value={userGuess}
              onChange={(e) => onGuessChange(e.target.value)}
              onKeyPress={handleKeyPress}
              className="px-4 py-2 border rounded w-full sm:w-24 text-lg"
              placeholder="Value"
            />
            <button
              onClick={onCheck}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 
                       transition-colors text-lg font-medium"
            >
              Check
            </button>
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