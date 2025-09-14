import React from 'react';
import { CustomThemeProvider } from './contexts/ThemeContext';
import { SettingsProvider } from './contexts/SettingsContext';
import MainLayout from './components/Layout/MainLayout';

function App() {
  return (
    <CustomThemeProvider>
      <SettingsProvider>
        <MainLayout />
      </SettingsProvider>
    </CustomThemeProvider>
  );
}

export default App;
