import { Text, View } from 'react-native';

import { SELOS } from '@/utils/calculos';

import { coresDoSelo, styles, type CorDoSelo } from './selo.styles';

const COR_POR_SELO: Record<string, CorDoSelo> = {
  [SELOS.valeAPena]: 'verde',
  [SELOS.valeComAtencao]: 'amarelo',
  [SELOS.naoVale]: 'vermelho',
};

type SeloProps = {
  /** Um dos textos de SELOS (calculos.js), por exemplo o `selo` que sai do calcularLucroDoDia. */
  texto: string;
};

/**
 * Selo do dia (S2.3): verde para "Vale a pena", amarelo para "Vale com atenção"
 * e vermelho para "Não vale a pena". Usado na Agenda e na Conta do dia (S2.4).
 */
export function Selo({ texto }: SeloProps) {
  const cor = coresDoSelo[COR_POR_SELO[texto] ?? 'vermelho'];

  return (
    <View style={[styles.selo, cor.fundo]}>
      <Text style={[styles.texto, cor.texto]}>{texto}</Text>
    </View>
  );
}
