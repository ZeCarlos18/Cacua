/**
 * Regras do estado do app (S4.1): o que muda quando entra um aviso, um custo, um preço ou uma
 * coleta. Cada função recebe o estado e devolve um novo, sem mexer no anterior. O dados.js é só
 * o ponto de partida; quem guarda o estado é o CacuaProvider (cacua.tsx).
 */

import { agenda, custos, precos, produtores, rota } from '@/data/dados';
import type { Aviso } from '@/utils/agenda';
import { errosDoProdutor, novoProdutor, type CamposDoProdutor } from '@/utils/novo-produtor';
import type { Posicao } from '@/utils/rota';

export type Custos = typeof custos;

/** Um produtor da região (S7.1): os 6 do dados.js e os que o coletor cadastra. */
export type Produtor = {
  id: number;
  nome: string;
  sitio: string;
  frutas: string[];
  /** "WhatsApp" ou "Ponto focal". */
  canal: string;
  /** Avisos cumpridos antes do app (S5.6); o produtor novo começa com 0 de 0. */
  cumpridos: number;
  avisos: number;
  /** O lugar do sítio no mapa ilustrativo. */
  posicao: Posicao;
  /** O texto da próxima colheita quando não tem aviso na agenda (S3.5). */
  previsao?: string;
};

export type EstadoCacua = {
  agenda: typeof agenda;
  /** Os produtores da região (S7.1), que começam pelos 6 do dados.js. */
  produtores: Produtor[];
  custos: Custos;
  precos: Record<string, { preco: number; kg: number }>;
  /** Ids dos produtores já coletados em cada dia (S5.1), ex.: { '01/out': [3] }. */
  coletas: Record<string, number[]>;
  /** Datas dos dias com a coleta confirmada (S5.1), ex.: ['30/set']. */
  confirmados: string[];
};

/** Os valores do dados.js. É o começo do app e o que o restaurarPadrao devolve. */
export function estadoInicial(): EstadoCacua {
  return {
    agenda,
    produtores,
    custos,
    precos,
    coletas: { [rota.data]: rota.coletados },
    confirmados: [],
  };
}

/**
 * Coloca o produtor novo no fim da lista (S7.1), com o id seguinte ao maior (o 7) e 0 de 0 avisos
 * cumpridos. Com erro nos campos (errosDoProdutor), nada muda.
 */
export function comProdutor(estado: EstadoCacua, campos: CamposDoProdutor): EstadoCacua {
  if (errosDoProdutor(campos, estado.produtores)) return estado;
  const id = Math.max(0, ...estado.produtores.map((produtor) => produtor.id)) + 1;
  return { ...estado, produtores: [...estado.produtores, novoProdutor(campos, id)] };
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

/** Confirma a coleta do dia, sem repetir. Se o dia não está na agenda, nada muda. */
export function comConfirmacao(estado: EstadoCacua, data: string): EstadoCacua {
  if (!temDia(estado, data) || estado.confirmados.includes(data)) return estado;
  return { ...estado, confirmados: [...estado.confirmados, data] };
}

/** Desfaz a confirmação do dia. Se ele não estava confirmado, nada muda. */
export function semConfirmacao(estado: EstadoCacua, data: string): EstadoCacua {
  if (!estado.confirmados.includes(data)) return estado;
  return { ...estado, confirmados: estado.confirmados.filter((confirmado) => confirmado !== data) };
}

/**
 * O estado guardado no celular (S4.5), a partir do texto salvo. Devolve null quando não há nada
 * salvo ou quando o texto não serve, e aí o app usa o dados.js. Custos e preços que faltarem no
 * salvo (um campo novo numa versão futura do app) vêm do dados.js. Desde o S5.1, as coletas de
 * cada dia têm que ser listas de ids e as confirmações, listas de datas; o formato antigo, com
 * `coletados`, não serve. Desde o S7.1, os produtores também ficam salvos; o salvo de antes, sem
 * `produtores` (ou com eles estragados), usa os 6 do dados.js e mantém o resto.
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
  const ehListaDe = (valor: unknown, tipo: 'number' | 'string') =>
    Array.isArray(valor) && valor.every((item) => typeof item === tipo);
  if (
    !ehObjeto(salvo) ||
    !Array.isArray(salvo.agenda) ||
    !ehObjeto(salvo.custos) ||
    !ehObjeto(salvo.precos) ||
    !ehObjeto(salvo.coletas) ||
    !Object.values(salvo.coletas).every((doDia) => ehListaDe(doDia, 'number')) ||
    !ehListaDe(salvo.confirmados, 'string')
  ) {
    return null;
  }

  const padrao = estadoInicial();
  return {
    agenda: salvo.agenda,
    produtores: produtoresDoSalvo(salvo.produtores) ?? padrao.produtores,
    custos: { ...padrao.custos, ...salvo.custos },
    precos: { ...padrao.precos, ...salvo.precos },
    coletas: salvo.coletas,
    confirmados: salvo.confirmados,
  };
}

/**
 * Os produtores salvos, se todos servem: id inteiro sem repetir, nome, sítio, frutas, canal,
 * avisos e o lugar no mapa. Senão (ou se não há nenhum), null.
 */
function produtoresDoSalvo(valor: unknown): Produtor[] | null {
  if (!Array.isArray(valor) || valor.length === 0) return null;

  const ehNumero = (item: unknown) => typeof item === 'number' && Number.isFinite(item);
  const ehTexto = (item: unknown) => typeof item === 'string';
  const serve = (item: unknown): item is Produtor => {
    if (typeof item !== 'object' || item === null) return false;
    const produtor = item as Record<string, unknown>;
    const posicao = produtor.posicao as Record<string, unknown> | null | undefined;
    return (
      Number.isInteger(produtor.id) &&
      ehTexto(produtor.nome) &&
      ehTexto(produtor.sitio) &&
      Array.isArray(produtor.frutas) &&
      produtor.frutas.every(ehTexto) &&
      ehTexto(produtor.canal) &&
      ehNumero(produtor.cumpridos) &&
      ehNumero(produtor.avisos) &&
      typeof posicao === 'object' &&
      posicao !== null &&
      ehNumero(posicao.x) &&
      ehNumero(posicao.y) &&
      (produtor.previsao === undefined || ehTexto(produtor.previsao))
    );
  };

  if (!valor.every(serve)) return null;
  const ids = valor.map((produtor) => produtor.id);
  return new Set(ids).size === ids.length ? valor : null;
}
