import { StyleSheet } from 'react-native';

import { Cacua, Spacing } from '@/constants/theme';

export const styles = StyleSheet.create({
  cartao: {
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Spacing.three,
    borderWidth: 1,
    borderColor: Cacua.borda,
    backgroundColor: Cacua.superficie,
  },
  cartaoParadas: {
    // A Parada já tem o próprio espaço em cima e embaixo.
    gap: 0,
    paddingVertical: 0,
  },
  resumo: {
    fontSize: 16,
    lineHeight: 22,
    color: Cacua.texto,
  },
  linhaDoLucro: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  lucro: {
    fontSize: 16,
    lineHeight: 22,
    color: Cacua.textoSecundario,
  },
  lucroValor: {
    fontWeight: 700,
    color: Cacua.texto,
  },
  divisor: {
    borderTopWidth: 1,
    borderTopColor: Cacua.borda,
  },
  aviso: {
    fontSize: 14,
    lineHeight: 20,
    color: Cacua.textoSecundario,
  },
});
