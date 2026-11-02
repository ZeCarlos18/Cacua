/**
 * Regras do estado do app (S4.1): o que muda quando entra um aviso, um custo, um preço ou uma
 * coleta. Cada função recebe o estado e devolve um novo, sem mexer no anterior. O dados.js é só
 * o ponto de partida; quem guarda o estado é o CacuaProvider (cacua.tsx).
 */

import { agenda, custos, precos, rota } from '@/data/dados';
import type { Aviso } from '@/utils/agenda';

export type Custos = typeof custos;

export type EstadoCacua = {
  agenda: typeof agenda;
  custos: Custos;
  precos: Record<string, { preco: number; kg: number }>;
  /** Ids dos produtores já coletados na rota do dia. */
  coletados: number[];
};

/** Os valores do dados.js. É o começo do app e o que o restaurarPadrao devolve. */
export function estadoInicial(): EstadoCacua {
  return { agenda, custos, precos, coletados: rota.coletados };
}

/** Coloca o aviso no dia (ex.: '30/set'). Se o dia não está na agenda, nada muda. */
export function comAviso(estado: EstadoCacua, data: string, aviso: Aviso): EstadoCacua {
  return {
    ...estado,
    agenda: estado.agenda.map((dia) =>
      dia.data === data ? { ...dia, avisos: [...dia.avisos, aviso] } : dia,
    ),
  };
}

/** Muda só os custos enviados (ex.: { diesel: 7.5 }). */
export function comCustos(estado: EstadoCacua, mudancas: Partial<Custos>): EstadoCacua {
  return { ...estado, custos: { ...estado.custos, ...mudancas } };
}

/** Muda o preço da caixa. Fruta sem preço (como o coco) não entra, porque falta o peso da caixa. */
export function comPreco(estado: EstadoCacua, fruta: string, preco: number): EstadoCacua {
  const atual = estado.precos[fruta];
  if (!atual) return estado;
  return { ...estado, precos: { ...estado.precos, [fruta]: { ...atual, preco } } };
}

/** Marca o produtor como coletado, sem repetir. */
export function comColeta(estado: EstadoCacua, produtor: number): EstadoCacua {
  if (estado.coletados.includes(produtor)) return estado;
  return { ...estado, coletados: [...estado.coletados, produtor] };
}
