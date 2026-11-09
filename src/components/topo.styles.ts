import { StyleSheet } from 'react-native';

import { Cacua, Spacing } from '@/constants/theme';

export const styles = StyleSheet.create({
  topo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.three,
    backgroundColor: Cacua.superficie,
    borderBottomWidth: 1,
    borderBottomColor: Cacua.borda,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  textos: {
    flex: 1,
  },
  ola: {
    fontSize: 22,
    fontWeight: 700,
    color: Cacua.texto,
  },
  regiao: {
    fontSize: 15,
    color: Cacua.textoSecundario,
  },
  sair: {
    alignSelf: 'flex-start',
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two,
    borderRadius: Spacing.two,
  },
  sairPressionado: {
    backgroundColor: Cacua.verdeClaro,
  },
  sairTexto: {
    fontSize: 16,
    fontWeight: 700,
    color: Cacua.verde,
  },
});
