import { router } from 'expo-router';
import { Pressable, Text } from 'react-native';

import { styles } from './botao-registrar-aviso.styles';

/** Botão no topo da Agenda (S4.4) que abre o formulário "Registrar aviso" por cima das abas. */
export function BotaoRegistrarAviso() {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Registrar aviso"
      onPress={() => router.push('/aviso/novo')}
      style={({ pressed }) => [styles.botao, pressed && styles.botaoPressionado]}>
      <Text style={styles.texto}>+ Registrar aviso</Text>
    </Pressable>
  );
}
