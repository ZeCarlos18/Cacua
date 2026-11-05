// Confere o login e o cadastro do coletor: o SHA-256 da senha (comparado com valores tirados do
// SHA-256 do Node), as regras do cadastro, o login com telefone e senha e quem a sessão aponta.
// Rodar na raiz do projeto: npm run conferir

import {
  cadastroQueEntra,
  cadastrosDoSalvo,
  codigoDoColetor,
  coletorDaSessao,
  errosDoCadastro,
  novoCadastro,
  novoSal,
  senhaFacil,
  sessaoDoSalvo,
  telefoneDoTexto,
  textoDoTelefone,
  type CamposDoCadastro,
} from '@/state/acesso-regras';
import { sha256 } from '@/utils/sha256';

let falhas = 0;

function conferir(nome: string, ok: boolean) {
  if (!ok) falhas++;
  console.log(`${ok ? 'OK   ' : 'FALHA'} ${nome}`);
}

// SHA-256 igual ao do Node (node -e "crypto.createHash('sha256')..."), com acento, emoji e
// textos que cruzam o tamanho do bloco de 64 bytes
const doNode: [string, string][] = [
  ['', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'],
  ['abc', 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'],
  ['Caçuá', 'ac86bbdf2c81bf0b485cd78db529bb91117fcf1fb2ab8b16c0303580c8207226'],
  ['a'.repeat(55), '9f4390f8d30c2dd92ec9f095b65e2b9ae9b0a925a5258e241c9f1e910f734318'],
  ['a'.repeat(56), 'b35439a4ac6f0948b6d6f9e3c6af0f5f590ce20f1bde7090ef7970686ec6738a'],
  ['a'.repeat(64), 'ffe054fe7ae0cb6dc65c3af9b61d5209f439851db43d0ba5997337df154668eb'],
  ['🥭 manga', '97ce1536157908445c0ea54b9b2e19931b47d6a6bd1f12ea5a2dcb651da77e0c'],
  ['x'.repeat(1000), '44f8354494a5ba03ba1792a8d3e9c534c47a9181980fde7a3f44b06ef2ae7c7f'],
];
for (const [texto, esperado] of doNode) {
  const nome = texto.length > 10 ? `${texto.length} × "${texto[0]}"` : JSON.stringify(texto);
  conferir(`SHA-256 de ${nome} igual ao do Node`, sha256(texto) === esperado);
}

// Telefone
conferir('"(88) 99999-0000" vira 88999990000', telefoneDoTexto('(88) 99999-0000') === '88999990000');
conferir('Com +55 na frente, o 55 sai', telefoneDoTexto('+55 88 99999-0000') === '88999990000');
conferir('Fixo com 10 dígitos vale', telefoneDoTexto('(88) 3555-0000') === '8835550000');
conferir('Sem DDD não vale', telefoneDoTexto('99999-0000') === null);
conferir('DDD 00 não vale', telefoneDoTexto('(00) 99999-0000') === null);
conferir('88999990000 aparece como (88) 99999-0000', textoDoTelefone('88999990000') === '(88) 99999-0000');

// Senha fácil
conferir('123456 é fácil', senhaFacil('123456'));
conferir('654321 é fácil', senhaFacil('654321'));
conferir('111111 é fácil', senhaFacil('111111'));
conferir('goiaba25 não é fácil', !senhaFacil('goiaba25'));

// Cadastro
const certo: CamposDoCadastro = {
  nome: '  José Carlos ',
  telefone: '(88) 99999-0000',
  regiao: 'Cedro',
  senha: 'goiaba25',
  repetirSenha: 'goiaba25',
};
conferir('Cadastro certo não tem erro', Object.keys(errosDoCadastro(certo, [])).length === 0);

const errado = errosDoCadastro({ nome: 'J', telefone: '9999', regiao: '', senha: '123', repetirSenha: '12' }, []);
conferir(
  'Cadastro errado marca nome, telefone, região, senha e repetição',
  ['nome', 'telefone', 'regiao', 'senha', 'repetirSenha'].every((campo) => campo in errado),
);
conferir(
  'Senha 123456 é recusada por ser fácil',
  errosDoCadastro({ ...certo, senha: '123456', repetirSenha: '123456' }, []).senha?.includes('fácil') === true,
);

const sal = novoSal(() => 0.5);
conferir('O sal tem 32 letras hexadecimais', /^[0-9a-f]{32}$/.test(novoSal()) && sal === '8'.repeat(32));

const jose = novoCadastro(certo, sal);
conferir('O nome é guardado sem espaços sobrando', jose.nome === 'José Carlos');
conferir('O telefone é guardado só com dígitos', jose.telefone === '88999990000');
conferir('A senha não é guardada, só o resumo', !JSON.stringify(jose).includes('goiaba25'));
conferir('O resumo é o SHA-256 de sal:senha', jose.resumoDaSenha === sha256(`${sal}:goiaba25`));
conferir(
  'Não deixa cadastrar o mesmo telefone duas vezes',
  errosDoCadastro({ ...certo, telefone: '88 99999 0000' }, [jose]).telefone !== undefined,
);

// Login
conferir('Entra com o telefone e a senha certos', cadastroQueEntra([jose], '(88) 99999-0000', 'goiaba25') === jose);
conferir('Não entra com a senha errada', cadastroQueEntra([jose], '88999990000', 'goiaba26') === null);
conferir('Não entra com outro telefone', cadastroQueEntra([jose], '(88) 98888-0000', 'goiaba25') === null);

// Quem entrou
conferir('O código do José Carlos é JOSE', codigoDoColetor('José Carlos') === 'JOSE');
const doJose = coletorDaSessao({ tipo: 'cadastro', telefone: '88999990000' }, [jose]);
conferir('A sessão do cadastro mostra o José, de Cedro', doJose?.nome === 'José Carlos' && doJose.regiao === 'Cedro');
const exemplo = coletorDaSessao({ tipo: 'exemplo' }, []);
conferir('A conta de exemplo é o Edson, com o código EDSON', exemplo?.nome === 'Edson' && exemplo.codigo === 'EDSON');
conferir('Sem sessão, ninguém entrou', coletorDaSessao(null, [jose]) === null);
conferir(
  'Sessão de uma conta que não existe mais não entra',
  coletorDaSessao({ tipo: 'cadastro', telefone: '88911112222' }, [jose]) === null,
);

// O que fica salvo no celular
conferir('As contas salvas voltam iguais', JSON.stringify(cadastrosDoSalvo(JSON.stringify([jose]))) === JSON.stringify([jose]));
conferir('Texto salvo estragado vira lista vazia', cadastrosDoSalvo('{não é json').length === 0);
conferir('A sessão do exemplo volta igual', sessaoDoSalvo(JSON.stringify({ tipo: 'exemplo' }))?.tipo === 'exemplo');
conferir('Sessão estranha é ignorada', sessaoDoSalvo(JSON.stringify({ tipo: 'admin' })) === null);

if (falhas > 0) {
  console.error(`\n${falhas} regra(s) do login e do cadastro não batem.`);
  process.exit(1);
}
console.log('\nO login e o cadastro batem.');
