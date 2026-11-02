import { StyleSheet } from 'react-native';

import { Cacua, Spacing } from '@/constants/theme';

const TAMANHO_DO_BOTAO = 44;

export const styles = StyleSheet.create({
  campoCaixas: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  botao: {
    width: TAMANHO_DO_BOTAO,
    height: TAMANHO_DO_BOTAO,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: TAMANHO_DO_BOTAO / 2,
    borderWidth: 1,
    borderColor: Cacua.borda,
    backgroundColor: Cacua.superficie,
  },
  botaoPressionado: {
    backgroundColor: Cacua.verdeClaro,
  },
  botaoTexto: {
    fontSize: 22,
    lineHeight: 26,
    fontWeight: 700,
    color: Cacua.verdeEscuro,
  },
  entrada: {
    width: 96,
    minHeight: TAMANHO_DO_BOTAO,
    paddingHorizontal: Spacing.two + Spacing.one,
    borderRadius: Spacing.two + Spacing.one,
    borderWidth: 1,
    borderColor: Cacua.borda,
    backgroundColor: Cacua.superficie,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 700,
    color: Cacua.texto,
  },
});
