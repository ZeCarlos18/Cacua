import { Stack, useLocalSearchParams } from 'expo-router';

import { ContaDoDia, ContaNaoEncontrada } from '@/components/conta-do-dia';
import { agenda, coletor, custos, precos, produtores } from '@/data/dados';
import { calcularLucroDoDia } from '@/utils/calculos';
import { diaPeloId, tituloDaConta } from '@/utils/conta';

/** Conta do dia (S2.4): abre pelo "Ver conta" da Agenda, em /conta/01-out. */
export default function ContaScreen() {
  const { dia: id } = useLocalSearchParams<{ dia: string }>();
  const dia = diaPeloId(agenda, id);

  if (!dia) {
    return (
      <>
        <Stack.Screen options={{ title: 'Conta do dia' }} />
        <ContaNaoEncontrada />
      </>
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
