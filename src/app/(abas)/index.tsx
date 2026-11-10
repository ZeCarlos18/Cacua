import { Lista } from '@/components/lista';
import { PainelInicio } from '@/components/painel-inicio';
import { Tela } from '@/components/tela';
import { coletor, posto, previsao, rota } from '@/data/dados';
import { useCacua } from '@/state/cacua';
import { diasSemConfirmacao, primeiraSemanaFraca, resumoDaSemana, resumoDoDia } from '@/utils/inicio';

/**
 * Início (S6.5): a primeira aba, com o resumo da semana do coletor. "Hoje" é o dia da rota do
 * dados.js (a quinta), como na Rota.
 */
export default function InicioScreen() {
  const estado = useCacua();
  // Os produtores vêm do estado (S7.1), junto com a agenda e as coletas.
  const dados = { ...estado, posto };
  const hoje = estado.agenda.find((dia) => dia.data === rota.data);

  return (
    <Tela titulo="Início" descricao="O resumo da sua semana de coletas.">
      <Lista>
        <PainelInicio
          hoje={hoje ? resumoDoDia(hoje, dados) : null}
          saida={rota.saida}
          semana={resumoDaSemana(estado.agenda, dados)}
          paraConfirmar={diasSemConfirmacao(estado.agenda, estado.confirmados).map((dia) => resumoDoDia(dia, dados))}
          semanaFraca={primeiraSemanaFraca(previsao, coletor.cargaMinima)}
          cargaMinima={coletor.cargaMinima}
        />
      </Lista>
    </Tela>
  );
}
