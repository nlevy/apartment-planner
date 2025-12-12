import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { ThemeName } from '../../types/theme';
import { useTranslation } from '../../i18n';
import styles from './ThemeSelector.module.css';

export const ThemeSelector: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();

  const themes: ThemeName[] = ['light', 'dark'];

  return (
    <div className={styles.container}>
      <label htmlFor="theme-select" className={styles.label}>
        {t('toolbar.theme')}:
      </label>
      <select
        id="theme-select"
        value={theme}
        onChange={(e) => setTheme(e.target.value as ThemeName)}
        className={styles.select}
      >
        {themes.map((themeName) => (
          <option key={themeName} value={themeName}>
            {t(`theme.${themeName}`)}
          </option>
        ))}
      </select>
    </div>
  );
};
