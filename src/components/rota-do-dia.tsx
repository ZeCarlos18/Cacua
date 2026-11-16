import { Text, View } from 'react-native';

import { BarraCarga } from '@/components/barra-carga';
import { MapaRota } from '@/components/mapa-rota';
import { Parada } from '@/components/parada';
import { Selo } from '@/components/selo';
import { useColetor } from '@/state/acesso';
import type { Aviso } from '@/utils/agenda';
import { formatarReais, type calcularLucroDoDia } from '@/utils/calculos';
import { caixasAvisadas, type CaixasPorFruta, type Entregas } from '@/utils/coleta';
import type { AreaDoMapa } from '@/utils/mapa-rota';
import { itensDoRecibo, textoDoRecibo, textoDoValor } from '@/utils/recibo';
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
  /** As caixas que vieram em cada coleta (S7.3) e o preço do Ceasa, para o valor do recibo (S8.2). */
  entregas: Entregas;
  precos: Parameters<typeof itensDoRecibo>[3];
  /** Os custos do coletor: o recibo mostra a porcentagem que o produtor recebe (pagoProdutor). */
  custos: Parameters<typeof itensDoRecibo>[4];
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
  /**
   * Dia confirmado na Conta: sem "Registrar coleta" e sem "Desfazer coleta". Primeiro desfaz a
   * confirmação, depois muda (a mesma regra do S7.2 e do S7.3).
   */
  diaConfirmado: boolean;
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
  entregas,
  precos,
  custos,
  paradas,
  km,
  conta,
  coletados,
  semPosicao,
  posto,
  area,
  diaConfirmado,
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

      {/* Sem isso, o "Registrar coleta" e o "Desfazer coleta" somem sem explicação (revisão do S7.6). */}
      {diaConfirmado ? (
        <Text style={styles.aviso}>
          Dia confirmado. Para registrar ou desfazer uma coleta, desfaça a confirmação na Conta do dia.
        </Text>
      ) : null}

      <View style={[styles.cartao, styles.cartaoParadas]}>
        {paradas.map((parada, posicao) => {
          const avisadas = caixasAvisadas({ avisos: avisados }, parada.id);
          // Calculado só aqui, para a parada mostrar o "(avisou 12)".
          const totalAvisado = Object.values(avisadas).reduce((soma, quantas) => soma + quantas, 0);
          // O recibo com o valor em reais e o preço do Ceasa (S8.2); a parada mostra o mesmo valor (S8.5).
          const itens = itensDoRecibo({ data: dia.data, avisos: avisados }, parada.id, entregas, precos, custos);
          return (
            // O dia entra na chave: ao trocar de dia, a parada do mesmo produtor começa do zero, e o
            // "Quantas caixas vieram?" aberto no outro dia fecha (revisão do S7.6).
            <View key={`${dia.data}-${parada.id}`} style={posicao > 0 && styles.divisor}>
              <Parada
                numero={parada.numero}
                sitio={parada.sitio}
                produtor={parada.produtor}
                fruta={parada.fruta}
                caixas={parada.caixas}
                avisadas={avisadas}
                totalAvisado={totalAvisado}
                coletada={coletados.includes(parada.id)}
                diaConfirmado={diaConfirmado}
                // "Goiaba: 10 caixas (avisou 12)" e o valor, com o preço do Ceasa (S7.3 e S8.2).
                recibo={textoDoRecibo(dia, { nome: parada.produtor, sitio: parada.sitio }, itens, coletor, custos)}
                valor={textoDoValor(itens)}
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
