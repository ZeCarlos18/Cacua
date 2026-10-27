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
  /** Cor fixa, para selos que não são do dia (o canal do produtor, por exemplo). */
  cor?: CorDoSelo;
};

/**
 * Selo do dia (S2.3): verde para "Vale a pena", amarelo para "Vale com atenção"
 * e vermelho para "Não vale a pena". Usado na Agenda e na Conta do dia (S2.4).
 */
export function Selo({ texto, cor }: SeloProps) {
  const estilo = coresDoSelo[cor ?? COR_POR_SELO[texto] ?? 'vermelho'];

  return (
    <View style={[styles.selo, estilo.fundo]}>
      <Text style={[styles.texto, estilo.texto]}>{texto}</Text>
    </View>
  );
}
