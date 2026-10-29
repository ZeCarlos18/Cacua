import { StyleSheet } from 'react-native';

import { Cacua, Spacing } from '@/constants/theme';

const TAMANHO_DO_CIRCULO = 28;
const ALTURA_DO_NOME = 16;
/** Distância do centro do círculo até o nome: o raio mais um respiro. */
const AFASTAMENTO_DO_NOME = TAMANHO_DO_CIRCULO / 2 + Spacing.one;

export const styles = StyleSheet.create({
  quadro: {
    alignItems: 'center',
    // Respiro para os círculos da borda (Pau d'Arco em cima, o posto embaixo) não encostarem.
    padding: Spacing.two + Spacing.one,
    borderRadius: Spacing.three,
    backgroundColor: Cacua.mapa,
  },
  area: {
    // A largura sai do aspectRatio (a proporção da área do mapa), para não distorcer as distâncias.
    height: 260,
  },
  circulo: {
    position: 'absolute',
    width: TAMANHO_DO_CIRCULO,
    height: TAMANHO_DO_CIRCULO,
    // Centraliza o círculo no ponto (left/top marcam o centro).
    marginLeft: -TAMANHO_DO_CIRCULO / 2,
    marginTop: -TAMANHO_DO_CIRCULO / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: TAMANHO_DO_CIRCULO / 2,
  },
  circuloPosto: {
    backgroundColor: Cacua.verdeEscuro,
  },
  circuloPendente: {
    backgroundColor: Cacua.vermelho,
  },
  circuloColetado: {
    backgroundColor: Cacua.verde,
  },
  circuloTexto: {
    fontSize: 14,
    fontWeight: 700,
    color: Cacua.superficie,
  },
  nome: {
    position: 'absolute',
    marginTop: -ALTURA_DO_NOME / 2,
    fontSize: 12,
    lineHeight: ALTURA_DO_NOME,
    fontWeight: 700,
    color: Cacua.texto,
  },
  nomeDireita: {
    marginLeft: AFASTAMENTO_DO_NOME,
  },
  nomeEsquerda: {
    marginRight: AFASTAMENTO_DO_NOME,
  },
  legenda: {
    position: 'absolute',
    right: Spacing.two + Spacing.one,
    bottom: Spacing.two,
    fontSize: 12,
    lineHeight: 16,
    color: Cacua.textoSecundario,
  },
});
