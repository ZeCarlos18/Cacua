// Confere as caixas que vieram na coleta e o desfazer coleta (S7.3) com os números do cartão.
// Rodar na raiz do projeto: npm run conferir

import { coletor, posto } from '@/data/dados';
import {
  comColeta,
  comConfirmacao,
  estadoDoSalvo,
  estadoInicial,
  semColeta,
  type EstadoCacua,
} from '@/state/estado';
import { formatarReais } from '@/utils/calculos';
import { caixasAvisadas, diaComEntregas } from '@/utils/coleta';
import { resumoDaSemana, resumoDoDia } from '@/utils/inicio';
import { textoDoRecibo } from '@/utils/recibo';
import { montarRota } from '@/utils/rota';
import { caixasColetadas, textoDoColetado, totalDeCaixas } from '@/utils/rota-do-dia';

let falhas = 0;

function conferir(nome: string, ok: boolean) {
  if (!ok) falhas++;
  console.log(`${ok ? 'OK   ' : 'FALHA'} ${nome}`);
}

function diaDa(estado: EstadoCacua, data: string) {
  const dia = estado.agenda.find((item) => item.data === data);
  if (!dia) throw new Error(`O dia ${data} não está na agenda.`);
  return dia;
}

// Como as telas vão fazer no S7.6: o dia com as caixas que vieram antes de montar a rota e a conta.
function quinta(estado: EstadoCacua) {
  return resumoDoDia(diaComEntregas(diaDa(estado, '01/out'), estado.entregas), { ...estado, posto });
}

function semana(estado: EstadoCacua) {
  const agenda = estado.agenda.map((dia) => diaComEntregas(dia, estado.entregas));
  return resumoDaSemana(agenda, { ...estado, posto });
}

function rotaDaQuinta(estado: EstadoCacua) {
  const { paradas } = montarRota(diaComEntregas(diaDa(estado, '01/out'), estado.entregas), estado.produtores, posto);
  return paradas;
}

/** A linha das caixas no recibo do produtor na quinta, como a Rota vai montar no S7.6. */
function linhaDoRecibo(estado: EstadoCacua, produtor: number) {
  const parada = rotaDaQuinta(estado).find((item) => item.id === produtor);
  if (!parada) throw new Error(`O produtor ${produtor} não está na rota de quinta.`);
  const avisadas = Object.values(caixasAvisadas(diaDa(estado, '01/out'), produtor)).reduce((soma, n) => soma + n, 0);
  return textoDoRecibo(diaDa(estado, '01/out'), parada, coletor, avisadas).split('\n')[3];
}

const inicio = estadoInicial();
conferir('No começo, nenhuma entrega: {}', JSON.stringify(inicio.entregas) === '{}');
conferir(
  'caixasAvisadas: quinta, Seu Antônio → { goiaba: 12 }',
  JSON.stringify(caixasAvisadas(diaDa(inicio, '01/out'), 2)) === JSON.stringify({ goiaba: 12 }),
);

// Seu Antônio na quinta: vieram 10 caixas de goiaba, e não 12
const antonio = comColeta(inicio, '01/out', 2, { goiaba: 10 });
conferir(
  'Seu Antônio com { goiaba: 10 }: entregas = { "01/out": { "2:goiaba": 10 } }',
  JSON.stringify(antonio.entregas) === JSON.stringify({ '01/out': { '2:goiaba': 10 } }),
);
conferir('Seu Antônio entra nas coletas da quinta', antonio.coletas['01/out'].join(',') === '3,2');
const quintaAntonio = quinta(antonio);
conferir(
  'Quinta com 45 caixas e R$ 466,86 · Vale a pena (antes 47 e R$ 484,86)',
  quintaAntonio.conta.caixas === 45 &&
    formatarReais(quintaAntonio.conta.lucro) === 'R$ 466,86' &&
    quintaAntonio.conta.selo === 'Vale a pena',
);
const paradas = rotaDaQuinta(antonio);
conferir(
  'Rota: "Coletado 30 de 45 caixas"',
  textoDoColetado(caixasColetadas(paradas, antonio.coletas['01/out']), totalDeCaixas(paradas)) ===
    'Coletado 30 de 45 caixas',
);
conferir('Recibo: "Goiaba: 10 caixas (avisou 12)"', linhaDoRecibo(antonio, 2) === 'Goiaba: 10 caixas (avisou 12)');
const quintaComEntregas = diaComEntregas(diaDa(antonio, '01/out'), antonio.entregas);
conferir(
  'diaComEntregas mantém a ordem e a quantidade de avisos (Maria, Antônio, Lúcia)',
  quintaComEntregas.avisos.map((aviso) => aviso.produtor).join(',') === '3,2,4' &&
    quintaComEntregas.avisos.map((aviso) => aviso.caixas).join(',') === '20,10,15',
);
conferir('A agenda guardada continua com as 12 avisadas', diaDa(antonio, '01/out').avisos[1].caixas === 12);

// A semana, com o diaComEntregas em cada dia
const semanaAntonio = semana(antonio);
conferir(
  'Semana: 98 caixas, R$ 598,32 e 2 de 8 paradas coletadas',
  semanaAntonio.caixas === 98 &&
    formatarReais(semanaAntonio.lucro) === 'R$ 598,32' &&
    semanaAntonio.paradasColetadas === 2 &&
    semanaAntonio.paradas === 8,
);

// Com a Dona Lúcia também: vieram 17 de maracujá (avisou 15)
const comLucia = comColeta(antonio, '01/out', 4, { maracujá: 17 });
const quintaLucia = quinta(comLucia);
conferir(
  'Com a Dona Lúcia { maracujá: 17 }: quinta com 47 caixas e R$ 505,86',
  quintaLucia.conta.caixas === 47 && formatarReais(quintaLucia.conta.lucro) === 'R$ 505,86',
);
conferir('Recibo da Dona Lúcia: "Maracujá: 17 caixas (avisou 15)"', linhaDoRecibo(comLucia, 4) === 'Maracujá: 17 caixas (avisou 15)');

// Desfazer a coleta do Seu Antônio
const desfeita = semColeta(antonio, '01/out', 2);
const quintaDesfeita = quinta(desfeita);
conferir(
  'Desfazer o Seu Antônio: volta para 47 caixas e R$ 484,86',
  quintaDesfeita.conta.caixas === 47 && formatarReais(quintaDesfeita.conta.lucro) === 'R$ 484,86',
);
conferir('Desfazer: ele sai das coletas e as entregas ficam {}', desfeita.coletas['01/out'].join(',') === '3' && JSON.stringify(desfeita.entregas) === '{}');
conferir(
  'Desfazer: o recibo perde o "(avisou)" → "Goiaba: 12 caixas"',
  linhaDoRecibo(comColeta(desfeita, '01/out', 2), 2) === 'Goiaba: 12 caixas',
);
conferir(
  'Desfazer o Seu Antônio não apaga a entrega da Dona Lúcia',
  JSON.stringify(semColeta(comLucia, '01/out', 2).entregas) === JSON.stringify({ '01/out': { '4:maracujá': 17 } }),
);
const vizinho = { ...antonio, entregas: { '01/out': { '2:goiaba': 10, '21:goiaba': 3 } } };
conferir(
  'Desfazer o produtor 2 não apaga a entrega do produtor 21',
  JSON.stringify(semColeta(vizinho, '01/out', 2).entregas) === JSON.stringify({ '01/out': { '21:goiaba': 3 } }),
);

// Quinta confirmada: primeiro desfaz a confirmação
const confirmada = comConfirmacao(antonio, '01/out');
conferir('Quinta confirmada: desfazer não muda nada', semColeta(confirmada, '01/out', 2) === confirmada);
conferir('Desfazer quem não foi coletado não muda nada', semColeta(inicio, '01/out', 2) === inicio);
const semDonaMaria = semColeta(inicio, '01/out', 3);
conferir('A coleta da Dona Maria (do dados.js) também se desfaz', semDonaMaria.coletas['01/out'].length === 0);

// Sem caixas, vale o avisado
const luciaSemCaixas = comColeta(inicio, '01/out', 4);
conferir(
  "registrarColeta('01/out', 4) sem caixas: vale o avisado (15 de maracujá)",
  JSON.stringify(luciaSemCaixas.entregas) === '{}' &&
    diaComEntregas(diaDa(luciaSemCaixas, '01/out'), luciaSemCaixas.entregas).avisos[2].caixas === 15 &&
    luciaSemCaixas.coletas['01/out'].join(',') === '3,4',
);

// Mesma fruta duas vezes no dia
const duasVezes = {
  dia: 'Domingo',
  data: '04/out',
  avisos: [
    { produtor: 2, fruta: 'goiaba', caixas: 5 },
    { produtor: 2, fruta: 'goiaba', caixas: 7 },
  ],
};
conferir(
  'Goiaba 5 e 7, vieram 11: os avisos ficam com 11 e 0',
  diaComEntregas(duasVezes, { '04/out': { '2:goiaba': 11 } }).avisos.map((aviso) => aviso.caixas).join(',') === '11,0',
);
conferir('caixasAvisadas soma a mesma fruta: { goiaba: 12 }', caixasAvisadas(duasVezes, 2).goiaba === 12);

// Frutas e caixas que não valem
const mangaNaoAvisada = comColeta(inicio, '01/out', 2, { manga: 5 });
conferir(
  'Fruta que ele não avisou no dia (manga) fica de fora: coleta entra, sem entrega',
  mangaNaoAvisada.coletas['01/out'].join(',') === '3,2' && JSON.stringify(mangaNaoAvisada.entregas) === '{}',
);
conferir('Caixas 0: nada muda', comColeta(inicio, '01/out', 2, { goiaba: 0 }) === inicio);
conferir('Caixas 2,5: nada muda', comColeta(inicio, '01/out', 2, { goiaba: 2.5 }) === inicio);
conferir('Coleta repetida não muda nada', comColeta(antonio, '01/out', 2, { goiaba: 8 }) === antonio);
conferir('Coleta num dia fora da agenda não muda nada', comColeta(inicio, '30/fev', 2, { goiaba: 10 }) === inicio);

// Salvo no celular
const lido = estadoDoSalvo(JSON.stringify(comLucia));
conferir('O salvo volta com as entregas', JSON.stringify(lido?.entregas) === JSON.stringify(comLucia.entregas));
const salvoAntigo: Record<string, unknown> = { ...comLucia };
delete salvoAntigo.entregas;
conferir('Salvo sem entregas (de antes desta sprint) começa com {}', JSON.stringify(estadoDoSalvo(JSON.stringify(salvoAntigo))?.entregas) === '{}');
const estragado = { ...comLucia, entregas: { '01/out': { '2:goiaba': 10, 'goiaba': 5, '4:maracujá': -1 }, '02/out': [3] } };
conferir(
  'Entrega estragada sai sozinha, e as outras ficam',
  JSON.stringify(estadoDoSalvo(JSON.stringify(estragado))?.entregas) === JSON.stringify({ '01/out': { '2:goiaba': 10 } }),
);
conferir('Voltar aos valores do Figma: entregas {}', JSON.stringify(estadoInicial().entregas) === '{}');

if (falhas > 0) {
  console.error(`\n${falhas} conta(s) da coleta não batem com o cartão.`);
  process.exit(1);
}
console.log('\nAs caixas que vieram e o desfazer coleta batem com o cartão.');
