import { Image } from 'expo-image';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Cacua, Spacing } from '@/constants/theme';
import { coletor, produtores } from '@/data/dados';

export function Topo() {
  const insets = useSafeAreaInsets();
  const espacoTopo = Platform.OS === 'web' ? Spacing.three : insets.top + Spacing.two;

  return (
    <View style={[styles.topo, { paddingTop: espacoTopo }]}>
      <Image source={require('@/assets/images/logo-cacua.png')} style={styles.logo} />
      <View>
        <Text style={styles.ola}>Olá, {coletor.nome}</Text>
        <Text style={styles.regiao}>
          {coletor.regiao} · {produtores.length} produtores
        </Text>
      </View>
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
