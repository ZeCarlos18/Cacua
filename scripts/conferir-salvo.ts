// Confere a leitura do estado salvo no celular (S4.5): o que volta igual e o que é ignorado.
// Rodar na raiz do projeto: npm run conferir

import { posto, produtores } from '@/data/dados';
import {
  comAviso,
  comColeta,
  comConfirmacao,
  comCustos,
  estadoDoSalvo,
  estadoInicial,
  type EstadoCacua,
} from '@/state/estado';
import { calcularLucroDoDia } from '@/utils/calculos';
import { diaComKm } from '@/utils/rota';

let falhas = 0;

function conferir(nome: string, ok: boolean) {
  if (!ok) falhas++;
  console.log(`${ok ? 'OK   ' : 'FALHA'} ${nome}`);
}

function lucroDoDia(estado: EstadoCacua, data: string) {
  const dia = estado.agenda.find((item) => item.data === data);
  if (!dia) throw new Error(`Dia ${data} não está na agenda`);
  return calcularLucroDoDia(diaComKm(dia, produtores, posto), estado.precos, estado.custos).lucro;
}

// O teste do cartão: aviso, diesel e coleta, salvos e lidos de novo (como ao fechar e abrir o app)
let mudado = estadoInicial();
mudado = comAviso(mudado, '30/set', { produtor: 1, fruta: 'goiaba', caixas: 20 });
mudado = comCustos(mudado, { diesel: 7.5 });
mudado = comColeta(mudado, '01/out', 2);
mudado = comConfirmacao(mudado, '30/set');
const lido = estadoDoSalvo(JSON.stringify(mudado));

conferir('O estado salvo volta igual', JSON.stringify(lido) === JSON.stringify(mudado));
conferir('O aviso continua: a quarta tem 38 caixas', lido?.agenda[0].avisos.reduce((soma, aviso) => soma + aviso.caixas, 0) === 38);
conferir('O diesel continua em R$ 7,50', lido?.custos.diesel === 7.5);
conferir('A coleta continua: Dona Maria e Seu Antônio na quinta', lido?.coletas['01/out'].join(',') === '3,2');
conferir('A confirmação da quarta continua', lido?.confirmados.join(',') === '30/set');
conferir('As contas usam o salvo: a quinta com diesel a R$ 7,50 fica em R$ 483,62', lido !== null && lucroDoDia(lido, '01/out') === 483.62);

// Nada salvo, ou salvo que não serve: o app usa o dados.js
conferir('Nada salvo (null) volta null', estadoDoSalvo(null) === null);
conferir('Texto vazio volta null', estadoDoSalvo('') === null);
conferir('Texto que não é JSON volta null', estadoDoSalvo('{agenda: [') === null);
conferir('JSON que não é objeto volta null', estadoDoSalvo('[1, 2]') === null && estadoDoSalvo('"oi"') === null);
for (const falta of ['agenda', 'custos', 'precos', 'coletas', 'confirmados'] as const) {
  const semCampo: Record<string, unknown> = { ...mudado };
  delete semCampo[falta];
  conferir(`Sem ${falta} volta null`, estadoDoSalvo(JSON.stringify(semCampo)) === null);
}
conferir('Custos numa lista em vez de objeto volta null', estadoDoSalvo(JSON.stringify({ ...mudado, custos: [] })) === null);

// O formato antigo (S4.5, com `coletados`) e coletas ou confirmações estragadas são ignorados (S5.1)
const formatoAntigo: Record<string, unknown> = { ...mudado, coletados: [3, 2] };
delete formatoAntigo.coletas;
delete formatoAntigo.confirmados;
conferir('Salvo no formato antigo (com coletados) volta null', estadoDoSalvo(JSON.stringify(formatoAntigo)) === null);
conferir('Coletas numa lista em vez de objeto volta null', estadoDoSalvo(JSON.stringify({ ...mudado, coletas: [3] })) === null);
conferir('Coletas de um dia que não são lista volta null', estadoDoSalvo(JSON.stringify({ ...mudado, coletas: { '01/out': 3 } })) === null);
conferir('Coletas com texto no lugar do id volta null', estadoDoSalvo(JSON.stringify({ ...mudado, coletas: { '01/out': ['3'] } })) === null);
conferir('Confirmados com número no lugar da data volta null', estadoDoSalvo(JSON.stringify({ ...mudado, confirmados: [30] })) === null);
conferir('Coletas e confirmados vazios valem', estadoDoSalvo(JSON.stringify({ ...mudado, coletas: {}, confirmados: [] })) !== null);

// Um campo novo numa versão futura do app: o que falta no salvo vem do dados.js
const custosAntigos: Record<string, number> = { ...mudado.custos };
delete custosAntigos.lucroMinimo;
const antigo = estadoDoSalvo(JSON.stringify({ ...mudado, custos: custosAntigos }));
conferir('Custo que falta no salvo vem do dados.js (lucro mínimo R$ 200)', antigo?.custos.lucroMinimo === 200);
conferir('E o que estava salvo continua (diesel R$ 7,50)', antigo?.custos.diesel === 7.5);

// Ler o salvo não mexe nos valores do dados.js
conferir('O dados.js continua igual: quarta com R$ 30,30', lucroDoDia(estadoInicial(), '30/set') === 30.3);

if (falhas > 0) {
  console.error(`\n${falhas} regra(s) do estado salvo não batem.`);
  process.exit(1);
}
console.log('\nO estado salvo volta igual, e o que não serve é ignorado.');
