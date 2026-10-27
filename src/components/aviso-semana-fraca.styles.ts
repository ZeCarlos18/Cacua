import { StyleSheet } from 'react-native';

import { Cacua, Spacing } from '@/constants/theme';

export const styles = StyleSheet.create({
  aviso: {
    padding: Spacing.three,
    borderRadius: Spacing.three,
    backgroundColor: Cacua.amareloClaro,
  },
  texto: {
    fontSize: 15,
    lineHeight: 22,
    color: Cacua.amarelo,
  },
  negrito: {
    fontWeight: 700,
  },
});
