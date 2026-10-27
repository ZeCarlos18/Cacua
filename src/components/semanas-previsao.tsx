import { Text, View } from 'react-native';

import { Selo } from '@/components/selo';
import type { previsao } from '@/data/dados';
import { textoDasFrutas, textoDasViagens, viagensCheias } from '@/utils/previsao';

import { styles } from './semanas-previsao.styles';

type Semana = (typeof previsao)[number];

type SemanasPrevisaoProps = {
  semanas: Semana[];
  cargaMinima: number;
};

/** Cartão da Previsão (S2.6) com uma linha por semana. */
export function SemanasPrevisao({ semanas, cargaMinima }: SemanasPrevisaoProps) {
  return (
    <View style={styles.cartao}>
      {semanas.map((semana, indice) => (
        <LinhaDaSemana
          key={semana.periodo}
          semana={semana}
          cargaMinima={cargaMinima}
          primeira={indice === 0}
        />
      ))}
    </View>
  );
}

type LinhaDaSemanaProps = {
  semana: Semana;
  cargaMinima: number;
  primeira: boolean;
};

/** Período e selo "Avisado"/"Previsto"; caixas e viagens cheias; frutas. */
function LinhaDaSemana({ semana, cargaMinima, primeira }: LinhaDaSemanaProps) {
  const viagens = viagensCheias(semana.caixas, cargaMinima);

  return (
    <View style={[styles.semana, !primeira && styles.divisoria]}>
      <View style={styles.cabecalho}>
        <Text style={styles.periodo}>{semana.periodo}</Text>
        <Selo
          texto={semana.avisado ? 'Avisado' : 'Previsto'}
          cor={semana.avisado ? 'verde' : 'neutro'}
        />
      </View>
      <Text style={styles.caixas}>
        <Text style={styles.negrito}>{semana.caixas} caixas</Text> · {textoDasViagens(viagens)}
      </Text>
      <Text style={styles.frutas}>{textoDasFrutas(semana.frutas)}</Text>
    </View>
  );
}
