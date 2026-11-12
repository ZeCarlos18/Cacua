import { StyleSheet } from 'react-native';

import { Cacua, Spacing } from '@/constants/theme';

export const styles = StyleSheet.create({
  campo: {
    gap: Spacing.one + Spacing.half,
  },
  quadro: {
    alignItems: 'center',
    // Como no mapa da Rota: respiro para os círculos da borda não encostarem.
    padding: Spacing.two + Spacing.one,
    borderRadius: Spacing.three,
    borderWidth: 1,
    borderColor: Cacua.mapa,
    backgroundColor: Cacua.mapa,
  },
  quadroComErro: {
    borderColor: Cacua.vermelho,
  },
  area: {
    // Mais alto que o da Rota (260), para o dedo acertar o lugar com mais folga.
    height: 300,
  },
  circuloPosto: {
    backgroundColor: Cacua.verdeEscuro,
  },
  circuloExistente: {
    backgroundColor: Cacua.textoSecundario,
  },
  circuloNovo: {
    backgroundColor: Cacua.verde,
  },
  camadaDeToque: {
    ...StyleSheet.absoluteFill,
  },
  legenda: {
    // A legenda fica por cima do canto do mapa; assim o toque passa por ela (revisão do S7.4).
    pointerEvents: 'none',
    position: 'absolute',
    right: Spacing.two + Spacing.one,
    bottom: Spacing.two,
    fontSize: 12,
    lineHeight: 16,
    color: Cacua.textoSecundario,
  },
  distancia: {
    fontSize: 15,
    fontWeight: 700,
    color: Cacua.verdeEscuro,
  },
  dica: {
    fontSize: 15,
    color: Cacua.textoSecundario,
  },
  erro: {
    fontSize: 14,
    lineHeight: 20,
    color: Cacua.vermelho,
  },
});
