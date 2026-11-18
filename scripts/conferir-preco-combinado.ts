// Confere as contas do preço combinado com cada produtor (S9.2) com os números do cartão no Trello.
// Rodar na raiz do projeto: npm run conferir

import { coletor, posto } from '@/data/dados';
import {
  comColeta,
  comCustos,
  comPrecoCombinado,
  estadoDoSalvo,
  estadoInicial,
  type EstadoCacua,
} from '@/state/estado';
import { calcularLucroDoDia, formatarReais } from '@/utils/calculos';
import { extratoDoProdutor, textoDoExtrato } from '@/utils/extrato';
import { avisosDoProdutor, combinadosDos, porcentagemDoProdutor, totalDosAvisos } from '@/utils/produtores';
import { itensDoRecibo, textoDoRecibo } from '@/utils/recibo';
import { diaComKm } from '@/utils/rota';

let falhas = 0;

function conferir(nome: string, ok: boolean) {
  if (!ok) falhas++;
  console.log(`${ok ? 'OK   ' : 'FALHA'} ${nome}`);
}

function doDia(estado: EstadoCacua, data: string) {
  const achado = estado.agenda.find((item) => item.data === data);
  if (!achado) throw new Error(`${data} não está na agenda.`);
  return achado;
}

/** A conta do dia como as telas vão fazer no S9.5: com os combinados dos produtores. */
function conta(estado: EstadoCacua, data: string) {
  const dia = diaComKm(doDia(estado, data), estado.produtores, posto);
  return calcularLucroDoDia(dia, estado.precos, estado.custos, combinadosDos(estado.produtores));
}

/** O lucro da semana: a soma do lucro de cada dia, nos centavos. */
function semana(estado: EstadoCacua) {
  const soma = estado.agenda.reduce((total, dia) => total + conta(estado, dia.data).lucro, 0);
  return Math.round(soma * 100) / 100;
}

function produtor(estado: EstadoCacua, id: number) {
  const achado = estado.produtores.find((item) => item.id === id);
  if (!achado) throw new Error(`O produtor ${id} não está na lista.`);
  return achado;
}

const LUCIA = 4;
const ANTONIO = 2;
const inicio = estadoInicial();

// Sem preço combinado, tudo igual
conferir('Sem combinado: ninguém tem preço combinado ({})', JSON.stringify(combinadosDos(inicio.produtores)) === '{}');
conferir('Sem combinado: quinta R$ 484,86', formatarReais(conta(inicio, '01/out').lucro) === 'R$ 484,86');
conferir('Sem combinado: semana R$ 616,32', formatarReais(semana(inicio)) === 'R$ 616,32');
conferir(
  'Sem `combinados`, o calcularLucroDoDia dá o mesmo de antes nos 4 dias',
  inicio.agenda.every((dia) => {
    const comKm = diaComKm(dia, inicio.produtores, posto);
    const antes = calcularLucroDoDia(comKm, inicio.precos, inicio.custos);
    const vazio = calcularLucroDoDia(comKm, inicio.precos, inicio.custos, {});
    return antes.lucro === vazio.lucro && antes.pagoProdutor === vazio.pagoProdutor;
  }),
);

// Dona Lúcia com 0.85
const lucia = comPrecoCombinado(inicio, LUCIA, 0.85);
conferir('Dona Lúcia com 0.85: combinados = { 4: 0.85 }', JSON.stringify(combinadosDos(lucia.produtores)) === '{"4":0.85}');
const quinta = conta(lucia, '01/out');
conferir(
  'Dona Lúcia com 0.85: quinta R$ 387,36 · Vale a pena',
  formatarReais(quinta.lucro) === 'R$ 387,36' && quinta.selo === 'Vale a pena',
);
conferir(
  'Dona Lúcia com 0.85: R$ 97,50 a mais para ela na quinta',
  Math.round((quinta.pagoProdutor - conta(inicio, '01/out').pagoProdutor) * 100) / 100 === 97.5,
);
conferir('Dona Lúcia com 0.85: quarta R$ 10,30', formatarReais(conta(lucia, '30/set').lucro) === 'R$ 10,30');
conferir('Dona Lúcia com 0.85: semana R$ 498,82', formatarReais(semana(lucia)) === 'R$ 498,82');
conferir('Dona Lúcia com 0.85: a sexta (sem ela) não muda', conta(lucia, '02/out').lucro === conta(inicio, '02/out').lucro);

// Recibo da Dona Lúcia na quinta
const coletada = comColeta(lucia, '01/out', LUCIA);
const itens = itensDoRecibo(
  doDia(coletada, '01/out'),
  LUCIA,
  coletada.entregas,
  coletada.precos,
  coletada.custos,
  combinadosDos(coletada.produtores),
);
const recibo = textoDoRecibo(doDia(coletada, '01/out'), produtor(coletada, LUCIA), itens, coletor, coletada.custos);
conferir('Recibo da Dona Lúcia: "R$ 110,50 a caixa = R$ 1.657,50"', recibo.includes('R$ 110,50 a caixa = R$ 1.657,50'));
conferir('Recibo da Dona Lúcia: "você recebe 85%"', recibo.includes('você recebe 85%'));
const itensSemCombinado = itensDoRecibo(doDia(coletada, '01/out'), LUCIA, coletada.entregas, coletada.precos, coletada.custos);
conferir('Recibo sem os combinados: continua com 80% (R$ 104,00 a caixa)', itensSemCombinado[0].valorPorCaixa === 104);

// Avisos da Dona Lúcia
const avisosDaLucia = avisosDoProdutor(produtor(lucia, LUCIA), lucia);
conferir(
  'Avisos da Dona Lúcia: R$ 340,00 (mamão, quarta) e R$ 1.657,50 (maracujá, quinta)',
  avisosDaLucia.map((aviso) => `${aviso.fruta} ${aviso.data} ${aviso.valor}`).join(' | ') ===
    'mamão 30/set 340 | maracujá 01/out 1657.5',
);
conferir('Avisos da Dona Lúcia: total R$ 1.997,50', formatarReais(totalDosAvisos(avisosDaLucia).valor) === 'R$ 1.997,50');

// Extrato da Dona Lúcia, coletada na quinta
const extrato = extratoDoProdutor(produtor(coletada, LUCIA), coletada);
const textoDoExtratoDaLucia = textoDoExtrato(produtor(coletada, LUCIA), extrato, coletor, coletada.custos, coletada.precos);
conferir(
  'Extrato da Dona Lúcia: maracujá 15 × R$ 110,50 = R$ 1.657,50, "você recebe 85%"',
  extrato.length === 1 &&
    extrato[0].valor === 1657.5 &&
    (textoDoExtratoDaLucia ?? '').includes('15 caixas × R$ 110,50 = R$ 1.657,50') &&
    (textoDoExtratoDaLucia ?? '').includes('você recebe 85%'),
);

// Padrão de Custos e preços mudado para 75%
const padrao75 = comCustos(lucia, { pagoProdutor: 0.75 });
conferir('Padrão em 75%: a Dona Lúcia continua com 85%', porcentagemDoProdutor(produtor(padrao75, LUCIA), padrao75.custos) === 0.85);
conferir('Padrão em 75%: o Seu Antônio vai para 75%', porcentagemDoProdutor(produtor(padrao75, ANTONIO), padrao75.custos) === 0.75);
conferir(
  'Padrão em 75%: avisos do Seu Antônio com 75% (goiaba 12 × R$ 60 = R$ 540,00)',
  avisosDoProdutor(produtor(padrao75, ANTONIO), padrao75)[0].valor === 540,
);

// comPrecoCombinado com valores que não servem, e o null
conferir('comPrecoCombinado com 0: nada muda', comPrecoCombinado(inicio, LUCIA, 0) === inicio);
conferir('comPrecoCombinado com 1.2: nada muda', comPrecoCombinado(inicio, LUCIA, 1.2) === inicio);
conferir('comPrecoCombinado com NaN: nada muda', comPrecoCombinado(inicio, LUCIA, Number.NaN) === inicio);
conferir('comPrecoCombinado com um id que não existe: nada muda', comPrecoCombinado(inicio, 99, 0.85) === inicio);
conferir('comPrecoCombinado com 1 (100%): vale', produtor(comPrecoCombinado(inicio, LUCIA, 1), LUCIA).pagoProdutor === 1);
const deVolta = comPrecoCombinado(lucia, LUCIA, null);
conferir(
  'comPrecoCombinado com null: volta para 80%, sem o campo',
  porcentagemDoProdutor(produtor(deVolta, LUCIA), deVolta.custos) === 0.8 && !('pagoProdutor' in produtor(deVolta, LUCIA)),
);
conferir('Com null, a quinta volta para R$ 484,86', formatarReais(conta(deVolta, '01/out').lucro) === 'R$ 484,86');
conferir('O estado de antes não muda', !('pagoProdutor' in produtor(inicio, LUCIA)));

// Salvo no celular
const salvo = estadoDoSalvo(JSON.stringify(lucia));
conferir('Salvar e ler de novo: a Dona Lúcia continua com 85%', salvo !== null && produtor(salvo, LUCIA).pagoProdutor === 0.85);
const semCampo = estadoDoSalvo(JSON.stringify(inicio));
conferir(
  'Salvo de antes, sem o campo: continua igual (ninguém combinado)',
  semCampo !== null && JSON.stringify(combinadosDos(semCampo.produtores)) === '{}',
);
const estragado = estadoDoSalvo(
  JSON.stringify({
    ...inicio,
    produtores: inicio.produtores.map((item) => (item.id === LUCIA ? { ...item, pagoProdutor: 1.2 } : item)),
  }),
);
conferir(
  'Salvo com combinado que não serve (1.2): a Dona Lúcia fica na lista, com o padrão',
  estragado !== null &&
    estragado.produtores.length === 6 &&
    porcentagemDoProdutor(produtor(estragado, LUCIA), estragado.custos) === 0.8,
);

if (falhas > 0) {
  console.error(`\n${falhas} conta(s) do preço combinado não batem com o cartão.`);
  process.exit(1);
}
console.log('\nAs contas do preço combinado batem com o cartão.');
