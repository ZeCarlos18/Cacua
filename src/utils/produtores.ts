/**
 * Próxima colheita de cada produtor na tela Produtores (S3.5), a partir da agenda do dados.js, e
 * os avisos cumpridos, que somam as coletas registradas no app (S5.6). No fim, as contas da tela
 * de detalhes do produtor: a taxa de cumprimento e os avisos com o valor de cada um.
 */

import type { Href } from 'expo-router';

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

/**
 * Avisos cumpridos do produtor (S5.6): o histórico do dados.js mais as coletas registradas no app.
 * Cada coleta nova (o produtor coletado num dia) conta +1 em cumpridos e +1 em avisos. As coletas
 * que já vêm do dados.js (`coletasIniciais`, como a Dona Maria na quinta) já estão no histórico e
 * não contam de novo.
 */
export function historicoDoProdutor(
  produtor: { id: number; cumpridos: number; avisos: number },
  coletas: Record<string, number[]>,
  coletasIniciais: Record<string, number[]>,
) {
  const novas = Object.entries(coletas).filter(
    ([data, ids]) => ids.includes(produtor.id) && !(coletasIniciais[data] ?? []).includes(produtor.id),
  ).length;
  return { cumpridos: produtor.cumpridos + novas, avisos: produtor.avisos + novas };
}

/** Quantos % dos avisos o produtor cumpriu (6 de 7 → 86). Sem nenhum aviso ainda, null. */
export function taxaDeCumprimento(historico: { cumpridos: number; avisos: number }) {
  if (historico.avisos === 0) return null;
  return Math.round((historico.cumpridos / historico.avisos) * 100);
}

/** Em que pé está o aviso: já coletado, com a coleta do dia confirmada ou esperando o coletor. */
export type SituacaoDoAviso = 'coletado' | 'confirmado' | 'aguardando';

export type AvisoDoProdutor = {
  data: string;
  dia: string;
  fruta: string;
  caixas: number;
  /** O preço da caixa no Ceasa, ou null para a fruta sem preço (como o coco). */
  precoDaCaixa: number | null;
  /** Quanto o coletor paga ao produtor: caixas × preço × a parte do produtor (80%). */
  valorDoProdutor: number | null;
  situacao: SituacaoDoAviso;
};

type DiaComData = DiaDaAgenda & { data: string };

/**
 * Os avisos do produtor na agenda, na ordem dos dias, com o valor estimado que o coletor paga e a
 * situação de cada um: "coletado" se a coleta foi registrada no dia, "confirmado" se o dia foi
 * confirmado na Conta (S5.5) e "aguardando" se ainda não.
 */
export function avisosDoProdutor(
  produtor: { id: number },
  agenda: DiaComData[],
  precos: Record<string, { preco: number }>,
  pagoProdutor: number,
  coletas: Record<string, number[]>,
  confirmados: string[],
): AvisoDoProdutor[] {
  return agenda.flatMap((dia) =>
    dia.avisos
      .filter((aviso) => aviso.produtor === produtor.id)
      .map((aviso) => {
        const precoDaCaixa = precos[aviso.fruta]?.preco ?? null;
        const situacao: SituacaoDoAviso = (coletas[dia.data] ?? []).includes(produtor.id)
          ? 'coletado'
          : confirmados.includes(dia.data)
            ? 'confirmado'
            : 'aguardando';
        return {
          data: dia.data,
          dia: dia.dia,
          fruta: aviso.fruta,
          caixas: aviso.caixas,
          precoDaCaixa,
          valorDoProdutor: precoDaCaixa === null ? null : aviso.caixas * precoDaCaixa * pagoProdutor,
          situacao,
        };
      }),
  );
}

/** As caixas de todos os avisos e o valor que o coletor paga por elas (sem a fruta sem preço). */
export function totalDosAvisos(avisos: AvisoDoProdutor[]) {
  return {
    caixas: avisos.reduce((total, aviso) => total + aviso.caixas, 0),
    valor: avisos.reduce((total, aviso) => total + (aviso.valorDoProdutor ?? 0), 0),
    semPreco: avisos.some((aviso) => aviso.precoDaCaixa === null),
  };
}

/** O texto do selo de cada situação. */
export const TEXTO_DA_SITUACAO: Record<SituacaoDoAviso, string> = {
  coletado: 'Coletado',
  confirmado: 'Confirmado',
  aguardando: 'Aguardando',
};

/** "Avisa pela Joana, a ponto focal, por ligação ou visita." ou "Avisa pelo WhatsApp do Caçuá." */
export function comoAvisa(canal: string, pontoFocal: string) {
  return canal === 'Ponto focal'
    ? `Avisa pela ${pontoFocal}, a ponto focal, por ligação ou visita.`
    : 'Avisa pelo WhatsApp do Caçuá.';
}

/** "goiaba e manga", "maracujá, mamão e coco". */
export function textoDasFrutasDoProdutor(frutas: string[]) {
  return juntarComE(frutas);
}

/** Endereço da tela de detalhes do produtor: /produtor/4. */
export function hrefDoProdutor(id: number): Href {
  return `/produtor/${id}`;
}
