// Confere a data do preço do Ceasa (S8.1) com os números do cartão no Trello.
// Rodar na raiz do projeto: npm run conferir

import { comPreco, estadoDoSalvo, estadoInicial } from '@/state/estado';
import {
  dataCurta,
  diasDesde,
  ehDataValida,
  frutasComPrecoAntigo,
  hojeNoCelular,
  precoAntigo,
  textoDaDataDoPreco,
} from '@/utils/preco-do-ceasa';

let falhas = 0;

function conferir(nome: string, ok: boolean) {
  if (!ok) falhas++;
  console.log(`${ok ? 'OK   ' : 'FALHA'} ${nome}`);
}

const HOJE = '2026-11-13';
const inicio = estadoInicial();

// No dados.js, todas as frutas são do boletim de 22/09
conferir(
  'No começo, as 5 frutas têm a data 2026-09-22',
  Object.values(inicio.precos).length === 5 && Object.values(inicio.precos).every((preco) => preco.data === '2026-09-22'),
);

// De 22/09 a 13/11
conferir('De 22/09 a 13/11: 52 dias', diasDesde('2026-09-22', HOJE) === 52);
conferir('De 22/09 a 13/11: "atualizado há 52 dias"', textoDaDataDoPreco('2026-09-22', HOJE) === 'atualizado há 52 dias');
conferir('De 22/09 a 13/11: antigo', precoAntigo('2026-09-22', HOJE));
conferir(
  'As 5 frutas estão com preço antigo, na ordem dos preços',
  frutasComPrecoAntigo(inicio.precos, HOJE).join(', ') === 'goiaba, manga, maracujá, mamão, banana',
);
conferir('Na terça 17/11: "atualizado há 56 dias" (a demonstração do S8.4)', textoDaDataDoPreco('2026-09-22', '2026-11-17') === 'atualizado há 56 dias');

// Mudar a goiaba para 70 em 13/11
const goiaba70 = comPreco(inicio, 'goiaba', 70, HOJE);
conferir('Goiaba a 70 em 13/11: data 2026-11-13', goiaba70.precos.goiaba.data === HOJE && goiaba70.precos.goiaba.preco === 70);
conferir('Goiaba a 70 em 13/11: "atualizado hoje"', textoDaDataDoPreco(goiaba70.precos.goiaba.data, HOJE) === 'atualizado hoje');
conferir('Goiaba a 70 em 13/11: sobram 4 frutas antigas', frutasComPrecoAntigo(goiaba70.precos, HOJE).length === 4);
conferir('Goiaba a 70: o peso da caixa continua', goiaba70.precos.goiaba.kg === 25);
conferir('Goiaba a 70: as outras frutas não mudam de data', goiaba70.precos.manga.data === '2026-09-22');
conferir('Fruta sem preço (coco): nada muda', comPreco(inicio, 'coco', 30, HOJE) === inicio);
const todas = Object.keys(inicio.precos).reduce((estado, fruta) => comPreco(estado, fruta, 50, HOJE), inicio);
conferir('Atualizar as 5 frutas: nenhuma antiga', frutasComPrecoAntigo(todas.precos, HOJE).length === 0);

// O limite dos 7 dias
conferir('De 06/11 a 13/11: 7 dias, ainda não é antigo', diasDesde('2026-11-06', HOJE) === 7 && !precoAntigo('2026-11-06', HOJE));
conferir('De 05/11 a 13/11: 8 dias, antigo', diasDesde('2026-11-05', HOJE) === 8 && precoAntigo('2026-11-05', HOJE));
conferir('De 12/11 a 13/11: "atualizado ontem"', textoDaDataDoPreco('2026-11-12', HOJE) === 'atualizado ontem');
conferir('De 31/12 a 01/01: 1 dia (virada do ano)', diasDesde('2026-12-31', '2027-01-01') === 1);
conferir('Data depois de hoje (relógio atrasado): conta como hoje', diasDesde('2026-11-20', HOJE) === 0 && textoDaDataDoPreco('2026-11-20', HOJE) === 'atualizado hoje');

// dataCurta e o dia do celular
conferir("dataCurta('2026-11-13') → \"13/11\"", dataCurta('2026-11-13') === '13/11');
conferir('Hoje no celular às 22h30 de 13/11 continua 2026-11-13 (sem o UTC)', hojeNoCelular(new Date(2026, 10, 13, 22, 30)) === HOJE);
conferir('Hoje no celular em 05/01 → 2026-01-05 (com o zero)', hojeNoCelular(new Date(2026, 0, 5, 8)) === '2026-01-05');
conferir("Data que não existe ('2026-02-31') não serve", !ehDataValida('2026-02-31') && ehDataValida(HOJE) && !ehDataValida('13/11/2026'));

// O que fica salvo no celular
const semData = JSON.parse(JSON.stringify(goiaba70));
delete semData.precos.goiaba.data;
delete semData.precos.banana.data;
const doSalvoAntigo = estadoDoSalvo(JSON.stringify(semData));
conferir(
  'Salvo antigo sem data → 2026-09-22, e o preço salvo continua',
  doSalvoAntigo?.precos.goiaba.data === '2026-09-22' && doSalvoAntigo.precos.goiaba.preco === 70 && doSalvoAntigo.precos.banana.data === '2026-09-22',
);
conferir('Fechar e abrir o app: a data salva continua', estadoDoSalvo(JSON.stringify(goiaba70))?.precos.goiaba.data === HOJE);
const dataRuim = JSON.parse(JSON.stringify(goiaba70));
dataRuim.precos.goiaba.data = '2026-02-31';
conferir('Data estragada no salvo → 2026-09-22', estadoDoSalvo(JSON.stringify(dataRuim))?.precos.goiaba.data === '2026-09-22');
conferir('"Voltar aos valores do Figma": as datas voltam para 22/09', estadoInicial().precos.goiaba.data === '2026-09-22');

if (falhas > 0) {
  console.error(`\n${falhas} conta(s) da data do preço não batem com o cartão.`);
  process.exit(1);
}
console.log('\nA data do preço do Ceasa bate com o cartão.');
