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
  link: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkTexto: {
    fontSize: 15,
    fontWeight: 600,
    color: Cacua.verde,
    textDecorationLine: 'underline',
  },
});
