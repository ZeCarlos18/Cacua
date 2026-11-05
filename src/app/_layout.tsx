import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { Cacua } from '@/constants/theme';
import { AcessoProvider, useAcesso } from '@/state/acesso';
import { CacuaProvider } from '@/state/cacua';

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

// Abrindo /conta/01-out direto (link ou recarregar na web), as abas ficam por baixo e o voltar aparece.
export const unstable_settings = {
  anchor: '(abas)',
};

export default function RootLayout() {
  return (
    <ThemeProvider value={temaCacua}>
      <StatusBar style="dark" />
      <AnimatedSplashOverlay />
      <AcessoProvider>
        <CacuaProvider>
          <Navegacao />
        </CacuaProvider>
      </AcessoProvider>
    </ThemeProvider>
  );
}

/**
 * As abas ficam embaixo de tudo; telas como a Conta do dia (S2.4) abrem por cima, com botão de
 * voltar. Rotas protegidas: sem login, só Entrar e Criar conta abrem; depois de entrar, essas
 * duas somem e o app abre nas abas. Ao sair da conta, volta para Entrar.
 */
function Navegacao() {
  const { coletor } = useAcesso();
  const entrou = coletor !== null;

  return (
    <Stack
      screenOptions={{
        headerTintColor: Cacua.verde,
        headerTitleStyle: { color: Cacua.texto },
        headerStyle: { backgroundColor: Cacua.superficie },
      }}>
      <Stack.Protected guard={entrou}>
        <Stack.Screen name="(abas)" options={{ headerShown: false }} />
        <Stack.Screen name="conta/[dia]" options={{ title: 'Conta do dia', headerBackTitle: 'Voltar' }} />
        <Stack.Screen name="aviso/novo" options={{ title: 'Registrar aviso', headerBackTitle: 'Voltar' }} />
        <Stack.Screen name="produtor/[id]" options={{ title: 'Produtor', headerBackTitle: 'Produtores' }} />
        <Stack.Screen name="custos" options={{ title: 'Custos e preços', headerBackTitle: 'Início' }} />
      </Stack.Protected>

      <Stack.Protected guard={!entrou}>
        <Stack.Screen name="entrar" options={{ headerShown: false }} />
        <Stack.Screen name="cadastro" options={{ title: 'Criar conta', headerBackTitle: 'Entrar' }} />
      </Stack.Protected>
    </Stack>
  );
}
