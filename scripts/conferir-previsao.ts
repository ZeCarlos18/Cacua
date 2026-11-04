// Confere as contas do gráfico da Previsão (S4.6) com os períodos do dados.js e o cartão no Trello.
// Rodar na raiz do projeto: npm run conferir

import { coletor, previsao } from '@/data/dados';
import { descricaoDaBarra, diasDoPeriodo, proporcaoDaBarra, viagensCheias } from '@/utils/previsao';

let falhas = 0;

function conferir(nome: string, ok: boolean) {
  if (!ok) falhas++;
  console.log(`${ok ? 'OK   ' : 'FALHA'} ${nome}`);
}

// Início e fim de cada período do dados.js
const dias: Record<string, [string, string]> = {
  '28/set – 04/out': ['28/set', '04/out'],
  '05 – 11/out': ['05/out', '11/out'],
  '12 – 18/out': ['12/out', '18/out'],
  '19 – 25/out': ['19/out', '25/out'],
  '26/out – 01/nov': ['26/out', '01/nov'],
  '02 – 08/nov': ['02/nov', '08/nov'],
};
for (const semana of previsao) {
  const alvo = dias[semana.periodo];
  conferir(
    `"${semana.periodo}" → ${alvo?.join(' a ')}`,
    alvo !== undefined && diasDoPeriodo(semana.periodo).join(',') === alvo.join(','),
  );
}

// O dados.js é editado à mão: hífen no lugar do travessão e período com uma data só não quebram a tela
conferir('Com hífen: "05 - 11/out" → 05/out a 11/out', diasDoPeriodo('05 - 11/out').join(',') === '05/out,11/out');
conferir('Uma data só: "05/out" → 05/out a 05/out', diasDoPeriodo('05/out').join(',') === '05/out,05/out');

// Texto do leitor de tela
conferir(
  'Leitor de tela: "Semana de 26/out a 01/nov, 38 caixas"',
  descricaoDaBarra('26/out – 01/nov', 38) === 'Semana de 26/out a 01/nov, 38 caixas',
);

// Altura das barras (teste do cartão): a de 131 é a mais alta, e só a de 38 fica abaixo dos 60
const maximo = Math.max(coletor.cargaMinima, ...previsao.map((semana) => semana.caixas));
const linha = proporcaoDaBarra(coletor.cargaMinima, maximo);
conferir('A barra de 131 caixas é a mais alta', proporcaoDaBarra(131, maximo) === 1);
conferir(
  'Só a de 38 fica abaixo da linha dos 60',
  previsao.filter((semana) => proporcaoDaBarra(semana.caixas, maximo) < linha).map((semana) => semana.caixas).join(',') === '38',
);
conferir(
  'A semana abaixo da linha é a semana fraca (nenhuma viagem cheia)',
  previsao.every((semana) => (proporcaoDaBarra(semana.caixas, maximo) < linha) === (viagensCheias(semana.caixas, coletor.cargaMinima) === 0)),
);
conferir('Sem caixas: proporcaoDaBarra(0, 0) → 0', proporcaoDaBarra(0, 0) === 0);

if (falhas > 0) {
  console.error(`\n${falhas} conta(s) do gráfico não batem com o cartão.`);
  process.exit(1);
}
console.log('\nAs contas do gráfico da Previsão batem com o cartão.');
