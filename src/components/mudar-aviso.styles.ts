import { StyleSheet } from 'react-native';

import { Cacua, Spacing } from '@/constants/theme';

export const styles = StyleSheet.create({
  caixa: {
    gap: Spacing.two,
    marginTop: Spacing.one,
    padding: Spacing.three,
    borderRadius: Spacing.two + Spacing.one,
    backgroundColor: Cacua.fundo,
  },
  rotulo: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 700,
    color: Cacua.texto,
  },
  pergunta: {
    fontSize: 15,
    lineHeight: 21,
    color: Cacua.texto,
  },
  erro: {
    fontSize: 14,
    lineHeight: 20,
    color: Cacua.vermelho,
  },
  botoes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  botao: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.two + Spacing.one,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  botaoTexto: {
    fontSize: 15,
    fontWeight: 700,
  },
  pressionado: {
    opacity: 0.7,
  },
  desligado: {
    opacity: 0.4,
  },
  cheio: {
    backgroundColor: Cacua.verde,
  },
  cheioTexto: {
    color: Cacua.superficie,
  },
  contorno: {
    borderColor: Cacua.verde,
    backgroundColor: Cacua.superficie,
  },
  contornoTexto: {
    color: Cacua.verdeEscuro,
  },
  perigo: {
    backgroundColor: Cacua.vermelho,
  },
  perigoTexto: {
    color: Cacua.superficie,
  },
  perigoContorno: {
    borderColor: Cacua.vermelho,
    backgroundColor: Cacua.superficie,
  },
  perigoContornoTexto: {
    color: Cacua.vermelho,
  },
  texto: {
    paddingHorizontal: Spacing.two,
  },
  textoTexto: {
    color: Cacua.textoSecundario,
  },
});
