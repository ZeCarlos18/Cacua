/**
 * Textos e endereços dos cartões da Agenda (S2.3), a partir dos avisos de cada dia.
 * A conta do lucro fica em calculos.js; aqui só o que o cartão mostra.
 */

import type { Href } from 'expo-router';

export type Aviso = { produtor: number; fruta: string; caixas: number };

export function capitalizar(texto: string) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

/** "Manga 20 · Goiaba 12 · Maracujá 15": caixas de cada fruta, na ordem dos avisos. */
export function resumoDasFrutas(avisos: Aviso[]) {
  const caixasPorFruta = new Map<string, number>();
  for (const aviso of avisos) {
    caixasPorFruta.set(aviso.fruta, (caixasPorFruta.get(aviso.fruta) ?? 0) + aviso.caixas);
  }
  return [...caixasPorFruta]
    .map(([fruta, caixas]) => `${capitalizar(fruta)} ${caixas}`)
    .join(' · ');
}

/** "3 sítios": quantos produtores diferentes avisaram no dia. */
export function textoDosSitios(avisos: Aviso[]) {
  const sitios = new Set(avisos.map((aviso) => aviso.produtor)).size;
  return `${sitios} ${sitios === 1 ? 'sítio' : 'sítios'}`;
}

/** Quanto da carga mínima o dia enche, de 0 a 1 (a barra não passa do fim). */
export function proporcaoDaCarga(caixas: number, cargaMinima: number) {
  return Math.min(caixas / cargaMinima, 1);
}

/** "47 de 60 caixas · faltam 13". Com a carga cheia: "60 de 60 caixas · carga completa". */
export function textoDaCarga(caixas: number, cargaMinima: number) {
  const faltam = cargaMinima - caixas;
  const restante = faltam > 0 ? `faltam ${faltam}` : 'carga completa';
  return `${caixas} de ${cargaMinima} caixas · ${restante}`;
}

/** Id do dia no endereço: "01/out" → "01-out". */
export function idDoDia(data: string) {
  return data.replace('/', '-');
}

/** Endereço da tela Conta do dia (S2.4), combinado com o Caique: /conta/01-out. */
export function hrefDaConta(data: string): Href {
  return `/conta/${idDoDia(data)}`;
}
