import React, { createContext, useContext, useState, useEffect } from 'react';

interface SettingsContextType {
  apiKey: string;
  model: string;
  temperature: number;
  setApiKey: (key: string) => void;
  setModel: (model: string) => void;
  setTemperature: (temp: number) => void;
  isConfigured: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apiKey, setApiKeyState] = useState<string>('');
  const [model, setModelState] = useState<string>('gpt-4');
  const [temperature, setTemperatureState] = useState<number>(0.7);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('openai-api-key');
    const savedModel = localStorage.getItem('openai-model');
    const savedTemperature = localStorage.getItem('openai-temperature');

    if (savedApiKey) setApiKeyState(savedApiKey);
    if (savedModel) setModelState(savedModel);
    if (savedTemperature) setTemperatureState(parseFloat(savedTemperature));
  }, []);

  const setApiKey = (key: string) => {
    setApiKeyState(key);
    if (key) {
      localStorage.setItem('openai-api-key', key);
    } else {
      localStorage.removeItem('openai-api-key');
    }
  };

  const setModel = (modelName: string) => {
    setModelState(modelName);
    localStorage.setItem('openai-model', modelName);
  };

  const setTemperature = (temp: number) => {
    setTemperatureState(temp);
    localStorage.setItem('openai-temperature', temp.toString());
  };

  const isConfigured = apiKey.trim().length > 0;

  return (
    <SettingsContext.Provider
      value={{
        apiKey,
        model,
        temperature,
        setApiKey,
        setModel,
        setTemperature,
        isConfigured
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};