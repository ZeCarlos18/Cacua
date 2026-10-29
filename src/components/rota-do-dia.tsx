import { Text, View } from 'react-native';

import { BarraCarga } from '@/components/barra-carga';
import { MapaRota } from '@/components/mapa-rota';
import { Parada } from '@/components/parada';
import { Selo } from '@/components/selo';
import { formatarReais, type calcularLucroDoDia } from '@/utils/calculos';
import type { AreaDoMapa } from '@/utils/mapa-rota';
import type { Parada as ParadaDaRota, Posicao } from '@/utils/rota';
import { caixasColetadas, resumoDaRota, textoDoColetado, totalDeCaixas } from '@/utils/rota-do-dia';

import { styles } from './rota-do-dia.styles';

type RotaDoDiaProps = {
  /** As paradas na ordem da montarRota. */
  paradas: ParadaDaRota[];
  km: number;
  conta: ReturnType<typeof calcularLucroDoDia>;
  /** Ids dos produtores já coletados (começa com `rota.coletados`). */
  coletados: number[];
  /** Nomes dos produtores que ficaram fora da rota por não ter posição no mapa. */
  semPosicao: string[];
  /** Posição do posto e área do mapa ilustrativo (S3.4). */
  posto: Posicao;
  area: AreaDoMapa;
  onRegistrar: (id: number) => void;
};

/**
 * Rota do dia (S3.3), como no Figma: resumo com km, lucro e Selo, a barra "Coletado" e as
 * paradas na ordem de visita. Não guarda estado: quem sabe o que foi coletado é a tela.
 */
export function RotaDoDia({
  paradas,
  km,
  conta,
  coletados,
  semPosicao,
  posto,
  area,
  onRegistrar,
}: RotaDoDiaProps) {
  const total = totalDeCaixas(paradas);
  const coletadas = caixasColetadas(paradas, coletados);

  return (
    <>
      <View style={styles.cartao}>
        <Text style={styles.resumo}>{resumoDaRota(paradas, km)}</Text>
        <View style={styles.linhaDoLucro}>
          <Text style={styles.lucro}>
            Lucro estimado: <Text style={styles.lucroValor}>{formatarReais(conta.lucro)}</Text>
          </Text>
          <Selo texto={conta.selo} />
        </View>
        <BarraCarga caixas={coletadas} cargaMinima={total} texto={textoDoColetado(coletadas, total)} />
      </View>

      <MapaRota posto={posto} area={area} paradas={paradas} coletados={coletados} />

      <View style={[styles.cartao, styles.cartaoParadas]}>
        {paradas.map((parada, posicao) => (
          <View key={parada.id} style={posicao > 0 && styles.divisor}>
            <Parada
              numero={parada.numero}
              sitio={parada.sitio}
              produtor={parada.produtor}
              fruta={parada.fruta}
              caixas={parada.caixas}
              coletada={coletados.includes(parada.id)}
              onRegistrar={() => onRegistrar(parada.id)}
            />
          </View>
        ))}
      </View>

      {semPosicao.length > 0 ? (
        <Text style={styles.aviso}>Fora da rota, sem posição no mapa: {semPosicao.join(', ')}</Text>
      ) : null}
    </>
  );
}

/** Quando `rota.data` não está na agenda. */
export function RotaNaoEncontrada() {
  return <Text style={styles.aviso}>Não achamos o dia desta rota na agenda.</Text>;
}
