/**
 * Contas do painel Início (S6.2): o resumo de um dia, o da semana, os dias que faltam confirmar e
 * a primeira semana fraca da Previsão. Tudo sai das funções que já existem (montarRota,
 * calcularLucroDoDia, viagensCheias), então os números batem com a Agenda, a Rota e a Previsão.
 */

import type { Aviso } from '@/utils/agenda';
import { SELOS, calcularLucroDoDia } from '@/utils/calculos';
import { viagensCheias } from '@/utils/previsao';
import { montarRota } from '@/utils/rota';
import { caixasColetadas, totalDeCaixas } from '@/utils/rota-do-dia';

type DiaDaAgenda = { dia: string; data: string; avisos: Aviso[] };

/**
 * O que as contas do Início usam, num objeto só para não trocar dois de lugar. No Início:
 * `{ ...useCacua(), posto }` (os produtores vêm do estado desde o S7.1).
 */
export type DadosDoInicio = {
  produtores: Parameters<typeof montarRota>[1];
  posto: Parameters<typeof montarRota>[2];
  precos: Parameters<typeof calcularLucroDoDia>[1];
  custos: Parameters<typeof calcularLucroDoDia>[2];
  coletas: Record<string, number[]>;
  confirmados: string[];
};

/**
 * Resumo de um dia da agenda: paradas e caixas da rota (como na aba Rota, sem os produtores fora do
 * mapa), quanto já foi coletado, o km da ida e volta, a conta do dia (lucro, selo e todas as caixas
 * avisadas) e se a coleta foi confirmada.
 */
export function resumoDoDia(
  dia: DiaDaAgenda,
  { produtores, posto, precos, custos, coletas, confirmados }: DadosDoInicio,
) {
  const { paradas, km } = montarRota(dia, produtores, posto);
  const coletadosDoDia = coletas[dia.data] ?? [];

  return {
    dia,
    paradas: paradas.length,
    paradasColetadas: paradas.filter((parada) => coletadosDoDia.includes(parada.id)).length,
    caixas: totalDeCaixas(paradas),
    caixasColetadas: caixasColetadas(paradas, coletadosDoDia),
    km,
    conta: calcularLucroDoDia({ ...dia, km }, precos, custos),
    confirmado: confirmados.includes(dia.data),
  };
}

/**
 * Resumo da semana (todos os dias da agenda): caixas avisadas, lucro, quantos dias valem a pena e
 * as paradas coletadas. As caixas são todas as avisadas, como na Agenda, inclusive de produtor sem
 * posição no mapa. O lucro é a soma do lucro de cada dia, arredondada nos centavos. Dia sem aviso
 * fica de fora (S7.2).
 */
export function resumoDaSemana(agenda: DiaDaAgenda[], dados: DadosDoInicio) {
  // Dia sem aviso não tem viagem, então não soma os outros custos (S7.2).
  const dias = agenda.filter(temAviso).map((dia) => resumoDoDia(dia, dados));
  const somar = (valor: (dia: (typeof dias)[number]) => number) =>
    dias.reduce((soma, dia) => soma + valor(dia), 0);

  return {
    dias: dias.length,
    diasQueValem: dias.filter((dia) => dia.conta.selo === SELOS.valeAPena).length,
    caixas: somar((dia) => dia.conta.caixas),
    lucro: Math.round(somar((dia) => dia.conta.lucro) * 100) / 100,
    paradas: somar((dia) => dia.paradas),
    paradasColetadas: somar((dia) => dia.paradasColetadas),
  };
}

/**
 * Os dias da agenda que ainda não tiveram a coleta confirmada, na ordem da agenda. Dia sem aviso
 * não tem o que confirmar (S7.2).
 */
export function diasSemConfirmacao<T extends { data: string; avisos: unknown[] }>(
  agenda: T[],
  confirmados: string[],
) {
  return agenda.filter((dia) => temAviso(dia) && !confirmados.includes(dia.data));
}

/** O dia tem pelo menos um aviso (S7.2): quando todos saem, o dia fica na agenda, mas sem viagem. */
function temAviso(dia: { avisos: unknown[] }) {
  return dia.avisos.length > 0;
}

/** A primeira semana da Previsão que não enche nenhuma viagem, ou null se todas enchem. */
export function primeiraSemanaFraca<T extends { caixas: number }>(previsao: T[], cargaMinima: number) {
  return previsao.find((semana) => viagensCheias(semana.caixas, cargaMinima) === 0) ?? null;
}
