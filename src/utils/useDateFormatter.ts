import { format as dateFnsFormat } from 'date-fns';
import { he, enUS } from 'date-fns/locale';
import { useLocale } from '../context/LocaleContext';

export function useDateFormatter() {
  const { language } = useLocale();
  const locale = language === 'he' ? he : enUS;

  const formatDate = (date: Date): string => {
    return dateFnsFormat(date, 'dd/MM/yyyy', { locale });
  };

  const formatDateLong = (date: Date): string => {
    const pattern = language === 'he' ? 'dd MMMM yyyy' : 'MMMM dd, yyyy';
    return dateFnsFormat(date, pattern, { locale });
  };

  return { formatDate, formatDateLong };
}
