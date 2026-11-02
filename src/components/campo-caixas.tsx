import { Pressable, Text, TextInput, View } from 'react-native';

import { caixasComPasso, lerCaixas } from '@/utils/aviso';

import { styles } from './campo-caixas.styles';

type CampoCaixasProps = {
  /** O que está escrito no campo (pode estar vazio ou inválido enquanto o coletor digita). */
  texto: string;
  onMudar: (texto: string) => void;
};

/** As caixas do aviso (S4.4): "−", o campo numérico e "+". O − não desce de 1. */
export function CampoCaixas({ texto, onMudar }: CampoCaixasProps) {
  function passo(sinal: 1 | -1) {
    const caixas = caixasComPasso(lerCaixas(texto), sinal);
    onMudar(caixas === null ? '' : String(caixas));
  }

  return (
    <View style={styles.campoCaixas}>
      <BotaoDePasso texto="−" rotulo="Uma caixa a menos" onPress={() => passo(-1)} />
      <TextInput
        accessibilityLabel="Caixas"
        keyboardType="number-pad"
        placeholder="0"
        value={texto}
        onChangeText={onMudar}
        style={styles.entrada}
      />
      <BotaoDePasso texto="+" rotulo="Uma caixa a mais" onPress={() => passo(1)} />
    </View>
  );
}

type BotaoDePassoProps = {
  texto: string;
  rotulo: string;
  onPress: () => void;
};

function BotaoDePasso({ texto, rotulo, onPress }: BotaoDePassoProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={rotulo}
      onPress={onPress}
      style={({ pressed }) => [styles.botao, pressed && styles.botaoPressionado]}>
      <Text style={styles.botaoTexto}>{texto}</Text>
    </Pressable>
  );
}
