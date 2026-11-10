import { Pressable, Text, View } from 'react-native';

import { styles } from './pilulas.styles';

type Opcao<T> = { valor: T; texto: string };

type PilulasVariasProps<T extends string | number> = {
  opcoes: Opcao<T>[];
  escolhidas: T[];
  onMudar: (escolhidas: T[]) => void;
};

/**
 * Pílulas que ligam e desligam, mais de uma ao mesmo tempo (S7.4), como as frutas do produtor
 * novo. Têm a mesma cara do Pilulas (S4.4), que escolhe uma só. Para o leitor de tela, cada uma é
 * uma caixa de marcar.
 */
export function PilulasVarias<T extends string | number>({ opcoes, escolhidas, onMudar }: PilulasVariasProps<T>) {
  return (
    <View style={styles.pilulas}>
      {opcoes.map((opcao) => {
        const marcada = escolhidas.includes(opcao.valor);
        return (
          <Pressable
            key={String(opcao.valor)}
            accessibilityRole="checkbox"
            aria-checked={marcada}
            onPress={() =>
              onMudar(marcada ? escolhidas.filter((valor) => valor !== opcao.valor) : [...escolhidas, opcao.valor])
            }
            style={({ pressed }) => [
              styles.pilula,
              pressed && styles.pilulaPressionada,
              marcada && styles.pilulaMarcada,
            ]}>
            <Text style={[styles.texto, marcada && styles.textoMarcado]}>{opcao.texto}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
