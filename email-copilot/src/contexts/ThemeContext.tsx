import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, GlobalStyles } from '@mui/material';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface CustomThemeProviderProps {
  children: ReactNode;
}

export const CustomThemeProvider: React.FC<CustomThemeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: {
        main: isDarkMode ? '#8ab4f8' : '#1a73e8',
      },
      secondary: {
        main: '#ea4335',
      },
      background: {
        default: isDarkMode ? '#202124' : '#ffffff',
        paper: isDarkMode ? '#303134' : '#ffffff',
      },
      grey: {
        50: '#f8f9fa',
        100: '#f1f3f4',
        200: '#e8eaed',
        300: '#dadce0',
        400: '#bdc1c6',
        500: '#9aa0a6',
        600: '#80868b',
        700: '#5f6368',
        800: '#3c4043',
        900: '#202124',
      },
      text: {
        primary: isDarkMode ? '#e8eaed' : '#202124',
        secondary: isDarkMode ? '#9aa0a6' : '#5f6368',
      },
    },
    typography: {
      fontFamily: '"Google Sans", "Roboto", "Helvetica", "Arial", sans-serif',
      h4: {
        fontSize: '1.375rem',
        fontWeight: 400,
        color: isDarkMode ? '#e8eaed' : '#202124',
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 500,
        color: isDarkMode ? '#e8eaed' : '#202124',
      },
      body1: {
        fontSize: '0.875rem',
        color: isDarkMode ? '#e8eaed' : '#202124',
      },
      body2: {
        fontSize: '0.75rem',
        color: isDarkMode ? '#9aa0a6' : '#5f6368',
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            border: isDarkMode ? '1px solid #5f6368' : '1px solid #dadce0',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontSize: '0.875rem',
            fontWeight: 500,
          },
          outlined: {
            borderColor: isDarkMode ? '#5f6368' : '#dadce0',
            color: isDarkMode ? '#8ab4f8' : '#1a73e8',
            '&:hover': {
              backgroundColor: isDarkMode ? 'rgba(138, 180, 248, 0.08)' : 'rgba(26, 115, 232, 0.04)',
            },
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: '0 20px 20px 0',
            marginRight: '8px',
            '&.Mui-selected': {
              backgroundColor: isDarkMode ? 'rgba(138, 180, 248, 0.12)' : '#fce8e6',
              color: isDarkMode ? '#8ab4f8' : '#d93025',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: isDarkMode ? 'rgba(138, 180, 248, 0.16)' : '#fce8e6',
              },
            },
            '&:hover': {
              backgroundColor: isDarkMode ? 'rgba(241, 243, 244, 0.08)' : 'rgba(60, 64, 67, 0.04)',
            },
          },
        },
      },
    },
  });

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles
          styles={{
            '@keyframes pulse': {
              '0%, 100%': {
                opacity: 1,
              },
              '50%': {
                opacity: 0.5,
              },
            },
            '@keyframes blink': {
              '0%, 50%': {
                opacity: 1,
              },
              '51%, 100%': {
                opacity: 0,
              },
            },
          }}
        />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};