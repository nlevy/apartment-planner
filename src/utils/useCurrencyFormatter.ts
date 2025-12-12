import { useLocale } from '../context/LocaleContext';
import { Currency } from '../i18n/types';

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  ILS: '₪',
  USD: '$',
  EUR: '€',
};

export function useCurrencyFormatter() {
  const { currency } = useLocale();
  const symbol = CURRENCY_SYMBOLS[currency];

  const formatCurrency = (amount: number): string => {
    const formatted = new Intl.NumberFormat('he-IL', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Math.abs(amount));

    const sign = amount < 0 ? '-' : '';
    return `${sign}${formatted}${symbol}`;
  };

  const formatCurrencyWithSign = (amount: number): string => {
    const formatted = new Intl.NumberFormat('he-IL', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Math.abs(amount));

    if (amount > 0) {
      return `+${formatted}${symbol}`;
    } else if (amount < 0) {
      return `-${formatted}${symbol}`;
    }
    return `${formatted}${symbol}`;
  };

  return { formatCurrency, formatCurrencyWithSign, currencySymbol: symbol };
}
