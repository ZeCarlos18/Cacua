import { StyleSheet } from 'react-native';

import { Cacua, Spacing } from '@/constants/theme';

export const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: Cacua.fundo,
  },
  conteudo: {
    gap: Spacing.four,
    padding: Spacing.three,
  },
  secao: {
    gap: Spacing.two + Spacing.one,
  },
  tituloSecao: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: 700,
    color: Cacua.texto,
  },
  dica: {
    fontSize: 15,
    lineHeight: 21,
    color: Cacua.textoSecundario,
  },
  aviso: {
    padding: Spacing.two + Spacing.one,
    borderRadius: Spacing.two + Spacing.one,
    backgroundColor: Cacua.amareloClaro,
  },
  avisoTexto: {
    fontSize: 14,
    lineHeight: 20,
    color: Cacua.amarelo,
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
  botaoDesligado: {
    backgroundColor: Cacua.borda,
  },
  botaoTexto: {
    fontSize: 16,
    fontWeight: 700,
    color: Cacua.superficie,
  },
  botaoTextoDesligado: {
    color: Cacua.textoSecundario,
  },
});
