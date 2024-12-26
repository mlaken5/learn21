import React, { useState, useEffect } from 'react';
import { GameTable } from './components/GameTable';
import { GameControls } from './components/GameControls';
import { GameHeader } from './components/GameHeader';
import { BlackjackAlert } from './components/BlackjackAlert';
import { 
  calculateHandValue, 
  type Card, 
  type GameState, 
  determineWinner,
  checkForBlackjack,
  checkForDealerAce,
  checkForDealerTenCard
} from './utils/blackjack';
import { dealInitialHand } from './utils/deck';
import { Card as CardType } from './utils/blackjack';

export default function App() {
  const [playerCards, setPlayerCards] = useState<Card[]>([]);
  const [dealerCards, setDealerCards] = useState<Card[]>([]);
  const [deck, setDeck] = useState<Card[]>([]);
  const [userGuess, setUserGuess] = useState('');
  const [feedback, setFeedback] = useState('');
  const [gameState, setGameState] = useState<GameState>('initial');
  const [showAllDealerCards, setShowAllDealerCards] = useState(false);
  const [alert, setAlert] = useState<string | null>(null);
  const [splitHands, setSplitHands] = useState<CardType[][]>([]);
  const [currentHandIndex, setCurrentHandIndex] = useState(0);

  const canHitMore = gameState === 'playing' && feedback && 
    (splitHands.length > 0 ? splitHands[currentHandIndex].length < 5 : playerCards.length < 5);
  const canStay = gameState === 'playing' && feedback;
  const canSplit = gameState === 'playing' && playerCards.length === 2 && 
    playerCards[0].rank === playerCards[1].rank && splitHands.length === 0;

  const formatHandSummary = (cards: Card[], total: number, label: string) => {
    const cardStr = cards.map(c => `${c.rank}${c.suit}`).join(', ');
    return `${label}: ${cardStr} (${total})`;
  };

  const startNewGame = () => {
    const { playerCards: newPlayerCards, dealerCards: newDealerCards, deck: newDeck } = dealInitialHand();
    setPlayerCards(newPlayerCards);
    setDealerCards(newDealerCards);
    setDeck(newDeck);
    setUserGuess('');
    setFeedback('');
    setGameState('playing');
    setShowAllDealerCards(false);
    setSplitHands([]);
    setCurrentHandIndex(0);
    
    // Check for blackjack scenarios
    const playerHasBlackjack = checkForBlackjack(newPlayerCards);
    const dealerShowsAce = checkForDealerAce(newDealerCards);
    const dealerHasTenCard = checkForDealerTenCard(newDealerCards[1]);
    
    const playerTotal = calculateHandValue(newPlayerCards).total;
    const dealerTotal = calculateHandValue(newDealerCards).total;
    const playerSummary = formatHandSummary(newPlayerCards, playerTotal, 'Player');
    const dealerSummary = formatHandSummary(newDealerCards, dealerTotal, 'Dealer');
    
    if (playerHasBlackjack) {
      if (dealerShowsAce && dealerHasTenCard) {
        setShowAllDealerCards(true);
        setAlert(`${dealerSummary}\n${playerSummary}\n\nPush - Both have Blackjack!`);
      } else {
        setAlert(`${dealerSummary}\n${playerSummary}\n\nBlackjack! Player wins!`);
      }
      setGameState('complete');
    } else if (dealerShowsAce && dealerHasTenCard) {
      setShowAllDealerCards(true);
      setAlert(`${dealerSummary}\n${playerSummary}\n\nDealer Blackjack!`);
      setGameState('complete');
    }
  };

  const checkAnswer = () => {
    const { total: actualTotal, explanation } = calculateHandValue(playerCards);
    const guessedValue = parseInt(userGuess);

    if (isNaN(guessedValue)) {
      setFeedback('Please enter a valid number');
      return;
    }

    if (guessedValue === actualTotal) {
      setFeedback(`Correct! ${explanation}`);
      if (actualTotal === 21) {
        stay();
      }
    } else {
      setFeedback(`Incorrect. The correct value is ${actualTotal}\n${explanation}`);
    }
  };

  const handleSplit = () => {
    if (!canSplit) return;
    
    // Create two new hands
    const hand1 = [playerCards[0]];
    const hand2 = [playerCards[1]];
    
    // Deal one card to each hand
    const newDeck = [...deck];
    hand1.push(newDeck.shift()!);
    hand2.push(newDeck.shift()!);
    
    setSplitHands([hand1, hand2]);
    setCurrentHandIndex(0);
    setPlayerCards(hand1);
    setDeck(newDeck);
    setUserGuess('');
    setFeedback('');
  };

  const hit = () => {
    if (deck.length === 0) return;
    
    const newCard = deck[0];
    const newDeck = deck.slice(1);
    
    let newPlayerCards: Card[];
    if (splitHands.length > 0) {
      const newSplitHands = [...splitHands];
      newSplitHands[currentHandIndex] = [...newSplitHands[currentHandIndex], newCard];
      setSplitHands(newSplitHands);
      newPlayerCards = newSplitHands[currentHandIndex];
      setPlayerCards(newPlayerCards);
    } else {
      newPlayerCards = [...playerCards, newCard];
      setPlayerCards(newPlayerCards);
    }
    
    setDeck(newDeck);
    setUserGuess('');
    setFeedback('');

    const { total: playerTotal } = calculateHandValue(newPlayerCards);
    const dealerTotal = calculateHandValue(dealerCards).total;

    if (playerTotal > 21) {
      if (splitHands.length > 0 && currentHandIndex < splitHands.length - 1) {
        // Move to next split hand
        setCurrentHandIndex(currentHandIndex + 1);
        setPlayerCards(splitHands[currentHandIndex + 1]);
        setUserGuess('');
        setFeedback('');
      } else {
        setGameState('playerBust');
        setShowAllDealerCards(true);
        const playerSummary = formatHandSummary(newPlayerCards, playerTotal, 'Player');
        const dealerSummary = formatHandSummary(dealerCards, dealerTotal, 'Dealer');
        setAlert(`${dealerSummary}\n${playerSummary}\n\n${determineWinner(playerTotal, dealerTotal)}`);
      }
    } else if (playerTotal === 21) {
      stay();
    }
  };

  const stay = () => {
    if (splitHands.length > 0 && currentHandIndex < splitHands.length - 1) {
      // Move to next split hand
      setCurrentHandIndex(currentHandIndex + 1);
      setPlayerCards(splitHands[currentHandIndex + 1]);
      setUserGuess('');
      setFeedback('');
      return;
    }

    setGameState('dealerTurn');
    setShowAllDealerCards(true);
    let currentDealerCards = [...dealerCards];
    let currentDeck = [...deck];
    
    while (calculateHandValue(currentDealerCards).total < 17 && currentDeck.length > 0) {
      currentDealerCards.push(currentDeck[0]);
      currentDeck = currentDeck.slice(1);
    }

    setDealerCards(currentDealerCards);
    setDeck(currentDeck);

    const dealerTotal = calculateHandValue(currentDealerCards).total;
    const dealerSummary = formatHandSummary(currentDealerCards, dealerTotal, 'Dealer');
    
    if (splitHands.length > 0) {
      // Handle multiple hands
      const results = splitHands.map((hand, index) => {
        const handTotal = calculateHandValue(hand).total;
        const handSummary = formatHandSummary(hand, handTotal, `Hand ${index + 1}`);
        return `${handSummary}\n${determineWinner(handTotal, dealerTotal)}`;
      });
      setAlert(`${dealerSummary}\n\n${results.join('\n\n')}`);
    } else {
      const playerTotal = calculateHandValue(playerCards).total;
      const playerSummary = formatHandSummary(playerCards, playerTotal, 'Player');
      setAlert(`${dealerSummary}\n${playerSummary}\n\n${determineWinner(playerTotal, dealerTotal)}`);
    }
    
    setGameState('complete');
  };

  return (
    <div className="min-h-screen bg-[#1b4332] p-4 sm:p-8">
      <div className="max-w-4xl mx-auto bg-[#2d6a4f] rounded-xl p-4 sm:p-8 shadow-2xl">
        <GameHeader onNewHand={startNewGame} gameState={gameState} />
        
        <div className="relative">
          <GameTable
            playerCards={playerCards}
            dealerCards={dealerCards}
            showAllDealerCards={showAllDealerCards}
            gameState={gameState}
            splitHands={splitHands}
            currentHandIndex={currentHandIndex}
          />

          {gameState !== 'initial' && (
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
              <GameControls
                userGuess={userGuess}
                onGuessChange={setUserGuess}
                onCheck={checkAnswer}
                onHit={canHitMore ? hit : undefined}
                onStay={canStay ? stay : undefined}
                onSplit={canSplit ? handleSplit : undefined}
                feedback={feedback}
                gameState={gameState}
                canSplit={canSplit}
              />
            </div>
          )}
        </div>
      </div>

      {alert && (
        <BlackjackAlert 
          message={alert} 
          onClose={() => {
            setAlert(null);
            startNewGame();
          }} 
        />
      )}
    </div>
  );
}