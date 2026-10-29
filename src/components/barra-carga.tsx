import { Text, View } from 'react-native';

import { proporcaoDaCarga, textoDaCarga } from '@/utils/agenda';

import { styles } from './barra-carga.styles';

type BarraCargaProps = {
  caixas: number;
  cargaMinima: number;
  /** Troca o texto embaixo da barra (a Rota usa "Coletado 20 de 47 caixas"). */
  texto?: string;
};

/** Barra de carga do dia: "47 de 60 caixas · faltam 13". */
export function BarraCarga({ caixas, cargaMinima, texto }: BarraCargaProps) {
  const largura = `${proporcaoDaCarga(caixas, cargaMinima) * 100}%` as const;

  return (
    <View style={styles.barraCarga}>
      <View
        style={styles.trilho}
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 0, max: cargaMinima, now: Math.min(caixas, cargaMinima) }}>
        <View style={[styles.preenchimento, { width: largura }]} />
      </View>
      <Text style={styles.texto}>{texto ?? textoDaCarga(caixas, cargaMinima)}</Text>
    </View>
  );
}
