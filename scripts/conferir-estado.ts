// Confere as regras do estado (S4.1) com os números dos cartões S4.3 e S4.4.
// Rodar na raiz do projeto: npm run conferir

import { posto, produtores } from '@/data/dados';
import {
  comAviso,
  comColeta,
  comCustos,
  comPreco,
  estadoInicial,
  type EstadoCacua,
} from '@/state/estado';
import { calcularLucroDoDia } from '@/utils/calculos';
import { diaComKm, montarRota } from '@/utils/rota';

/** A conta de um dia ('30/set') com os valores do estado. */
function contaDoDia(estado: EstadoCacua, data: string) {
  const dia = estado.agenda.find((item) => item.data === data);
  if (!dia) throw new Error(`Dia ${data} não está na agenda`);
  return calcularLucroDoDia(diaComKm(dia, produtores, posto), estado.precos, estado.custos);
}

function lucros(estado: EstadoCacua) {
  return estado.agenda.map((dia) => contaDoDia(estado, dia.data).lucro).join(' · ');
}

let falhas = 0;

function conferir(nome: string, ok: boolean) {
  if (!ok) falhas++;
  console.log(`${ok ? 'OK   ' : 'FALHA'} ${nome}`);
}

const inicio = estadoInicial();
const lucrosDoFigma = '30.3 · 484.86 · 110.82 · -9.66';

conferir(`Sem mudanças, os 4 lucros são ${lucrosDoFigma}`, lucros(inicio) === lucrosDoFigma);

// Custos e preços (S4.3)
const diesel = comCustos(inicio, { diesel: 7.5 });
conferir('Diesel R$ 7,50: a quinta vai para R$ 483,62', contaDoDia(diesel, '01/out').lucro === 483.62);
conferir('Diesel R$ 7,50: só o diesel muda', diesel.custos.kmPorLitro === inicio.custos.kmPorLitro);

const lucroMinimo = comCustos(inicio, { lucroMinimo: 100 });
conferir(
  'Lucro mínimo R$ 100: a sexta vira "Vale a pena"',
  contaDoDia(lucroMinimo, '02/out').selo === 'Vale a pena',
);

const banana = comPreco(inicio, 'banana', 50);
conferir('Banana R$ 50: a quarta vai para R$ 42,30', contaDoDia(banana, '30/set').lucro === 42.3);
conferir('Banana R$ 50: a sexta vai para R$ 125,22', contaDoDia(banana, '02/out').lucro === 125.22);
conferir('Banana R$ 50: o peso da caixa continua', banana.precos.banana.kg === inicio.precos.banana.kg);
conferir('Fruta sem preço (coco) não muda nada', comPreco(inicio, 'coco', 30) === inicio);

// Novo aviso (S4.4)
const quarta = comAviso(inicio, '30/set', { produtor: 1, fruta: 'goiaba', caixas: 20 });
const contaDaQuarta = contaDoDia(quarta, '30/set');
const rotaDaQuarta = montarRota(quarta.agenda[0], produtores, posto);
conferir('Aviso na quarta: 38 caixas', contaDaQuarta.caixas === 38);
conferir('Aviso na quarta: R$ 210,20 · Vale a pena', contaDaQuarta.lucro === 210.2 && contaDaQuarta.selo === 'Vale a pena');
conferir(
  "Aviso na quarta: rota Boa Vista → Baixio → Olho d'Água",
  rotaDaQuarta.paradas.map((parada) => parada.sitio).join(' → ') ===
    "Sítio Boa Vista → Sítio Baixio → Sítio Olho d'Água",
);
conferir('Aviso na quarta: 16,625 km', rotaDaQuarta.km.toFixed(3) === '16.625');

const sabado = comAviso(inicio, '03/out', { produtor: 1, fruta: 'goiaba', caixas: 25 });
const contaDoSabado = contaDoDia(sabado, '03/out');
conferir(
  'Aviso no sábado: 34 caixas · R$ 215,30 · Vale a pena',
  contaDoSabado.caixas === 34 && contaDoSabado.lucro === 215.3 && contaDoSabado.selo === 'Vale a pena',
);

const semDia = comAviso(inicio, '30/fev', { produtor: 1, fruta: 'goiaba', caixas: 20 });
conferir('Dia fora da agenda não muda nada', lucros(semDia) === lucrosDoFigma);

// Coletas por dia (S5.1)
conferir(
  'Coletas começam com a quinta: { "01/out": [3] }',
  JSON.stringify(inicio.coletas) === JSON.stringify({ '01/out': [3] }),
);
const coleta = comColeta(inicio, '30/set', 4);
conferir(
  'Coleta da Dona Lúcia na quarta: { "01/out": [3], "30/set": [4] }',
  JSON.stringify(coleta.coletas) === JSON.stringify({ '01/out': [3], '30/set': [4] }),
);
conferir('A quinta não muda', coleta.coletas['01/out'].join(',') === '3');
conferir('Coleta na quinta: entra o produtor', comColeta(inicio, '01/out', 2).coletas['01/out'].join(',') === '3,2');
conferir('Coleta repetida não duplica', comColeta(coleta, '30/set', 4) === coleta);
conferir('Coleta num dia fora da agenda não muda nada', comColeta(inicio, '30/fev', 4) === inicio);

// Restaurar: nada acima pode ter mexido nos valores do dados.js
conferir('Restaurar: os 4 lucros voltam', lucros(estadoInicial()) === lucrosDoFigma);
conferir(
  'Restaurar: as coletas voltam a { "01/out": [3] }',
  JSON.stringify(estadoInicial().coletas) === JSON.stringify({ '01/out': [3] }),
);

if (falhas > 0) {
  console.error(`\n${falhas} regra(s) do estado não batem com os cartões.`);
  process.exit(1);
}
console.log('\nAs regras do estado batem com os cartões.');
