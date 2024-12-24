export type Card = {
  rank: string;
  suit: string;
};

export type GameState = 'initial' | 'playing' | 'playerBust' | 'dealerTurn' | 'complete';

export const calculateHandValue = (cards: Card[]): { total: number; explanation: string } => {
  let value = 0;
  let aces = 0;
  const calculations: string[] = [];

  // First count non-aces
  cards.forEach(card => {
    if (card.rank === 'A') {
      aces += 1;
    } else if (['K', 'Q', 'J'].includes(card.rank)) {
      value += 10;
      calculations.push(`${card.rank} (10)`);
    } else {
      value += parseInt(card.rank);
      calculations.push(card.rank);
    }
  });

  // Then add aces optimally
  for (let i = 0; i < aces; i++) {
    if (value + 11 <= 21) {
      value += 11;
      calculations.push('A (11)');
    } else {
      value += 1;
      calculations.push('A (1)');
    }
  }

  return {
    total: value,
    explanation: `${calculations.join(' + ')}${aces > 0 ? '\nAces can be worth 1 or 11' : ''}`
  };
};

export const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
export const SUITS = ['♠', '♥', '♦', '♣'];

export const checkForBlackjack = (cards: Card[]): boolean => {
  if (cards.length !== 2) return false;
  const { total } = calculateHandValue(cards);
  return total === 21;
};

export const checkForDealerAce = (cards: Card[]): boolean => {
  return cards[0].rank === 'A';
};

export const checkForDealerTenCard = (card: Card): boolean => {
  return ['10', 'J', 'Q', 'K'].includes(card.rank);
};

export const determineWinner = (playerTotal: number, dealerTotal: number): string => {
  if (playerTotal > 21) return 'Dealer wins - Player bust!';
  if (dealerTotal > 21) return 'Player wins - Dealer bust!';
  if (playerTotal > dealerTotal) return 'Player wins!';
  if (dealerTotal > playerTotal) return 'Dealer wins!';
  return 'Push - It\'s a tie!';
};