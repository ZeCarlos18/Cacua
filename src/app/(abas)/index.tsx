import { AvisoPrecoAntigo } from '@/components/aviso-preco-antigo';
import { Lista } from '@/components/lista';
import { PainelInicio } from '@/components/painel-inicio';
import { Tela } from '@/components/tela';
import { coletor, posto, previsao, rota } from '@/data/dados';
import { useCacua } from '@/state/cacua';
import { diaComEntregas } from '@/utils/coleta';
import { diasSemConfirmacao, primeiraSemanaFraca, resumoDaSemana, resumoDoDia } from '@/utils/inicio';
import { frutasComPrecoAntigo, hojeNoCelular } from '@/utils/preco-do-ceasa';

/**
 * Início (S6.5): a primeira aba, com o resumo da semana do coletor. "Hoje" é o dia da rota do
 * dados.js (a quinta), como na Rota.
 */
export default function InicioScreen() {
  const estado = useCacua();
  // Os produtores vêm do estado (S7.1), junto com a agenda e as coletas.
  const dados = { ...estado, posto };
  // As caixas que vieram na coleta valem no "Hoje", na semana e nas coletas para confirmar (S7.6).
  const agenda = estado.agenda.map((dia) => diaComEntregas(dia, estado.entregas));
  const hoje = agenda.find((dia) => dia.data === rota.data);
  // Os preços do Ceasa com mais de 7 dias, pelo dia do celular, e não pelo da agenda (S8.4).
  const precosAntigos = frutasComPrecoAntigo(estado.precos, hojeNoCelular()).length;

  return (
    <Tela titulo="Início" descricao="O resumo da sua semana de coletas.">
      <Lista>
        {precosAntigos > 0 ? <AvisoPrecoAntigo quantos={precosAntigos} /> : null}
        <PainelInicio
          hoje={hoje ? resumoDoDia(hoje, dados) : null}
          saida={rota.saida}
          semana={resumoDaSemana(agenda, dados)}
          paraConfirmar={diasSemConfirmacao(agenda, estado.confirmados).map((dia) => resumoDoDia(dia, dados))}
          semanaFraca={primeiraSemanaFraca(previsao, coletor.cargaMinima)}
          cargaMinima={coletor.cargaMinima}
        />
      </Lista>
    </Tela>
  );
}
