import { StyleSheet } from 'react-native';

import { Cacua, Spacing } from '@/constants/theme';

export const styles = StyleSheet.create({
  cartao: {
    gap: Spacing.two + Spacing.one,
    padding: Spacing.three,
    borderRadius: Spacing.three,
    borderWidth: 1,
    borderColor: Cacua.borda,
    backgroundColor: Cacua.superficie,
  },
  rotuloDaSecao: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: 700,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: Cacua.verde,
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  titulo: {
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
  detalhe: {
    fontSize: 15,
    lineHeight: 21,
    color: Cacua.textoSecundario,
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
  lucro: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: 700,
    color: Cacua.verdeEscuro,
    fontVariant: ['tabular-nums'],
  },
  pendente: {
    fontSize: 15,
    lineHeight: 21,
    color: Cacua.amarelo,
  },
  botoes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  botao: {
    flexGrow: 1,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
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
  botaoContorno: {
    flexGrow: 1,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.two + Spacing.one,
    borderWidth: 1,
    borderColor: Cacua.verde,
    backgroundColor: Cacua.superficie,
  },
  botaoContornoPressionado: {
    backgroundColor: Cacua.verdeClaro,
  },
  botaoContornoTexto: {
    fontSize: 16,
    fontWeight: 700,
    color: Cacua.verde,
  },
  numeros: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  numero: {
    flexGrow: 1,
    flexBasis: '45%',
    gap: Spacing.half,
    padding: Spacing.two + Spacing.one,
    borderRadius: Spacing.two + Spacing.one,
    backgroundColor: Cacua.fundo,
  },
  numeroValor: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: 700,
    color: Cacua.verdeEscuro,
    fontVariant: ['tabular-nums'],
  },
  numeroRotulo: {
    fontSize: 14,
    lineHeight: 19,
    color: Cacua.textoSecundario,
  },
  dia: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    paddingVertical: Spacing.two,
    borderTopWidth: 1,
    borderTopColor: Cacua.borda,
  },
  diaPressionado: {
    backgroundColor: Cacua.fundo,
  },
  diaTextos: {
    flexShrink: 1,
    gap: Spacing.half,
  },
  diaNome: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: 700,
    color: Cacua.texto,
  },
  diaDireita: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  seta: {
    fontSize: 24,
    lineHeight: 26,
    color: Cacua.textoSecundario,
  },
  tudoCerto: {
    fontSize: 15,
    lineHeight: 21,
    color: Cacua.verdeEscuro,
  },
});
