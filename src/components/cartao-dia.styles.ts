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
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  data: {
    flexShrink: 1,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: 700,
    color: Cacua.texto,
  },
  frutas: {
    fontSize: 16,
    lineHeight: 22,
    color: Cacua.texto,
  },
  sitios: {
    fontSize: 14,
    lineHeight: 20,
    color: Cacua.textoSecundario,
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
  aviso: {
    fontSize: 14,
    lineHeight: 20,
    color: Cacua.textoSecundario,
  },
  botao: {
    minHeight: 44,
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
});
