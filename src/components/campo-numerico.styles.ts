import { StyleSheet } from 'react-native';

import { Cacua, Spacing } from '@/constants/theme';

export const styles = StyleSheet.create({
  campo: {
    width: 120,
    maxWidth: '100%',
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.two + Spacing.one,
    borderRadius: Spacing.two + Spacing.one,
    borderWidth: 1,
    borderColor: Cacua.borda,
    backgroundColor: Cacua.fundo,
  },
  campoEditando: {
    borderColor: Cacua.verde,
    backgroundColor: Cacua.superficie,
  },
  unidade: {
    fontSize: 14,
    color: Cacua.textoSecundario,
  },
  entrada: {
    flex: 1,
    minWidth: 0,
    paddingVertical: Spacing.two,
    textAlign: 'right',
    fontSize: 16,
    fontWeight: 700,
    color: Cacua.texto,
  },
});
