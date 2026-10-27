import { StyleSheet } from 'react-native';

import { Cacua, Spacing } from '@/constants/theme';

export const styles = StyleSheet.create({
  cartao: {
    borderRadius: Spacing.three,
    borderWidth: 1,
    borderColor: Cacua.borda,
    backgroundColor: Cacua.superficie,
  },
  semana: {
    gap: Spacing.one,
    padding: Spacing.three,
  },
  divisoria: {
    borderTopWidth: 1,
    borderTopColor: Cacua.borda,
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  periodo: {
    flexShrink: 1,
    fontSize: 17,
    lineHeight: 24,
    fontWeight: 700,
    color: Cacua.texto,
  },
  caixas: {
    fontSize: 15,
    lineHeight: 21,
    color: Cacua.texto,
  },
  negrito: {
    fontWeight: 700,
  },
  frutas: {
    fontSize: 14,
    lineHeight: 20,
    color: Cacua.textoSecundario,
  },
});
