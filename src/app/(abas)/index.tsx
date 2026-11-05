import { router } from 'expo-router';

import { AvisoSemanaFraca } from '@/components/aviso-semana-fraca';
import { BotaoConvidar } from '@/components/botao-convidar';
import { BotaoRegistrarAviso } from '@/components/botao-registrar-aviso';
import { Lista } from '@/components/lista';
import { BotaoAtalho, DiasSemConfirmacao, ResumoDaSemana, RotaDeHoje } from '@/components/painel-inicio';
import { Tela } from '@/components/tela';
import { coletor, posto, previsao, produtores, rota } from '@/data/dados';
import { useCacua } from '@/state/cacua';
import { hrefDaConta, idDoDia } from '@/utils/agenda';
import { diasSemConfirmacao, primeiraSemanaFraca, resumoDaSemana, resumoDoDia } from '@/utils/inicio';

/**
 * Início: o painel do coletor, a primeira aba depois de entrar. Mostra a rota de hoje (a do
 * dados.js, a quinta), o resumo da semana, os dias que faltam confirmar, a semana fraca da
 * Previsão e os atalhos para registrar aviso, mudar os custos e convidar produtor.
 */
export default function InicioScreen() {
  const { agenda, custos, precos, coletas, confirmados } = useCacua();
  const diaDeHoje = agenda.find((dia) => dia.data === rota.data);
  const resumir = (dia: (typeof agenda)[number]) =>
    resumoDoDia(dia, produtores, posto, precos, custos, coletas, confirmados);
  const semanaFraca = primeiraSemanaFraca(previsao, coletor.cargaMinima);

  return (
    <Tela titulo="Início" descricao="O resumo da sua semana de coletas.">
      <Lista>
        {diaDeHoje ? (
          <RotaDeHoje
            hoje={resumir(diaDeHoje)}
            saida={rota.saida}
            onAbrirRota={() =>
              router.navigate({ pathname: '/rota', params: { dia: idDoDia(diaDeHoje.data) } })
            }
            onVerConta={() => router.push(hrefDaConta(diaDeHoje.data))}
          />
        ) : null}

        <ResumoDaSemana
          semana={resumoDaSemana(agenda, produtores, posto, precos, custos, coletas, confirmados)}
        />

        <DiasSemConfirmacao
          dias={diasSemConfirmacao(agenda, confirmados).map((dia) => ({ ...dia, conta: resumir(dia).conta }))}
          onAbrir={(data) => router.push(hrefDaConta(data))}
        />

        {semanaFraca ? (
          <AvisoSemanaFraca
            periodo={semanaFraca.periodo}
            caixas={semanaFraca.caixas}
            cargaMinima={coletor.cargaMinima}
          />
        ) : null}

        <BotaoRegistrarAviso />
        <BotaoAtalho texto="Custos e preços" onPress={() => router.push('/custos')} />
        <BotaoConvidar />
      </Lista>
    </Tela>
  );
}
