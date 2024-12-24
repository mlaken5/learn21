import { Card, RANKS, SUITS } from './blackjack';

export function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ rank, suit });
    }
  }
  return shuffleDeck(deck);
}

export function shuffleDeck(deck: Card[]): Card[] {
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
}

export function dealInitialHand(): {
  playerCards: Card[];
  dealerCards: Card[];
  deck: Card[];
} {
  const deck = createDeck();
  return {
    playerCards: [deck[1], deck[3]],
    dealerCards: [deck[0], deck[2]],
    deck: deck.slice(4)
  };
}