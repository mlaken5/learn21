import React from 'react';
import type { Card as CardType } from '../utils/blackjack';

interface CardProps {
  card: CardType;
}

export function Card({ card }: CardProps) {
  const isRed = card.suit === '♥' || card.suit === '♦';
  
  return (
    <div className="w-12 h-18 bg-white rounded-lg shadow-md m-0.5 flex flex-col items-center justify-center border border-gray-200">
      <span className={`text-lg font-bold ${isRed ? 'text-red-600' : 'text-gray-900'}`}>
        {card.rank}
      </span>
      <span className={isRed ? 'text-red-600' : 'text-gray-900'}>
        {card.suit}
      </span>
    </div>
  );
}