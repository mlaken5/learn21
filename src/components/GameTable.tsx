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
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Dealer's Cards</h2>
        <div className="flex items-center">
          {gameState !== 'initial' ? (
            <>
              <Card card={dealerCards[0]} />
              {showAllDealerCards ? (
                dealerCards.slice(1).map((card, index) => (
                  <Card key={index + 1} card={card} />
                ))
              ) : (
                <div className="w-16 h-24 bg-red-900 rounded-lg shadow-md m-1" />
              )}
            </>
          ) : (
            <div className="text-white">Start game to deal cards</div>
          )}
        </div>
      </div>

      <div className="mb-8">
        {splitHands.length > 0 ? (
          <>
            {splitHands.map((hand, index) => (
              <div key={index} className="mb-4">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Hand {index + 1} {index === currentHandIndex && '(Active)'}
                </h2>
                <div className="flex items-center">
                  {hand.map((card, cardIndex) => (
                    <Card key={cardIndex} card={card} />
                  ))}
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-white mb-4">Your Cards</h2>
            <div className="flex items-center">
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