import { DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { Cacua } from '@/constants/theme';

SplashScreen.preventAutoHideAsync();

// O protótipo do Caçuá é claro (fundo creme), então o app usa sempre o tema claro.
const temaCacua = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Cacua.verde,
    background: Cacua.fundo,
    card: Cacua.superficie,
    text: Cacua.texto,
    border: Cacua.borda,
  },
};

export default function TabLayout() {
  return (
    <ThemeProvider value={temaCacua}>
      <StatusBar style="dark" />
      <AnimatedSplashOverlay />
      <AppTabs />
    </ThemeProvider>
  );
}
