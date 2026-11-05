import { StyleSheet } from 'react-native';

import { Cacua, Spacing } from '@/constants/theme';

export const styles = StyleSheet.create({
  botao: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Spacing.two + Spacing.one,
    backgroundColor: Cacua.verde,
  },
  botaoPressionado: {
    backgroundColor: Cacua.verdeEscuro,
  },
  botaoTexto: {
    fontSize: 16,
    fontWeight: 700,
    color: Cacua.superficie,
  },
  confirmada: {
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Spacing.three,
    backgroundColor: Cacua.verdeClaro,
  },
  confirmadaTexto: {
    fontSize: 15,
    lineHeight: 21,
    color: Cacua.verdeEscuro,
  },
  forte: {
    fontWeight: 700,
  },
  desfazer: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Spacing.two + Spacing.one,
    borderWidth: 1,
    borderColor: Cacua.verde,
    backgroundColor: Cacua.superficie,
  },
  desfazerPressionado: {
    backgroundColor: Cacua.verdeClaro,
  },
  desfazerTexto: {
    fontSize: 16,
    fontWeight: 700,
    color: Cacua.verdeEscuro,
  },
});
