// Confere as contas dos detalhes do produtor (S6.3) com os números do cartão no Trello.
// Rodar na raiz do projeto: npm run conferir

import { pontoFocal, posto, produtores } from '@/data/dados';
import { comColeta, comConfirmacao, estadoInicial, type EstadoCacua } from '@/state/estado';
import { formatarReais } from '@/utils/calculos';
import { textoDoKm } from '@/utils/conta';
import {
  avisosDoProdutor,
  comoAvisa,
  hrefDoProdutor,
  taxaDeCumprimento,
  totalDosAvisos,
} from '@/utils/produtores';
import { kmEntre } from '@/utils/rota';

let falhas = 0;

function conferir(nome: string, ok: boolean) {
  if (!ok) falhas++;
  console.log(`${ok ? 'OK   ' : 'FALHA'} ${nome}`);
}

function produtor(nome: string) {
  const achado = produtores.find((p) => p.nome === nome);
  if (!achado) throw new Error(`${nome} não está no dados.js`);
  return achado;
}

// Como nos detalhes: o estado do useCacua() (agenda, preços, custos, coletas e confirmações).
function avisos(nome: string, estado: EstadoCacua) {
  return avisosDoProdutor(
    produtor(nome),
    estado.agenda,
    estado.precos,
    estado.custos.pagoProdutor,
    estado.coletas,
    estado.confirmados,
  );
}

// Distância do posto, em linha reta
const distancias: Record<string, string> = {
  'Seu Francisco': '4,7 km',
  'Seu Antônio': '7,5 km',
  'Dona Maria': '5,6 km',
  'Dona Lúcia': '5,9 km',
  'Seu Raimundo': '7,4 km',
  'Seu Pedro': '2,5 km',
};
for (const [nome, esperado] of Object.entries(distancias)) {
  const km = textoDoKm(kmEntre(posto, produtor(nome).posicao));
  conferir(`Distância do posto: ${nome} ${esperado}`, km === esperado);
}
conferir('Do posto ao próprio posto: 0 km', kmEntre(posto, posto) === 0);

// Taxa de avisos cumpridos
conferir('Taxa: Seu Antônio 86% (6 de 7)', taxaDeCumprimento(produtor('Seu Antônio')) === 86);
conferir('Taxa: Seu Raimundo 67% (2 de 3)', taxaDeCumprimento(produtor('Seu Raimundo')) === 67);
conferir('Taxa: Dona Lúcia 100% (5 de 5)', taxaDeCumprimento(produtor('Dona Lúcia')) === 100);
conferir('Taxa sem nenhum aviso: null', taxaDeCumprimento({ cumpridos: 0, avisos: 0 }) === null);

// Avisos da semana
const inicio = estadoInicial();

const antonio = avisos('Seu Antônio', inicio);
conferir('Seu Antônio: quinta, sexta e sábado', antonio.map((a) => a.dia).join(', ') === 'Quinta, Sexta, Sábado');
const goiabaDaQuinta = antonio.find((a) => a.data === '01/out' && a.fruta === 'goiaba');
conferir(
  'Seu Antônio: goiaba 12 cx na quinta, a R$ 60,00 a caixa = R$ 576,00',
  goiabaDaQuinta?.caixas === 12 &&
    goiabaDaQuinta.precoDaCaixa === 60 &&
    goiabaDaQuinta.valor !== null &&
    formatarReais(goiabaDaQuinta.valor) === 'R$ 576,00',
);
const totalAntonio = totalDosAvisos(antonio);
conferir(
  'Seu Antônio: semana com 35 caixas e R$ 1.680,00',
  totalAntonio.caixas === 35 && formatarReais(totalAntonio.valor) === 'R$ 1.680,00',
);
conferir('Seu Antônio: todos aguardando no começo', antonio.every((a) => a.situacao === 'aguardando'));

const totalLucia = totalDosAvisos(avisos('Dona Lúcia', inicio));
conferir(
  'Dona Lúcia: 23 caixas e R$ 1.880,00',
  totalLucia.caixas === 23 && formatarReais(totalLucia.valor) === 'R$ 1.880,00',
);

const francisco = avisos('Seu Francisco', inicio);
conferir(
  'Seu Francisco não tem aviso: 0 caixas e R$ 0,00',
  francisco.length === 0 && totalDosAvisos(francisco).caixas === 0 && totalDosAvisos(francisco).valor === 0,
);

// Situação de cada aviso
const mangaDaMaria = avisos('Dona Maria', inicio).find((a) => a.data === '01/out');
conferir('A manga da Dona Maria na quinta já vem "coletado"', mangaDaMaria?.situacao === 'coletado');

const depois = comConfirmacao(comColeta(inicio, '30/set', 4), '01/out');
const lucia = avisos('Dona Lúcia', depois);
conferir(
  'Coletando a Dona Lúcia na quarta: a quarta fica "coletado"',
  lucia.find((a) => a.data === '30/set')?.situacao === 'coletado',
);
conferir(
  'Confirmando a quinta: a quinta da Dona Lúcia fica "confirmado"',
  lucia.find((a) => a.data === '01/out')?.situacao === 'confirmado',
);
conferir(
  'Na quinta confirmada, a Dona Maria continua "coletado"',
  avisos('Dona Maria', depois).find((a) => a.data === '01/out')?.situacao === 'coletado',
);
conferir(
  'A sexta e o sábado do Seu Antônio continuam "aguardando"',
  avisos('Seu Antônio', depois)
    .filter((a) => a.data !== '01/out')
    .every((a) => a.situacao === 'aguardando'),
);

// Fruta sem preço do Ceasa (o coco): aparece, mas não soma no valor
const comCoco = avisosDoProdutor(
  produtor('Seu Pedro'),
  [{ dia: 'Domingo', data: '04/out', avisos: [{ produtor: 6, fruta: 'coco', caixas: 5 }] }],
  inicio.precos,
  inicio.custos.pagoProdutor,
  {},
  [],
);
conferir(
  'Coco sem preço: preço e valor null, e o total soma só as caixas',
  comCoco[0]?.precoDaCaixa === null &&
    comCoco[0].valor === null &&
    totalDosAvisos(comCoco).caixas === 5 &&
    totalDosAvisos(comCoco).valor === 0,
);

// Como avisa e o endereço dos detalhes
conferir(
  'Ponto focal: "Avisa pela Joana, a ponto focal, por ligação ou visita."',
  comoAvisa('Ponto focal', pontoFocal) === 'Avisa pela Joana, a ponto focal, por ligação ou visita.',
);
conferir('WhatsApp: "Avisa pelo WhatsApp do Caçuá."', comoAvisa('WhatsApp', pontoFocal) === 'Avisa pelo WhatsApp do Caçuá.');
conferir('Endereço da Dona Lúcia: /produtor/4', String(hrefDoProdutor(4)) === '/produtor/4');

if (falhas > 0) {
  console.error(`\n${falhas} conta(s) dos detalhes do produtor não batem com o cartão.`);
  process.exit(1);
}
console.log('\nAs contas dos detalhes dos 6 produtores batem com o cartão.');
