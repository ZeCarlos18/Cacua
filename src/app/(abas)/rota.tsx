import { Lista } from '@/components/lista';
import { RotaDoDia, RotaNaoEncontrada } from '@/components/rota-do-dia';
import { Tela } from '@/components/tela';
import { posto, produtores, rota } from '@/data/dados';
import { useCacua } from '@/state/cacua';
import { calcularLucroDoDia } from '@/utils/calculos';
import { areaDoMapa } from '@/utils/mapa-rota';
import { montarRota } from '@/utils/rota';
import { nomesDosProdutores, subtituloDaRota } from '@/utils/rota-do-dia';

/** Rota do dia (S3.3): as paradas na ordem da montarRota e o "Registrar coleta" de cada uma. */
export default function RotaScreen() {
  const { agenda, custos, precos, coletados, registrarColeta } = useCacua();
  const dia = agenda.find((item) => item.data === rota.data);

  if (!dia) {
    return (
      <Tela titulo="Rota do dia">
        <RotaNaoEncontrada />
      </Tela>
    );
  }

  const { paradas, km, semPosicao } = montarRota(dia, produtores, posto);

  return (
    <Tela titulo="Rota do dia" descricao={subtituloDaRota(dia.dia, rota.saida)}>
      <Lista>
        <RotaDoDia
          paradas={paradas}
          km={km}
          conta={calcularLucroDoDia({ ...dia, km }, precos, custos)}
          coletados={coletados}
          semPosicao={nomesDosProdutores(semPosicao, produtores)}
          posto={posto}
          area={areaDoMapa(posto, produtores)}
          onRegistrar={registrarColeta}
        />
      </Lista>
    </Tela>
  );
}
