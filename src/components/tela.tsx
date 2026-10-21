import type { ReactNode } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { Topo } from '@/components/topo';
import { Cacua, Spacing } from '@/constants/theme';

type TelaProps = {
  titulo: string;
  descricao?: string;
  children?: ReactNode;
};

/**
 * Base de todas as abas: topo do app (S1.5), fundo do Caçuá, título e descrição.
 */
export function Tela({ titulo, descricao, children }: TelaProps) {
  // Na web, a barra de abas fica por cima do conteúdo, então deixa espaço embaixo.
  const espacoBaixo = Platform.OS === 'web' ? 72 : 0;

  return (
    <View style={[styles.tela, { paddingBottom: espacoBaixo }]}>
      <Topo />
      <View style={styles.conteudo}>
        <Text style={styles.titulo} accessibilityRole="header">
          {titulo}
        </Text>
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
