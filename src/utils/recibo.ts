/**
 * Recibo da coleta (S5.2): o texto que o coletor manda para o produtor pelo WhatsApp. Desde o S8.2,
 * ele traz o valor em reais e o preço do Ceasa, para o produtor ver quanto a caixa vale e quanto
 * ele recebe. As contas (itensDoRecibo e totalDoRecibo) ficam separadas do texto, para a Rota e a
 * Conta do dia (S8.5) mostrarem o mesmo valor. A foto fica para depois; por enquanto é só o texto.
 */

import { capitalizar, type Aviso } from '@/utils/agenda';
import { formatarReais } from '@/utils/calculos';
import { caixasAvisadas, diaComEntregas, type Entregas } from '@/utils/coleta';
import { textoDaPorcentagem } from '@/utils/conta';
import { textoDasCaixas } from '@/utils/rota-do-dia';

type DiaDoRecibo = { dia: string; data: string };
type ProdutorDoRecibo = { nome: string; sitio: string };
type ColetorDoRecibo = { nome: string };
type CustosDoRecibo = { pagoProdutor: number };

/** O preço do Ceasa de cada fruta. A `data` ('AAAA-MM-DD', do S8.1) é opcional. */
type PrecosDoRecibo = Record<string, { preco: number; data?: string }>;

/** Uma fruta que o produtor entregou no dia. Sem `preco`, o valor fica "a combinar". */
export type ItemDoRecibo = {
  /** Como está no preço do Ceasa, por exemplo 'goiaba'. */
  fruta: string;
  /** As caixas que vieram. */
  caixas: number;
  /** As caixas que o produtor avisou. */
  avisadas: number;
  /** O preço da caixa no Ceasa, se a fruta tem preço. */
  preco?: number;
  /** O dia do preço do Ceasa ('AAAA-MM-DD'), se tiver. */
  data?: string;
  /** O que o produtor recebe por caixa: o preço do Ceasa × a porcentagem dele, nos centavos. */
  valorPorCaixa?: number;
  /** O que o produtor recebe pela fruta: as caixas que vieram × o valor da caixa, nos centavos. */
  valor?: number;
};

function emCentavos(valor: number) {
  return Math.round(valor * 100) / 100;
}

/**
 * Uma linha por fruta que o produtor entregou no dia, na ordem em que ele avisou. Usa as caixas que
 * vieram (diaComEntregas) e as avisadas (caixasAvisadas). A mesma fruta avisada duas vezes junta
 * numa linha só. Fruta sem preço do Ceasa (como o coco) fica sem valor.
 *
 * `dia` é o dia da agenda, com as caixas avisadas, e `produtor` é o id dele.
 */
export function itensDoRecibo(
  dia: { data: string; avisos: Aviso[] },
  produtor: number,
  entregas: Entregas,
  precos: PrecosDoRecibo,
  custos: CustosDoRecibo,
): ItemDoRecibo[] {
  const avisadas = caixasAvisadas(dia, produtor);
  const vieram = new Map<string, number>();
  for (const aviso of diaComEntregas(dia, entregas).avisos) {
    if (aviso.produtor !== produtor) continue;
    vieram.set(aviso.fruta, (vieram.get(aviso.fruta) ?? 0) + aviso.caixas);
  }

  return [...vieram].map(([fruta, caixas]) => {
    const item: ItemDoRecibo = { fruta, caixas, avisadas: avisadas[fruta] ?? 0 };
    const doCeasa = precos[fruta];
    if (!doCeasa) return item;

    const valorPorCaixa = emCentavos(doCeasa.preco * custos.pagoProdutor);
    return {
      ...item,
      preco: doCeasa.preco,
      data: doCeasa.data,
      valorPorCaixa,
      valor: emCentavos(caixas * valorPorCaixa),
    };
  });
}

/** A soma do valor das frutas com preço; as frutas sem preço ficam de fora. */
export function totalDoRecibo(itens: ItemDoRecibo[]) {
  return emCentavos(itens.reduce((soma, item) => soma + (item.valor ?? 0), 0));
}

/** '2026-11-17' → "17/11", ou null se a data não tem esse formato. */
function dataCurta(data: string) {
  const partes = /^\d{4}-(\d{2})-(\d{2})$/.exec(data);
  return partes ? `${partes[2]}/${partes[1]}` : null;
}

/** As linhas de uma fruta: as caixas e, embaixo, o valor e o preço do Ceasa (ou "valor a combinar"). */
function linhasDaFruta(item: ItemDoRecibo, custos: CustosDoRecibo) {
  const avisou = item.avisadas !== item.caixas ? ` (avisou ${item.avisadas})` : '';
  const caixas = `${capitalizar(item.fruta)}: ${textoDasCaixas(item.caixas)}${avisou}`;

  if (item.preco === undefined || item.valorPorCaixa === undefined || item.valor === undefined) {
    return [caixas, 'Sem preço do Ceasa no app: valor a combinar'];
  }

  const dia = item.data ? dataCurta(item.data) : null;
  const quando = dia ? ` em ${dia}` : '';
  return [
    caixas,
    `${formatarReais(item.valorPorCaixa)} a caixa = ${formatarReais(item.valor)}`,
    `Ceasa: ${formatarReais(item.preco)} a caixa${quando} · você recebe ${textoDaPorcentagem(custos.pagoProdutor)}`,
  ];
}

/**
 * Recibo do Caçuá
 * Quinta 01/out
 * Seu Antônio · Sítio Pau d'Arco
 * Goiaba: 10 caixas (avisou 12)
 * R$ 48,00 a caixa = R$ 480,00
 * Ceasa: R$ 60,00 a caixa em 22/09 · você recebe 80%
 * Total: R$ 480,00
 * Coletado por Edson
 *
 * Sem a data do preço, a linha do Ceasa sai sem o "em 22/09". Fruta sem preço sai como "Coco: 8
 * caixas" e "Sem preço do Ceasa no app: valor a combinar", e não entra no total. Se nenhuma fruta
 * tem preço, a linha "Total" não aparece.
 */
export function textoDoRecibo(
  dia: DiaDoRecibo,
  produtor: ProdutorDoRecibo,
  itens: ItemDoRecibo[],
  coletor: ColetorDoRecibo,
  custos: CustosDoRecibo,
) {
  const temValor = itens.some((item) => item.valor !== undefined);
  return [
    'Recibo do Caçuá',
    `${dia.dia} ${dia.data}`,
    `${produtor.nome} · ${produtor.sitio}`,
    ...itens.flatMap((item) => linhasDaFruta(item, custos)),
    ...(temValor ? [`Total: ${formatarReais(totalDoRecibo(itens))}`] : []),
    `Coletado por ${coletor.nome}`,
  ].join('\n');
}
