import { router, useLocalSearchParams } from 'expo-router';

import { Lista } from '@/components/lista';
import { Pilulas } from '@/components/pilulas';
import { RotaDoDia, RotaNaoEncontrada } from '@/components/rota-do-dia';
import { Tela } from '@/components/tela';
import { posto, produtores, rota } from '@/data/dados';
import { useCacua } from '@/state/cacua';
import { calcularLucroDoDia } from '@/utils/calculos';
import { areaDoMapa } from '@/utils/mapa-rota';
import { idDoDia } from '@/utils/agenda';
import { rotuloDoDia } from '@/utils/aviso';
import { diaPeloId } from '@/utils/conta';
import { montarRota } from '@/utils/rota';
import { nomesDosProdutores, subtituloDaRota } from '@/utils/rota-do-dia';

/**
 * Rota do dia (S3.3): as paradas na ordem da montarRota e o "Registrar coleta" de cada uma. Desde
 * o S5.4, o coletor escolhe o dia nas pílulas; cada dia tem a sua rota, o seu km e as suas coletas.
 *
 * O dia escolhido fica no endereço (/rota?dia=01-out, S6.5): o "Abrir a rota" do Início troca o
 * dia mesmo se a aba já estava aberta em outro, e as pílulas só atualizam o endereço.
 */
export default function RotaScreen() {
  const { agenda, custos, precos, coletas, registrarColeta } = useCacua();
  const { dia: id } = useLocalSearchParams<{ dia?: string }>();
  // Sem dia no endereço (ou com um que não está na agenda), começa no dia da rota do dados.js (a quinta).
  const dia = (id ? diaPeloId(agenda, id) : undefined) ?? agenda.find((item) => item.data === rota.data);

  const escolhaDoDia = (
    <Pilulas
      opcoes={agenda.map((item) => ({ valor: item.data, texto: rotuloDoDia(item) }))}
      escolhida={dia?.data ?? null}
      onEscolher={(data) => router.setParams({ dia: idDoDia(data) })}
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
