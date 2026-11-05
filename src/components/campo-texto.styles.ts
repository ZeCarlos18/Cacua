import { StyleSheet } from 'react-native';

import { Cacua, Spacing } from '@/constants/theme';

export const styles = StyleSheet.create({
  campo: {
    gap: Spacing.one,
  },
  rotulo: {
    fontSize: 15,
    lineHeight: 21,
    fontWeight: 700,
    color: Cacua.texto,
  },
  entrada: {
    minHeight: 48,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two + Spacing.one,
    borderWidth: 1,
    borderColor: Cacua.borda,
    backgroundColor: Cacua.superficie,
    fontSize: 17,
    color: Cacua.texto,
  },
  entradaFocada: {
    borderColor: Cacua.verde,
  },
  entradaComErro: {
    borderColor: Cacua.vermelho,
  },
  dica: {
    fontSize: 14,
    lineHeight: 20,
    color: Cacua.textoSecundario,
  },
  erro: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 700,
    color: Cacua.vermelho,
  },
});
