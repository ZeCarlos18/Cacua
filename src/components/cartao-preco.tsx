import { Text, View } from 'react-native';

import { CampoNumerico } from '@/components/campo-numerico';
import { Selo } from '@/components/selo';
import { capitalizar } from '@/utils/agenda';
import { precoAntigo, textoDaDataDoPreco } from '@/utils/preco-do-ceasa';

import { styles } from './cartao-preco.styles';

type CartaoPrecoProps = {
  fruta: string;
  preco: number;
  kg: number;
  /** O dia em que o preço foi atualizado, 'AAAA-MM-DD' (S8.1). */
  data: string;
  /** O dia de hoje no celular, 'AAAA-MM-DD' (hojeNoCelular). */
  hoje: string;
  onMudar: (preco: number) => void;
};

/**
 * Um preço do Ceasa em Custos e preços: a fruta, o peso da caixa e o campo do preço. Desde o S8.4,
 * embaixo, quando ele foi atualizado ("atualizado há 56 dias") e, com mais de 7 dias, o selo
 * "Preço antigo".
 */
export function CartaoPreco({ fruta, preco, kg, data, hoje, onMudar }: CartaoPrecoProps) {
  const antigo = precoAntigo(data, hoje);

  return (
    <View style={styles.cartao}>
      <Text style={styles.nome}>{capitalizar(fruta)}</Text>
      <Text style={styles.explicacao}>cx {kg} kg</Text>
      <View style={styles.campo}>
        <CampoNumerico valor={preco} unidade="reais" rotulo={`Preço da caixa de ${fruta}`} onMudar={onMudar} />
      </View>
      <Text style={[styles.data, antigo && styles.dataAntiga]}>{textoDaDataDoPreco(data, hoje)}</Text>
      {antigo ? (
        <View style={styles.selo}>
          <Selo texto="Preço antigo" cor="amarelo" />
        </View>
      ) : null}
    </View>
  );
}
