import { DarkTheme, DefaultTheme, ThemeProvider, Slot } from 'expo-router';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { AppContextProvider, useApp } from '@/context/AppContext';

function AppContent() {
  const { themeMode } = useApp();
  return (
    <ThemeProvider value={themeMode === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <Slot />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AppContextProvider>
      <AppContent />
    </AppContextProvider>
  );
}

