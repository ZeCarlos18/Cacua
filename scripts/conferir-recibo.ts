// Confere o texto e as contas do recibo da coleta (S5.2 e S8.2) com os do cartão no Trello.
// Rodar na raiz do projeto: npm run conferir

import { agenda, coletor, custos, precos } from '@/data/dados';
import { chaveDaEntrega, type Entregas } from '@/utils/coleta';
import { itensDoRecibo, textoDoRecibo, totalDoRecibo } from '@/utils/recibo';

let falhas = 0;

function conferir(nome: string, ok: boolean) {
  if (!ok) falhas++;
  console.log(`${ok ? 'OK   ' : 'FALHA'} ${nome}`);
}

function dia(data: string) {
  const achado = agenda.find((item) => item.data === data);
  if (!achado) throw new Error(`O dia ${data} não está no dados.js`);
  return achado;
}

const quinta = dia('01/out');
const sexta = dia('02/out');
const antonio = { nome: 'Seu Antônio', sitio: 'Sítio Pau d\'Arco' };

/** O recibo do produtor no dia, do jeito que a Rota monta. */
function recibo(
  doDia: typeof quinta,
  produtor: { id: number; nome: string; sitio: string },
  entregas: Entregas = {},
  tabela: Parameters<typeof itensDoRecibo>[3] = precos,
  custosDoColetor = custos,
) {
  const itens = itensDoRecibo(doDia, produtor.id, entregas, tabela, custosDoColetor);
  return { itens, texto: textoDoRecibo(doDia, produtor, itens, coletor, custosDoColetor) };
}

// Seu Antônio, quinta, vieram 10 de goiaba (avisou 12): o texto do cartão, com a data do preço
const comData = { ...precos, goiaba: { ...precos.goiaba, data: '2026-09-22' } };
const entregaDoAntonio: Entregas = { '01/out': { [chaveDaEntrega(2, 'goiaba')]: 10 } };
conferir(
  'Seu Antônio, quinta, vieram 10 de goiaba: o texto do cartão',
  recibo(quinta, { id: 2, ...antonio }, entregaDoAntonio, comData).texto ===
    [
      'Recibo do Caçuá',
      'Quinta 01/out',
      "Seu Antônio · Sítio Pau d'Arco",
      'Goiaba: 10 caixas (avisou 12)',
      'R$ 48,00 a caixa = R$ 480,00',
      'Ceasa: R$ 60,00 a caixa em 22/09 · você recebe 80%',
      'Total: R$ 480,00',
      'Coletado por Edson',
    ].join('\n'),
);

// Com os preços do dados.js, que desde o S8.1 têm a data do boletim
conferir(
  'Com os preços do dados.js: "Ceasa: R$ 60,00 a caixa em 22/09 · você recebe 80%"',
  recibo(quinta, { id: 2, ...antonio }, entregaDoAntonio).texto.split('\n')[5] ===
    'Ceasa: R$ 60,00 a caixa em 22/09 · você recebe 80%',
);

// Sem a data do preço (como antes do S8.1): os preços montados sem o campo `data`
const semDataNoPreco = Object.fromEntries(
  Object.entries(precos).map(([fruta, { preco, kg }]) => [fruta, { preco, kg }]),
);
const semData = recibo(quinta, { id: 2, ...antonio }, entregaDoAntonio, semDataNoPreco);
conferir(
  'Sem a data do preço: "Ceasa: R$ 60,00 a caixa · você recebe 80%"',
  semData.texto.split('\n')[5] === 'Ceasa: R$ 60,00 a caixa · você recebe 80%',
);
const dataRuim = { ...precos, goiaba: { ...precos.goiaba, data: '22/09' } };
conferir(
  'Data fora do formato: a linha sai sem o "em", e não com "undefined"',
  recibo(quinta, { id: 2, ...antonio }, entregaDoAntonio, dataRuim).texto.split('\n')[5] ===
    'Ceasa: R$ 60,00 a caixa · você recebe 80%',
);
conferir('Seu Antônio: total R$ 480,00', totalDoRecibo(semData.itens) === 480);
conferir(
  'Seu Antônio: o item com as caixas que vieram e as avisadas',
  semData.itens.length === 1 && semData.itens[0].caixas === 10 && semData.itens[0].avisadas === 12,
);

// Sem entregas, vale o avisado, e o recibo não tem "(avisou)"
conferir(
  'Sem entregas: "Goiaba: 12 caixas", sem "(avisou)"',
  recibo(quinta, { id: 2, ...antonio }).texto.split('\n')[3] === 'Goiaba: 12 caixas',
);

// Os valores do cartão
function valorDaLinha(texto: string) {
  return texto.split('\n')[4];
}
conferir(
  'Dona Maria, quinta, manga 20: R$ 48,00 a caixa = R$ 960,00',
  valorDaLinha(recibo(quinta, { id: 3, nome: 'Dona Maria', sitio: 'Sítio Riacho Verde' }).texto) ===
    'R$ 48,00 a caixa = R$ 960,00',
);
conferir(
  'Dona Lúcia, quinta, maracujá 15: R$ 104,00 a caixa = R$ 1.560,00',
  valorDaLinha(recibo(quinta, { id: 4, nome: 'Dona Lúcia', sitio: "Sítio Olho d'Água" }).texto) ===
    'R$ 104,00 a caixa = R$ 1.560,00',
);
conferir(
  'Seu Pedro, sexta, banana 12: R$ 33,60 a caixa = R$ 403,20',
  valorDaLinha(recibo(sexta, { id: 6, nome: 'Seu Pedro', sitio: 'Sítio Cajueiro' }).texto) ===
    'R$ 33,60 a caixa = R$ 403,20',
);

// Goiaba a R$ 70,00, com a data do preço
const goiaba70 = { ...precos, goiaba: { preco: 70, kg: 25, data: '2026-11-17' } };
const aSetenta = recibo(quinta, { id: 2, ...antonio }, entregaDoAntonio, goiaba70).texto.split('\n');
conferir('Goiaba a R$ 70,00: R$ 56,00 a caixa = R$ 560,00', aSetenta[4] === 'R$ 56,00 a caixa = R$ 560,00');
conferir(
  'Goiaba a R$ 70,00: "Ceasa: R$ 70,00 a caixa em 17/11 · você recebe 80%"',
  aSetenta[5] === 'Ceasa: R$ 70,00 a caixa em 17/11 · você recebe 80%',
);

// Coletor pagando 85%
const a85 = recibo(quinta, { id: 2, ...antonio }, entregaDoAntonio, precos, { ...custos, pagoProdutor: 0.85 });
conferir(
  'Coletor pagando 85%: goiaba R$ 51,00 a caixa, 10 caixas = R$ 510,00',
  a85.texto.split('\n')[4] === 'R$ 51,00 a caixa = R$ 510,00',
);
conferir('Coletor pagando 85%: "você recebe 85%"', a85.texto.includes('você recebe 85%'));

// Seu Pedro com coco (sem preço) e banana no mesmo dia
const pedroComCoco = {
  dia: 'Sexta',
  data: '02/out',
  avisos: [
    { produtor: 6, fruta: 'coco', caixas: 8 },
    { produtor: 6, fruta: 'banana', caixas: 12 },
  ],
};
const pedro = recibo(pedroComCoco, { id: 6, nome: 'Seu Pedro', sitio: 'Sítio Cajueiro' });
const linhasDoPedro = pedro.texto.split('\n');
conferir('Coco sem preço: "Coco: 8 caixas"', linhasDoPedro[3] === 'Coco: 8 caixas');
conferir(
  'Coco sem preço: "Sem preço do Ceasa no app: valor a combinar"',
  linhasDoPedro[4] === 'Sem preço do Ceasa no app: valor a combinar',
);
conferir('Coco não entra no total: R$ 403,20', totalDoRecibo(pedro.itens) === 403.2 && linhasDoPedro.includes('Total: R$ 403,20'));
conferir(
  'Coco e banana: uma linha por fruta, na ordem do aviso',
  pedro.itens.map((item) => item.fruta).join() === 'coco,banana' && pedro.itens[0].valor === undefined,
);

// Só fruta sem preço: não tem a linha "Total"
const soCoco = recibo(
  { dia: 'Sexta', data: '02/out', avisos: [{ produtor: 6, fruta: 'coco', caixas: 8 }] },
  { id: 6, nome: 'Seu Pedro', sitio: 'Sítio Cajueiro' },
);
conferir('Só coco: não tem a linha "Total"', !soCoco.texto.includes('Total:') && totalDoRecibo(soCoco.itens) === 0);

// Duas frutas do mesmo produtor: um bloco para cada uma, e um total só
const duasFrutas = recibo(
  {
    dia: 'Sexta',
    data: '02/out',
    avisos: [
      { produtor: 2, fruta: 'goiaba', caixas: 9 },
      { produtor: 2, fruta: 'manga', caixas: 3 },
    ],
  },
  { id: 2, ...antonio },
);
conferir(
  'Duas frutas do mesmo produtor: goiaba R$ 432,00 + manga R$ 144,00 = R$ 576,00',
  duasFrutas.texto.includes('Goiaba: 9 caixas') &&
    duasFrutas.texto.includes('Manga: 3 caixas') &&
    duasFrutas.texto.includes('Total: R$ 576,00'),
);

// A mesma fruta avisada duas vezes (5 e 7) com 11 que vieram: junta numa linha só
const duasVezes = recibo(
  {
    dia: 'Sexta',
    data: '02/out',
    avisos: [
      { produtor: 2, fruta: 'goiaba', caixas: 5 },
      { produtor: 2, fruta: 'goiaba', caixas: 7 },
    ],
  },
  { id: 2, ...antonio },
  { '02/out': { [chaveDaEntrega(2, 'goiaba')]: 11 } },
);
conferir(
  'Goiaba avisada 5 e 7, vieram 11: uma linha, "Goiaba: 11 caixas (avisou 12)"',
  duasVezes.itens.length === 1 && duasVezes.texto.split('\n')[3] === 'Goiaba: 11 caixas (avisou 12)',
);

// Uma caixa só
conferir(
  'Uma caixa só: "Banana: 1 caixa"',
  recibo(
    { dia: 'Quarta', data: '30/set', avisos: [{ produtor: 5, fruta: 'banana', caixas: 1 }] },
    { id: 5, nome: 'Seu Raimundo', sitio: 'Sítio Baixio' },
  ).texto.split('\n')[3] === 'Banana: 1 caixa',
);

// Os outros produtores do dia não entram no recibo
conferir(
  'Só as frutas do produtor: o recibo do Seu Antônio na quinta não tem manga nem maracujá',
  !recibo(quinta, { id: 2, ...antonio }).texto.includes('Manga') &&
    !recibo(quinta, { id: 2, ...antonio }).texto.includes('Maracujá'),
);

if (falhas > 0) {
  console.error(`\n${falhas} regra(s) do recibo não batem com o cartão.`);
  process.exit(1);
}
console.log('\nO recibo bate com o cartão.');
