/**
 * Contas e textos da tela Previsão (S2.6), a partir das semanas do dados.js.
 */

import { capitalizar } from '@/utils/agenda';

/** Viagens cheias que as caixas da semana dão, arredondado para baixo: 100 → 1, 131 → 2, 38 → 0. */
export function viagensCheias(caixas: number, cargaMinima: number) {
  return Math.floor(caixas / cargaMinima);
}

/** "nenhuma viagem cheia", "1 viagem cheia", "2 viagens cheias". */
export function textoDasViagens(viagens: number) {
  if (viagens === 0) return 'nenhuma viagem cheia';
  if (viagens === 1) return '1 viagem cheia';
  return `${viagens} viagens cheias`;
}

/**
 * Início e fim do período: "28/set – 04/out" → ["28/set", "04/out"]. Quando o início não tem
 * mês ("05 – 11/out"), ele vem do fim: ["05/out", "11/out"].
 */
export function diasDoPeriodo(periodo: string) {
  const [inicio, fim] = periodo.split('–').map((parte) => parte.trim());
  const mes = fim.split('/')[1];
  return [inicio.includes('/') ? inicio : `${inicio}/${mes}`, fim] as const;
}

/** Texto da barra para o leitor de tela: "Semana de 26/out a 01/nov, 38 caixas". */
export function descricaoDaBarra(periodo: string, caixas: number) {
  const [inicio, fim] = diasDoPeriodo(periodo);
  return `Semana de ${inicio} a ${fim}, ${caixas} caixas`;
}

/** Altura da barra em proporção ao maior valor do gráfico, de 0 a 1. */
export function proporcaoDaBarra(caixas: number, maximo: number) {
  return maximo > 0 ? caixas / maximo : 0;
}

/** ["goiaba", "manga"] → "Goiaba, Manga". */
export function textoDasFrutas(frutas: string[]) {
  return frutas.map(capitalizar).join(', ');
}
