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
  rotulo: {
    marginBottom: -Spacing.two,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: Cacua.textoSecundario,
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  dia: {
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
  confirmacao: {
    fontSize: 14,
    lineHeight: 20,
    color: Cacua.textoSecundario,
  },
  confirmada: {
    fontWeight: 700,
    color: Cacua.verdeEscuro,
  },
  botoes: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  botaoMetade: {
    flex: 1,
  },
  botao: {
    minHeight: 44,
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
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.two + Spacing.one,
    borderWidth: 1.5,
    borderColor: Cacua.verde,
    backgroundColor: Cacua.superficie,
  },
  botaoContornoPressionado: {
    backgroundColor: Cacua.verdeClaro,
  },
  botaoContornoTexto: {
    fontSize: 16,
    fontWeight: 700,
    color: Cacua.verdeEscuro,
  },
  numeros: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: Spacing.three,
  },
  numero: {
    width: '50%',
    gap: Spacing.half,
  },
  numeroValor: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: 700,
    color: Cacua.texto,
    fontVariant: ['tabular-nums'],
  },
  numeroRotulo: {
    fontSize: 13,
    lineHeight: 18,
    color: Cacua.textoSecundario,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    minHeight: 44,
    paddingVertical: Spacing.one,
  },
  itemPressionado: {
    opacity: 0.6,
  },
  divisor: {
    paddingTop: Spacing.three,
    borderTopWidth: 1,
    borderTopColor: Cacua.borda,
  },
  itemTextos: {
    flex: 1,
    gap: Spacing.half,
  },
  itemDia: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: 700,
    color: Cacua.texto,
  },
  seta: {
    fontSize: 22,
    lineHeight: 26,
    color: Cacua.textoSecundario,
  },
  atalhos: {
    gap: Spacing.two,
  },
});
