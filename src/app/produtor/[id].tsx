import { router, useLocalSearchParams } from 'expo-router';

import { DetalhesProdutor, ProdutorNaoEncontrado } from '@/components/detalhes-produtor';
import { Lista } from '@/components/lista';
import { Tela } from '@/components/tela';
import { pontoFocal, posto } from '@/data/dados';
import { useCacua } from '@/state/cacua';
import { estadoInicial } from '@/state/estado';
import { motivoParaNaoApagar } from '@/utils/novo-produtor';
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
 * nome do produtor vai para a barra de cima, com o voltar (Tela com cabecalhoNativo, S6.3). No fim,
 * "Editar produtor" e "Apagar produtor" (S9.4).
 */
export default function ProdutorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const estado = useCacua();
  const { agenda, produtores, custos, coletas, apagarProdutor } = estado;
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
  const avisos = avisosDoProdutor(produtor, estado);

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
          onEditar={() => router.push({ pathname: '/produtor/editar', params: { id: produtor.id } })}
          onApagar={() => {
            // Volta para Produtores antes de apagar: sem ele na lista, esta tela viraria "Não achamos
            // esse produtor" por um instante.
            router.dismissTo('/produtores');
            apagarProdutor(produtor.id);
          }}
          motivoParaNaoApagar={motivoParaNaoApagar(estado, produtor.id)}
        />
      </Lista>
    </Tela>
  );
}
