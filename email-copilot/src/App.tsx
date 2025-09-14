import React from 'react';
import { CustomThemeProvider } from './contexts/ThemeContext';
import MainLayout from './components/Layout/MainLayout';

function App() {
  return (
    <CustomThemeProvider>
      <MainLayout />
    </CustomThemeProvider>
  );
}

export default App;
