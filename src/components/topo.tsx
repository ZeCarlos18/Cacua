import { Image } from 'expo-image';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Cacua, Spacing } from '@/constants/theme';
import { produtores } from '@/data/dados';
import { useAcesso, useColetor } from '@/state/acesso';

/** O topo de todas as abas: o logo, o nome do coletor que entrou, a região dele e o "Sair". */
export function Topo() {
  const insets = useSafeAreaInsets();
  const coletor = useColetor();
  const { sair } = useAcesso();
  const espacoTopo = Platform.OS === 'web' ? Spacing.three : insets.top + Spacing.two;

  return (
    <View style={[styles.topo, { paddingTop: espacoTopo }]}>
      <Image source={require('@/assets/images/logo-cacua.png')} style={styles.logo} />
      <View style={styles.textos}>
        <Text style={styles.ola} numberOfLines={1}>
          Olá, {coletor.nome}
        </Text>
        <Text style={styles.regiao} numberOfLines={1}>
          {coletor.regiao} · {produtores.length} produtores
        </Text>
      </View>
      {/* Sair não apaga nada: a agenda e os custos continuam no celular para a próxima vez. */}
      <Pressable
        accessibilityRole="button"
        accessibilityHint="Sai da conta e volta para a tela Entrar"
        onPress={sair}
        hitSlop={8}
        style={({ pressed }) => [styles.sair, pressed && styles.sairPressionado]}>
        <Text style={styles.sairTexto}>Sair</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  topo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.three,
    backgroundColor: Cacua.superficie,
    borderBottomWidth: 1,
    borderBottomColor: Cacua.borda,
  },
  textos: {
    flex: 1,
  },
  sair: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two + Spacing.one,
    borderWidth: 1,
    borderColor: Cacua.borda,
  },
  sairPressionado: {
    backgroundColor: Cacua.fundo,
  },
  sairTexto: {
    fontSize: 15,
    fontWeight: 700,
    color: Cacua.textoSecundario,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  ola: {
    fontSize: 22,
    fontWeight: 700,
    color: Cacua.texto,
  },
  regiao: {
    fontSize: 15,
    color: Cacua.textoSecundario,
  },
});
