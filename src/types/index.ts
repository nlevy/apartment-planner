export type AmountType = 'fixed' | 'percentage';
export type TransactionType = 'income' | 'payment';
export type PercentageBase = 'buy' | 'sell';

export interface PriceConfig {
  buyPrice: number | null;
  sellPrice: number | null;
}

export interface InitialFunds {
  [category: string]: number;
}

export interface Installment {
  id: string;
  date: Date;
  percentage: number;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  date: Date;
  amountType: AmountType;
  amount: number;
  percentageBase?: PercentageBase;
  description?: string;
  category?: string;
  isInstallment?: boolean;
  installments?: Installment[];
}

export interface TimelineEntry {
  date: Date;
  description: string;
  amount: number;
  category?: string;
  runningBalance: number;
}

export interface AppState {
  priceConfig: PriceConfig;
  initialFunds: InitialFunds;
  transactions: Transaction[];
}
