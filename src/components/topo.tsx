import { Image } from 'expo-image';
import { Platform, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Spacing } from '@/constants/theme';
import { produtores } from '@/data/dados';
import { useAcesso, useColetor } from '@/state/acesso';

import { styles } from './topo.styles';

/** Topo das abas (S1.5): o nome e a região de quem entrou (S6.4) e o botão Sair. */
export function Topo() {
  const insets = useSafeAreaInsets();
  const espacoTopo = Platform.OS === 'web' ? Spacing.three : insets.top + Spacing.two;
  const coletor = useColetor();
  const { sair } = useAcesso();

  return (
    <View style={[styles.topo, { paddingTop: espacoTopo }]}>
      <Image source={require('@/assets/images/logo-cacua.png')} style={styles.logo} />
      <View style={styles.textos}>
        <Text style={styles.ola}>Olá, {coletor.nome}</Text>
        <Text style={styles.regiao}>
          {coletor.regiao} · {produtores.length} produtores
        </Text>
      </View>
      {/* Sair só esquece quem entrou: a agenda, as coletas e os custos continuam salvos. */}
      <Pressable
        accessibilityRole="button"
        accessibilityHint="Volta para a tela Entrar"
        onPress={sair}
        hitSlop={8}
        style={({ pressed }) => [styles.sair, pressed && styles.sairPressionado]}>
        <Text style={styles.sairTexto}>Sair</Text>
      </Pressable>
    </View>
  );
}
