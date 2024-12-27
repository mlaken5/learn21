import React, { useState, useEffect } from 'react';

export function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white p-4 rounded-lg shadow-xl z-40">
      <p className="text-sm mb-2">Add Learn21 to your home screen for offline access!</p>
      <div className="flex justify-end gap-2">
        <button 
          onClick={() => setShowPrompt(false)}
          className="px-3 py-1 text-gray-600"
        >
          Later
        </button>
        <button 
          onClick={handleInstall}
          className="px-3 py-1 bg-blue-600 text-white rounded"
        >
          Install
        </button>
      </div>
    </div>
  );
} 