import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

import { Lista } from '@/components/lista';
import { Pilulas } from '@/components/pilulas';
import { RotaDoDia, RotaNaoEncontrada } from '@/components/rota-do-dia';
import { Tela } from '@/components/tela';
import { posto, produtores, rota } from '@/data/dados';
import { useCacua } from '@/state/cacua';
import { calcularLucroDoDia } from '@/utils/calculos';
import { diaPeloId } from '@/utils/conta';
import { areaDoMapa } from '@/utils/mapa-rota';
import { rotuloDoDia } from '@/utils/aviso';
import { montarRota } from '@/utils/rota';
import { nomesDosProdutores, subtituloDaRota } from '@/utils/rota-do-dia';

/**
 * Rota do dia (S3.3): as paradas na ordem da montarRota e o "Registrar coleta" de cada uma. Desde
 * o S5.4, o coletor escolhe o dia nas pílulas; cada dia tem a sua rota, o seu km e as suas coletas.
 */
export default function RotaScreen() {
  const { agenda, custos, precos, coletas, registrarColeta } = useCacua();
  // O Início abre a Rota já num dia (/rota?dia=01-out). Sem o dia, começa na rota do dados.js (a quinta).
  const { dia: diaPedido } = useLocalSearchParams<{ dia?: string }>();
  const [data, setData] = useState(() => diaPeloId(agenda, diaPedido ?? '')?.data ?? rota.data);
  // A aba continua aberta entre uma visita e outra: se o Início pedir outro dia, troca o dia escolhido.
  const [ultimoPedido, setUltimoPedido] = useState(diaPedido);
  if (diaPedido !== ultimoPedido) {
    setUltimoPedido(diaPedido);
    const pedido = diaPeloId(agenda, diaPedido ?? '');
    if (pedido) setData(pedido.data);
  }
  const dia = agenda.find((item) => item.data === data);

  const escolhaDoDia = (
    <Pilulas
      opcoes={agenda.map((item) => ({ valor: item.data, texto: rotuloDoDia(item) }))}
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
    // O horário de saída do dados.js é só o da rota de quinta; nos outros dias o app não sabe.
    <Tela
      titulo="Rota do dia"
      descricao={subtituloDaRota(dia.dia, dia.data === rota.data ? rota.saida : undefined)}>
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
