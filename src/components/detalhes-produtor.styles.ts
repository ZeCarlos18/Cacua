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
  linha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.three,
    paddingVertical: Spacing.one + Spacing.half,
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
  destaque: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: 700,
    color: Cacua.verdeEscuro,
  },
  textoSecundario: {
    fontSize: 15,
    lineHeight: 21,
    color: Cacua.textoSecundario,
  },
  aviso: {
    gap: Spacing.half,
    paddingTop: Spacing.two,
    borderTopWidth: 1,
    borderTopColor: Cacua.borda,
  },
  avisoTopo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  avisoDia: {
    flexShrink: 1,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: 700,
    color: Cacua.texto,
  },
  avisoFruta: {
    fontSize: 15,
    lineHeight: 21,
    color: Cacua.texto,
  },
  avisoValor: {
    fontSize: 15,
    lineHeight: 21,
    color: Cacua.textoSecundario,
  },
  forte: {
    fontWeight: 700,
    color: Cacua.texto,
  },
  total: {
    padding: Spacing.three,
    borderRadius: Spacing.two + Spacing.one,
    backgroundColor: Cacua.fundo,
  },
  totalTexto: {
    fontSize: 15,
    lineHeight: 21,
    color: Cacua.textoSecundario,
  },
  vazio: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
  },
  vazioTexto: {
    fontSize: 16,
    lineHeight: 22,
    color: Cacua.textoSecundario,
  },
});
