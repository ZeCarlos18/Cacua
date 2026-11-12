import { Stack, useLocalSearchParams } from 'expo-router';

import { ContaDoDia, ContaNaoEncontrada } from '@/components/conta-do-dia';
import { coletor, posto } from '@/data/dados';
import { useCacua } from '@/state/cacua';
import { calcularLucroDoDia } from '@/utils/calculos';
import { diaComEntregas } from '@/utils/coleta';
import { diaPeloId, tituloDaConta } from '@/utils/conta';
import { diaComKm } from '@/utils/rota';

/**
 * Conta do dia (S2.4): abre pelo "Ver conta" da Agenda, em /conta/01-out. No fim, o coletor
 * confirma a coleta do dia (S5.5), e a confirmação fica salva no celular (S5.1). Desde o S7.5, o
 * "Quem avisou" muda as caixas ou tira o aviso da agenda.
 */
export default function ContaScreen() {
  const { dia: id } = useLocalSearchParams<{ dia: string }>();
  const {
    agenda,
    produtores,
    custos,
    precos,
    coletas,
    confirmados,
    entregas,
    confirmarDia,
    desfazerConfirmacao,
    mudarCaixasDoAviso,
    tirarAviso,
  } = useCacua();
  const dia = diaPeloId(agenda, id);

  if (!dia) {
    return (
      <>
        <Stack.Screen options={{ title: 'Conta do dia' }} />
        <ContaNaoEncontrada />
      </>
    );
  }

  // As caixas que vieram na coleta valem na conta do dia (S7.6).
  const diaDaRota = diaComKm(diaComEntregas(dia, entregas), produtores, posto);

  return (
    <>
      <Stack.Screen options={{ title: tituloDaConta(dia.dia) }} />
      <ContaDoDia
        dia={diaDaRota}
        conta={calcularLucroDoDia(diaDaRota, precos, custos)}
        custos={custos}
        produtores={produtores}
        cargaMinima={coletor.cargaMinima}
        confirmado={confirmados.includes(dia.data)}
        coletados={coletas[dia.data] ?? []}
        onConfirmar={() => confirmarDia(dia.data)}
        onDesfazer={() => desfazerConfirmacao(dia.data)}
        // Vai junto o aviso que a tela mostrou: se a lista mudou antes do toque (dois toques no
        // "Sim, tirar"), nada muda (S7.2).
        onMudarCaixas={(posicao, caixas) => mudarCaixasDoAviso(dia.data, posicao, caixas, dia.avisos[posicao])}
        onTirar={(posicao) => tirarAviso(dia.data, posicao, dia.avisos[posicao])}
      />
    </>
  );
}
