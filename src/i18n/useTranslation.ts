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

  return { t };
}
