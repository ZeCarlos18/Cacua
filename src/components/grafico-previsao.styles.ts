import { StyleSheet } from 'react-native';

import { Cacua, Spacing } from '@/constants/theme';

/** Altura da barra mais alta, sem o número em cima. */
export const ALTURA_DO_GRAFICO = 140;
/** Espaço em cima da barra mais alta para o número. */
const ALTURA_DO_VALOR = 20;

export const styles = StyleSheet.create({
  cartao: {
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Spacing.three,
    borderWidth: 1,
    borderColor: Cacua.borda,
    backgroundColor: Cacua.superficie,
  },
  area: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.two,
    height: ALTURA_DO_GRAFICO + ALTURA_DO_VALOR,
    borderBottomWidth: 1,
    borderBottomColor: Cacua.borda,
  },
  coluna: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.one,
  },
  valor: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: 700,
    color: Cacua.texto,
  },
  barra: {
    alignSelf: 'stretch',
    borderTopLeftRadius: Spacing.one,
    borderTopRightRadius: Spacing.one,
    backgroundColor: Cacua.verde,
  },
  barraFraca: {
    backgroundColor: Cacua.amarelo,
  },
  linha: {
    position: 'absolute',
    left: 0,
    right: 0,
    // Por cima das barras, para a linha aparecer também onde elas passam.
    zIndex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  traco: {
    width: 5,
    height: 1.5,
    backgroundColor: Cacua.textoSecundario,
  },
  rotulos: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  rotulo: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 14,
    color: Cacua.textoSecundario,
  },
  legenda: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  legendaTracos: {
    flexDirection: 'row',
    gap: 3,
  },
  legendaTexto: {
    fontSize: 13,
    lineHeight: 18,
    color: Cacua.textoSecundario,
  },
});
