import { StyleSheet } from 'react-native';

import { Cacua, Spacing } from '@/constants/theme';

export const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: Cacua.fundo,
  },
  conteudo: {
    flexGrow: 1,
    justifyContent: 'center',
    gap: Spacing.five,
    paddingHorizontal: Spacing.three,
  },
  marca: {
    alignItems: 'center',
    gap: Spacing.two,
  },
  logo: {
    width: 88,
    height: 88,
    borderRadius: 22,
  },
  nome: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: 700,
    color: Cacua.texto,
  },
  frase: {
    maxWidth: 300,
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
    color: Cacua.textoSecundario,
  },
  campos: {
    gap: Spacing.three,
  },
  erro: {
    padding: Spacing.two + Spacing.one,
    borderRadius: Spacing.two + Spacing.one,
    backgroundColor: Cacua.vermelhoClaro,
  },
  erroTexto: {
    fontSize: 14,
    lineHeight: 20,
    color: Cacua.vermelho,
  },
  botoes: {
    gap: Spacing.two + Spacing.one,
  },
  botao: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
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
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
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
