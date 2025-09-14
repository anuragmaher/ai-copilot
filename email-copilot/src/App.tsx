import React from 'react';
import { CustomThemeProvider } from './contexts/ThemeContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { EmailProvider } from './contexts/EmailContext';
import MainLayout from './components/Layout/MainLayout';

function App() {
  return (
    <CustomThemeProvider>
      <SettingsProvider>
        <EmailProvider>
          <MainLayout />
        </EmailProvider>
      </SettingsProvider>
    </CustomThemeProvider>
  );
}

export default App;
