import { Stack } from 'expo-router';
import type { ReactNode } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Topo } from '@/components/topo';
import { Cacua, Spacing } from '@/constants/theme';

type TelaProps = {
  /** O título grande da aba. Com `cabecalhoNativo`, vai para a barra de cima. */
  titulo: string;
  descricao?: string;
  /**
   * Para as telas que abrem por cima das abas (S6.3), como os Custos (S6.5) e os detalhes do
   * produtor (S6.6): sem o topo do app e sem o título grande, porque o título e o voltar ficam na
   * barra de cima.
   */
  cabecalhoNativo?: boolean;
  children?: ReactNode;
};

/**
 * Base de todas as abas: topo do app (S1.5), fundo do Caçuá, título e descrição. Com
 * `cabecalhoNativo`, serve também para as telas que abrem por cima das abas.
 */
export function Tela({ titulo, descricao, cabecalhoNativo = false, children }: TelaProps) {
  const insets = useSafeAreaInsets();
  // Nas abas da web, a barra de abas fica por cima do conteúdo, então deixa espaço embaixo. Por
  // cima das abas não tem barra de abas; no celular, só o espaço da borda de baixo da tela.
  const espacoBaixo = cabecalhoNativo ? insets.bottom : Platform.OS === 'web' ? 72 : 0;

  return (
    <View style={[styles.tela, { paddingBottom: espacoBaixo }]}>
      {cabecalhoNativo ? <Stack.Screen options={{ title: titulo }} /> : <Topo />}
      <View style={[styles.conteudo, cabecalhoNativo && styles.conteudoNativo]}>
        {cabecalhoNativo ? null : (
          <Text style={styles.titulo} accessibilityRole="header">
            {titulo}
          </Text>
        )}
        {descricao ? <Text style={styles.descricao}>{descricao}</Text> : null}
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: Cacua.fundo,
  },
  conteudo: {
    flex: 1,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.four,
    gap: Spacing.two,
  },
  conteudoNativo: {
    // Embaixo da barra de cima, como a Conta do dia.
    paddingTop: Spacing.three,
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
