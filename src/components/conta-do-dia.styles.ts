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
    paddingVertical: Spacing.one + Spacing.half,
  },
  rotulo: {
    flexShrink: 1,
    fontSize: 15,
    lineHeight: 21,
    color: Cacua.textoSecundario,
  },
  rotuloDestaque: {
    fontWeight: 700,
    color: Cacua.texto,
  },
  valor: {
    fontSize: 15,
    lineHeight: 21,
    color: Cacua.texto,
    fontVariant: ['tabular-nums'],
  },
  valorDestaque: {
    fontSize: 17,
    fontWeight: 700,
    color: Cacua.verdeEscuro,
  },
  divisor: {
    height: 1,
    marginVertical: Spacing.one,
    backgroundColor: Cacua.borda,
  },
  aviso: {
    fontSize: 14,
    lineHeight: 20,
    color: Cacua.textoSecundario,
  },
  dica: {
    padding: Spacing.three,
    borderRadius: Spacing.two + Spacing.one,
    backgroundColor: Cacua.verdeClaro,
  },
  dicaTexto: {
    fontSize: 15,
    lineHeight: 21,
    color: Cacua.verdeEscuro,
  },
  forte: {
    fontWeight: 700,
  },
  produtor: {
    gap: Spacing.half,
    paddingTop: Spacing.two,
    borderTopWidth: 1,
    borderTopColor: Cacua.borda,
  },
  produtorTopo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  produtorNome: {
    flexShrink: 1,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: 700,
    color: Cacua.texto,
  },
  produtorCaixas: {
    fontSize: 15,
    lineHeight: 22,
    color: Cacua.texto,
  },
  produtorDetalhe: {
    fontSize: 14,
    lineHeight: 20,
    color: Cacua.textoSecundario,
  },
});
