/**
 * Caixas que vieram na coleta (S7.3): o produtor avisa 12 caixas e entrega 10. O estado guarda o
 * que veio em `entregas`, e as contas usam o dia com essas caixas no lugar das avisadas.
 */

import type { Aviso } from '@/utils/agenda';

/**
 * As caixas que vieram, por dia, produtor e fruta: { '01/out': { '2:goiaba': 10 } }. Só entra o
 * que foi diferente de "vale o avisado"; coleta sem caixas não guarda nada aqui.
 */
export type Entregas = Record<string, Record<string, number>>;

/** As caixas que vieram de cada fruta, como o formulário da coleta manda: { goiaba: 10 }. */
export type CaixasPorFruta = Record<string, number>;

/** A chave da entrega: o id do produtor e a fruta, "2:goiaba". */
export function chaveDaEntrega(produtor: number, fruta: string) {
  return `${produtor}:${fruta}`;
}

/**
 * O dia com as caixas que vieram no lugar das avisadas. Mantém a ordem e a quantidade de avisos,
 * porque o S7.2 acha o aviso pela posição. Se o produtor avisou a mesma fruta duas vezes no dia, o
 * primeiro aviso fica com o que veio e o outro com 0 (goiaba 5 e 7, vieram 11 → 11 e 0).
 */
export function diaComEntregas<T extends { data: string; avisos: Aviso[] }>(dia: T, entregas: Entregas): T {
  const doDia = entregas[dia.data];
  if (!doDia) return dia;

  const usadas = new Set<string>();
  const avisos = dia.avisos.map((aviso) => {
    const chave = chaveDaEntrega(aviso.produtor, aviso.fruta);
    const veio = doDia[chave];
    if (veio === undefined) return aviso;
    if (usadas.has(chave)) return { ...aviso, caixas: 0 };
    usadas.add(chave);
    return { ...aviso, caixas: veio };
  });
  return { ...dia, avisos };
}

/**
 * As caixas avisadas por fruta, para o formulário da coleta já vir preenchido (S7.6). Quinta, Seu
 * Antônio → { goiaba: 12 }. A mesma fruta avisada duas vezes soma.
 */
export function caixasAvisadas(dia: { avisos: Aviso[] }, produtor: number): CaixasPorFruta {
  const porFruta: CaixasPorFruta = {};
  for (const aviso of dia.avisos) {
    if (aviso.produtor !== produtor) continue;
    porFruta[aviso.fruta] = (porFruta[aviso.fruta] ?? 0) + aviso.caixas;
  }
  return porFruta;
}
