/**
 * Contas da aba Início, o painel do coletor: a rota de hoje, o resumo da semana e o que ainda
 * precisa de atenção. Tudo sai das mesmas funções da Agenda, da Rota e da Previsão.
 */

import type { Aviso } from '@/utils/agenda';
import { calcularLucroDoDia, SELOS } from '@/utils/calculos';
import { viagensCheias } from '@/utils/previsao';
import { montarRota, type Posicao } from '@/utils/rota';
import { caixasColetadas, totalDeCaixas } from '@/utils/rota-do-dia';

type Dia = { dia: string; data: string; avisos: Aviso[] };
type Produtor = { id: number; nome: string; sitio: string; posicao?: Posicao };
type Precos = Parameters<typeof calcularLucroDoDia>[1];
type Custos = Parameters<typeof calcularLucroDoDia>[2];

/** A rota do dia com a conta, as coletas e se a coleta foi confirmada. */
export function resumoDoDia(
  dia: Dia,
  produtores: Produtor[],
  posto: Posicao,
  precos: Precos,
  custos: Custos,
  coletas: Record<string, number[]>,
  confirmados: string[],
) {
  const { paradas, km } = montarRota(dia, produtores, posto);
  const coletados = coletas[dia.data] ?? [];
  return {
    dia,
    km,
    paradas: paradas.length,
    paradasColetadas: paradas.filter((parada) => coletados.includes(parada.id)).length,
    caixas: totalDeCaixas(paradas),
    caixasColetadas: caixasColetadas(paradas, coletados),
    conta: calcularLucroDoDia({ ...dia, km }, precos, custos),
    confirmado: confirmados.includes(dia.data),
  };
}

/** A semana toda: caixas avisadas, lucro estimado, dias que valem a pena e paradas coletadas. */
export function resumoDaSemana(
  agenda: Dia[],
  produtores: Produtor[],
  posto: Posicao,
  precos: Precos,
  custos: Custos,
  coletas: Record<string, number[]>,
  confirmados: string[],
) {
  const dias = agenda.map((dia) => resumoDoDia(dia, produtores, posto, precos, custos, coletas, confirmados));
  return {
    dias: dias.length,
    caixas: dias.reduce((total, dia) => total + dia.conta.caixas, 0),
    lucro: dias.reduce((total, dia) => total + dia.conta.lucro, 0),
    diasQueValem: dias.filter((dia) => dia.conta.selo === SELOS.valeAPena).length,
    paradas: dias.reduce((total, dia) => total + dia.paradas, 0),
    paradasColetadas: dias.reduce((total, dia) => total + dia.paradasColetadas, 0),
    confirmados: dias.filter((dia) => dia.confirmado).length,
  };
}

/** Os dias da agenda que ainda não tiveram a coleta confirmada na Conta (S5.5). */
export function diasSemConfirmacao<T extends { data: string }>(agenda: T[], confirmados: string[]) {
  return agenda.filter((dia) => !confirmados.includes(dia.data));
}

/** A primeira semana da Previsão que não enche nenhuma viagem, ou null se todas enchem. */
export function primeiraSemanaFraca<T extends { caixas: number }>(previsao: T[], cargaMinima: number) {
  return previsao.find((semana) => viagensCheias(semana.caixas, cargaMinima) === 0) ?? null;
}

/** "1 de 4", para os números do resumo. */
export function textoDeUmDe(parte: number, total: number) {
  return `${parte} de ${total}`;
}
