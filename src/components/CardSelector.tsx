import React, { useState } from 'react';
import { RANKS, SUITS } from '../utils/blackjack';

interface CardSelectorProps {
  onSelect: (rank: string, suit: string) => void;
}

export function CardSelector({ onSelect }: CardSelectorProps) {
  const [selectedRank, setSelectedRank] = useState<string | null>(null);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      {!selectedRank ? (
        <div>
          <h3 className="text-lg font-semibold mb-2">Select Rank</h3>
          <div className="flex flex-wrap gap-2">
            {RANKS.map((rank) => (
              <button
                key={rank}
                onClick={() => setSelectedRank(rank)}
                className="px-3 py-2 bg-blue-100 hover:bg-blue-200 rounded-md transition-colors"
              >
                {rank}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <h3 className="text-lg font-semibold mb-2">Select Suit for {selectedRank}</h3>
          <div className="flex flex-wrap gap-2">
            {SUITS.map((suit) => (
              <button
                key={suit}
                onClick={() => {
                  onSelect(selectedRank, suit);
                  setSelectedRank(null);
                }}
                className={`px-3 py-2 rounded-md transition-colors ${
                  suit === '♥' || suit === '♦'
                    ? 'bg-red-100 hover:bg-red-200 text-red-600'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {suit}
              </button>
            ))}
          </div>
          <button
            onClick={() => setSelectedRank(null)}
            className="mt-2 text-sm text-gray-600 hover:text-gray-800"
          >
            ← Back to ranks
          </button>
        </div>
      )}
    </div>
  );
}