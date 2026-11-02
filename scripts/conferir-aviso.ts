// Confere as regras do formulário "Registrar aviso" (S4.4).
// Os números do cartão (R$ 210,20 e R$ 215,30) estão no conferir-estado.
// Rodar na raiz do projeto: npm run conferir

import { agenda, precos, produtores } from '@/data/dados';
import {
  avisoPronto,
  avisoSemPreco,
  caixasComPasso,
  frutaAoTrocarProdutor,
  lerCaixas,
  rotuloDoDia,
} from '@/utils/aviso';

let falhas = 0;

function conferir(nome: string, ok: boolean) {
  if (!ok) falhas++;
  console.log(`${ok ? 'OK   ' : 'FALHA'} ${nome}`);
}

function produtor(nome: string) {
  const encontrado = produtores.find((p) => p.nome === nome);
  if (!encontrado) throw new Error(`${nome} não está no dados.js`);
  return encontrado;
}

// Dias
conferir(
  'Os 4 dias: Qua 30/set, Qui 01/out, Sex 02/out, Sáb 03/out',
  agenda.map(rotuloDoDia).join(', ') === 'Qua 30/set, Qui 01/out, Sex 02/out, Sáb 03/out',
);

// Caixas
for (const [texto, esperado] of [['20', 20], [' 7 ', 7], ['1', 1]] as const) {
  conferir(`Caixas "${texto}" vale ${esperado}`, lerCaixas(texto) === esperado);
}
for (const texto of ['', '0', '-3', '2,5', '2.5', 'abc', '1e2']) {
  conferir(`Caixas "${texto}" não vale`, lerCaixas(texto) === null);
}
conferir('+ com o campo vazio começa em 1', caixasComPasso(null, 1) === 1);
conferir('− com o campo vazio continua vazio', caixasComPasso(null, -1) === null);
conferir('+ em 20 vai para 21', caixasComPasso(20, 1) === 21);
conferir('− em 1 continua 1', caixasComPasso(1, -1) === 1);

// Frutas ao escolher e trocar de produtor
conferir(
  'Escolher o Seu Francisco: sem fruta marcada (tem goiaba e manga)',
  frutaAoTrocarProdutor(null, produtor('Seu Francisco')) === null,
);
conferir(
  'Escolher a Dona Maria: manga já vem marcada (é a única)',
  frutaAoTrocarProdutor(null, produtor('Dona Maria')) === 'manga',
);
conferir(
  'Trocar do Seu Francisco para o Seu Antônio: goiaba continua',
  frutaAoTrocarProdutor('goiaba', produtor('Seu Antônio')) === 'goiaba',
);
conferir(
  'Trocar para a Dona Lúcia: goiaba sai (ela tem maracujá e mamão)',
  frutaAoTrocarProdutor('goiaba', produtor('Dona Lúcia')) === null,
);
conferir(
  'Trocar para o Seu Raimundo: banana entra no lugar da goiaba (é a única)',
  frutaAoTrocarProdutor('goiaba', produtor('Seu Raimundo')) === 'banana',
);

// Fruta sem preço
conferir(
  'Coco avisa que não tem preço do Ceasa',
  avisoSemPreco('coco', precos) === 'Coco ainda não tem preço do Ceasa: entra na agenda, mas não soma no lucro.',
);
conferir('Goiaba não avisa nada', avisoSemPreco('goiaba', precos) === null);

// Salvar
const completo = { data: '30/set', produtor: 1, fruta: 'goiaba', caixas: 20 };
const pronto = avisoPronto(completo);
conferir(
  'Tudo preenchido: Salvar libera com o aviso do cartão',
  pronto?.data === '30/set' &&
    JSON.stringify(pronto.aviso) === JSON.stringify({ produtor: 1, fruta: 'goiaba', caixas: 20 }),
);
for (const falta of ['data', 'produtor', 'fruta', 'caixas'] as const) {
  conferir(`Sem ${falta}: Salvar desligado`, avisoPronto({ ...completo, [falta]: null }) === null);
}

if (falhas > 0) {
  console.error(`\n${falhas} regra(s) do formulário não batem.`);
  process.exit(1);
}
console.log('\nAs regras do formulário "Registrar aviso" batem.');
