import { useState } from 'react';

import { Lista } from '@/components/lista';
import { Pilulas } from '@/components/pilulas';
import { RotaDoDia, RotaNaoEncontrada } from '@/components/rota-do-dia';
import { Tela } from '@/components/tela';
import { posto, produtores, rota } from '@/data/dados';
import { useCacua } from '@/state/cacua';
import { calcularLucroDoDia } from '@/utils/calculos';
import { areaDoMapa } from '@/utils/mapa-rota';
import { montarRota } from '@/utils/rota';
import { nomesDosProdutores, subtituloDaRota, textoDoDia } from '@/utils/rota-do-dia';

/**
 * Rota do dia (S3.3): as paradas na ordem da montarRota e o "Registrar coleta" de cada uma. Desde
 * o S5.4, o coletor escolhe o dia nas pílulas; cada dia tem a sua rota, o seu km e as suas coletas.
 */
export default function RotaScreen() {
  const { agenda, custos, precos, coletas, registrarColeta } = useCacua();
  // Começa no dia da rota do dados.js (a quinta), como antes.
  const [data, setData] = useState(rota.data);
  const dia = agenda.find((item) => item.data === data);

  const escolhaDoDia = (
    <Pilulas
      opcoes={agenda.map((item) => ({ valor: item.data, texto: textoDoDia(item) }))}
      escolhida={data}
      onEscolher={setData}
    />
  );

  if (!dia) {
    return (
      <Tela titulo="Rota do dia">
        {escolhaDoDia}
        <RotaNaoEncontrada />
      </Tela>
    );
  }

  const { paradas, km, semPosicao } = montarRota(dia, produtores, posto);

  return (
    <Tela titulo="Rota do dia" descricao={subtituloDaRota(dia.dia, rota.saida)}>
      {escolhaDoDia}
      <Lista>
        <RotaDoDia
          dia={dia}
          paradas={paradas}
          km={km}
          conta={calcularLucroDoDia({ ...dia, km }, precos, custos)}
          coletados={coletas[dia.data] ?? []}
          semPosicao={nomesDosProdutores(semPosicao, produtores)}
          posto={posto}
          area={areaDoMapa(posto, produtores)}
          onRegistrar={(produtor) => registrarColeta(dia.data, produtor)}
        />
      </Lista>
    </Tela>
  );
}
