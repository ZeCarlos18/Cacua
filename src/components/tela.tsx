import type { ReactNode } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Cacua, Spacing } from '@/constants/theme';

type TelaProps = {
  titulo: string;
  descricao?: string;
  children?: ReactNode;
};

/**
 * Base de todas as abas: fundo do Caçuá, título e descrição.
 * O topo do app (S1.5) entra aqui, acima do título, para aparecer em todas as abas.
 */
export function Tela({ titulo, descricao, children }: TelaProps) {
  const insets = useSafeAreaInsets();
  // No celular, desconta a barra do relógio e da bateria.
  const espacoTopo = Platform.OS === 'web' ? Spacing.five : insets.top + Spacing.four;
  // Na web, a barra de abas fica por cima do conteúdo, então deixa espaço embaixo.
  const espacoBaixo = Platform.OS === 'web' ? 72 : 0;

  return (
    <View style={[styles.tela, { paddingTop: espacoTopo, paddingBottom: espacoBaixo }]}>
      <Text style={styles.titulo} accessibilityRole="header">
        {titulo}
      </Text>
      {descricao ? <Text style={styles.descricao}>{descricao}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: Cacua.fundo,
    paddingHorizontal: Spacing.three,
    gap: Spacing.two,
  },
  titulo: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: 700,
    color: Cacua.texto,
  },
  descricao: {
    fontSize: 16,
    lineHeight: 22,
    color: Cacua.textoSecundario,
  },
});
