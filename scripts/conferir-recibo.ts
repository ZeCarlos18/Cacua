// Confere o texto do recibo da coleta (S5.2) com o do cartão no Trello.
// Rodar na raiz do projeto: npm run conferir

import { agenda, coletor, posto, produtores } from '@/data/dados';
import { textoDoRecibo } from '@/utils/recibo';
import { montarRota } from '@/utils/rota';

let falhas = 0;

function conferir(nome: string, ok: boolean) {
  if (!ok) falhas++;
  console.log(`${ok ? 'OK   ' : 'FALHA'} ${nome}`);
}

const quinta = agenda.find((dia) => dia.data === '01/out');
const donaMaria = quinta && montarRota(quinta, produtores, posto).paradas.find((parada) => parada.id === 3);

const esperado = [
  'Recibo do Caçuá',
  'Quinta 01/out',
  'Dona Maria · Sítio Riacho Verde',
  'Manga: 20 caixas',
  'Coletado por Edson',
].join('\n');

conferir(
  'Dona Maria, quinta: o texto do cartão',
  quinta !== undefined && donaMaria !== undefined && textoDoRecibo(quinta, donaMaria, coletor) === esperado,
);

// O mesmo produtor com duas frutas no dia: a montarRota junta numa parada só, e o recibo também.
const duasFrutas = {
  dia: 'Sexta',
  data: '02/out',
  avisos: [
    { produtor: 2, fruta: 'goiaba', caixas: 9 },
    { produtor: 2, fruta: 'manga', caixas: 3 },
  ],
};
const seuAntonio = montarRota(duasFrutas, produtores, posto).paradas[0];
conferir(
  'Duas frutas do mesmo produtor: "Goiaba, Manga: 12 caixas"',
  textoDoRecibo(duasFrutas, seuAntonio, coletor).split('\n')[3] === 'Goiaba, Manga: 12 caixas',
);

conferir(
  'Uma caixa só: "Banana: 1 caixa"',
  textoDoRecibo(
    { dia: 'Quarta', data: '30/set' },
    { produtor: 'Seu Raimundo', sitio: 'Sítio Baixio', fruta: 'Banana', caixas: 1 },
    coletor,
  ).split('\n')[3] === 'Banana: 1 caixa',
);

if (falhas > 0) {
  console.error(`\n${falhas} regra(s) do recibo não batem com o cartão.`);
  process.exit(1);
}
console.log('\nO recibo bate com o cartão.');
