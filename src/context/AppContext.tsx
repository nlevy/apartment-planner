import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppState, PriceConfig, InitialFunds, Transaction } from '../types';

interface AppContextType {
  state: AppState;
  updatePriceConfig: (config: Partial<PriceConfig>) => void;
  updateInitialFunds: (funds: InitialFunds) => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  loadState: (newState: AppState) => void;
  resetState: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const getInitialState = (): AppState => {
  const saved = localStorage.getItem('apate2-state');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        transactions: parsed.transactions.map((t: any) => ({
          ...t,
          date: new Date(t.date),
          installments: t.installments?.map((inst: any) => ({
            ...inst,
            date: new Date(inst.date)
          }))
        }))
      };
    } catch (e) {
      console.error('Failed to parse saved state:', e);
    }
  }

  return {
    priceConfig: {
      buyPrice: null,
      sellPrice: null
    },
    initialFunds: {
      'cash': 0,
      'stocks': 0,
      'other': 0
    },
    transactions: []
  };
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, setState] = useState<AppState>(getInitialState);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const toSave = {
        ...state,
        transactions: state.transactions.map(t => ({
          ...t,
          date: t.date.toISOString(),
          installments: t.installments?.map(inst => ({
            ...inst,
            date: inst.date.toISOString()
          }))
        }))
      };
      localStorage.setItem('apate2-state', JSON.stringify(toSave));
    }, 500);

    return () => clearTimeout(timeout);
  }, [state]);

  const updatePriceConfig = (config: Partial<PriceConfig>) => {
    setState(prev => ({
      ...prev,
      priceConfig: {
        ...prev.priceConfig,
        ...config
      }
    }));
  };

  const updateInitialFunds = (funds: InitialFunds) => {
    setState(prev => ({
      ...prev,
      initialFunds: funds
    }));
  };

  const addTransaction = (transaction: Transaction) => {
    setState(prev => ({
      ...prev,
      transactions: [...prev.transactions, transaction]
    }));
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setState(prev => ({
      ...prev,
      transactions: prev.transactions.map(t =>
        t.id === id ? { ...t, ...updates } : t
      )
    }));
  };

  const deleteTransaction = (id: string) => {
    setState(prev => ({
      ...prev,
      transactions: prev.transactions.filter(t => t.id !== id)
    }));
  };

  const loadState = (newState: AppState) => {
    setState(newState);
  };

  const resetState = () => {
    localStorage.removeItem('apate2-state');
    setState(getInitialState());
  };

  const value: AppContextType = {
    state,
    updatePriceConfig,
    updateInitialFunds,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    loadState,
    resetState
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
