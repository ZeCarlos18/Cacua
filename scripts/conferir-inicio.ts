// Confere as contas do Início, o painel do coletor: a rota de hoje, o resumo da semana, os dias
// sem confirmação e a semana fraca, com os dados de exemplo e depois de coletar e confirmar.
// Rodar na raiz do projeto: npm run conferir

import { coletor, posto, previsao, produtores, rota } from '@/data/dados';
import { comColeta, comConfirmacao, estadoInicial, type EstadoCacua } from '@/state/estado';
import { formatarReais } from '@/utils/calculos';
import { textoDoKm } from '@/utils/conta';
import { diasSemConfirmacao, primeiraSemanaFraca, resumoDaSemana, resumoDoDia } from '@/utils/inicio';

let falhas = 0;

function conferir(nome: string, ok: boolean) {
  if (!ok) falhas++;
  console.log(`${ok ? 'OK   ' : 'FALHA'} ${nome}`);
}

function semana(estado: EstadoCacua) {
  return resumoDaSemana(estado.agenda, produtores, posto, estado.precos, estado.custos, estado.coletas, estado.confirmados);
}

function hoje(estado: EstadoCacua) {
  const dia = estado.agenda.find((item) => item.data === rota.data);
  if (!dia) throw new Error(`O dia ${rota.data} não está na agenda`);
  return resumoDoDia(dia, produtores, posto, estado.precos, estado.custos, estado.coletas, estado.confirmados);
}

const inicio = estadoInicial();

// Rota de hoje (a quinta do dados.js)
const quinta = hoje(inicio);
conferir('Hoje é a Quinta 01/out', quinta.dia.data === '01/out');
conferir('3 paradas, 47 caixas e 18,7 km', quinta.paradas === 3 && quinta.caixas === 47 && textoDoKm(quinta.km) === '18,7 km');
conferir('Já coletado: 1 parada e 20 caixas (a Dona Maria)', quinta.paradasColetadas === 1 && quinta.caixasColetadas === 20);
conferir('Lucro de R$ 484,86 · Vale a pena', formatarReais(quinta.conta.lucro) === 'R$ 484,86' && quinta.conta.selo === 'Vale a pena');
conferir('A quinta ainda não está confirmada', !quinta.confirmado);

// Resumo da semana
const doFigma = semana(inicio);
conferir('100 caixas avisadas na semana', doFigma.caixas === 100);
conferir(
  `Lucro da semana: R$ 30,30 + R$ 484,86 + R$ 110,82 − R$ 9,66 = R$ 616,32 (${formatarReais(doFigma.lucro)})`,
  formatarReais(doFigma.lucro) === 'R$ 616,32',
);
conferir('1 de 4 dias vale a pena (a quinta)', doFigma.diasQueValem === 1 && doFigma.dias === 4);
conferir('1 de 8 paradas coletadas', doFigma.paradasColetadas === 1 && doFigma.paradas === 8);

// Depois de coletar o Seu Antônio e a Dona Lúcia na quinta e confirmar a quinta
const depois = comConfirmacao(comColeta(comColeta(inicio, '01/out', 2), '01/out', 4), '01/out');
const quintaDepois = hoje(depois);
conferir('A quinta fica com 3 de 3 paradas e 47 de 47 caixas', quintaDepois.paradasColetadas === 3 && quintaDepois.caixasColetadas === 47);
conferir('E aparece como confirmada', quintaDepois.confirmado);
conferir('O resumo passa para 3 de 8 paradas coletadas', semana(depois).paradasColetadas === 3);

// Dias sem confirmação
conferir('No começo, os 4 dias faltam confirmar', diasSemConfirmacao(inicio.agenda, inicio.confirmados).length === 4);
conferir(
  'Com a quinta confirmada, faltam quarta, sexta e sábado',
  diasSemConfirmacao(depois.agenda, depois.confirmados).map((dia) => dia.data).join(',') === '30/set,02/out,03/out',
);

// Semana fraca da Previsão
const fraca = primeiraSemanaFraca(previsao, coletor.cargaMinima);
conferir('A semana fraca é 26/out – 01/nov, com 38 caixas', fraca?.periodo === '26/out – 01/nov' && fraca.caixas === 38);
conferir('Com carga mínima de 30 caixas, nenhuma semana é fraca', primeiraSemanaFraca(previsao, 30) === null);

if (falhas > 0) {
  console.error(`\n${falhas} conta(s) do Início não batem.`);
  process.exit(1);
}
console.log('\nO Início bate com a Agenda, a Rota e a Previsão.');
