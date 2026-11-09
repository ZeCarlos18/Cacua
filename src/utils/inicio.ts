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
type Produtores = Parameters<typeof montarRota>[1];
type Posto = Parameters<typeof montarRota>[2];
type Precos = Parameters<typeof calcularLucroDoDia>[1];
type Custos = Parameters<typeof calcularLucroDoDia>[2];

/**
 * Resumo de um dia da agenda: paradas e caixas da rota (como na aba Rota), quanto já foi coletado,
 * o km da ida e volta, a conta do dia (lucro e selo) e se a coleta foi confirmada.
 */
export function resumoDoDia(
  dia: DiaDaAgenda,
  produtores: Produtores,
  posto: Posto,
  precos: Precos,
  custos: Custos,
  coletas: Record<string, number[]>,
  confirmados: string[],
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
 * Resumo da semana (todos os dias da agenda): caixas, lucro, quantos dias valem a pena e as paradas
 * coletadas. O lucro é a soma do lucro de cada dia, arredondada nos centavos.
 */
export function resumoDaSemana(
  agenda: DiaDaAgenda[],
  produtores: Produtores,
  posto: Posto,
  precos: Precos,
  custos: Custos,
  coletas: Record<string, number[]>,
  confirmados: string[],
) {
  const dias = agenda.map((dia) =>
    resumoDoDia(dia, produtores, posto, precos, custos, coletas, confirmados),
  );
  const somar = (valor: (dia: (typeof dias)[number]) => number) =>
    dias.reduce((soma, dia) => soma + valor(dia), 0);

  return {
    dias: dias.length,
    diasQueValem: dias.filter((dia) => dia.conta.selo === SELOS.valeAPena).length,
    caixas: somar((dia) => dia.caixas),
    lucro: Math.round(somar((dia) => dia.conta.lucro) * 100) / 100,
    paradas: somar((dia) => dia.paradas),
    paradasColetadas: somar((dia) => dia.paradasColetadas),
  };
}

/** Os dias da agenda que ainda não tiveram a coleta confirmada, na ordem da agenda. */
export function diasSemConfirmacao<T extends { data: string }>(agenda: T[], confirmados: string[]) {
  return agenda.filter((dia) => !confirmados.includes(dia.data));
}

/** A primeira semana da Previsão que não enche nenhuma viagem, ou null se todas enchem. */
export function primeiraSemanaFraca<T extends { caixas: number }>(previsao: T[], cargaMinima: number) {
  return previsao.find((semana) => viagensCheias(semana.caixas, cargaMinima) === 0) ?? null;
}
