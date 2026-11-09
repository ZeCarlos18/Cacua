// Confere a conta do coletor (S6.1): o SHA-256 em TypeScript puro e as regras do cadastro.
// Rodar na raiz do projeto: npm run conferir

import {
  cadastroQueConfere,
  cadastrosDoSalvo,
  codigoDoConvite,
  coletorDaSessao,
  coletorDeExemplo,
  errosDoCadastro,
  limparTelefone,
  novoCadastro,
  novoSal,
  senhaFacil,
  sessaoDoSalvo,
  type CamposDoCadastro,
} from '@/state/acesso-regras';
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

// Os testes do cartão
const jose: CamposDoCadastro = {
  nome: 'José Carlos',
  telefone: '(88) 99999-0000',
  regiao: 'Cedro',
  senha: 'goiaba25',
  repetirSenha: 'goiaba25',
};
conferir('Cadastro certo (José Carlos · (88) 99999-0000 · Cedro · goiaba25) não tem erro', errosDoCadastro(jose, []) === null);
const cadastroDoJose = novoCadastro(jose, novoSal());
const salvo = JSON.stringify([cadastroDoJose]);
conferir('O JSON salvo não contém "goiaba25"', !salvo.includes('goiaba25'));
conferir(
  'O JSON salvo tem nome, telefone, região, sal e resumo da senha',
  Object.keys(cadastroDoJose).join(',') === 'nome,telefone,regiao,sal,resumoDaSenha' && cadastroDoJose.telefone === '88999990000',
);
const cadastros = cadastrosDoSalvo(salvo);
conferir('Entra com o telefone e a senha certos', cadastroQueConfere('(88) 99999-0000', 'goiaba25', cadastros) !== null);
conferir('Entra com o telefone escrito de outro jeito', cadastroQueConfere('+55 88 99999-0000', 'goiaba25', cadastros) !== null);
conferir('Não entra com goiaba26', cadastroQueConfere('(88) 99999-0000', 'goiaba26', cadastros) === null);
conferir('Não entra com um telefone sem conta', cadastroQueConfere('(88) 98888-0000', 'goiaba25', cadastros) === null);
const exemplo = coletorDeExemplo();
conferir('A conta de exemplo é o Edson, com o código EDSON', exemplo.nome === 'Edson' && exemplo.codigo === 'EDSON');
conferir('Sem sessão, ninguém entrou', coletorDaSessao(null, cadastros) === null);
conferir('Com a sessão do José, entrou o José (código JOSE)', coletorDaSessao({ telefone: '88999990000' }, cadastros)?.codigo === 'JOSE');
conferir('Com a sessão de exemplo, entrou o Edson', coletorDaSessao({ exemplo: true }, cadastros)?.nome === 'Edson');
conferir('Sessão de uma conta que não existe mais: ninguém entrou', coletorDaSessao({ telefone: '88988887777' }, cadastros) === null);

// Telefone
conferir('"(88) 99999-0000" vira 88999990000', limparTelefone('(88) 99999-0000') === '88999990000');
conferir('"+55 88 99999-0000" vira 88999990000', limparTelefone('+55 88 99999-0000') === '88999990000');
conferir('Fixo com DDD (10 números) vale', limparTelefone('(88) 3521-0000') === '8835210000');
conferir('DDD 55 sem o +55 continua (55 99999-0000)', limparTelefone('55 99999-0000') === '55999990000');
conferir('Sem DDD (9 números) não vale', limparTelefone('99999-0000') === null);
conferir('DDD começando com 0 não vale', limparTelefone('(088) 9999-0000') === null);

// Erros de cada campo
const vazio = errosDoCadastro({ nome: '', telefone: '', regiao: '', senha: '', repetirSenha: '' }, []);
conferir(
  'Sem preencher nada: erro no nome, telefone, região e senha',
  vazio?.nome === 'Digite o seu nome.' &&
    vazio.telefone === 'Digite o telefone com DDD.' &&
    vazio.regiao === 'Digite a sua região.' &&
    vazio.senha === 'A senha precisa ter pelo menos 6 caracteres.',
);
conferir('Nome com 1 letra', errosDoCadastro({ ...jose, nome: 'J' }, [])?.nome === 'O nome precisa ter pelo menos 2 letras.');
conferir('Nome "Zé" (2 letras, uma com acento) vale', errosDoCadastro({ ...jose, nome: 'Zé' }, []) === null);
conferir(
  'Telefone curto',
  errosDoCadastro({ ...jose, telefone: '9999-0000' }, [])?.telefone === 'O telefone precisa ter DDD e 10 ou 11 números.',
);
conferir(
  'Telefone repetido',
  errosDoCadastro({ ...jose, nome: 'Outra Pessoa' }, cadastros)?.telefone === 'Já existe uma conta com esse telefone.',
);
conferir(
  'Telefone repetido escrito de outro jeito também',
  errosDoCadastro({ ...jose, telefone: '+55 88 99999-0000' }, cadastros)?.telefone === 'Já existe uma conta com esse telefone.',
);
conferir('Região só com espaços', errosDoCadastro({ ...jose, regiao: '   ' }, [])?.regiao === 'Digite a sua região.');
conferir('Senha com 5 caracteres', errosDoCadastro({ ...jose, senha: 'goia5', repetirSenha: 'goia5' }, [])?.senha === 'A senha precisa ter pelo menos 6 caracteres.');
conferir('Senha com símbolo vale (goiaba-25)', errosDoCadastro({ ...jose, senha: 'goiaba-25', repetirSenha: 'goiaba-25' }, []) === null);
conferir('"Repita a senha" diferente', errosDoCadastro({ ...jose, repetirSenha: 'goiaba52' }, [])?.repetirSenha === 'As duas senhas não são iguais.');

// Senha fácil
for (const facil of ['123456', '654321', '111111', 'aaaaaa', '0000000', '1234567', '98765432']) {
  conferir(`Senha fácil: ${facil}`, senhaFacil(facil));
}
for (const boa of ['goiaba25', '135792', '123457']) {
  conferir(`Senha que não é fácil: ${boa}`, !senhaFacil(boa));
}
conferir(
  'A mensagem da senha fácil',
  errosDoCadastro({ ...jose, senha: '123456', repetirSenha: '123456' }, [])?.senha === 'Essa senha é fácil de adivinhar. Escolha outra.',
);

// Código do convite e sal
conferir('Código: "José Carlos" → JOSE', codigoDoConvite('José Carlos') === 'JOSE');
conferir('Código: "  ângela maria " → ANGELA', codigoDoConvite('  ângela maria ') === 'ANGELA');
const sal1 = novoSal();
conferir('O sal tem 32 caracteres hexadecimais', /^[0-9a-f]{32}$/.test(sal1));
conferir('Cada conta tem um sal diferente', sal1 !== novoSal());
conferir(
  'A mesma senha em duas contas tem resumos diferentes (o sal muda)',
  novoCadastro(jose, novoSal()).resumoDaSenha !== novoCadastro(jose, novoSal()).resumoDaSenha,
);

// O que vem do celular e não serve
conferir('Cadastros: texto estragado vira lista vazia', cadastrosDoSalvo('{x').length === 0);
conferir('Cadastros: item sem o resumo da senha é ignorado', cadastrosDoSalvo(JSON.stringify([{ nome: 'A', telefone: '1' }])).length === 0);
conferir('Sessão: texto estragado é null', sessaoDoSalvo('{x') === null);
conferir('Sessão: { exemplo: true } é a conta de exemplo', JSON.stringify(sessaoDoSalvo('{"exemplo":true}')) === '{"exemplo":true}');

if (falhas > 0) {
  console.error(`\n${falhas} regra(s) da conta do coletor não batem com o cartão.`);
  process.exit(1);
}
console.log('\nA conta do coletor bate com o cartão.');
