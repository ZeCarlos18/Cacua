import { Text, View } from 'react-native';

import { BarraCarga } from '@/components/barra-carga';
import { MapaRota } from '@/components/mapa-rota';
import { Parada } from '@/components/parada';
import { Selo } from '@/components/selo';
import { useColetor } from '@/state/acesso';
import type { Aviso } from '@/utils/agenda';
import { formatarReais, type calcularLucroDoDia } from '@/utils/calculos';
import { caixasAvisadas, type CaixasPorFruta } from '@/utils/coleta';
import type { AreaDoMapa } from '@/utils/mapa-rota';
import { textoDoRecibo } from '@/utils/recibo';
import type { Parada as ParadaDaRota, Posicao } from '@/utils/rota';
import { caixasColetadas, resumoDaRota, textoDoColetado, totalDeCaixas } from '@/utils/rota-do-dia';

import { styles } from './rota-do-dia.styles';

type RotaDoDiaProps = {
  /** O dia da rota (ex.: Quinta 01/out), que vai no recibo de cada parada (S5.2). */
  dia: { dia: string; data: string };
  /**
   * Os avisos do dia como foram avisados, antes do diaComEntregas (S7.6): o "Quantas caixas
   * vieram?" já vem com eles, e a parada e o recibo mostram o "(avisou 12)".
   */
  avisados: Aviso[];
  /** As paradas na ordem da montarRota, já com as caixas que vieram (diaComEntregas, S7.3). */
  paradas: ParadaDaRota[];
  km: number;
  conta: ReturnType<typeof calcularLucroDoDia>;
  /** Ids dos produtores já coletados no dia (as `coletas` do dia, S5.1). */
  coletados: number[];
  /** Nomes dos produtores que ficaram fora da rota por não ter posição no mapa. */
  semPosicao: string[];
  /** Posição do posto e área do mapa ilustrativo (S3.4). */
  posto: Posicao;
  area: AreaDoMapa;
  /** Sem "Desfazer coleta" em dia confirmado (S7.3). */
  podeDesfazer: boolean;
  /** Registra a coleta do produtor com as caixas que vieram de cada fruta (S7.6). */
  onRegistrar: (id: number, caixas: CaixasPorFruta) => void;
  onDesfazer: (id: number) => void;
};

/**
 * Rota do dia (S3.3), como no Figma: resumo com km, lucro e Selo, a barra "Coletado" e as
 * paradas na ordem de visita. Não guarda estado: quem sabe o que foi coletado é a tela.
 */
export function RotaDoDia({
  dia,
  avisados,
  paradas,
  km,
  conta,
  coletados,
  semPosicao,
  posto,
  area,
  podeDesfazer,
  onRegistrar,
  onDesfazer,
}: RotaDoDiaProps) {
  // O recibo sai com o nome de quem entrou (S6.4): "Coletado por José Carlos".
  const coletor = useColetor();
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
        {paradas.map((parada, posicao) => {
          const avisadas = caixasAvisadas({ avisos: avisados }, parada.id);
          const totalAvisado = Object.values(avisadas).reduce((soma, quantas) => soma + quantas, 0);
          return (
            <View key={parada.id} style={posicao > 0 && styles.divisor}>
              <Parada
                numero={parada.numero}
                sitio={parada.sitio}
                produtor={parada.produtor}
                fruta={parada.fruta}
                caixas={parada.caixas}
                avisadas={avisadas}
                coletada={coletados.includes(parada.id)}
                podeDesfazer={podeDesfazer}
                // "Goiaba: 10 caixas (avisou 12)" quando o que veio é diferente (S7.3).
                recibo={textoDoRecibo(dia, parada, coletor, totalAvisado)}
                onRegistrar={(caixas) => onRegistrar(parada.id, caixas)}
                onDesfazer={() => onDesfazer(parada.id)}
              />
            </View>
          );
        })}
      </View>

      {semPosicao.length > 0 ? (
        <Text style={styles.aviso}>Fora da rota, sem posição no mapa: {semPosicao.join(', ')}</Text>
      ) : null}
    </>
  );
}

/** Quando o dia escolhido não está na agenda. */
export function RotaNaoEncontrada() {
  return <Text style={styles.aviso}>Não achamos o dia desta rota na agenda.</Text>;
}

/** Quando todos os avisos do dia saíram (S7.2): sem aviso, não há rota. */
export function RotaSemParadas() {
  return <Text style={styles.aviso}>Nenhuma parada neste dia.</Text>;
}
