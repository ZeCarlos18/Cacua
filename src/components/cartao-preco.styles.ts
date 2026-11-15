import { StyleSheet } from 'react-native';

import { Cacua, Spacing } from '@/constants/theme';

// O cartão do preço era da rota custos.tsx; veio para cá com os mesmos valores (S8.4).
export const styles = StyleSheet.create({
  cartao: {
    width: '48%',
    padding: Spacing.three,
    borderRadius: Spacing.three,
    borderWidth: 1,
    borderColor: Cacua.borda,
    backgroundColor: Cacua.superficie,
  },
  nome: {
    fontSize: 16,
    fontWeight: 700,
    color: Cacua.texto,
  },
  explicacao: {
    fontSize: 14,
    color: Cacua.textoSecundario,
  },
  campo: {
    marginTop: Spacing.two,
  },
  data: {
    marginTop: Spacing.two,
    fontSize: 13,
    lineHeight: 18,
    color: Cacua.textoSecundario,
  },
  dataAntiga: {
    color: Cacua.amarelo,
  },
  selo: {
    flexDirection: 'row',
    marginTop: Spacing.one,
  },
});
