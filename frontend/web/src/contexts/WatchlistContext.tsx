import React, { createContext, useContext, useState, useEffect } from 'react';

export interface WatchlistItem {
  id: string;
  symbol: string;
  name: string;
  currentPrice: number;
  dailyChange: number;
  dailyChangePercent: number;
  sentimentScore: number;
  type: 'stock' | 'crypto';
  addedAt: number;
}

interface WatchlistContextType {
  watchlist: WatchlistItem[];
  addToWatchlist: (item: Omit<WatchlistItem, 'id' | 'addedAt'>) => void;
  removeFromWatchlist: (symbol: string) => void;
  isInWatchlist: (symbol: string) => boolean;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export const WatchlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);

  // Initialize from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('neom-watchlist');
    if (stored) {
      try {
        setWatchlist(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse watchlist from localStorage:', e);
      }
    }
  }, []);

  // Persist to localStorage whenever watchlist changes
  useEffect(() => {
    localStorage.setItem('neom-watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const addToWatchlist = (item: Omit<WatchlistItem, 'id' | 'addedAt'>) => {
    // Check if already exists
    if (watchlist.some(w => w.symbol === item.symbol)) {
      return;
    }

    const newItem: WatchlistItem = {
      ...item,
      id: `${item.symbol}-${Date.now()}`,
      addedAt: Date.now(),
    };

    setWatchlist(prev => [...prev, newItem]);
  };

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist(prev => prev.filter(item => item.symbol !== symbol));
  };

  const isInWatchlist = (symbol: string) => {
    return watchlist.some(item => item.symbol === symbol);
  };

  return (
    <WatchlistContext.Provider value={{ watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (context === undefined) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};
