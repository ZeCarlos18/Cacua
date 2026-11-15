import { StyleSheet } from 'react-native';

import { Cacua, Spacing } from '@/constants/theme';

// O mesmo amarelo do aviso da semana fraca (aviso-semana-fraca.styles.ts) e do "Vale com atenção":
// é um alerta, e não um erro.
export const styles = StyleSheet.create({
  aviso: {
    gap: Spacing.two + Spacing.one,
    padding: Spacing.three,
    borderRadius: Spacing.three,
    backgroundColor: Cacua.amareloClaro,
  },
  texto: {
    fontSize: 15,
    lineHeight: 22,
    color: Cacua.amarelo,
  },
  negrito: {
    fontWeight: 700,
  },
  botao: {
    minHeight: 44,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.two + Spacing.one,
    borderWidth: 1.5,
    borderColor: Cacua.amarelo,
    backgroundColor: Cacua.superficie,
  },
  botaoPressionado: {
    backgroundColor: Cacua.amareloClaro,
  },
  botaoTexto: {
    fontSize: 15,
    fontWeight: 700,
    color: Cacua.amarelo,
  },
});
