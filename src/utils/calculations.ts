import { InitialFunds, Transaction, TimelineEntry, PriceConfig } from '../types';

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

export function generateTimeline(
  initialFunds: InitialFunds,
  transactions: Transaction[],
  priceConfig: PriceConfig
): TimelineEntry[] {
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
          description: `${transaction.description || (transaction.type === 'income' ? 'הכנסה' : 'תשלום')} (${installment.percentage}%)`,
          category: transaction.category,
          amount: signedAmount
        });
      }
    } else {
      // Regular transaction
      const signedAmount = transaction.type === 'income' ? totalAmount : -totalAmount;

      expandedEntries.push({
        date: transaction.date,
        description: transaction.description || (transaction.type === 'income' ? 'הכנסה' : 'תשלום'),
        category: transaction.category,
        amount: signedAmount
      });
    }
  }

  if (expandedEntries.length === 0) {
    entries.push({
      date: new Date(),
      description: 'יתרה התחלתית',
      amount: totalInitial,
      runningBalance: balance
    });
    return entries;
  }

  // Sort all expanded entries by date
  const sorted = expandedEntries.sort((a, b) => a.date.getTime() - b.date.getTime());
  const firstDate = sorted[0]?.date || new Date();

  entries.push({
    date: new Date(firstDate.getTime() - 1),
    description: 'יתרה התחלתית',
    amount: totalInitial,
    runningBalance: balance
  });

  for (const entry of sorted) {
    balance += entry.amount;

    entries.push({
      date: entry.date,
      description: entry.description,
      category: entry.category,
      amount: entry.amount,
      runningBalance: balance
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
