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

/** ["goiaba", "manga"] → "Goiaba, Manga". */
export function textoDasFrutas(frutas: string[]) {
  return frutas.map(capitalizar).join(', ');
}
