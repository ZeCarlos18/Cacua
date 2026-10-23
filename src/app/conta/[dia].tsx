import { Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { ContaDoDia } from '@/components/conta-do-dia';
import { Cacua, Spacing } from '@/constants/theme';
import { agenda, coletor, custos, precos, produtores } from '@/data/dados';
import { calcularLucroDoDia } from '@/utils/calculos';
import { diaPeloId, tituloDaConta } from '@/utils/conta';

/** Conta do dia (S2.4): abre pelo "Ver conta" da Agenda, em /conta/01-out. */
export default function ContaScreen() {
  const { dia: id } = useLocalSearchParams<{ dia: string }>();
  const dia = diaPeloId(agenda, id);

  if (!dia) {
    return (
      <View style={styles.vazio}>
        <Stack.Screen options={{ title: 'Conta do dia' }} />
        <Text style={styles.vazioTexto}>Não achamos esse dia na agenda.</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: tituloDaConta(dia.dia) }} />
      <ContaDoDia
        dia={dia}
        conta={calcularLucroDoDia(dia, precos, custos)}
        custos={custos}
        produtores={produtores}
        cargaMinima={coletor.cargaMinima}
      />
    </>
  );
}

const styles = StyleSheet.create({
  vazio: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
    backgroundColor: Cacua.fundo,
  },
  vazioTexto: {
    fontSize: 16,
    lineHeight: 22,
    color: Cacua.textoSecundario,
  },
});
