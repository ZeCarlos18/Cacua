import { BotaoRegistrarAviso } from '@/components/botao-registrar-aviso';
import { CartaoDia } from '@/components/cartao-dia';
import { Lista } from '@/components/lista';
import { Tela } from '@/components/tela';
import { coletor, posto, produtores } from '@/data/dados';
import { useCacua } from '@/state/cacua';
import { calcularLucroDoDia } from '@/utils/calculos';
import { diaComKm } from '@/utils/rota';

/** Agenda (S2.3): os dias com aviso, se vale a pena passar e o "Registrar aviso" (S4.4). */
export default function AgendaScreen() {
  const { agenda, custos, precos, confirmados } = useCacua();

  return (
    <Tela titulo="Agenda" descricao="Próximas coletas e se vale a pena passar em cada dia.">
      <Lista>
        <BotaoRegistrarAviso />
        {agenda.map((dia) => (
          <CartaoDia
            key={dia.data}
            dia={dia}
            conta={calcularLucroDoDia(diaComKm(dia, produtores, posto), precos, custos)}
            cargaMinima={coletor.cargaMinima}
            confirmado={confirmados.includes(dia.data)}
          />
        ))}
      </Lista>
    </Tela>
  );
}
