import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeName, themes } from '../types/theme';

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'apate2-theme';

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeName>(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    // Validate that the saved theme exists in our themes object
    if (saved && saved in themes) {
      return saved as ThemeName;
    }
    return 'light';
  });

  useEffect(() => {
    const colors = themes[theme];
    const root = document.documentElement;

    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-income', colors.income);
    root.style.setProperty('--color-payment', colors.payment);
    root.style.setProperty('--color-background', colors.background);
    root.style.setProperty('--color-surface', colors.surface);
    root.style.setProperty('--color-border', colors.border);
    root.style.setProperty('--color-text', colors.text);
    root.style.setProperty('--color-text-secondary', colors.textSecondary);
    root.style.setProperty('--color-negative', colors.negative);
  }, [theme]);

  const setTheme = (newTheme: ThemeName) => {
    setThemeState(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
