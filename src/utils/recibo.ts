/**
 * Recibo da coleta (S5.2): o texto que o coletor manda para o produtor pelo WhatsApp, a partir do
 * dia da agenda e da parada da montarRota. A foto fica para depois; por enquanto é só o texto.
 */

import { textoDasCaixas } from '@/utils/rota-do-dia';

type DiaDoRecibo = { dia: string; data: string };
type ParadaDoRecibo = { produtor: string; sitio: string; fruta: string; caixas: number };
type ColetorDoRecibo = { nome: string };

/**
 * Recibo do Caçuá
 * Quinta 01/out
 * Dona Maria · Sítio Riacho Verde
 * Manga: 20 caixas
 * Coletado por Edson
 */
export function textoDoRecibo(dia: DiaDoRecibo, parada: ParadaDoRecibo, coletor: ColetorDoRecibo) {
  return [
    'Recibo do Caçuá',
    `${dia.dia} ${dia.data}`,
    `${parada.produtor} · ${parada.sitio}`,
    `${parada.fruta}: ${textoDasCaixas(parada.caixas)}`,
    `Coletado por ${coletor.nome}`,
  ].join('\n');
}
