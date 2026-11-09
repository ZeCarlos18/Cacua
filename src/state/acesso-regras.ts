/**
 * Regras da conta do coletor (S6.1): o telefone, os erros do cadastro, a senha fácil, o resumo da
 * senha com sal e o código do convite. Funções puras; quem guarda no celular é o AcessoProvider
 * (acesso.tsx). É o protótipo, então a conta fica só no celular, mas a senha nunca é guardada:
 * só o resumo dela (SHA-256 com um sal).
 */

import { coletor as edson } from '@/data/dados';
import { sha256 } from '@/utils/sha256';

export type CamposDoCadastro = {
  nome: string;
  telefone: string;
  regiao: string;
  senha: string;
  repetirSenha: string;
};

/** Só os campos com erro; o texto aparece embaixo do campo (S6.4). */
export type ErrosDoCadastro = Partial<Record<keyof CamposDoCadastro, string>>;

/** O que fica guardado no celular. A senha não: só o resumo, sha256(sal + ':' + senha). */
export type Cadastro = {
  nome: string;
  telefone: string;
  regiao: string;
  sal: string;
  resumoDaSenha: string;
};

/** Quem entrou: o telefone de um cadastro, ou a conta de exemplo (o Edson). */
export type Sessao = { telefone: string } | { exemplo: true };

export type Coletor = {
  nome: string;
  regiao: string;
  /** null na conta de exemplo, que não tem telefone. */
  telefone: string | null;
  /** O código do convite (S5.3), ex.: JOSE. */
  codigo: string;
};

const SENHAS_FACEIS = ['123456', '654321', '111111'];
const TAMANHO_MINIMO_DA_SENHA = 6;

const SEM_ACENTO: Record<string, string> = {
  á: 'a', à: 'a', â: 'a', ã: 'a', ä: 'a', é: 'e', è: 'e', ê: 'e', ë: 'e', í: 'i', ì: 'i', î: 'i',
  ï: 'i', ó: 'o', ò: 'o', ô: 'o', õ: 'o', ö: 'o', ú: 'u', ù: 'u', û: 'u', ü: 'u', ç: 'c', ñ: 'n',
};

/** "José" → "Jose". Sem o normalize, que nem todo motor de JavaScript do celular tem. */
function semAcento(texto: string) {
  return [...texto]
    .map((letra) => {
      const minuscula = letra.toLowerCase();
      const trocada = SEM_ACENTO[minuscula];
      if (!trocada) return letra;
      return letra === minuscula ? trocada : trocada.toUpperCase();
    })
    .join('');
}

function contarLetras(texto: string) {
  return (semAcento(texto).match(/[a-z]/gi) ?? []).length;
}

/**
 * O telefone só com os números, com DDD: "(88) 99999-0000" e "+55 88 99999-0000" → 88999990000.
 * Tira o 55 do Brasil quando sobram 12 ou 13 números. Devolve null se não ficar com 10 ou 11
 * números, ou se o DDD começar com 0.
 */
export function limparTelefone(texto: string) {
  let numeros = texto.replace(/\D/g, '');
  if ((numeros.length === 12 || numeros.length === 13) && numeros.startsWith('55')) {
    numeros = numeros.slice(2);
  }
  if (numeros.length !== 10 && numeros.length !== 11) return null;
  if (numeros.startsWith('0')) return null;
  return numeros;
}

/**
 * Senha fácil de adivinhar: 123456, 654321 e 111111 (as do cartão), todos os caracteres iguais
 * (aaaaaa, 0000000) ou só números em sequência (1234567, 98765432).
 */
export function senhaFacil(senha: string) {
  if (SENHAS_FACEIS.includes(senha)) return true;

  const caracteres = [...senha];
  if (caracteres.every((caractere) => caractere === caracteres[0])) return true;

  if (/^\d+$/.test(senha)) {
    const numeros = caracteres.map(Number);
    const sobe = numeros.every((n, i) => i === 0 || n === numeros[i - 1] + 1);
    const desce = numeros.every((n, i) => i === 0 || n === numeros[i - 1] - 1);
    return sobe || desce;
  }
  return false;
}

/** Os erros de cada campo do cadastro, ou null se está tudo certo. */
export function errosDoCadastro(campos: CamposDoCadastro, cadastros: Cadastro[]): ErrosDoCadastro | null {
  const erros: ErrosDoCadastro = {};

  const nome = campos.nome.trim();
  if (!nome) erros.nome = 'Digite o seu nome.';
  else if (contarLetras(nome) < 2) erros.nome = 'O nome precisa ter pelo menos 2 letras.';

  const telefone = limparTelefone(campos.telefone);
  if (!campos.telefone.trim()) erros.telefone = 'Digite o telefone com DDD.';
  else if (!telefone) erros.telefone = 'O telefone precisa ter DDD e 10 ou 11 números.';
  else if (cadastros.some((cadastro) => cadastro.telefone === telefone)) {
    erros.telefone = 'Já existe uma conta com esse telefone.';
  }

  if (!campos.regiao.trim()) erros.regiao = 'Digite a sua região.';

  if ([...campos.senha].length < TAMANHO_MINIMO_DA_SENHA) {
    erros.senha = `A senha precisa ter pelo menos ${TAMANHO_MINIMO_DA_SENHA} caracteres.`;
  } else if (senhaFacil(campos.senha)) {
    erros.senha = 'Essa senha é fácil de adivinhar. Escolha outra.';
  }

  if (campos.repetirSenha !== campos.senha) erros.repetirSenha = 'As duas senhas não são iguais.';

  return Object.keys(erros).length > 0 ? erros : null;
}

/** O resumo que fica guardado no lugar da senha: sha256(sal + ':' + senha). */
export function resumoDaSenha(sal: string, senha: string) {
  return sha256(`${sal}:${senha}`);
}

/**
 * Um sal novo, 16 bytes em hexadecimal. Usa o gerador seguro (crypto.getRandomValues) quando o
 * celular ou o navegador tem; senão, o Math.random. O sal não é segredo: só precisa ser diferente
 * para cada conta.
 */
export function novoSal() {
  const bytes = new Uint8Array(16);
  if (typeof globalThis.crypto?.getRandomValues === 'function') {
    globalThis.crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/** O cadastro para guardar, a partir de campos já conferidos (sem erros). */
export function novoCadastro(campos: CamposDoCadastro, sal: string): Cadastro {
  return {
    nome: campos.nome.trim(),
    telefone: limparTelefone(campos.telefone) ?? '',
    regiao: campos.regiao.trim(),
    sal,
    resumoDaSenha: resumoDaSenha(sal, campos.senha),
  };
}

/** O cadastro do telefone, se a senha confere; senão, null. */
export function cadastroQueConfere(telefone: string, senha: string, cadastros: Cadastro[]) {
  const limpo = limparTelefone(telefone);
  const cadastro = cadastros.find((item) => item.telefone === limpo);
  if (!cadastro || resumoDaSenha(cadastro.sal, senha) !== cadastro.resumoDaSenha) return null;
  return cadastro;
}

/** O código do convite: o primeiro nome em maiúsculas e sem acento ("José Carlos" → JOSE). */
export function codigoDoConvite(nome: string) {
  const primeiro = nome.trim().split(/\s+/)[0] ?? '';
  return semAcento(primeiro).toUpperCase().replace(/[^A-Z]/g, '');
}

export function coletorDoCadastro(cadastro: Cadastro): Coletor {
  return {
    nome: cadastro.nome,
    regiao: cadastro.regiao,
    telefone: cadastro.telefone,
    codigo: codigoDoConvite(cadastro.nome),
  };
}

/** A conta de exemplo: o Edson do dados.js, com o código EDSON e sem telefone. */
export function coletorDeExemplo(): Coletor {
  return { nome: edson.nome, regiao: edson.regiao, telefone: null, codigo: edson.codigo };
}

/** Quem entrou, pela sessão. Sem sessão (ou com a conta apagada), ninguém entrou: null. */
export function coletorDaSessao(sessao: Sessao | null, cadastros: Cadastro[]): Coletor | null {
  if (!sessao) return null;
  if ('exemplo' in sessao) return coletorDeExemplo();
  const cadastro = cadastros.find((item) => item.telefone === sessao.telefone);
  return cadastro ? coletorDoCadastro(cadastro) : null;
}

const ehTexto = (valor: unknown) => typeof valor === 'string';

/** Os cadastros guardados no celular; o que não serve é ignorado. */
export function cadastrosDoSalvo(texto: string | null): Cadastro[] {
  if (!texto) return [];
  try {
    const salvo: unknown = JSON.parse(texto);
    if (!Array.isArray(salvo)) return [];
    return salvo.filter(
      (item): item is Cadastro =>
        typeof item === 'object' &&
        item !== null &&
        ['nome', 'telefone', 'regiao', 'sal', 'resumoDaSenha'].every((campo) => ehTexto(item[campo])),
    );
  } catch {
    return [];
  }
}

/** A sessão guardada no celular, ou null se não há (ou não serve). */
export function sessaoDoSalvo(texto: string | null): Sessao | null {
  if (!texto) return null;
  try {
    const salvo = JSON.parse(texto);
    if (salvo?.exemplo === true) return { exemplo: true };
    if (ehTexto(salvo?.telefone)) return { telefone: salvo.telefone };
    return null;
  } catch {
    return null;
  }
}
