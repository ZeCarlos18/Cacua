import { StyleSheet } from 'react-native';

import { Cacua, Spacing } from '@/constants/theme';

export const styles = StyleSheet.create({
  campo: {
    gap: Spacing.one + Spacing.half,
  },
  rotulo: {
    fontSize: 15,
    fontWeight: 600,
    color: Cacua.texto,
  },
  caixa: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.two + Spacing.one,
    borderRadius: Spacing.two + Spacing.one,
    borderWidth: 1,
    borderColor: Cacua.borda,
    backgroundColor: Cacua.superficie,
  },
  caixaFocada: {
    borderColor: Cacua.verde,
  },
  caixaComErro: {
    borderColor: Cacua.vermelho,
  },
  entrada: {
    flex: 1,
    minWidth: 0,
    paddingVertical: Spacing.two + Spacing.one,
    fontSize: 16,
    color: Cacua.texto,
    // Na web, o navegador desenha um contorno no campo focado; a borda verde já mostra o foco.
    // O estilo "solid" com largura 0 troca o contorno do navegador por nenhum.
    outlineStyle: 'solid',
    outlineWidth: 0,
  },
  mostrar: {
    paddingVertical: Spacing.one,
  },
  mostrarTexto: {
    fontSize: 14,
    fontWeight: 700,
    color: Cacua.verde,
  },
  erro: {
    fontSize: 14,
    lineHeight: 20,
    color: Cacua.vermelho,
  },
});
