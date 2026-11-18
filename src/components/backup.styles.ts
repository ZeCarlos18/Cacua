import { StyleSheet } from 'react-native';

import { Cacua, Spacing } from '@/constants/theme';

/** Os estilos da tela Backup dos dados (S9.6): os cartões "Mandar" e "Restaurar" dividem os botões. */
export const styles = StyleSheet.create({
  cartao: {
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Spacing.three,
    borderWidth: 1,
    borderColor: Cacua.borda,
    backgroundColor: Cacua.superficie,
  },
  titulo: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: 700,
    color: Cacua.texto,
  },
  texto: {
    fontSize: 15,
    lineHeight: 21,
    color: Cacua.textoSecundario,
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
  botaoPerigo: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.two + Spacing.one,
    backgroundColor: Cacua.vermelho,
  },
  botaoPerigoPressionado: {
    opacity: 0.85,
  },
  desligado: {
    opacity: 0.5,
  },
  botoes: {
    gap: Spacing.two,
  },
  // O texto do backup na tela, para copiar à mão e para testar na web.
  textoDoBackup: {
    padding: Spacing.three,
    borderRadius: Spacing.two + Spacing.one,
    backgroundColor: Cacua.fundo,
    fontSize: 12,
    lineHeight: 17,
    color: Cacua.texto,
  },
  campo: {
    gap: Spacing.one + Spacing.half,
  },
  rotulo: {
    fontSize: 15,
    fontWeight: 600,
    color: Cacua.texto,
  },
  caixaDeTexto: {
    minHeight: 120,
    paddingHorizontal: Spacing.two + Spacing.one,
    paddingVertical: Spacing.two + Spacing.one,
    borderRadius: Spacing.two + Spacing.one,
    borderWidth: 1,
    borderColor: Cacua.borda,
    backgroundColor: Cacua.superficie,
    fontSize: 15,
    color: Cacua.texto,
    textAlignVertical: 'top',
    // Na web, o navegador desenha um contorno no campo focado; a borda verde já mostra o foco.
    outlineStyle: 'solid',
    outlineWidth: 0,
  },
  caixaFocada: {
    borderColor: Cacua.verde,
  },
  caixaComErro: {
    borderColor: Cacua.vermelho,
  },
  erro: {
    fontSize: 14,
    lineHeight: 20,
    color: Cacua.vermelho,
  },
  // O resumo do backup conferido e o aviso de que restaurar troca tudo.
  conferido: {
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Spacing.two + Spacing.one,
    backgroundColor: Cacua.verdeClaro,
  },
  conferidoTitulo: {
    fontSize: 15,
    lineHeight: 21,
    fontWeight: 700,
    color: Cacua.verdeEscuro,
  },
  aviso: {
    padding: Spacing.three,
    borderRadius: Spacing.two + Spacing.one,
    backgroundColor: Cacua.amareloClaro,
  },
  avisoTexto: {
    fontSize: 15,
    lineHeight: 21,
    fontWeight: 600,
    color: Cacua.amarelo,
  },
  pronto: {
    padding: Spacing.three,
    borderRadius: Spacing.two + Spacing.one,
    backgroundColor: Cacua.verdeClaro,
  },
  prontoTexto: {
    fontSize: 15,
    lineHeight: 21,
    fontWeight: 700,
    color: Cacua.verdeEscuro,
  },
});
