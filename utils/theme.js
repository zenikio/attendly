import { Appearance } from 'react-native';

export const applyTheme = (theme) => {
  Appearance.setColorScheme(theme === 'system' ? 'unspecified' : theme);
};
