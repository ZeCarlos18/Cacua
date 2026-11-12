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
 *
 * Desde o S7.3, a `parada` vem com as caixas que vieram, e `avisadas` são as que o produtor
 * avisou. Quando são diferentes, a linha fica "Goiaba: 10 caixas (avisou 12)".
 */
export function textoDoRecibo(
  dia: DiaDoRecibo,
  parada: ParadaDoRecibo,
  coletor: ColetorDoRecibo,
  avisadas?: number,
) {
  const avisou = avisadas !== undefined && avisadas !== parada.caixas ? ` (avisou ${avisadas})` : '';
  return [
    'Recibo do Caçuá',
    `${dia.dia} ${dia.data}`,
    `${parada.produtor} · ${parada.sitio}`,
    `${parada.fruta}: ${textoDasCaixas(parada.caixas)}${avisou}`,
    `Coletado por ${coletor.nome}`,
  ].join('\n');
}
