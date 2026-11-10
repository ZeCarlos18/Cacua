/**
 * Próxima colheita de cada produtor na tela Produtores (S3.5), a partir da agenda do dados.js, e
 * os avisos cumpridos, que somam as coletas registradas no app (S5.6). Desde o S6.3, também as
 * contas dos detalhes do produtor: a taxa de avisos cumpridos, os avisos da semana com o valor de
 * cada um e como ele avisa.
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

/**
 * Quantos avisos foram cumpridos, em porcentagem arredondada (S6.3): 6 de 7 → 86. Sem nenhum
 * aviso, não dá para dizer, e devolve null.
 */
export function taxaDeCumprimento({ cumpridos, avisos }: { cumpridos: number; avisos: number }) {
  if (avisos <= 0) return null;
  return Math.round((cumpridos / avisos) * 100);
}

/**
 * A situação do aviso no dia: "coletado" se a coleta do produtor foi registrada naquele dia (na
 * Rota), "confirmado" se o dia foi confirmado na Conta do dia, senão "aguardando".
 */
export type SituacaoDoAviso = 'coletado' | 'confirmado' | 'aguardando';

export type AvisoDoProdutor = {
  dia: string;
  data: string;
  fruta: string;
  caixas: number;
  /** O preço da caixa no Ceasa, ou null se a fruta não tem preço (como o coco). */
  precoDaCaixa: number | null;
  /** O que o coletor paga ao produtor: caixas × preço × pagoProdutor (80%). Null sem preço. */
  valor: number | null;
  situacao: SituacaoDoAviso;
};

/**
 * Cada aviso do produtor na agenda da semana (S6.3), na ordem dos dias, com o preço da caixa, o
 * valor que o coletor paga e a situação. Seu Antônio, goiaba 12 cx na quinta: 12 × R$ 60 × 80% =
 * R$ 576,00.
 */
export function avisosDoProdutor(
  produtor: { id: number },
  agenda: { dia: string; data: string; avisos: Aviso[] }[],
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
          dia: dia.dia,
          data: dia.data,
          fruta: aviso.fruta,
          caixas: aviso.caixas,
          precoDaCaixa,
          valor: precoDaCaixa === null ? null : aviso.caixas * precoDaCaixa * pagoProdutor,
          situacao,
        };
      }),
  );
}

/** As caixas e o valor da semana (S6.3): Seu Antônio, 35 caixas e R$ 1.680,00. Fruta sem preço não soma no valor. */
export function totalDosAvisos(avisos: AvisoDoProdutor[]) {
  return {
    caixas: avisos.reduce((soma, aviso) => soma + aviso.caixas, 0),
    valor: avisos.reduce((soma, aviso) => soma + (aviso.valor ?? 0), 0),
  };
}

/** Como o produtor avisa a colheita (S6.3): pela ponto focal ou pelo WhatsApp do Caçuá. */
export function comoAvisa(canal: string, pontoFocal: string) {
  if (canal === 'Ponto focal') return `Avisa pela ${pontoFocal}, a ponto focal, por ligação ou visita.`;
  return 'Avisa pelo WhatsApp do Caçuá.';
}

/** O endereço dos detalhes do produtor (S6.3), que a tela do S6.6 abre: 4 → "/produtor/4". */
export function hrefDoProdutor(id: number): Href {
  // A tela src/app/produtor/[id].tsx chega no S6.6; até lá, o Expo Router não conhece a rota e
  // recusa o endereço. Com a tela criada, o "as Href" pode sair.
  return `/produtor/${id}` as Href;
}
