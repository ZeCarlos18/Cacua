/**
 * Textos da tela Rota do dia (S3.3). A ordem e os km vêm da montarRota (rota.ts) e o lucro do
 * calcularLucroDoDia (calculos.js); aqui só o que a tela mostra em volta deles.
 */

import { textoDoKm } from '@/utils/conta';

type ParadaComCaixas = { id: number; caixas: number };

/** "Rota de quinta · saída às 7h". */
export function subtituloDaRota(dia: string, saida: string) {
  return `Rota de ${dia.toLowerCase()} · saída às ${saida}`;
}

/** "3 paradas · 47 caixas · cerca de 18,7 km ida e volta". */
export function resumoDaRota(paradas: ParadaComCaixas[], km: number) {
  const quantas = `${paradas.length} ${paradas.length === 1 ? 'parada' : 'paradas'}`;
  return `${quantas} · ${totalDeCaixas(paradas)} caixas · cerca de ${textoDoKm(km)} ida e volta`;
}

export function totalDeCaixas(paradas: ParadaComCaixas[]) {
  return paradas.reduce((soma, parada) => soma + parada.caixas, 0);
}

/** Caixas das paradas já coletadas (pelo id do produtor, como em `rota.coletados`). */
export function caixasColetadas(paradas: ParadaComCaixas[], coletados: number[]) {
  return totalDeCaixas(paradas.filter((parada) => coletados.includes(parada.id)));
}

/** Nomes dos produtores pelos ids (os `semPosicao` da montarRota). */
export function nomesDosProdutores(ids: number[], produtores: { id: number; nome: string }[]) {
  return ids.map((id) => produtores.find((p) => p.id === id)?.nome ?? `Produtor ${id}`);
}

/** "Coletado 20 de 47 caixas". */
export function textoDoColetado(coletadas: number, total: number) {
  return `Coletado ${coletadas} de ${total} caixas`;
}
