import * as XLSX from 'xlsx';
import { AppState, TimelineEntry } from '../types';
import { formatCurrency, formatDate, formatCurrencyWithSign } from './formatters';
import { calculateSummaryStats } from './calculations';

interface ExcelTranslations {
  appTitle: string;
  prices: string;
  buyPrice: string;
  sellPrice: string;
  notSet: string;
  initialBalance: string;
  totalInitial: string;
  summaryTitle: string;
  totalIncome: string;
  totalPayments: string;
  finalBalance: string;
  summary: string;
  timeline: string;
  transactions: string;
  date: string;
  event: string;
  category: string;
  amount: string;
  balance: string;
  type: string;
  description: string;
  amountType: string;
  percentageBase: string;
  income: string;
  payment: string;
  amountTypeFixed: string;
  amountTypePercentage: string;
}

export function exportToExcel(
  timeline: TimelineEntry[],
  state: AppState,
  translations: ExcelTranslations,
  filename = 'apartment-plan.xlsx'
): void {
  const workbook = XLSX.utils.book_new();

  const summarySheet = createSummarySheet(state, translations);
  XLSX.utils.book_append_sheet(workbook, summarySheet, translations.summary);

  const timelineSheet = createTimelineSheet(timeline, translations);
  XLSX.utils.book_append_sheet(workbook, timelineSheet, translations.timeline);

  const transactionsSheet = createTransactionsSheet(state, translations);
  XLSX.utils.book_append_sheet(workbook, transactionsSheet, translations.transactions);

  XLSX.writeFile(workbook, filename);
}

function createSummarySheet(state: AppState, translations: ExcelTranslations): XLSX.WorkSheet {
  const stats = calculateSummaryStats(
    state.initialFunds,
    state.transactions,
    state.priceConfig
  );

  const data: string[][] = [
    [translations.appTitle],
    [''],
    [translations.prices],
    [translations.buyPrice, state.priceConfig.buyPrice !== null ? formatCurrency(state.priceConfig.buyPrice) : translations.notSet],
    [translations.sellPrice, state.priceConfig.sellPrice !== null ? formatCurrency(state.priceConfig.sellPrice) : translations.notSet],
    [''],
    [translations.initialBalance],
  ];

  Object.entries(state.initialFunds).forEach(([category, amount]) => {
    data.push([category, formatCurrency(amount)]);
  });

  data.push(
    [translations.totalInitial, formatCurrency(stats.totalInitial)],
    [''],
    [translations.summaryTitle],
    [translations.totalIncome, formatCurrency(stats.totalIncome)],
    [translations.totalPayments, formatCurrency(stats.totalPayments)],
    [translations.finalBalance, formatCurrency(stats.finalBalance)]
  );

  const worksheet = XLSX.utils.aoa_to_sheet(data);

  worksheet['!cols'] = [
    { wch: 25 },
    { wch: 20 }
  ];

  return worksheet;
}

function createTimelineSheet(timeline: TimelineEntry[], translations: ExcelTranslations): XLSX.WorkSheet {
  const headers = [
    translations.date,
    translations.event,
    translations.category,
    translations.amount,
    translations.balance
  ];

  const data = timeline.map(entry => [
    formatDate(entry.date),
    entry.description,
    entry.category || '-',
    formatCurrencyWithSign(entry.amount),
    formatCurrency(entry.runningBalance)
  ]);

  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);

  worksheet['!cols'] = [
    { wch: 12 },
    { wch: 25 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 }
  ];

  return worksheet;
}

function createTransactionsSheet(state: AppState, translations: ExcelTranslations): XLSX.WorkSheet {
  const headers = [
    translations.date,
    translations.type,
    translations.description,
    translations.category,
    translations.amount,
    translations.amountType,
    translations.percentageBase
  ];

  const data = state.transactions.map(transaction => {
    let amountDisplay: string;
    if (transaction.amountType === 'fixed') {
      amountDisplay = formatCurrency(transaction.amount);
    } else {
      amountDisplay = `${transaction.amount}%`;
    }

    const typeLabel = transaction.type === 'income' ? translations.income : translations.payment;
    const amountTypeLabel = transaction.amountType === 'fixed' ? translations.amountTypeFixed : translations.amountTypePercentage;

    let percentageBaseLabel = '-';
    if (transaction.percentageBase === 'buy') {
      percentageBaseLabel = translations.buyPrice;
    } else if (transaction.percentageBase === 'sell') {
      percentageBaseLabel = translations.sellPrice;
    }

    return [
      formatDate(transaction.date),
      typeLabel,
      transaction.description || '-',
      transaction.category || '-',
      amountDisplay,
      amountTypeLabel,
      percentageBaseLabel
    ];
  });

  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);

  worksheet['!cols'] = [
    { wch: 12 },
    { wch: 10 },
    { wch: 25 },
    { wch: 15 },
    { wch: 15 },
    { wch: 12 },
    { wch: 15 }
  ];

  return worksheet;
}
