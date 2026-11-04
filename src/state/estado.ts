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
  /** Ids dos produtores já coletados em cada dia (S5.1), ex.: { '01/out': [3] }. */
  coletas: Record<string, number[]>;
};

/** Os valores do dados.js. É o começo do app e o que o restaurarPadrao devolve. */
export function estadoInicial(): EstadoCacua {
  return { agenda, custos, precos, coletas: { [rota.data]: rota.coletados } };
}

function temDia(estado: EstadoCacua, data: string) {
  return estado.agenda.some((dia) => dia.data === data);
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

/** Marca o produtor como coletado no dia, sem repetir. Se o dia não está na agenda, nada muda. */
export function comColeta(estado: EstadoCacua, data: string, produtor: number): EstadoCacua {
  const doDia = estado.coletas[data] ?? [];
  if (!temDia(estado, data) || doDia.includes(produtor)) return estado;
  return { ...estado, coletas: { ...estado.coletas, [data]: [...doDia, produtor] } };
}

/**
 * O estado guardado no celular (S4.5), a partir do texto salvo. Devolve null quando não há nada
 * salvo ou quando o texto não serve, e aí o app usa o dados.js. Custos e preços que faltarem no
 * salvo (um campo novo numa versão futura do app) vêm do dados.js.
 */
export function estadoDoSalvo(texto: string | null): EstadoCacua | null {
  if (!texto) return null;

  let salvo;
  try {
    salvo = JSON.parse(texto);
  } catch {
    return null;
  }

  const ehObjeto = (valor: unknown) => typeof valor === 'object' && valor !== null && !Array.isArray(valor);
  if (
    !ehObjeto(salvo) ||
    !Array.isArray(salvo.agenda) ||
    !ehObjeto(salvo.custos) ||
    !ehObjeto(salvo.precos) ||
    !ehObjeto(salvo.coletas)
  ) {
    return null;
  }

  const padrao = estadoInicial();
  return {
    agenda: salvo.agenda,
    custos: { ...padrao.custos, ...salvo.custos },
    precos: { ...padrao.precos, ...salvo.precos },
    coletas: salvo.coletas,
  };
}
