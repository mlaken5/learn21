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
import { WelcomeModal } from './components/WelcomeModal';
import { InstallPrompt } from './components/InstallPrompt';

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
  const currentHandTotal = calculateHandValue(playerCards).total;
  const [sessionScore, setSessionScore] = useState(0);
  const [isDoubled, setIsDoubled] = useState(false);

  const canHitMore = gameState === 'playing' && feedback && 
    (splitHands.length > 0 ? splitHands[currentHandIndex].length < 5 : playerCards.length < 5);
  const canStay = gameState === 'playing' && feedback;
  const canSplit = gameState === 'playing' && playerCards.length === 2 && 
    playerCards[0].rank === playerCards[1].rank && splitHands.length === 0;
  const canDouble = gameState === 'playing' && feedback && 
    (playerCards.length === 2 || (splitHands.length > 0 && splitHands[currentHandIndex].length === 2));

  const formatHandSummary = (cards: Card[], total: number, label: string) => {
    const cardStr = cards.map(c => `${c.rank}${c.suit}`).join(', ');
    return `${label}: ${cardStr} (${total})`;
  };

  const startNewGame = () => {
    if (gameState === 'initial') {
      setSessionScore(0);
    }
    
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
        handleGameResult('Blackjack! Player wins', 1);
      }
      setGameState('complete');
    } else if (dealerShowsAce && dealerHasTenCard) {
      setShowAllDealerCards(true);
      setAlert(`${dealerSummary}\n${playerSummary}\n\nDealer Blackjack!`);
      handleGameResult('Dealer wins', 1);
      setGameState('complete');
    }
  };

  const checkAnswer = () => {
    const { total, altTotal, explanation } = calculateHandValue(playerCards);
    const guessedValue = parseInt(userGuess);

    if (isNaN(guessedValue)) {
      setFeedback('Please enter a valid number');
      return;
    }

    if (guessedValue === total || (altTotal && guessedValue === altTotal)) {
      setFeedback(`Correct! ${explanation}`);
      if (total === 21 || (altTotal && altTotal === 21)) {
        stay();
      }
    } else {
      setFeedback(`Incorrect. The hand can be worth ${total}${altTotal ? ` or ${altTotal}` : ''}\n${explanation}`);
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
    
    if (splitHands.length > 0) {
      // Handle split hands
      const newSplitHands = [...splitHands];
      newSplitHands[currentHandIndex] = [...newSplitHands[currentHandIndex], newCard];
      setSplitHands(newSplitHands);
      setPlayerCards(newSplitHands[currentHandIndex]);
      setDeck(newDeck);
      
      const { total: playerTotal } = calculateHandValue(newSplitHands[currentHandIndex]);
      setUserGuess('');
      setFeedback('');

      if (playerTotal > 21) {
        if (currentHandIndex < splitHands.length - 1) {
          setCurrentHandIndex(currentHandIndex + 1);
          setPlayerCards(splitHands[currentHandIndex + 1]);
          setUserGuess('');
          setFeedback('');
        } else {
          finishSplitHands(newSplitHands);
        }
      }
    } else {
      // Regular hand - Remove the setIsDoubled line as it shouldn't be here
      const newPlayerCards = [...playerCards, newCard];
      setPlayerCards(newPlayerCards);
      setDeck(newDeck);
      
      // Reset user input to force new hand value entry
      setUserGuess('');
      setFeedback('');
      
      // Only check for bust, don't show the total
      const { total: playerTotal } = calculateHandValue(newPlayerCards);
      if (playerTotal > 21) {
        setGameState('playerBust');
        setShowAllDealerCards(true);
        const dealerTotal = calculateHandValue(dealerCards).total;
        const result = determineWinner(playerTotal, dealerTotal);
        handleGameResult(result, isDoubled ? 2 : 1);
        setAlert(`${formatHandSummary(dealerCards, dealerTotal, 'Dealer')}\n${formatHandSummary(newPlayerCards, playerTotal, 'Player')}\n\n${result}`);
      }
    }
  };

  const handleDouble = () => {
    if (!canDouble || deck.length === 0) return;
    
    const newCard = deck[0];
    const newDeck = deck.slice(1);
    
    if (splitHands.length > 0) {
      // Handle doubling on split hand
      const newSplitHands = [...splitHands];
      newSplitHands[currentHandIndex] = [...newSplitHands[currentHandIndex], newCard];
      setSplitHands(newSplitHands);
      setPlayerCards(newSplitHands[currentHandIndex]);
      setDeck(newDeck);
      setIsDoubled(true);
      
      const { total: playerTotal } = calculateHandValue(newSplitHands[currentHandIndex]);
      setUserGuess('');
      setFeedback(`Hand value is ${playerTotal}`);
      
      if (currentHandIndex < splitHands.length - 1) {
        // Move to next split hand
        setCurrentHandIndex(currentHandIndex + 1);
        setPlayerCards(splitHands[currentHandIndex + 1]);
        setUserGuess('');
        setFeedback('');
      } else {
        // All hands complete, show dealer's hand
        finishSplitHands(newSplitHands);
      }
    } else {
      // Regular hand doubling (existing code)
      const newPlayerCards = [...playerCards, newCard];
      setPlayerCards(newPlayerCards);
      setDeck(newDeck);
      setIsDoubled(true);
      
      const { total: playerTotal } = calculateHandValue(newPlayerCards);
      setUserGuess('');
      setFeedback(`Hand value is ${playerTotal}`);
      
      if (playerTotal > 21) {
        setGameState('playerBust');
        setShowAllDealerCards(true);
        const dealerTotal = calculateHandValue(dealerCards).total;
        const result = determineWinner(playerTotal, dealerTotal);
        handleGameResult(result, 2);
        setAlert(`${formatHandSummary(dealerCards, dealerTotal, 'Dealer')}\n${formatHandSummary(newPlayerCards, playerTotal, 'Player')}\n\n${result}`);
      } else {
        stay(true, newPlayerCards);
      }
    }
  };

  const finishSplitHands = (finalSplitHands: Card[][]) => {
    setGameState('dealerTurn');
    setShowAllDealerCards(true);
    let currentDealerCards = [...dealerCards];
    let currentDeck = [...deck];
    
    // Always play dealer hand if any split hand exists
    while (calculateHandValue(currentDealerCards).total < 17 && currentDeck.length > 0) {
      currentDealerCards.push(currentDeck[0]);
      currentDeck = currentDeck.slice(1);
    }

    setDealerCards(currentDealerCards);
    setDeck(currentDeck);

    const dealerTotal = calculateHandValue(currentDealerCards).total;
    const dealerSummary = formatHandSummary(currentDealerCards, dealerTotal, 'Dealer');
    
    // Process all split hands and show all results
    const results = finalSplitHands.map((hand, index) => {
      const handTotal = calculateHandValue(hand).total;
      const handSummary = formatHandSummary(hand, handTotal, `Hand ${index + 1}`);
      const result = determineWinner(handTotal, dealerTotal);
      const wasDoubled = hand.length === 3 && isDoubled && index === currentHandIndex;
      const points = wasDoubled ? 2 : 1;
      handleGameResult(result, points);
      return `${handSummary} - ${result}`;
    });

    setAlert(`${dealerSummary}\n\n${results.join('\n')}`);
    setGameState('complete');
    setIsDoubled(false);
  };

  const stay = (doubled: boolean = false, doubledCards?: Card[]) => {
    const currentPlayerCards = doubledCards || playerCards;
    
    if (splitHands.length > 0) {
      if (currentHandIndex < splitHands.length - 1) {
        // Update the current hand in splitHands before moving to next
        const newSplitHands = [...splitHands];
        newSplitHands[currentHandIndex] = currentPlayerCards;
        setSplitHands(newSplitHands);
        
        // Move to next split hand
        setCurrentHandIndex(currentHandIndex + 1);
        setPlayerCards(splitHands[currentHandIndex + 1]);
        setUserGuess('');
        setFeedback('');
        return;
      } else {
        // Last hand complete, finish the game
        const finalSplitHands = [...splitHands];
        finalSplitHands[currentHandIndex] = currentPlayerCards;
        finishSplitHands(finalSplitHands);
        return;
      }
    }

    // Regular hand logic...
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
    const playerTotal = calculateHandValue(currentPlayerCards).total;
    
    const dealerSummary = formatHandSummary(currentDealerCards, dealerTotal, 'Dealer');
    const playerSummary = formatHandSummary(currentPlayerCards, playerTotal, 'Player');
    const result = determineWinner(playerTotal, dealerTotal);
    
    const points = doubled ? 2 : 1;
    handleGameResult(result, points);
    setAlert(`${dealerSummary}\n${playerSummary}\n\n${result}`);
    
    setGameState('complete');
    setIsDoubled(false);
  };

  const handleGameResult = (result: string, points: number) => {
    if (result.toLowerCase().includes('player wins')) {
      setSessionScore(prev => prev + points);
    } else if (result.toLowerCase().includes('dealer wins')) {
      setSessionScore(prev => prev - points);
    }
    // Push (tie) doesn't affect score
  };

  return (
    <div className="min-h-screen bg-[#1b4332] p-2">
      <WelcomeModal />
      <InstallPrompt />
      <div className="max-w-md mx-auto bg-[#2d6a4f] rounded-xl p-3 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <GameHeader onNewHand={startNewGame} gameState={gameState} />
          </div>
          <div className="flex items-center gap-2">
            <div className="text-white text-sm font-medium">Score:</div>
            <div className="w-20 h-10 border-2 border-white rounded flex items-center justify-center 
                          text-lg font-medium bg-white/20 text-white shadow-inner">
              {sessionScore}
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
          <GameTable
            playerCards={playerCards}
            dealerCards={dealerCards}
            showAllDealerCards={showAllDealerCards}
            gameState={gameState}
              splitHands={splitHands}
              currentHandIndex={currentHandIndex}
          />
          </div>

          {gameState !== 'initial' && (
            <div className="w-[180px] flex-none">
            <GameControls
              userGuess={userGuess}
              onGuessChange={setUserGuess}
              onCheck={checkAnswer}
              onHit={canHitMore ? hit : undefined}
              onStay={canStay ? stay : undefined}
                onSplit={canSplit ? handleSplit : undefined}
                onDouble={canDouble ? handleDouble : undefined}
              feedback={feedback}
              gameState={gameState}
                canSplit={canSplit as boolean}
                canDouble={canDouble as boolean}
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