import { router } from 'expo-router';
import { Pressable, Text } from 'react-native';

import { styles } from './botao-registrar-aviso.styles';

/**
 * Botão no topo da aba Produtores (S7.4) que abre o formulário "Novo produtor" por cima das abas.
 * Tem a mesma cara do "+ Registrar aviso" da Agenda.
 */
export function BotaoNovoProdutor() {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Novo produtor"
      onPress={() => router.push('/produtor/novo')}
      style={({ pressed }) => [styles.botao, pressed && styles.botaoPressionado]}>
      <Text style={styles.texto}>+ Novo produtor</Text>
    </Pressable>
  );
}
