import { useState } from 'react';
import { Text, View, type GestureResponderEvent, type LayoutChangeEvent } from 'react-native';

import { Ponto } from '@/components/mapa-rota';
import { textoDoKm } from '@/utils/conta';
import { nomeCurto, posicaoDoToque, type AreaDoMapa } from '@/utils/mapa-rota';
import { kmEntre, type Posicao } from '@/utils/rota';

import { styles } from './mapa-do-sitio.styles';

type MapaDoSitioProps = {
  posto: Posicao;
  /** A área do quadro (areaDoMapa), a mesma do mapa da Rota. */
  area: AreaDoMapa;
  /** Os sítios que já existem, em cinza, para o coletor se orientar. */
  sitios: { id: number; sitio: string; posicao: Posicao }[];
  /** O lugar marcado, ou null antes do primeiro toque. */
  marcado: Posicao | null;
  /** O nome do sítio novo, para aparecer ao lado do ponto verde. */
  nomeDoSitio: string;
  onMarcar: (posicao: Posicao) => void;
  erro?: string;
};

/**
 * "Onde fica o sítio" (S7.4): o mapa ilustrativo da Rota, com o posto e os sítios que já existem.
 * Tocar marca o sítio novo e mostra a distância do posto; tocar de novo muda o lugar.
 */
export function MapaDoSitio({ posto, area, sitios, marcado, nomeDoSitio, onMarcar, erro }: MapaDoSitioProps) {
  const [tamanho, setTamanho] = useState({ largura: 0, altura: 0 });

  function medir(evento: LayoutChangeEvent) {
    const { width, height } = evento.nativeEvent.layout;
    setTamanho({ largura: width, altura: height });
  }

  // O locationX/Y vem em relação à camada de toque, que cobre o quadro inteiro (na web e no celular).
  function marcar(evento: GestureResponderEvent) {
    const { locationX, locationY } = evento.nativeEvent;
    onMarcar(posicaoDoToque({ x: locationX, y: locationY }, tamanho, area));
  }

  return (
    <View style={styles.campo}>
      <View style={[styles.quadro, erro && styles.quadroComErro]}>
        <View style={[styles.area, { aspectRatio: area.largura / area.altura }]} onLayout={medir}>
          <Ponto posicao={posto} area={area} texto="P" estilo={styles.circuloPosto} />
          {sitios.map((item) => (
            <Ponto
              key={item.id}
              posicao={item.posicao}
              area={area}
              texto=""
              estilo={styles.circuloExistente}
              nome={nomeCurto(item.sitio)}
            />
          ))}
          {marcado ? (
            <Ponto
              posicao={marcado}
              area={area}
              texto="✓"
              estilo={styles.circuloNovo}
              nome={nomeCurto(nomeDoSitio.trim()) || 'Sítio novo'}
            />
          ) : null}
          {/* A camada de toque fica por cima de tudo e não tem nada dentro. */}
          <View
            style={styles.camadaDeToque}
            accessible
            accessibilityLabel="Mapa para marcar o sítio"
            accessibilityHint="Toque onde fica o sítio. Tocar de novo muda o lugar."
            onStartShouldSetResponder={() => true}
            onResponderRelease={marcar}
          />
        </View>
        <Text style={styles.legenda}>Mapa ilustrativo</Text>
      </View>

      <Text style={marcado ? styles.distancia : styles.dica} accessibilityLiveRegion="polite">
        {marcado
          ? `${textoDoKm(kmEntre(posto, marcado))} do posto, em linha reta`
          : 'Toque no mapa onde fica o sítio.'}
      </Text>
      {erro ? (
        <Text style={styles.erro} accessibilityLiveRegion="polite">
          {erro}
        </Text>
      ) : null}
    </View>
  );
}
