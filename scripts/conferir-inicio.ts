// Confere as contas do painel Início (S6.2) com os números do cartão no Trello.
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

// Como no Início: o estado do useCacua() com os produtores e o posto do dados.js.
function hoje(estado: EstadoCacua) {
  const dia = estado.agenda.find((item) => item.data === rota.data);
  if (!dia) throw new Error(`O dia de hoje (${rota.data}) não está na agenda.`);
  return resumoDoDia(dia, { ...estado, produtores, posto });
}

function semana(estado: EstadoCacua) {
  return resumoDaSemana(estado.agenda, { ...estado, produtores, posto });
}

// Hoje: a Quinta 01/out do dados.js
const inicio = estadoInicial();
const quinta = hoje(inicio);
conferir('Hoje é a Quinta 01/out', `${quinta.dia.dia} ${quinta.dia.data}` === 'Quinta 01/out');
conferir('Hoje: 3 paradas e 47 caixas', quinta.paradas === 3 && quinta.caixas === 47);
conferir('Hoje: 18,7 km', textoDoKm(quinta.km) === '18,7 km');
conferir('Hoje: já coletado 1 parada e 20 caixas', quinta.paradasColetadas === 1 && quinta.caixasColetadas === 20);
conferir(
  'Hoje: R$ 484,86 · Vale a pena',
  formatarReais(quinta.conta.lucro) === 'R$ 484,86' && quinta.conta.selo === 'Vale a pena',
);
conferir('Hoje: não confirmada', !quinta.confirmado);

// Semana: os 4 dias da agenda
const resumo = semana(inicio);
conferir('Semana: 100 caixas', resumo.caixas === 100);
conferir('Semana: R$ 616,32 (30,30 + 484,86 + 110,82 − 9,66)', formatarReais(resumo.lucro) === 'R$ 616,32');
conferir('Semana: 1 de 4 dias vale a pena', resumo.diasQueValem === 1 && resumo.dias === 4);
conferir('Semana: 1 de 8 paradas coletadas', resumo.paradasColetadas === 1 && resumo.paradas === 8);
conferir('Faltam confirmar os 4 dias', diasSemConfirmacao(inicio.agenda, inicio.confirmados).length === 4);

// Coletando o Seu Antônio e a Dona Lúcia na quinta e confirmando a quinta
let mudado = comColeta(inicio, rota.data, 2);
mudado = comColeta(mudado, rota.data, 4);
mudado = comConfirmacao(mudado, rota.data);
const quintaCompleta = hoje(mudado);
conferir(
  'Quinta coletada: 3 de 3 paradas e 47 de 47 caixas',
  quintaCompleta.paradasColetadas === 3 && quintaCompleta.caixasColetadas === 47,
);
conferir('Quinta confirmada', quintaCompleta.confirmado);
conferir('Semana: 3 de 8 paradas coletadas', semana(mudado).paradasColetadas === 3);
conferir(
  'Faltam confirmar quarta, sexta e sábado',
  diasSemConfirmacao(mudado.agenda, mudado.confirmados).map((dia) => dia.data).join(', ') ===
    '30/set, 02/out, 03/out',
);

// Produtor sem posição no mapa (Seu Raimundo, 10 caixas na quarta): fica fora da rota da quarta,
// mas as caixas avisadas da semana contam com ele, como na Agenda.
const semRaimundoNoMapa = produtores.map((produtor) =>
  produtor.id === 5 ? { ...produtor, posicao: undefined } : produtor,
);
const quarta = inicio.agenda[0];
const quartaSemRaimundo = resumoDoDia(quarta, { ...inicio, produtores: semRaimundoNoMapa, posto });
conferir(
  'Sem o Seu Raimundo no mapa: a rota da quarta tem 8 caixas, e a conta, as 18 avisadas',
  quartaSemRaimundo.caixas === 8 && quartaSemRaimundo.conta.caixas === 18,
);
conferir(
  'Sem o Seu Raimundo no mapa: a semana continua com 100 caixas avisadas',
  resumoDaSemana(inicio.agenda, { ...inicio, produtores: semRaimundoNoMapa, posto }).caixas === 100,
);

// Semana fraca da Previsão
const fraca = primeiraSemanaFraca(previsao, coletor.cargaMinima);
conferir('Semana fraca: 26/out – 01/nov, com 38 caixas', fraca?.periodo === '26/out – 01/nov' && fraca.caixas === 38);
conferir('Com carga mínima de 30, nenhuma é fraca', primeiraSemanaFraca(previsao, 30) === null);

if (falhas > 0) {
  console.error(`\n${falhas} conta(s) do Início não batem com o cartão.`);
  process.exit(1);
}
console.log('\nAs contas do painel Início batem com o cartão.');
