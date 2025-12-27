import { format as dateFnsFormat } from 'date-fns';
import { he, enUS } from 'date-fns/locale';
import { Language } from '../i18n/types';

export function formatDate(date: Date, language: Language = 'he'): string {
  const locale = language === 'he' ? he : enUS;
  return dateFnsFormat(date, 'dd/MM/yyyy', { locale });
}

export function formatDateLong(date: Date, language: Language = 'he'): string {
  const locale = language === 'he' ? he : enUS;
  const pattern = language === 'he' ? 'dd MMMM yyyy' : 'MMMM dd, yyyy';
  return dateFnsFormat(date, pattern, { locale });
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
