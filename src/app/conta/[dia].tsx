import { Stack, useLocalSearchParams } from 'expo-router';

import { ContaDoDia, ContaNaoEncontrada } from '@/components/conta-do-dia';
import { coletor, posto, produtores } from '@/data/dados';
import { useCacua } from '@/state/cacua';
import { calcularLucroDoDia } from '@/utils/calculos';
import { diaPeloId, tituloDaConta } from '@/utils/conta';
import { diaComKm } from '@/utils/rota';

/** Conta do dia (S2.4): abre pelo "Ver conta" da Agenda, em /conta/01-out. */
export default function ContaScreen() {
  const { dia: id } = useLocalSearchParams<{ dia: string }>();
  const { agenda, custos, precos } = useCacua();
  const dia = diaPeloId(agenda, id);

  if (!dia) {
    return (
      <>
        <Stack.Screen options={{ title: 'Conta do dia' }} />
        <ContaNaoEncontrada />
      </>
    );
  }

  const diaDaRota = diaComKm(dia, produtores, posto);

  return (
    <>
      <Stack.Screen options={{ title: tituloDaConta(dia.dia) }} />
      <ContaDoDia
        dia={diaDaRota}
        conta={calcularLucroDoDia(diaDaRota, precos, custos)}
        custos={custos}
        produtores={produtores}
        cargaMinima={coletor.cargaMinima}
      />
    </>
  );
}
