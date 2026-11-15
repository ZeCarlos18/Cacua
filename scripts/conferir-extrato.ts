// Confere o extrato do produtor (S8.3) com os números do cartão no Trello.
// Rodar na raiz do projeto: npm run conferir

import { coletor } from '@/data/dados';
import {
  comAviso,
  comColeta,
  comConfirmacao,
  comProdutor,
  estadoInicial,
  semColeta,
  type EstadoCacua,
} from '@/state/estado';
import { formatarReais } from '@/utils/calculos';
import { extratoDoProdutor, textoDoExtrato, totalDoExtrato } from '@/utils/extrato';
import { itensDoRecibo, totalDoRecibo } from '@/utils/recibo';

let falhas = 0;

function conferir(nome: string, ok: boolean) {
  if (!ok) falhas++;
  console.log(`${ok ? 'OK   ' : 'FALHA'} ${nome}`);
}

function produtor(estado: EstadoCacua, nome: string) {
  const achado = estado.produtores.find((item) => item.nome === nome);
  if (!achado) throw new Error(`${nome} não está entre os produtores.`);
  return achado;
}

/** O extrato e o texto, como a tela do S8.6 vai montar. */
function extrato(estado: EstadoCacua, nome: string, precos: EstadoCacua['precos'] = estado.precos) {
  const dono = produtor(estado, nome);
  const linhas = extratoDoProdutor(dono, { ...estado, precos });
  return { linhas, total: totalDoExtrato(linhas), texto: textoDoExtrato(dono, linhas, coletor, estado.custos, precos) };
}

const linhasDoTexto = (texto: string | null) => (texto ?? '').split('\n');

// Dona Maria: coletada na quinta, já no dados.js
const inicio = estadoInicial();
const maria = extrato(inicio, 'Dona Maria');
conferir('Dona Maria: 1 linha', maria.linhas.length === 1);
conferir(
  'Dona Maria: "Qui 01/out · Manga · 20 caixas × R$ 48,00 = R$ 960,00"',
  linhasDoTexto(maria.texto)[2] === 'Qui 01/out · Manga · 20 caixas × R$ 48,00 = R$ 960,00',
);
conferir(
  'Dona Maria: total 20 caixas · R$ 960,00',
  maria.total.caixas === 20 && formatarReais(maria.total.valor) === 'R$ 960,00' && linhasDoTexto(maria.texto)[3] === 'Total: 20 caixas · R$ 960,00',
);
conferir(
  'Sem a data do preço (antes do S8.1): "Ceasa: manga R$ 60,00 · você recebe 80%"',
  linhasDoTexto(maria.texto)[4] === 'Ceasa: manga R$ 60,00 · você recebe 80%',
);
conferir('O texto termina com "Coletor: Edson"', linhasDoTexto(maria.texto).at(-1) === 'Coletor: Edson');

// Seu Antônio sem coleta
const semColetaAinda = extrato(inicio, 'Seu Antônio');
conferir('Seu Antônio sem coleta: lista vazia e texto null', semColetaAinda.linhas.length === 0 && semColetaAinda.texto === null);

// Seu Antônio coletado na quinta (10 de goiaba) e na sexta (14 de manga)
const quinta = comColeta(inicio, '01/out', 2, { goiaba: 10 });
const quintaESexta = comColeta(quinta, '02/out', 2, { manga: 14 });
const antonio = extrato(quintaESexta, 'Seu Antônio');
conferir('Seu Antônio na quinta e na sexta: 2 linhas', antonio.linhas.length === 2);
conferir(
  'Seu Antônio: total 24 caixas · R$ 1.152,00',
  antonio.total.caixas === 24 && formatarReais(antonio.total.valor) === 'R$ 1.152,00',
);
// Com a data do preço (o S8.1 coloca `data` em cada preço), o texto inteiro do cartão
const comData = {
  ...quintaESexta.precos,
  goiaba: { ...quintaESexta.precos.goiaba, data: '2026-09-22' },
  manga: { ...quintaESexta.precos.manga, data: '2026-09-22' },
};
conferir(
  'Com a data do preço: o texto do cartão, linha por linha',
  extrato(quintaESexta, 'Seu Antônio', comData).texto ===
    [
      'Extrato do Caçuá',
      "Seu Antônio · Sítio Pau d'Arco",
      'Qui 01/out · Goiaba · 10 caixas × R$ 48,00 = R$ 480,00',
      'Sex 02/out · Manga · 14 caixas × R$ 48,00 = R$ 672,00',
      'Total: 24 caixas · R$ 1.152,00',
      'Ceasa: goiaba R$ 60,00 em 22/09, manga R$ 60,00 em 22/09 · você recebe 80%',
      'Coletor: Edson',
    ].join('\n'),
);
conferir(
  'Sem a data: "Ceasa: goiaba R$ 60,00, manga R$ 60,00 · você recebe 80%"',
  linhasDoTexto(antonio.texto)[5] === 'Ceasa: goiaba R$ 60,00, manga R$ 60,00 · você recebe 80%',
);

// Desfazer a coleta da sexta
const desfeita = extrato(semColeta(quintaESexta, '02/out', 2), 'Seu Antônio');
conferir(
  'Desfazer a sexta: só a quinta, R$ 480,00',
  desfeita.linhas.length === 1 && desfeita.linhas[0].data === '01/out' && formatarReais(desfeita.total.valor) === 'R$ 480,00',
);

// Seu Pedro com 8 caixas de coco no sábado (fruta sem preço)
const comCoco = comColeta(comAviso(inicio, '03/out', { produtor: 6, fruta: 'coco', caixas: 8 }), '03/out', 6);
const pedroCoco = extrato(comCoco, 'Seu Pedro');
conferir(
  'Seu Pedro: "Sáb 03/out · Coco · 8 caixas · valor a combinar"',
  linhasDoTexto(pedroCoco.texto)[2] === 'Sáb 03/out · Coco · 8 caixas · valor a combinar',
);
conferir(
  'Só coco: fora do total em reais ("Total: 8 caixas") e sem a linha do Ceasa',
  pedroCoco.total.caixas === 8 &&
    pedroCoco.total.valor === 0 &&
    linhasDoTexto(pedroCoco.texto)[3] === 'Total: 8 caixas' &&
    !(pedroCoco.texto ?? '').includes('Ceasa:'),
);
const pedroBananaECoco = extrato(comColeta(comCoco, '02/out', 6), 'Seu Pedro');
conferir(
  'Seu Pedro com banana na sexta e coco no sábado: 20 caixas · R$ 403,20, e o Ceasa só da banana',
  pedroBananaECoco.total.caixas === 20 &&
    formatarReais(pedroBananaECoco.total.valor) === 'R$ 403,20' &&
    linhasDoTexto(pedroBananaECoco.texto)[4] === 'Total: 20 caixas · R$ 403,20' &&
    linhasDoTexto(pedroBananaECoco.texto)[5] === 'Ceasa: banana R$ 42,00 · você recebe 80%',
);

// Além do cartão
const duasVezes = comColeta(comAviso(inicio, '02/out', { produtor: 2, fruta: 'manga', caixas: 6 }), '02/out', 2, { manga: 18 });
const juntou = extrato(duasVezes, 'Seu Antônio');
conferir(
  'Manga avisada duas vezes na sexta (14 e 6), vieram 18: uma linha só, 18 caixas',
  juntou.linhas.length === 1 && juntou.linhas[0].caixas === 18,
);
const aOitentaECinco = extrato({ ...quinta, custos: { ...quinta.custos, pagoProdutor: 0.85 } }, 'Seu Antônio');
conferir(
  'Coletor pagando 85%: "10 caixas × R$ 51,00 = R$ 510,00" e "você recebe 85%"',
  linhasDoTexto(aOitentaECinco.texto)[2] === 'Qui 01/out · Goiaba · 10 caixas × R$ 51,00 = R$ 510,00' &&
    (aOitentaECinco.texto ?? '').includes('você recebe 85%'),
);
const quebrado = extrato({ ...quinta, precos: { ...quinta.precos, goiaba: { ...quinta.precos.goiaba, preco: 61 } }, custos: { ...quinta.custos, pagoProdutor: 0.825 } }, 'Seu Antônio');
conferir(
  'Preço com meio centavo (61 × 82,5%): a linha fecha, 10 × R$ 50,33 = R$ 503,30, como no recibo',
  linhasDoTexto(quebrado.texto)[2] === 'Qui 01/out · Goiaba · 10 caixas × R$ 50,33 = R$ 503,30',
);
const estadoQuebrado = {
  ...quinta,
  precos: { ...quinta.precos, goiaba: { ...quinta.precos.goiaba, preco: 61 } },
  custos: { ...quinta.custos, pagoProdutor: 0.825 },
};
const doRecibo = totalDoRecibo(
  itensDoRecibo(estadoQuebrado.agenda[1], 2, estadoQuebrado.entregas, estadoQuebrado.precos, estadoQuebrado.custos),
);
conferir(
  'O extrato e o recibo (S8.2) da mesma coleta dão o mesmo valor',
  extrato(estadoQuebrado, 'Seu Antônio').total.valor === doRecibo,
);
conferir(
  'Dia confirmado continua no extrato',
  extrato(comConfirmacao(quinta, '01/out'), 'Seu Antônio').linhas.length === 1,
);
const comRita = comProdutor(inicio, {
  nome: 'Dona Rita',
  sitio: 'Sítio Lagoa Seca',
  frutas: ['goiaba'],
  canal: 'WhatsApp',
  posicao: { x: 168, y: 230 },
});
const rita = extrato(comRita, 'Dona Rita');
conferir('Produtor novo (Dona Rita): lista vazia e texto null', rita.linhas.length === 0 && rita.texto === null);
const umaCaixa = extrato(comColeta(inicio, '01/out', 4, { maracujá: 1 }), 'Dona Lúcia');
conferir(
  'Uma caixa só: "1 caixa × R$ 104,00 = R$ 104,00"',
  linhasDoTexto(umaCaixa.texto)[2] === 'Qui 01/out · Maracujá · 1 caixa × R$ 104,00 = R$ 104,00',
);

if (falhas > 0) {
  console.error(`\n${falhas} conta(s) do extrato não batem com o cartão.`);
  process.exit(1);
}
console.log('\nO extrato do produtor bate com o cartão.');
