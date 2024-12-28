import React from 'react';
import { Card } from './Card';
import type { Card as CardType } from '../utils/blackjack';
import type { GameState } from '../utils/blackjack';

interface GameTableProps {
  playerCards: CardType[];
  dealerCards: CardType[];
  showAllDealerCards: boolean;
  gameState: GameState;
  splitHands?: CardType[][];
  currentHandIndex?: number;
}

export function GameTable({ 
  playerCards, 
  dealerCards, 
  showAllDealerCards, 
  gameState,
  splitHands = [],
  currentHandIndex = 0 
}: GameTableProps) {
  return (
    <div className="space-y-2">
      <div className="mb-2">
        <h2 className="text-lg font-semibold text-white mb-1">Dealer's Cards</h2>
        <div className="flex items-center min-h-[72px]">
          {gameState !== 'initial' ? (
            <>
              <Card card={dealerCards[0]} />
              {showAllDealerCards ? (
                dealerCards.slice(1).map((card, index) => (
                  <Card key={index + 1} card={card} />
                ))
              ) : (
                <div className="w-12 h-18 bg-red-900 rounded-lg shadow-md m-0.5 border-2 border-white/30 relative">
                  <div className="absolute inset-2 border-2 border-white/20 rounded-sm"></div>
                  <div className="absolute inset-4 bg-white/10 rounded-sm transform rotate-45"></div>
                </div>
              )}
            </>
          ) : (
            <div className="text-white">Start game to deal cards</div>
          )}
        </div>
      </div>

      <div>
        {splitHands.length > 0 ? (
          <>
            {splitHands.map((hand, index) => (
              <div key={index} className="mb-2">
                <h2 className="text-lg font-semibold text-white mb-1">
                  Hand {index + 1} {index === currentHandIndex && '(Active)'}
                </h2>
                <div className="flex items-center min-h-[72px]">
                  {hand.map((card, cardIndex) => (
                    <Card key={cardIndex} card={card} />
                  ))}
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold text-white mb-1">Your Cards</h2>
            <div className="flex items-center min-h-[72px]">
              {playerCards.map((card, index) => (
                <Card key={index} card={card} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}