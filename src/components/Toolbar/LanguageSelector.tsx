import React from 'react';
import { useLocale } from '../../context/LocaleContext';
import { useTranslation } from '../../i18n';
import { Language } from '../../i18n/types';
import styles from './ThemeSelector.module.css';

const languageLabels: Record<Language, string> = {
  he: 'עברית',
  en: 'English',
};

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLocale();
  const { t } = useTranslation();

  const languages: Language[] = ['he', 'en'];

  return (
    <div className={styles.container}>
      <label htmlFor="language-select" className={styles.label}>
        {t('toolbar.language')}:
      </label>
      <select
        id="language-select"
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className={styles.select}
      >
        {languages.map((lang) => (
          <option key={lang} value={lang}>
            {languageLabels[lang]}
          </option>
        ))}
      </select>
    </div>
  );
};
