import { StyleSheet } from 'react-native';

import { Cacua, Spacing } from '@/constants/theme';

export const styles = StyleSheet.create({
  selo: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.two + Spacing.one,
    paddingVertical: Spacing.one,
    borderRadius: 999,
  },
  texto: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: 700,
  },
});

/** Cores do selo: fundo claro com o texto na cor forte. */
export const coresDoSelo = {
  verde: StyleSheet.create({
    fundo: { backgroundColor: Cacua.verdeClaro },
    texto: { color: Cacua.verdeEscuro },
  }),
  amarelo: StyleSheet.create({
    fundo: { backgroundColor: Cacua.amareloClaro },
    texto: { color: Cacua.amarelo },
  }),
  vermelho: StyleSheet.create({
    fundo: { backgroundColor: Cacua.vermelhoClaro },
    texto: { color: Cacua.vermelho },
  }),
  /** Sem julgamento de bom ou ruim, como "Previsto" na Previsão. */
  neutro: StyleSheet.create({
    fundo: { backgroundColor: Cacua.borda },
    texto: { color: Cacua.texto },
  }),
};

export type CorDoSelo = keyof typeof coresDoSelo;
