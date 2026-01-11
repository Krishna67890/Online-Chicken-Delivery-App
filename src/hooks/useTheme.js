import { useTheme as useThemeContext } from '../Contexts/ThemeContext';

export const useTheme = () => {
  return useThemeContext();
};

export default useTheme;
