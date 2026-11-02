import { StyleSheet } from 'react-native';

import { Cacua, Spacing } from '@/constants/theme';

export const styles = StyleSheet.create({
  pilulas: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  pilula: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Cacua.borda,
    backgroundColor: Cacua.superficie,
  },
  pilulaPressionada: {
    backgroundColor: Cacua.verdeClaro,
  },
  pilulaMarcada: {
    borderColor: Cacua.verde,
    backgroundColor: Cacua.verde,
  },
  texto: {
    fontSize: 15,
    fontWeight: 600,
    color: Cacua.texto,
  },
  textoMarcado: {
    fontWeight: 700,
    color: Cacua.superficie,
  },
});
