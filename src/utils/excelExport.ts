import * as XLSX from 'xlsx';
import { AppState, TimelineEntry } from '../types';
import { formatCurrency, formatDate, formatCurrencyWithSign } from './formatters';
import { calculateSummaryStats } from './calculations';

export function exportToExcel(
  timeline: TimelineEntry[],
  state: AppState,
  filename = 'apartment-plan.xlsx'
): void {
  const workbook = XLSX.utils.book_new();

  const summarySheet = createSummarySheet(state);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'סיכום');

  const timelineSheet = createTimelineSheet(timeline);
  XLSX.utils.book_append_sheet(workbook, timelineSheet, 'ציר זמן');

  const transactionsSheet = createTransactionsSheet(state);
  XLSX.utils.book_append_sheet(workbook, transactionsSheet, 'תנועות');

  XLSX.writeFile(workbook, filename);
}

function createSummarySheet(state: AppState): XLSX.WorkSheet {
  const stats = calculateSummaryStats(
    state.initialFunds,
    state.transactions,
    state.priceConfig
  );

  const data: string[][] = [
    ['מתכנן קניית ומכירת דירה'],
    [''],
    ['מחירים'],
    ['מחיר קניה', state.priceConfig.buyPrice !== null ? formatCurrency(state.priceConfig.buyPrice) : 'לא הוגדר'],
    ['מחיר מכירה', state.priceConfig.sellPrice !== null ? formatCurrency(state.priceConfig.sellPrice) : 'לא הוגדר'],
    [''],
    ['יתרה התחלתית'],
  ];

  Object.entries(state.initialFunds).forEach(([category, amount]) => {
    data.push([category, formatCurrency(amount)]);
  });

  data.push(
    ['סה"כ יתרה התחלתית', formatCurrency(stats.totalInitial)],
    [''],
    ['סיכום'],
    ['סה"כ הכנסות', formatCurrency(stats.totalIncome)],
    ['סה"כ תשלומים', formatCurrency(stats.totalPayments)],
    ['יתרה סופית', formatCurrency(stats.finalBalance)]
  );

  const worksheet = XLSX.utils.aoa_to_sheet(data);

  worksheet['!cols'] = [
    { wch: 25 },
    { wch: 20 }
  ];

  return worksheet;
}

function createTimelineSheet(timeline: TimelineEntry[]): XLSX.WorkSheet {
  const headers = ['תאריך', 'אירוע', 'קטגוריה', 'סכום', 'יתרה'];

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

function createTransactionsSheet(state: AppState): XLSX.WorkSheet {
  const headers = ['תאריך', 'סוג', 'תיאור', 'קטגוריה', 'סכום', 'סוג סכום', 'בסיס אחוז'];

  const data = state.transactions.map(transaction => {
    let amountDisplay: string;
    if (transaction.amountType === 'fixed') {
      amountDisplay = formatCurrency(transaction.amount);
    } else {
      amountDisplay = `${transaction.amount}%`;
    }

    return [
      formatDate(transaction.date),
      transaction.type === 'income' ? 'הכנסה' : 'תשלום',
      transaction.description || '-',
      transaction.category || '-',
      amountDisplay,
      transaction.amountType === 'fixed' ? 'קבוע' : 'אחוז',
      transaction.percentageBase === 'buy' ? 'מחיר קניה' : (transaction.percentageBase === 'sell' ? 'מחיר מכירה' : '-')
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
