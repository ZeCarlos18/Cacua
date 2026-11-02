// Confere os campos da aba Custos (S4.3): o que entra, o que é recusado e os testes do cartão.
// Rodar na raiz do projeto: npm run conferir

import { posto, produtores } from '@/data/dados';
import { comCustos, comPreco, estadoInicial, type EstadoCacua } from '@/state/estado';
import { calcularLucroDoDia } from '@/utils/calculos';
import { textoDaPorcentagem } from '@/utils/conta';
import { lerCampo, textoDoCampo, type Unidade } from '@/utils/custos';
import { diaComKm } from '@/utils/rota';

let falhas = 0;

function conferir(nome: string, ok: boolean) {
  if (!ok) falhas++;
  console.log(`${ok ? 'OK   ' : 'FALHA'} ${nome}`);
}

const aceitos: [string, Unidade, number][] = [
  ['7,50', 'reais', 7.5],
  ['7.5', 'reais', 7.5],
  [' 100 ', 'reais', 100],
  ['0', 'reais', 0],
  [',5', 'reais', 0.5],
  ['7,', 'reais', 7],
  ['7,126', 'reais', 7.13],
  ['80', 'porcentagem', 0.8],
  ['5', 'porcentagem', 0.05],
  ['7,5', 'porcentagem', 0.075],
  ['8,5', 'kmPorLitro', 8.5],
];
for (const [texto, unidade, esperado] of aceitos) {
  conferir(`"${texto}" (${unidade}) vira ${esperado}`, lerCampo(texto, unidade) === esperado);
}

const recusados: [string, Unidade][] = [
  ['', 'reais'],
  ['   ', 'reais'],
  ['-5', 'reais'],
  ['abc', 'reais'],
  ['7a', 'reais'],
  ['1,2,3', 'reais'],
  ['1e3', 'reais'],
  ['0x10', 'reais'],
  [',', 'reais'],
  ['0', 'kmPorLitro'],
  ['0,001', 'kmPorLitro'],
];
for (const [texto, unidade] of recusados) {
  conferir(`"${texto}" (${unidade}) é recusado`, lerCampo(texto, unidade) === null);
}

const textos: [number, Unidade, string][] = [
  [6.97, 'reais', '6,97'],
  [0.5, 'reais', '0,50'],
  [70, 'reais', '70,00'],
  [0.8, 'porcentagem', '80'],
  [0.05, 'porcentagem', '5'],
  [0.29, 'porcentagem', '29'],
  [0.075, 'porcentagem', '7,5'],
  [8, 'kmPorLitro', '8'],
  [8.5, 'kmPorLitro', '8,5'],
];
for (const [valor, unidade, esperado] of textos) {
  conferir(`${valor} (${unidade}) aparece como "${esperado}"`, textoDoCampo(valor, unidade) === esperado);
}

conferir('A Conta mostra 80% como antes', textoDaPorcentagem(0.8) === '80%');
conferir('A Conta mostra 7,5% sem arredondar', textoDaPorcentagem(0.075) === '7,5%');

// Os testes do cartão, a partir do que é digitado no campo.
function contaDoDia(estado: EstadoCacua, data: string) {
  const dia = estado.agenda.find((item) => item.data === data);
  if (!dia) throw new Error(`Dia ${data} não está na agenda`);
  return calcularLucroDoDia(diaComKm(dia, produtores, posto), estado.precos, estado.custos);
}

const inicio = estadoInicial();
const diesel = comCustos(inicio, { diesel: lerCampo('7,50', 'reais') ?? undefined });
conferir('Diesel "7,50": a quinta vai para R$ 483,62', contaDoDia(diesel, '01/out').lucro === 483.62);

const lucroMinimo = comCustos(inicio, { lucroMinimo: lerCampo('100', 'reais') ?? undefined });
conferir('Lucro mínimo "100": a sexta vira "Vale a pena"', contaDoDia(lucroMinimo, '02/out').selo === 'Vale a pena');

const banana = comPreco(inicio, 'banana', lerCampo('50', 'reais') ?? 0);
conferir('Banana "50": a quarta vai para R$ 42,30', contaDoDia(banana, '30/set').lucro === 42.3);
conferir('Banana "50": a sexta vai para R$ 125,22', contaDoDia(banana, '02/out').lucro === 125.22);

if (falhas > 0) {
  console.error(`\n${falhas} regra(s) dos campos não batem com o cartão.`);
  process.exit(1);
}
console.log('\nOs campos da aba Custos batem com o cartão.');
