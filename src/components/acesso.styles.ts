import { StyleSheet } from 'react-native';

import { Cacua, Spacing } from '@/constants/theme';

/** Estilos das telas Entrar e Criar conta. */
export const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: Cacua.fundo,
  },
  conteudo: {
    flexGrow: 1,
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
  },
  marca: {
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.three,
  },
  logo: {
    width: 88,
    height: 88,
    borderRadius: 22,
  },
  nomeDoApp: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: 700,
    color: Cacua.verdeEscuro,
  },
  frase: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 22,
    color: Cacua.textoSecundario,
  },
  cartao: {
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Spacing.three,
    borderWidth: 1,
    borderColor: Cacua.borda,
    backgroundColor: Cacua.superficie,
  },
  titulo: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: 700,
    color: Cacua.texto,
  },
  erro: {
    padding: Spacing.three,
    borderRadius: Spacing.two + Spacing.one,
    backgroundColor: Cacua.vermelhoClaro,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: 700,
    color: Cacua.vermelho,
  },
  botao: {
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
  exemplo: {
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Spacing.three,
    backgroundColor: Cacua.verdeClaro,
  },
  exemploTexto: {
    fontSize: 15,
    lineHeight: 21,
    color: Cacua.verdeEscuro,
  },
  link: {
    alignSelf: 'flex-start',
    paddingVertical: Spacing.one,
  },
  linkTexto: {
    fontSize: 16,
    fontWeight: 700,
    color: Cacua.verdeEscuro,
    textDecorationLine: 'underline',
  },
  nota: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
    color: Cacua.textoSecundario,
  },
});
