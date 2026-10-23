import { StyleSheet } from 'react-native';

import { Cacua, Spacing } from '@/constants/theme';

export const styles = StyleSheet.create({
  barraCarga: {
    gap: Spacing.two,
  },
  trilho: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: Cacua.verdeClaro,
  },
  preenchimento: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: Cacua.verde,
  },
  texto: {
    fontSize: 14,
    lineHeight: 20,
    color: Cacua.textoSecundario,
  },
});
