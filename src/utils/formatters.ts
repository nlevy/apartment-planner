import { format as dateFnsFormat } from 'date-fns';
import { he } from 'date-fns/locale';

export function formatCurrency(amount: number): string {
  const formatted = new Intl.NumberFormat('he-IL', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(Math.abs(amount));

  const sign = amount < 0 ? '-' : '';
  return `${sign}${formatted}₪`;
}

export function formatCurrencyWithSign(amount: number): string {
  const formatted = new Intl.NumberFormat('he-IL', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(Math.abs(amount));

  if (amount > 0) {
    return `+${formatted}₪`;
  } else if (amount < 0) {
    return `-${formatted}₪`;
  }
  return `${formatted}₪`;
}

export function formatDate(date: Date): string {
  return dateFnsFormat(date, 'dd/MM/yyyy', { locale: he });
}

export function formatDateLong(date: Date): string {
  return dateFnsFormat(date, 'dd MMMM yyyy', { locale: he });
}

export function parseDate(dateString: string): Date {
  return new Date(dateString);
}

export function formatDateForInput(date: Date): string {
  return dateFnsFormat(date, 'yyyy-MM-dd');
}

export function parseCurrency(value: string): number {
  const cleaned = value.replace(/[^\d.-]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

export function formatPercentage(value: number): string {
  return `${value}%`;
}
