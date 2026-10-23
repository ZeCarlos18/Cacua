import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
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

// As abas ficam embaixo de tudo; telas como a Conta do dia (S2.4) abrem por cima, com botão de voltar.
export default function RootLayout() {
  return (
    <ThemeProvider value={temaCacua}>
      <StatusBar style="dark" />
      <AnimatedSplashOverlay />
      <Stack
        screenOptions={{
          headerTintColor: Cacua.verde,
          headerTitleStyle: { color: Cacua.texto },
          headerStyle: { backgroundColor: Cacua.superficie },
        }}>
        <Stack.Screen name="(abas)" options={{ headerShown: false }} />
        <Stack.Screen name="conta/[dia]" options={{ title: 'Conta do dia', headerBackTitle: 'Agenda' }} />
      </Stack>
    </ThemeProvider>
  );
}
