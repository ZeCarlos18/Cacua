// Confere a conta do coletor (S6.1): o SHA-256 em TypeScript puro e as regras do cadastro.
// Rodar na raiz do projeto: npm run conferir

import { sha256 } from '@/utils/sha256';

let falhas = 0;

function conferir(nome: string, ok: boolean) {
  if (!ok) falhas++;
  console.log(`${ok ? 'OK   ' : 'FALHA'} ${nome}`);
}

// SHA-256: os valores do cartão, tirados do Node
conferir(
  'sha256("abc") é o do cartão',
  sha256('abc') === 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
);
conferir(
  'sha256("Caçuá") é o do cartão',
  sha256('Caçuá') === 'ac86bbdf2c81bf0b485cd78db529bb91117fcf1fb2ab8b16c0303580c8207226',
);

// E igual ao do Node em textos de vários tamanhos (55, 56 e 64 bytes mudam o número de blocos).
// Valores tirados de: node -e "console.log(require('crypto').createHash('sha256').update(texto).digest('hex'))"
const doNode: [string, string][] = [
  ['', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'],
  ['a'.repeat(55), '9f4390f8d30c2dd92ec9f095b65e2b9ae9b0a925a5258e241c9f1e910f734318'],
  ['a'.repeat(56), 'b35439a4ac6f0948b6d6f9e3c6af0f5f590ce20f1bde7090ef7970686ec6738a'],
  ['a'.repeat(64), 'ffe054fe7ae0cb6dc65c3af9b61d5209f439851db43d0ba5997337df154668eb'],
  ['b'.repeat(1000), 'f6f118e120e52be0bd0cfdf2794cd12c07686cc871235ac2f11459378e6d235b'],
  ['José Carlos · (88) 99999-0000 · Cedro', 'a49d0d03b8f8237111f8fb3fc016e707a56f456d920b6171456bc948a0c57688'],
  ['emoji 🍈 e acento ã', 'ef181fab119b08ba29737ed332ab901f0c9ee1daac4846806fdd6c5b6d849df8'],
];
for (const [texto, resumo] of doNode) {
  conferir(`sha256 igual ao do Node (${[...texto].length} caracteres)`, sha256(texto) === resumo);
}

if (falhas > 0) {
  console.error(`\n${falhas} regra(s) da conta do coletor não batem com o cartão.`);
  process.exit(1);
}
console.log('\nA conta do coletor bate com o cartão.');
