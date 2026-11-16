import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { styles } from './aviso-preco-antigo.styles';

type AvisoPrecoAntigoProps = {
  /** Quantos preços do Ceasa têm mais de 7 dias (frutasComPrecoAntigo, S8.1). */
  quantos: number;
};

/** "5 preços do Ceasa têm mais de 7 dias." ou, com um só, "1 preço do Ceasa tem mais de 7 dias." */
function textoDosPrecos(quantos: number) {
  return quantos === 1
    ? '1 preço do Ceasa tem mais de 7 dias.'
    : `${quantos} preços do Ceasa têm mais de 7 dias.`;
}

/**
 * Aviso do Início (S8.4) quando há preço do Ceasa antigo: o recibo (S8.2) mostra o preço ao
 * produtor, e um preço velho mostrado como se fosse de hoje engana. "Atualizar preços" abre Custos e
 * preços. Sem preço antigo, o Início não mostra o aviso.
 */
export function AvisoPrecoAntigo({ quantos }: AvisoPrecoAntigoProps) {
  return (
    <View style={styles.aviso} accessibilityLiveRegion="polite">
      <Text style={styles.texto}>
        <Text style={styles.negrito}>{textoDosPrecos(quantos)}</Text> Atualize antes de mandar os
        recibos.
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityHint="Abre Custos e preços"
        onPress={() => router.push('/custos')}
        style={({ pressed }) => [styles.botao, pressed && styles.botaoPressionado]}>
        <Text style={styles.botaoTexto}>Atualizar preços</Text>
      </Pressable>
    </View>
  );
}
