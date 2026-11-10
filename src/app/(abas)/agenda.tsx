import { BotaoRegistrarAviso } from '@/components/botao-registrar-aviso';
import { CartaoDia } from '@/components/cartao-dia';
import { Lista } from '@/components/lista';
import { Tela } from '@/components/tela';
import { coletor, posto } from '@/data/dados';
import { useCacua } from '@/state/cacua';
import { calcularLucroDoDia } from '@/utils/calculos';
import { diaComKm } from '@/utils/rota';

export default function AgendaScreen() {
  const { agenda, produtores, custos, precos, confirmados } = useCacua();

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
