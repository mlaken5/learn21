import React, { useState, useEffect } from 'react';

export function WelcomeModal() {
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      setShowWelcome(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('hasSeenWelcome', 'true');
    setShowWelcome(false);
  };

  if (!showWelcome) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md mx-4">
        <h2 className="text-2xl font-bold mb-4">Welcome to Learn 21!</h2>
        <div className="space-y-4">
          <p>This game helps you practice calculating blackjack hand values.</p>
          <p>For each hand, you must enter the total value before you can hit, stay, or double.</p>
          <p>Remember:</p>
          <ul className="list-disc pl-5">
            <li>Face cards (J, Q, K) are worth 10</li>
            <li>Aces can be worth 1 or 11</li>
            <li>You can split pairs into two hands</li>
          </ul>
        </div>
        <button
          onClick={handleClose}
          className="w-full mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                   transition-colors font-bold"
        >
          Let's Play!
        </button>
      </div>
    </div>
  );
} 