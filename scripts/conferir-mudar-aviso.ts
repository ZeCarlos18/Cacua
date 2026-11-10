// Confere as contas para mudar e tirar avisos da agenda (S7.2) com os números do cartão no Trello.
// Rodar na raiz do projeto: npm run conferir

import { posto, produtores } from '@/data/dados';
import { comCaixasDoAviso, comConfirmacao, estadoInicial, semAviso, type EstadoCacua } from '@/state/estado';
import { motivoParaNaoMudar } from '@/utils/aviso';
import { formatarReais } from '@/utils/calculos';
import { textoDoKm } from '@/utils/conta';
import { diasSemConfirmacao, resumoDaSemana, resumoDoDia } from '@/utils/inicio';

let falhas = 0;

function conferir(nome: string, ok: boolean) {
  if (!ok) falhas++;
  console.log(`${ok ? 'OK   ' : 'FALHA'} ${nome}`);
}

function dia(estado: EstadoCacua, data: string) {
  const doDia = estado.agenda.find((item) => item.data === data);
  if (!doDia) throw new Error(`${data} não está na agenda.`);
  return resumoDoDia(doDia, { ...estado, produtores, posto });
}

function semana(estado: EstadoCacua) {
  return resumoDaSemana(estado.agenda, { ...estado, produtores, posto });
}

const inicio = estadoInicial();

// Sexta 02/out: tirar o Seu Pedro (posição 1, banana, 12 caixas)
const semPedro = semAviso(inicio, '02/out', 1);
const sexta = dia(semPedro, '02/out');
conferir(
  'Sexta sem o Seu Pedro: 1 parada, 14 caixas, 15,1 km',
  sexta.paradas === 1 && sexta.caixas === 14 && textoDoKm(sexta.km) === '15,1 km',
);
conferir(
  'Sexta sem o Seu Pedro: R$ 35,34 · Vale com atenção (antes R$ 110,82)',
  formatarReais(sexta.conta.lucro) === 'R$ 35,34' &&
    sexta.conta.selo === 'Vale com atenção' &&
    formatarReais(dia(inicio, '02/out').conta.lucro) === 'R$ 110,82',
);

// Sábado 03/out: a goiaba do Seu Antônio (posição 0) de 9 para 15 caixas
const ambas = comCaixasDoAviso(semPedro, '03/out', 0, 15);
const sabado = dia(ambas, '03/out');
conferir(
  'Sábado com 15 caixas: R$ 44,34 · Vale com atenção (antes −R$ 9,66 · Não vale a pena)',
  formatarReais(sabado.conta.lucro) === 'R$ 44,34' &&
    sabado.conta.selo === 'Vale com atenção' &&
    dia(inicio, '03/out').conta.selo === 'Não vale a pena',
);

const semanaMudada = semana(ambas);
conferir(
  'Semana com as duas mudanças: 94 caixas, R$ 594,84, 1 de 4 dias, 1 de 7 paradas coletadas',
  semanaMudada.caixas === 94 &&
    formatarReais(semanaMudada.lucro) === 'R$ 594,84' &&
    semanaMudada.diasQueValem === 1 &&
    semanaMudada.dias === 4 &&
    semanaMudada.paradasColetadas === 1 &&
    semanaMudada.paradas === 7,
);

// Quinta 01/out: a Dona Maria (posição 0) já foi coletada
conferir(
  'Dona Maria na quinta: o motivo é "Já coletado…"',
  motivoParaNaoMudar(inicio, '01/out', 0) === 'Já coletado. Desfaça a coleta na Rota para mudar.',
);
conferir('Dona Maria na quinta: mudar as caixas não muda nada', comCaixasDoAviso(inicio, '01/out', 0, 5) === inicio);
conferir('Dona Maria na quinta: tirar não muda nada', semAviso(inicio, '01/out', 0) === inicio);
conferir('Seu Antônio na quinta (não coletado) pode mudar', motivoParaNaoMudar(inicio, '01/out', 1) === null);

// Quarta 30/set confirmada
const quartaConfirmada = comConfirmacao(inicio, '30/set');
conferir(
  'Quarta confirmada: o motivo é "Dia confirmado…"',
  motivoParaNaoMudar(quartaConfirmada, '30/set', 0) ===
    'Dia confirmado. Desfaça a confirmação para mudar os avisos.',
);
conferir('Quarta confirmada: tirar o aviso da posição 0 não muda nada', semAviso(quartaConfirmada, '30/set', 0) === quartaConfirmada);

// Tirar os 2 avisos da quarta: o dia continua na agenda, mas sai da semana
const quartaVazia = semAviso(semAviso(inicio, '30/set', 0), '30/set', 0);
conferir(
  'Quarta sem avisos: o dia continua na agenda, sem nenhum aviso',
  quartaVazia.agenda.length === 4 && quartaVazia.agenda[0].avisos.length === 0,
);
const semanaSemQuarta = semana(quartaVazia);
conferir(
  'Semana sem a quarta: 3 dias, 82 caixas, R$ 586,02, 1 de 3 dias, 6 paradas',
  semanaSemQuarta.dias === 3 &&
    semanaSemQuarta.caixas === 82 &&
    formatarReais(semanaSemQuarta.lucro) === 'R$ 586,02' &&
    semanaSemQuarta.diasQueValem === 1 &&
    semanaSemQuarta.paradas === 6,
);
conferir(
  'A quarta sem avisos sai de "Coletas para confirmar"',
  diasSemConfirmacao(quartaVazia.agenda, quartaVazia.confirmados).map((item) => item.data).join(', ') ===
    '01/out, 02/out, 03/out',
);

// Caixas que não valem, e aviso que não existe
conferir('Caixas 0: nada muda', comCaixasDoAviso(inicio, '03/out', 0, 0) === inicio);
conferir('Caixas 2,5: nada muda', comCaixasDoAviso(inicio, '03/out', 0, 2.5) === inicio);
conferir('Aviso que não existe (posição 5 do sábado): nada muda', semAviso(inicio, '03/out', 5) === inicio);
conferir('O estado de antes não muda', inicio.agenda[2].avisos.length === 2 && inicio.agenda[3].avisos[0].caixas === 9);

if (falhas > 0) {
  console.error(`\n${falhas} conta(s) de mudar e tirar aviso não batem com o cartão.`);
  process.exit(1);
}
console.log('\nAs contas de mudar e tirar aviso batem com o cartão.');
