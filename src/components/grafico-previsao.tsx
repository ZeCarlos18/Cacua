import { Text, View } from 'react-native';

import type { previsao } from '@/data/dados';
import { descricaoDaBarra, diasDoPeriodo, proporcaoDaBarra, viagensCheias } from '@/utils/previsao';

import { ALTURA_DO_GRAFICO, styles } from './grafico-previsao.styles';

type Semana = (typeof previsao)[number];

type GraficoPrevisaoProps = {
  semanas: Semana[];
  cargaMinima: number;
};

/** Quantos traços formam a linha da carga mínima (a borda tracejada de um lado só falha no Android). */
const TRACOS = 32;

/**
 * Gráfico de barras da Previsão (S4.6): uma barra por semana, com altura proporcional às caixas,
 * e a linha tracejada da carga mínima. A semana fraca (nenhuma viagem cheia) fica na cor do aviso
 * de semana fraca.
 */
export function GraficoPrevisao({ semanas, cargaMinima }: GraficoPrevisaoProps) {
  // A linha da carga mínima também tem que caber, mesmo que todas as semanas fiquem abaixo dela.
  const maximo = Math.max(cargaMinima, ...semanas.map((semana) => semana.caixas));
  const alturaDaLinha = proporcaoDaBarra(cargaMinima, maximo) * ALTURA_DO_GRAFICO;

  return (
    <View style={styles.cartao}>
      <View style={styles.area}>
        <View
          style={[styles.linha, { bottom: alturaDaLinha }]}
          accessible
          accessibilityLabel={`Carga mínima: ${cargaMinima} caixas`}>
          {Array.from({ length: TRACOS }, (_, indice) => (
            <View key={indice} style={styles.traco} />
          ))}
        </View>

        {semanas.map((semana) => {
          const fraca = viagensCheias(semana.caixas, cargaMinima) === 0;
          const altura = proporcaoDaBarra(semana.caixas, maximo) * ALTURA_DO_GRAFICO;
          return (
            <View
              key={semana.periodo}
              style={styles.coluna}
              accessible
              accessibilityLabel={descricaoDaBarra(semana.periodo, semana.caixas)}>
              <Text style={styles.valor}>{semana.caixas}</Text>
              <View style={[styles.barra, fraca && styles.barraFraca, { height: altura }]} />
            </View>
          );
        })}
      </View>

      {/* aria-hidden: as barras e a linha já dizem isso ao leitor de tela, no Android, no iPhone e na web. */}
      <View style={styles.rotulos} aria-hidden>
        {semanas.map((semana) => (
          <Text key={semana.periodo} style={styles.rotulo}>
            {diasDoPeriodo(semana.periodo)[0]}
          </Text>
        ))}
      </View>

      <View style={styles.legenda} aria-hidden>
        <View style={styles.legendaTracos}>
          <View style={styles.traco} />
          <View style={styles.traco} />
          <View style={styles.traco} />
        </View>
        <Text style={styles.legendaTexto}>Carga mínima: {cargaMinima} caixas</Text>
      </View>
    </View>
  );
}
