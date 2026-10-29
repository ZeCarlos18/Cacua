import { StyleSheet } from 'react-native';

import { Cacua, Spacing } from '@/constants/theme';

const TAMANHO_DO_CIRCULO = 32;

export const styles = StyleSheet.create({
  parada: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two + Spacing.one,
    paddingVertical: Spacing.three,
  },
  circulo: {
    width: TAMANHO_DO_CIRCULO,
    height: TAMANHO_DO_CIRCULO,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: TAMANHO_DO_CIRCULO / 2,
    backgroundColor: Cacua.vermelho,
  },
  circuloColetado: {
    backgroundColor: Cacua.verde,
  },
  circuloTexto: {
    fontSize: 16,
    fontWeight: 700,
    color: Cacua.superficie,
  },
  conteudo: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    columnGap: Spacing.two + Spacing.one,
    rowGap: Spacing.two + Spacing.one,
  },
  info: {
    // Sem flex: 1 (que zera a largura base): o texto ocupa a largura dele, e o botão só fica
    // ao lado quando os dois cabem na linha.
    flexGrow: 1,
    flexShrink: 1,
    gap: Spacing.half,
  },
  sitio: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: 700,
    color: Cacua.texto,
  },
  detalhe: {
    fontSize: 14,
    lineHeight: 20,
    color: Cacua.textoSecundario,
  },
  coletado: {
    alignItems: 'flex-end',
    gap: Spacing.one,
  },
  linhaDoSelo: {
    flexDirection: 'row',
  },
  recibo: {
    fontSize: 14,
    lineHeight: 20,
    color: Cacua.textoSecundario,
  },
  botao: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.two + Spacing.one,
    borderRadius: Spacing.two + Spacing.one,
    borderWidth: 1.5,
    borderColor: Cacua.verde,
    backgroundColor: Cacua.superficie,
  },
  botaoPressionado: {
    backgroundColor: Cacua.verdeClaro,
  },
  botaoTexto: {
    fontSize: 15,
    fontWeight: 700,
    color: Cacua.verdeEscuro,
  },
});
