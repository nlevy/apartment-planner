import { useLocale } from '../context/LocaleContext';
import { translations } from './translations';
import { Translations } from './types';

type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

type TranslationKey = NestedKeyOf<Translations>;

function getNestedValue(obj: any, path: string): string {
  const keys = path.split('.');
  let current = obj;

  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return path; // Fallback to key if not found
    }
  }

  return typeof current === 'string' ? current : path;
}

export function useTranslation() {
  const { language } = useLocale();

  const t = (key: TranslationKey): string => {
    const translation = translations[language];
    return getNestedValue(translation, key);
  };

  // Translate transaction category keys (downPayment, brokerage, etc.)
  const translateCategory = (categoryKey: string | undefined): string => {
    if (!categoryKey) return '-';

    const translationKey = `transactions.categories.${categoryKey}`;
    const translated = getNestedValue(translations[language], translationKey);

    // If translation not found, return the original key (for backward compatibility)
    return translated !== translationKey ? translated : categoryKey;
  };

  // Translate initial funds category keys (cash, stocks, other, or custom)
  const translateInitialFundsCategory = (categoryKey: string): string => {
    const translationKey = `initialFunds.${categoryKey}`;
    const translated = getNestedValue(translations[language], translationKey);

    // If translation not found, return the original key (custom category)
    return translated !== translationKey ? translated : categoryKey;
  };

  return { t, translateCategory, translateInitialFundsCategory };
}
