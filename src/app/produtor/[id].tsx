import { useLocalSearchParams } from 'expo-router';

import { DetalhesProdutor, ProdutorNaoEncontrado } from '@/components/detalhes-produtor';
import { Lista } from '@/components/lista';
import { Tela } from '@/components/tela';
import { pontoFocal, posto, produtores } from '@/data/dados';
import { useCacua } from '@/state/cacua';
import { estadoInicial } from '@/state/estado';
import {
  avisosDoProdutor,
  comoAvisa,
  historicoDoProdutor,
  proximaColheita,
  taxaDeCumprimento,
  totalDosAvisos,
} from '@/utils/produtores';
import { kmEntre } from '@/utils/rota';

/**
 * Detalhes do produtor (S6.6): abre pela aba Produtores, em /produtor/4, por cima das abas. O
 * nome do produtor vai para a barra de cima, com o voltar (Tela com cabecalhoNativo, S6.3).
 */
export default function ProdutorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { agenda, precos, custos, coletas, confirmados } = useCacua();
  const produtor = produtores.find((item) => String(item.id) === id);

  if (!produtor) {
    return (
      <Tela titulo="Produtor" cabecalhoNativo>
        <ProdutorNaoEncontrado />
      </Tela>
    );
  }

  // Os avisos cumpridos somam as coletas registradas no app, como na aba Produtores (S5.6).
  const historico = historicoDoProdutor(produtor, coletas, estadoInicial().coletas);
  const avisos = avisosDoProdutor(produtor, agenda, precos, custos.pagoProdutor, coletas, confirmados);

  return (
    <Tela titulo={produtor.nome} cabecalhoNativo>
      <Lista>
        <DetalhesProdutor
          produtor={produtor}
          km={kmEntre(posto, produtor.posicao)}
          proximaColheita={proximaColheita(produtor, agenda)}
          comoAvisa={comoAvisa(produtor.canal, pontoFocal)}
          historico={historico}
          taxa={taxaDeCumprimento(historico)}
          avisos={avisos}
          total={totalDosAvisos(avisos)}
          pagoProdutor={custos.pagoProdutor}
        />
      </Lista>
    </Tela>
  );
}
