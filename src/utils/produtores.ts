/**
 * Próxima colheita de cada produtor na tela Produtores (S3.5), a partir da agenda do dados.js.
 */

import type { Aviso } from '@/utils/agenda';

type Produtor = { id: number; previsao?: string };
type DiaDaAgenda = { dia: string; avisos: Aviso[] };

/** "Qui, sex e sáb": os itens separados por vírgula, com "e" antes do último. */
function juntarComE(itens: string[]) {
  if (itens.length <= 1) return itens.join('');
  return `${itens.slice(0, -1).join(', ')} e ${itens[itens.length - 1]}`;
}

/** "Quinta" → "Qui"; do segundo dia em diante, em minúscula: "sex", "sáb". */
function diaAbreviado(dia: string, primeiro: boolean) {
  const abreviado = dia.slice(0, 3);
  return primeiro ? abreviado : abreviado.toLowerCase();
}

/**
 * O texto da próxima colheita do produtor:
 * - um dia só na agenda: "Quinta · 20 cx de manga";
 * - mais de um dia: os dias abreviados, "Qui, sex e sáb";
 * - nenhum aviso na agenda: a `previsao` do produtor ("Goiaba prevista (pela poda)"), ou null se não tiver.
 */
export function proximaColheita(produtor: Produtor, agenda: DiaDaAgenda[]) {
  const dias = agenda
    .map((dia) => ({
      dia: dia.dia,
      avisos: dia.avisos.filter((aviso) => aviso.produtor === produtor.id),
    }))
    .filter((dia) => dia.avisos.length > 0);

  if (dias.length === 0) return produtor.previsao ?? null;

  if (dias.length === 1) {
    const [{ dia, avisos }] = dias;
    const caixas = avisos.map((aviso) => `${aviso.caixas} cx de ${aviso.fruta}`);
    return `${dia} · ${juntarComE(caixas)}`;
  }

  return juntarComE(dias.map(({ dia }, i) => diaAbreviado(dia, i === 0)));
}
