import { Text, View, type StyleProp, type ViewStyle } from 'react-native';

import {
  descricaoDoMapa,
  ladoDoNome,
  nomeCurto,
  posicaoNoMapa,
  type AreaDoMapa,
} from '@/utils/mapa-rota';
import type { Parada } from '@/utils/rota';

import { styles } from './mapa-rota.styles';

type Posicao = Parada['posicao'];

type MapaRotaProps = {
  posto: Posicao;
  /** A área do quadro (areaDoMapa), com todos os sítios e o posto. */
  area: AreaDoMapa;
  /** As paradas na ordem da montarRota. */
  paradas: Parada[];
  /** Ids dos produtores já coletados, para o círculo ficar verde com ✓. */
  coletados: number[];
};

/**
 * Mapa ilustrativo da Rota (S3.4), como no Figma: fundo bege, o posto com "P" e os sítios com o
 * número da parada, nas posições do S3.1. Os círculos seguem o Parada: vermelho com o número
 * antes da coleta, verde com ✓ depois. As linhas entre os pontos ficam para depois.
 */
export function MapaRota({ posto, area, paradas, coletados }: MapaRotaProps) {
  return (
    <View
      style={styles.quadro}
      accessible
      accessibilityRole="image"
      accessibilityLabel={descricaoDoMapa(paradas, coletados)}>
      <View style={[styles.area, { aspectRatio: area.largura / area.altura }]}>
        <Ponto posicao={posto} area={area} texto="P" estilo={styles.circuloPosto} />
        {paradas.map((parada) => {
          const coletada = coletados.includes(parada.id);
          return (
            <Ponto
              key={parada.id}
              posicao={parada.posicao}
              area={area}
              texto={coletada ? '✓' : String(parada.numero)}
              estilo={coletada ? styles.circuloColetado : styles.circuloPendente}
              nome={nomeCurto(parada.sitio)}
            />
          );
        })}
      </View>
      <Text style={styles.legenda}>Mapa ilustrativo</Text>
    </View>
  );
}

type PontoProps = {
  posicao: Posicao;
  area: AreaDoMapa;
  texto: string;
  estilo: StyleProp<ViewStyle>;
  nome?: string;
};

/** Um círculo no mapa e, ao lado, o nome do sítio. */
function Ponto({ posicao, area, texto, estilo, nome }: PontoProps) {
  const { esquerda, topo } = posicaoNoMapa(posicao, area);
  const nomeNaDireita = ladoDoNome(posicao, area) === 'direita';

  return (
    <>
      <View style={[styles.circulo, estilo, { left: `${esquerda}%`, top: `${topo}%` }]}>
        <Text style={styles.circuloTexto}>{texto}</Text>
      </View>
      {nome ? (
        <Text
          style={[
            styles.nome,
            nomeNaDireita
              ? [styles.nomeDireita, { left: `${esquerda}%` }]
              : [styles.nomeEsquerda, { right: `${100 - esquerda}%` }],
            { top: `${topo}%` },
          ]}>
          {nome}
        </Text>
      ) : null}
    </>
  );
}
