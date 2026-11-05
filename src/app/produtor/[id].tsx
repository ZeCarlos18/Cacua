import { Stack, useLocalSearchParams } from 'expo-router';

import { DetalhesDoProdutor, ProdutorNaoEncontrado } from '@/components/detalhes-produtor';
import { pontoFocal, posto, produtores } from '@/data/dados';
import { useCacua } from '@/state/cacua';
import { estadoInicial } from '@/state/estado';
import {
  avisosDoProdutor,
  historicoDoProdutor,
  proximaColheita,
  taxaDeCumprimento,
} from '@/utils/produtores';
import { kmEntre } from '@/utils/rota';

/**
 * Detalhes do produtor: abre ao tocar num produtor da aba Produtores, em /produtor/4. Mostra o
 * sítio, como ele avisa, a distância do posto, os avisos cumpridos e os avisos da semana.
 */
export default function ProdutorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { agenda, precos, custos, coletas, confirmados } = useCacua();
  const produtor = produtores.find((item) => String(item.id) === id);

  if (!produtor) {
    return (
      <>
        <Stack.Screen options={{ title: 'Produtor' }} />
        <ProdutorNaoEncontrado />
      </>
    );
  }

  // As coletas que já vêm do dados.js (a Dona Maria na quinta) já estão no histórico (S5.6).
  const historico = historicoDoProdutor(produtor, coletas, estadoInicial().coletas);

  return (
    <>
      <Stack.Screen options={{ title: produtor.nome }} />
      <DetalhesDoProdutor
        produtor={produtor}
        historico={historico}
        taxa={taxaDeCumprimento(historico)}
        km={kmEntre(posto, produtor.posicao)}
        proximaColheita={proximaColheita(produtor, agenda)}
        avisos={avisosDoProdutor(produtor, agenda, precos, custos.pagoProdutor, coletas, confirmados)}
        pagoProdutor={custos.pagoProdutor}
        pontoFocal={pontoFocal}
      />
    </>
  );
}
