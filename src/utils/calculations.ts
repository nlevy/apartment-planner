import { InitialFunds, Transaction, TimelineEntry, PriceConfig, Checkpoint } from '../types';

export function calculateTotalInitialFunds(funds: InitialFunds): number {
  return Object.values(funds).reduce((sum, value) => sum + value, 0);
}

export function calculateTransactionAmount(
  transaction: Transaction,
  priceConfig: PriceConfig
): number {
  if (transaction.amountType === 'fixed') {
    return transaction.amount;
  }

  const basePrice = transaction.percentageBase === 'buy'
    ? priceConfig.buyPrice
    : priceConfig.sellPrice;

  if (basePrice === null || basePrice === 0) {
    return 0;
  }

  return (basePrice * transaction.amount) / 100;
}

export function sortTransactionsByDate(transactions: Transaction[]): Transaction[] {
  return [...transactions].sort((a, b) => a.date.getTime() - b.date.getTime());
}

interface TimelineTranslations {
  initialBalance: string;
  income: string;
  payment: string;
}

interface TimelineTranslationsExtended extends TimelineTranslations {
  checkpoint?: string;
}

export function generateTimeline(
  initialFunds: InitialFunds,
  transactions: Transaction[],
  priceConfig: PriceConfig,
  translations?: TimelineTranslationsExtended,
  checkpoint?: Checkpoint
): TimelineEntry[] {
  const t = translations || {
    initialBalance: 'יתרה התחלתית',
    income: 'הכנסה',
    payment: 'תשלום',
    checkpoint: 'נקודת ביקורת'
  };
  const entries: TimelineEntry[] = [];

  const totalInitial = calculateTotalInitialFunds(initialFunds);
  let balance = totalInitial;

  // Expand installment transactions into individual entries
  const expandedEntries: Array<{
    date: Date;
    description: string;
    category?: string;
    amount: number;
  }> = [];

  for (const transaction of transactions) {
    const totalAmount = calculateTransactionAmount(transaction, priceConfig);

    if (transaction.isInstallment && transaction.installments && transaction.installments.length > 0) {
      // Create entries for each installment
      for (const installment of transaction.installments) {
        const installmentAmount = (totalAmount * installment.percentage) / 100;
        const signedAmount = transaction.type === 'income' ? installmentAmount : -installmentAmount;

        expandedEntries.push({
          date: installment.date,
          description: `${transaction.description || (transaction.type === 'income' ? t.income : t.payment)} (${installment.percentage}%)`,
          category: transaction.category,
          amount: signedAmount
        });
      }
    } else {
      // Regular transaction
      const signedAmount = transaction.type === 'income' ? totalAmount : -totalAmount;

      expandedEntries.push({
        date: transaction.date,
        description: transaction.description || (transaction.type === 'income' ? t.income : t.payment),
        category: transaction.category,
        amount: signedAmount
      });
    }
  }

  if (expandedEntries.length === 0) {
    entries.push({
      date: new Date(),
      description: t.initialBalance,
      amount: totalInitial,
      runningBalance: balance,
      isArchived: checkpoint ? new Date().getTime() < checkpoint.date.getTime() : false
    });
    return entries;
  }

  // Sort all expanded entries by date
  const sorted = expandedEntries.sort((a, b) => a.date.getTime() - b.date.getTime());
  const firstDate = sorted[0]?.date || new Date();

  const initialEntry = {
    date: new Date(firstDate.getTime() - 1),
    description: t.initialBalance,
    amount: totalInitial,
    runningBalance: balance,
    isArchived: checkpoint ? new Date(firstDate.getTime() - 1).getTime() < checkpoint.date.getTime() : false
  };
  entries.push(initialEntry);

  let checkpointInserted = false;

  for (let i = 0; i < sorted.length; i++) {
    const entry = sorted[i];

    // Check if we should insert checkpoint before this entry
    if (checkpoint && !checkpointInserted && entry.date.getTime() >= checkpoint.date.getTime()) {
      // Insert checkpoint entry
      entries.push({
        date: checkpoint.date,
        description: t.checkpoint || 'נקודת ביקורת',
        amount: checkpoint.balance - balance,
        runningBalance: checkpoint.balance,
        isCheckpoint: true
      });
      balance = checkpoint.balance;
      checkpointInserted = true;
    }

    balance += entry.amount;

    const isBeforeCheckpoint = checkpoint && !checkpointInserted;

    entries.push({
      date: entry.date,
      description: entry.description,
      category: entry.category,
      amount: entry.amount,
      runningBalance: balance,
      isArchived: isBeforeCheckpoint
    });
  }

  // If checkpoint is after all transactions, insert it at the end
  if (checkpoint && !checkpointInserted) {
    entries.push({
      date: checkpoint.date,
      description: t.checkpoint || 'נקודת ביקורת',
      amount: checkpoint.balance - balance,
      runningBalance: checkpoint.balance,
      isCheckpoint: true
    });
  }

  return entries;
}

export function calculateSummaryStats(
  initialFunds: InitialFunds,
  transactions: Transaction[],
  priceConfig: PriceConfig
) {
  const totalInitial = calculateTotalInitialFunds(initialFunds);

  let totalIncome = 0;
  let totalPayments = 0;

  for (const transaction of transactions) {
    const amount = calculateTransactionAmount(transaction, priceConfig);
    if (transaction.type === 'income') {
      totalIncome += amount;
    } else {
      totalPayments += amount;
    }
  }

  const finalBalance = totalInitial + totalIncome - totalPayments;

  return {
    totalInitial,
    totalIncome,
    totalPayments,
    finalBalance
  };
}
