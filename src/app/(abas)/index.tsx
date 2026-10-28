import { CartaoDia } from '@/components/cartao-dia';
import { Lista } from '@/components/lista';
import { Tela } from '@/components/tela';
import { agenda, coletor, custos, posto, precos, produtores } from '@/data/dados';
import { calcularLucroDoDia } from '@/utils/calculos';
import { diaComKm } from '@/utils/rota';

export default function AgendaScreen() {
  return (
    <Tela titulo="Agenda" descricao="Próximas coletas e se vale a pena passar em cada dia.">
      <Lista>
        {agenda.map((dia) => (
          <CartaoDia
            key={dia.data}
            dia={dia}
            conta={calcularLucroDoDia(diaComKm(dia, produtores, posto), precos, custos)}
            cargaMinima={coletor.cargaMinima}
          />
        ))}
      </Lista>
    </Tela>
  );
}
