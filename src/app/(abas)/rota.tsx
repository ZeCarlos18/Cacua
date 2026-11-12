import { router, useLocalSearchParams } from 'expo-router';

import { Lista } from '@/components/lista';
import { Pilulas } from '@/components/pilulas';
import { RotaDoDia, RotaNaoEncontrada, RotaSemParadas } from '@/components/rota-do-dia';
import { Tela } from '@/components/tela';
import { posto, rota } from '@/data/dados';
import { useCacua } from '@/state/cacua';
import { calcularLucroDoDia } from '@/utils/calculos';
import { areaDoMapa } from '@/utils/mapa-rota';
import { idDoDia } from '@/utils/agenda';
import { rotuloDoDia } from '@/utils/aviso';
import { diaComEntregas } from '@/utils/coleta';
import { diaPeloId } from '@/utils/conta';
import { montarRota } from '@/utils/rota';
import { nomesDosProdutores, subtituloDaRota } from '@/utils/rota-do-dia';

/**
 * Rota do dia (S3.3): as paradas na ordem da montarRota e o "Registrar coleta" de cada uma. Desde
 * o S5.4, o coletor escolhe o dia nas pílulas; cada dia tem a sua rota, o seu km e as suas coletas.
 *
 * O dia escolhido fica no endereço (/rota?dia=01-out, S6.5): o "Abrir a rota" do Início troca o
 * dia mesmo se a aba já estava aberta em outro, e as pílulas só atualizam o endereço.
 *
 * Desde o S7.6, o "Registrar coleta" pergunta quantas caixas vieram, e a rota, a barra "Coletado",
 * o mapa e o recibo usam o que veio (diaComEntregas).
 */
export default function RotaScreen() {
  const { agenda, produtores, custos, precos, coletas, confirmados, entregas, registrarColeta, desfazerColeta } =
    useCacua();
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

  // O horário de saída do dados.js é só o da rota de quinta; nos outros dias o app não sabe.
  const descricao = subtituloDaRota(dia.dia, dia.data === rota.data ? rota.saida : undefined);

  // Todos os avisos do dia saíram (S7.2): sem aviso, não há rota.
  if (dia.avisos.length === 0) {
    return (
      <Tela titulo="Rota do dia" descricao={descricao}>
        {escolhaDoDia}
        <RotaSemParadas />
      </Tela>
    );
  }

  // As caixas que vieram valem na rota, na conta, no mapa e no recibo (S7.6).
  const diaQueVeio = diaComEntregas(dia, entregas);
  const { paradas, km, semPosicao } = montarRota(diaQueVeio, produtores, posto);

  return (
    <Tela titulo="Rota do dia" descricao={descricao}>
      {escolhaDoDia}
      <Lista>
        <RotaDoDia
          dia={dia}
          avisados={dia.avisos}
          paradas={paradas}
          km={km}
          conta={calcularLucroDoDia({ ...diaQueVeio, km }, precos, custos)}
          coletados={coletas[dia.data] ?? []}
          semPosicao={nomesDosProdutores(semPosicao, produtores)}
          posto={posto}
          area={areaDoMapa(posto, produtores)}
          diaConfirmado={confirmados.includes(dia.data)}
          onRegistrar={(produtor, caixas) => registrarColeta(dia.data, produtor, caixas)}
          onDesfazer={(produtor) => desfazerColeta(dia.data, produtor)}
        />
      </Lista>
    </Tela>
  );
}
