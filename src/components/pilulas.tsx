import { Pressable, Text, View } from 'react-native';

import { styles } from './pilulas.styles';

type Opcao<T> = { valor: T; texto: string };

type PilulasProps<T extends string | number> = {
  opcoes: Opcao<T>[];
  escolhida: T | null;
  onEscolher: (valor: T) => void;
};

/**
 * Botões de escolha única em forma de pílula (S4.4): a escolhida fica verde. Para o leitor de
 * tela, cada um é um "radio" marcado ou não.
 */
export function Pilulas<T extends string | number>({ opcoes, escolhida, onEscolher }: PilulasProps<T>) {
  return (
    <View style={styles.pilulas} accessibilityRole="radiogroup">
      {opcoes.map((opcao) => {
        const marcada = opcao.valor === escolhida;
        return (
          <Pressable
            key={String(opcao.valor)}
            accessibilityRole="radio"
            aria-checked={marcada}
            onPress={() => onEscolher(opcao.valor)}
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
