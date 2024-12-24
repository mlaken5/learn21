import React from 'react';

interface BlackjackAlertProps {
  message: string;
  onClose: () => void;
}

export function BlackjackAlert({ message, onClose }: BlackjackAlertProps) {
  // Split the message into parts
  const parts = message.split('\n\n');
  const dealerInfo = parts[0].replace(/[♠♥♦♣]/g, '').trim();
  const playerInfo = parts[1]?.replace(/[♠♥♦♣]/g, '').trim();
  const result = parts[2];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="space-y-4 mb-6">
          <p className="text-base text-gray-700">
            {dealerInfo}
          </p>
          <p className="text-base text-red-600 font-medium">
            {playerInfo}
          </p>
          <h2 className="text-2xl font-bold text-center text-gray-900">
            {result}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                   transition-colors font-bold"
        >
          Continue
        </button>
      </div>
    </div>
  );
}