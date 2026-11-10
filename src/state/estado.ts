/**
 * Regras do estado do app (S4.1): o que muda quando entra um aviso, um custo, um preço ou uma
 * coleta. Cada função recebe o estado e devolve um novo, sem mexer no anterior. O dados.js é só
 * o ponto de partida; quem guarda o estado é o CacuaProvider (cacua.tsx).
 */

import { agenda, custos, precos, rota } from '@/data/dados';
import type { Aviso } from '@/utils/agenda';
import { caixasValem, motivoParaNaoMudar } from '@/utils/aviso';

export type Custos = typeof custos;

export type EstadoCacua = {
  agenda: typeof agenda;
  custos: Custos;
  precos: Record<string, { preco: number; kg: number }>;
  /** Ids dos produtores já coletados em cada dia (S5.1), ex.: { '01/out': [3] }. */
  coletas: Record<string, number[]>;
  /** Datas dos dias com a coleta confirmada (S5.1), ex.: ['30/set']. */
  confirmados: string[];
};

/** Os valores do dados.js. É o começo do app e o que o restaurarPadrao devolve. */
export function estadoInicial(): EstadoCacua {
  return { agenda, custos, precos, coletas: { [rota.data]: rota.coletados }, confirmados: [] };
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

/** Troca o aviso da posição (0, 1, 2…) na lista do dia pelo que a função devolver (null tira). */
function comAvisoDaPosicao(
  estado: EstadoCacua,
  data: string,
  posicao: number,
  trocar: (aviso: Aviso) => Aviso | null,
): EstadoCacua {
  return {
    ...estado,
    agenda: estado.agenda.map((dia) => {
      if (dia.data !== data) return dia;
      const avisos = dia.avisos.flatMap((aviso, i) => {
        if (i !== posicao) return [aviso];
        const novo = trocar(aviso);
        return novo ? [novo] : [];
      });
      return { ...dia, avisos };
    }),
  };
}

/**
 * Troca as caixas do aviso (S7.2), quando o produtor colheu mais ou menos. As caixas têm que ser
 * inteiras e maiores que zero, como no Registrar aviso. Com motivo para não mudar (dia confirmado
 * ou produtor já coletado), nada muda.
 */
export function comCaixasDoAviso(
  estado: EstadoCacua,
  data: string,
  posicao: number,
  caixas: number,
): EstadoCacua {
  if (!caixasValem(caixas) || motivoParaNaoMudar(estado, data, posicao)) return estado;
  return comAvisoDaPosicao(estado, data, posicao, (aviso) => ({ ...aviso, caixas }));
}

/**
 * Tira o aviso do dia (S7.2), quando o produtor não vai colher. O dia continua na agenda, mesmo
 * sem nenhum aviso. Com motivo para não mudar, nada muda.
 */
export function semAviso(estado: EstadoCacua, data: string, posicao: number): EstadoCacua {
  if (motivoParaNaoMudar(estado, data, posicao)) return estado;
  return comAvisoDaPosicao(estado, data, posicao, () => null);
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
 * `coletados`, não serve.
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
    custos: { ...padrao.custos, ...salvo.custos },
    precos: { ...padrao.precos, ...salvo.precos },
    coletas: salvo.coletas,
    confirmados: salvo.confirmados,
  };
}
