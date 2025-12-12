import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { ThemeName, themeLabels } from '../../types/theme';
import styles from './ThemeSelector.module.css';

export const ThemeSelector: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const themes: ThemeName[] = ['light', 'dark'];

  return (
    <div className={styles.container}>
      <label htmlFor="theme-select" className={styles.label}>
        ערכת צבעים:
      </label>
      <select
        id="theme-select"
        value={theme}
        onChange={(e) => setTheme(e.target.value as ThemeName)}
        className={styles.select}
      >
        {themes.map((themeName) => (
          <option key={themeName} value={themeName}>
            {themeLabels[themeName]}
          </option>
        ))}
      </select>
    </div>
  );
};
