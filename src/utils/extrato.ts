/**
 * Extrato do produtor (S8.3): tudo o que ele já entregou na semana, com o valor de cada coleta. O
 * recibo (S8.2) é de uma coleta só; o extrato junta a semana, para o produtor conferir o que vendeu e
 * quanto recebeu. Mostra o preço do mesmo jeito do recibo: "R$ 48,00 a caixa", "você recebe 80%".
 */

import { capitalizar, type Aviso } from '@/utils/agenda';
import { rotuloDoDia } from '@/utils/aviso';
import { formatarReais } from '@/utils/calculos';
import { diaComEntregas, type Entregas } from '@/utils/coleta';
import { textoDaPorcentagem } from '@/utils/conta';
import { dataCurta, ehDataValida } from '@/utils/preco-do-ceasa';
import { avisosDoProdutor } from '@/utils/produtores';
import { textoDasCaixas } from '@/utils/rota-do-dia';

/** O que o extrato usa do estado do app (useCacua()). */
export type DadosDoExtrato = {
  agenda: { dia: string; data: string; avisos: Aviso[] }[];
  /** O preço do Ceasa de cada fruta. A `data` ('AAAA-MM-DD', do S8.1) é opcional. */
  precos: Record<string, { preco: number; data?: string }>;
  custos: { pagoProdutor: number };
  coletas: Record<string, number[]>;
  confirmados: string[];
  entregas: Entregas;
};

/** Uma coleta do produtor: uma fruta num dia. Sem preço do Ceasa, os valores ficam null. */
export type LinhaDoExtrato = {
  dia: string;
  data: string;
  /** Como está no preço do Ceasa, por exemplo 'goiaba'. */
  fruta: string;
  /** As caixas que vieram. */
  caixas: number;
  /** O que o produtor recebe por caixa: o preço do Ceasa × a porcentagem dele, nos centavos. */
  valorPorCaixa: number | null;
  /** As caixas × o valor da caixa, nos centavos. */
  valor: number | null;
};

function emCentavos(valor: number) {
  return Math.round(valor * 100) / 100;
}

/**
 * Só os dias em que o produtor foi coletado, com as caixas que vieram (diaComEntregas), na ordem da
 * agenda. Reaproveita o avisosDoProdutor (S6.3) e fica só com os avisos "coletado". A mesma fruta
 * avisada duas vezes no mesmo dia junta numa linha só, como no recibo.
 *
 * O valor é calculado como no recibo (S8.2): primeiro o valor da caixa, nos centavos, e depois as
 * caixas × esse valor. Assim cada linha fecha ("10 caixas × R$ 48,00 = R$ 480,00") e o extrato
 * bate com o recibo de cada coleta.
 */
export function extratoDoProdutor(produtor: { id: number }, estado: DadosDoExtrato): LinhaDoExtrato[] {
  const agenda = estado.agenda.map((dia) => diaComEntregas(dia, estado.entregas));
  const coletados = avisosDoProdutor(produtor, { ...estado, agenda }).filter(
    (aviso) => aviso.situacao === 'coletado',
  );

  const linhas: LinhaDoExtrato[] = [];
  for (const aviso of coletados) {
    const mesma = linhas.find((linha) => linha.data === aviso.data && linha.fruta === aviso.fruta);
    if (mesma) {
      mesma.caixas += aviso.caixas;
      continue;
    }
    linhas.push({ dia: aviso.dia, data: aviso.data, fruta: aviso.fruta, caixas: aviso.caixas, valorPorCaixa: null, valor: null });
  }

  return linhas.map((linha) => {
    const preco = estado.precos[linha.fruta]?.preco;
    if (preco === undefined) return linha;
    const valorPorCaixa = emCentavos(preco * estado.custos.pagoProdutor);
    return { ...linha, valorPorCaixa, valor: emCentavos(linha.caixas * valorPorCaixa) };
  });
}

/** As caixas e o valor da semana. Fruta sem preço soma nas caixas, mas não no valor. */
export function totalDoExtrato(linhas: LinhaDoExtrato[]) {
  return {
    caixas: linhas.reduce((soma, linha) => soma + linha.caixas, 0),
    valor: emCentavos(linhas.reduce((soma, linha) => soma + (linha.valor ?? 0), 0)),
  };
}

/** "Qui 01/out · Goiaba · 10 caixas × R$ 48,00 = R$ 480,00", ou "… · 8 caixas · valor a combinar". */
function textoDaLinha(linha: LinhaDoExtrato) {
  const comeco = `${rotuloDoDia(linha)} · ${capitalizar(linha.fruta)} · ${textoDasCaixas(linha.caixas)}`;
  if (linha.valorPorCaixa === null || linha.valor === null) return `${comeco} · valor a combinar`;
  return `${comeco} × ${formatarReais(linha.valorPorCaixa)} = ${formatarReais(linha.valor)}`;
}

/**
 * Extrato do Caçuá
 * Seu Antônio · Sítio Pau d'Arco
 * Qui 01/out · Goiaba · 10 caixas × R$ 48,00 = R$ 480,00
 * Sex 02/out · Manga · 14 caixas × R$ 48,00 = R$ 672,00
 * Total: 24 caixas · R$ 1.152,00
 * Ceasa: goiaba R$ 60,00 em 22/09, manga R$ 60,00 em 22/09 · você recebe 80%
 * Coletor: Edson
 *
 * Sem a data do preço (antes do S8.1), a linha do Ceasa sai sem o "em 22/09". Fruta sem preço sai
 * com "valor a combinar" e fica fora do total em reais e da linha do Ceasa; se nenhuma fruta tem
 * preço, o total mostra só as caixas e não há linha do Ceasa. Sem nenhuma coleta, devolve null.
 */
export function textoDoExtrato(
  produtor: { nome: string; sitio: string },
  linhas: LinhaDoExtrato[],
  coletor: { nome: string },
  custos: { pagoProdutor: number },
  precos: DadosDoExtrato['precos'],
) {
  if (linhas.length === 0) return null;

  const total = totalDoExtrato(linhas);
  const comPreco = linhas.some((linha) => linha.valor !== null);
  const textoDoTotal = comPreco
    ? `Total: ${textoDasCaixas(total.caixas)} · ${formatarReais(total.valor)}`
    : `Total: ${textoDasCaixas(total.caixas)}`;

  // O preço do Ceasa de cada fruta com preço, uma vez só, na ordem em que aparece no extrato.
  const frutas = [...new Set(linhas.filter((linha) => linha.valor !== null).map((linha) => linha.fruta))];
  const precosDoCeasa = frutas.flatMap((fruta) => {
    const doCeasa = precos[fruta];
    if (!doCeasa) return [];
    // "em 22/09" com o dataCurta do S8.1; uma data fora do formato fica de fora, e não vira "undefined".
    const dia = ehDataValida(doCeasa.data) ? dataCurta(doCeasa.data) : null;
    return [`${fruta} ${formatarReais(doCeasa.preco)}${dia ? ` em ${dia}` : ''}`];
  });

  return [
    'Extrato do Caçuá',
    `${produtor.nome} · ${produtor.sitio}`,
    ...linhas.map(textoDaLinha),
    textoDoTotal,
    ...(precosDoCeasa.length > 0
      ? [`Ceasa: ${precosDoCeasa.join(', ')} · você recebe ${textoDaPorcentagem(custos.pagoProdutor)}`]
      : []),
    `Coletor: ${coletor.nome}`,
  ].join('\n');
}
