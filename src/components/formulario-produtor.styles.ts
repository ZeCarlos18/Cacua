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
  secao: {
    gap: Spacing.one + Spacing.half,
  },
  // O mesmo rótulo e o mesmo erro do CampoTexto (campo-texto.styles.ts).
  rotulo: {
    fontSize: 15,
    fontWeight: 600,
    color: Cacua.texto,
  },
  erro: {
    fontSize: 14,
    lineHeight: 20,
    color: Cacua.vermelho,
  },
  botao: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.two,
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
