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
  /**
   * Fundo verde forte, para o que já foi decidido, como "Confirmada" na Agenda (S5.5). Assim não se
   * confunde com o "Vale a pena", que é verde claro.
   */
  cheio: StyleSheet.create({
    fundo: { backgroundColor: Cacua.verde },
    texto: { color: Cacua.superficie },
  }),
  /** Sem julgamento de bom ou ruim, como "Previsto" na Previsão. */
  neutro: StyleSheet.create({
    fundo: { backgroundColor: Cacua.borda },
    texto: { color: Cacua.texto },
  }),
};

export type CorDoSelo = keyof typeof coresDoSelo;
