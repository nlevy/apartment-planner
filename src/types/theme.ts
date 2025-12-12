export type ThemeName = 'light' | 'dark';

export interface ThemeColors {
  primary: string;
  income: string;
  payment: string;
  background: string;
  surface: string;
  border: string;
  text: string;
  textSecondary: string;
  negative: string;
}

export const themes: Record<ThemeName, ThemeColors> = {
  light: {
    primary: '#1976D2',
    income: '#66BB6A',
    payment: '#EF5350',
    background: '#E3F2FD',
    surface: '#FFFFFF',
    border: '#BBDEFB',
    text: '#0D47A1',
    textSecondary: '#1565C0',
    negative: '#C62828'
  },
  dark: {
    primary: '#64B5F6',
    income: '#81C784',
    payment: '#E57373',
    background: '#1E1E1E',
    surface: '#2D2D2D',
    border: '#404040',
    text: '#E0E0E0',
    textSecondary: '#B0B0B0',
    negative: '#EF5350'
  }
};

export const themeLabels: Record<ThemeName, string> = {
  light: 'בהיר',
  dark: 'כהה'
};
