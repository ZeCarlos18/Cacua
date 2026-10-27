import { Text, View } from 'react-native';

import { styles } from './aviso-semana-fraca.styles';

type AvisoSemanaFracaProps = {
  periodo: string;
  caixas: number;
  cargaMinima: number;
};

/** Aviso da Previsão (S2.6) para a semana em que nenhuma viagem enche. */
export function AvisoSemanaFraca({ periodo, caixas, cargaMinima }: AvisoSemanaFracaProps) {
  return (
    <View style={styles.aviso}>
      <Text style={styles.texto}>
        <Text style={styles.negrito}>Semana fraca: {periodo}, com {caixas} caixas.</Text> Não
        dá para encher nenhuma viagem de {cargaMinima} caixas.
      </Text>
    </View>
  );
}
