import { StyleSheet } from 'react-native';

import { Cacua, Spacing } from '@/constants/theme';

export const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: Cacua.fundo,
  },
  conteudo: {
    gap: Spacing.three,
    padding: Spacing.three,
  },
  cartao: {
    gap: Spacing.two,
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
  sitio: {
    flexShrink: 1,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: 700,
    color: Cacua.texto,
  },
  tituloSecao: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: 700,
    color: Cacua.texto,
  },
  linha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  rotulo: {
    fontSize: 15,
    lineHeight: 21,
    color: Cacua.textoSecundario,
  },
  valor: {
    flexShrink: 1,
    textAlign: 'right',
    fontSize: 15,
    lineHeight: 21,
    color: Cacua.texto,
    fontVariant: ['tabular-nums'],
  },
  nota: {
    padding: Spacing.three,
    borderRadius: Spacing.two + Spacing.one,
    backgroundColor: Cacua.verdeClaro,
    fontSize: 15,
    lineHeight: 21,
    color: Cacua.verdeEscuro,
  },
  numeroGrande: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: 700,
    color: Cacua.verdeEscuro,
    fontVariant: ['tabular-nums'],
  },
  explicacao: {
    fontSize: 14,
    lineHeight: 20,
    color: Cacua.textoSecundario,
  },
  aviso: {
    gap: Spacing.half,
    paddingTop: Spacing.two,
    borderTopWidth: 1,
    borderTopColor: Cacua.borda,
  },
  diaDoAviso: {
    flexShrink: 1,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: 700,
    color: Cacua.texto,
  },
  detalhe: {
    fontSize: 15,
    lineHeight: 21,
    color: Cacua.textoSecundario,
  },
  valorDoAviso: {
    fontSize: 15,
    lineHeight: 21,
    color: Cacua.texto,
    fontVariant: ['tabular-nums'],
  },
  total: {
    gap: Spacing.half,
    paddingTop: Spacing.two,
    borderTopWidth: 1,
    borderTopColor: Cacua.borda,
  },
  totalTexto: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: 700,
    color: Cacua.verdeEscuro,
  },
  vazio: {
    fontSize: 15,
    lineHeight: 21,
    color: Cacua.textoSecundario,
  },
  naoEncontrado: {
    padding: Spacing.three,
    fontSize: 16,
    lineHeight: 22,
    color: Cacua.texto,
  },
});
