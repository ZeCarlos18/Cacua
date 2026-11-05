import { Pressable, Text, View } from 'react-native';

import { styles } from './confirmar-coleta.styles';

type ConfirmarColetaProps = {
  /** Se o dia já está em `confirmados` (S5.1). */
  confirmado: boolean;
  onConfirmar: () => void;
  onDesfazer: () => void;
};

/**
 * Fim da Conta do dia (S5.5): o botão "Confirmar coleta" e, depois de confirmar, o aviso de que os
 * produtores recebem a confirmação na véspera, com o botão "Desfazer". Enquanto o chatbot não
 * existe, o aviso aos produtores é só este texto na tela.
 */
export function ConfirmarColeta({ confirmado, onConfirmar, onDesfazer }: ConfirmarColetaProps) {
  if (!confirmado) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityHint="Marca a coleta deste dia como confirmada"
        onPress={onConfirmar}
        style={({ pressed }) => [styles.botao, pressed && styles.botaoPressionado]}>
        <Text style={styles.botaoTexto}>Confirmar coleta</Text>
      </Pressable>
    );
  }

  return (
    <View style={styles.confirmada} accessibilityLiveRegion="polite">
      <Text style={styles.confirmadaTexto}>
        <Text style={styles.forte}>Coleta confirmada.</Text> Os produtores recebem a confirmação na
        véspera.
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Desfazer a confirmação da coleta"
        onPress={onDesfazer}
        style={({ pressed }) => [styles.desfazer, pressed && styles.desfazerPressionado]}>
        <Text style={styles.desfazerTexto}>Desfazer</Text>
      </Pressable>
    </View>
  );
}
