import { AppState, Transaction, Checkpoint } from '../types';

const STORAGE_KEY = 'apate2-state';
const STORAGE_VERSION = '1.0';

interface SerializedState {
  version: string;
  timestamp: string;
  priceConfig: {
    buyPrice: number | null;
    sellPrice: number | null;
  };
  initialFunds: {
    [key: string]: number;
  };
  transactions: Array<Omit<Transaction, 'date'> & { date: string }>;
  checkpoint?: {
    date: string;
    balance: number;
  };
}

export function saveToLocalStorage(state: AppState): void {
  try {
    const serialized: SerializedState = {
      version: STORAGE_VERSION,
      timestamp: new Date().toISOString(),
      priceConfig: state.priceConfig,
      initialFunds: state.initialFunds,
      transactions: state.transactions.map(t => ({
        ...t,
        date: t.date.toISOString()
      }))
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

export function loadFromLocalStorage(): AppState | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return null;
    }

    const parsed: SerializedState = JSON.parse(saved);

    return {
      priceConfig: parsed.priceConfig,
      initialFunds: parsed.initialFunds,
      transactions: parsed.transactions.map(t => ({
        ...t,
        date: new Date(t.date)
      }))
    };
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return null;
  }
}

export function clearLocalStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
}

export function exportToJSON(state: AppState): string {
  const serialized: SerializedState = {
    version: STORAGE_VERSION,
    timestamp: new Date().toISOString(),
    priceConfig: state.priceConfig,
    initialFunds: state.initialFunds,
    transactions: state.transactions.map(t => ({
      ...t,
      date: t.date.toISOString(),
      installments: t.installments?.map(inst => ({
        ...inst,
        date: inst.date.toISOString()
      }))
    })),
    checkpoint: state.checkpoint ? {
      date: state.checkpoint.date.toISOString(),
      balance: state.checkpoint.balance
    } : undefined
  };
  return JSON.stringify(serialized, null, 2);
}

export function importFromJSON(json: string): AppState {
  try {
    const parsed: SerializedState = JSON.parse(json);

    return {
      priceConfig: parsed.priceConfig,
      initialFunds: parsed.initialFunds,
      transactions: parsed.transactions.map((t: any) => ({
        ...t,
        date: new Date(t.date),
        installments: t.installments?.map((inst: any) => ({
          ...inst,
          date: new Date(inst.date)
        }))
      })),
      checkpoint: parsed.checkpoint ? {
        date: new Date(parsed.checkpoint.date),
        balance: parsed.checkpoint.balance
      } : undefined
    };
  } catch (error) {
    throw new Error('Invalid JSON format');
  }
}

export function downloadJSON(state: AppState, filename = 'apartment-plan.json'): void {
  const json = exportToJSON(state);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
