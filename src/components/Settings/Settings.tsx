import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useLocale } from '../../context/LocaleContext';
import { useTranslation } from '../../i18n';
import { Language, Currency } from '../../i18n/types';
import styles from './Settings.module.css';

export const Settings: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();
  const { language, currency, setLanguage, setCurrency } = useLocale();
  const { t } = useTranslation();

  // Local state for pending changes (only applied when closing)
  const [pendingLanguage, setPendingLanguage] = useState<Language>(language);
  const [pendingCurrency, setPendingCurrency] = useState<Currency>(currency);
  const [pendingTheme, setPendingTheme] = useState<'light' | 'dark'>(theme);

  const languageLabels: Record<Language, string> = {
    he: 'עברית',
    en: 'English',
  };

  const currencyLabels: Record<Currency, string> = {
    ILS: '₪ ILS',
    USD: '$ USD',
    EUR: '€ EUR',
  };

  // Apply pending changes when closing
  const handleClose = () => {
    setLanguage(pendingLanguage);
    setCurrency(pendingCurrency);
    setTheme(pendingTheme);
    setIsOpen(false);
  };

  // Initialize pending state when opening
  const handleOpen = () => {
    setPendingLanguage(language);
    setPendingCurrency(currency);
    setPendingTheme(theme);
    setIsOpen(true);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        // Apply changes directly here to capture current pending values
        setLanguage(pendingLanguage);
        setCurrency(pendingCurrency);
        setTheme(pendingTheme);
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, pendingLanguage, pendingCurrency, pendingTheme, setLanguage, setCurrency, setTheme]);

  const handleToggle = () => {
    if (isOpen) {
      handleClose();
    } else {
      handleOpen();
    }
  };

  return (
    <div className={styles.container} ref={dropdownRef}>
      <button
        className={styles.settingsButton}
        onClick={handleToggle}
        title={t('toolbar.settings')}
      >
        ⚙️
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.dropdownHeader}>
            <h3>{t('toolbar.settings')}</h3>
          </div>

          <div className={styles.settingsSection}>
            <label className={styles.settingLabel}>
              {t('toolbar.language')}
            </label>
            <select
              value={pendingLanguage}
              onChange={(e) => setPendingLanguage(e.target.value as Language)}
              className={styles.settingSelect}
            >
              {Object.entries(languageLabels).map(([lang, label]) => (
                <option key={lang} value={lang}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.settingsSection}>
            <label className={styles.settingLabel}>
              {t('toolbar.currency')}
            </label>
            <select
              value={pendingCurrency}
              onChange={(e) => setPendingCurrency(e.target.value as Currency)}
              className={styles.settingSelect}
            >
              {Object.entries(currencyLabels).map(([curr, label]) => (
                <option key={curr} value={curr}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.settingsSection}>
            <label className={styles.settingLabel}>
              {t('toolbar.theme')}
            </label>
            <select
              value={pendingTheme}
              onChange={(e) => setPendingTheme(e.target.value as 'light' | 'dark')}
              className={styles.settingSelect}
            >
              <option value="light">{t('theme.light')}</option>
              <option value="dark">{t('theme.dark')}</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};
