/**
 * Regras do login e do cadastro do coletor. É um protótipo sem servidor: a conta fica só no
 * celular, junto com o resto do app (S4.5), e a senha nunca é guardada, só o resumo dela (SHA-256
 * com um sal). Num app de verdade, a conta iria para um servidor e o celular guardaria só a
 * sessão, no expo-secure-store.
 */

import { coletor as coletorDeExemplo } from '@/data/dados';
import { sha256 } from '@/utils/sha256';

/** A conta de um coletor cadastrado no celular. */
export type Cadastro = {
  nome: string;
  /** Só dígitos, com o DDD: "88999990000". */
  telefone: string;
  regiao: string;
  /** Texto aleatório misturado à senha antes do resumo. */
  sal: string;
  /** O SHA-256 de `${sal}:${senha}`. */
  resumoDaSenha: string;
};

/** Quem está usando o app: um coletor cadastrado (pelo telefone) ou a conta de exemplo (Edson). */
export type Sessao = { tipo: 'cadastro'; telefone: string } | { tipo: 'exemplo' };

/** O coletor que as telas mostram: no topo, no recibo e no convite. */
export type ColetorAtual = {
  nome: string;
  regiao: string;
  /** null na conta de exemplo. */
  telefone: string | null;
  /** O código do convite (S5.3): EDSON, JOSE. */
  codigo: string;
  exemplo: boolean;
};

export type CamposDoCadastro = {
  nome: string;
  telefone: string;
  regiao: string;
  senha: string;
  repetirSenha: string;
};

export type ErrosDoCadastro = Partial<Record<keyof CamposDoCadastro, string>>;

/** Tamanho mínimo da senha. O guia de segurança de apps da GSMA pede 6 para senha com letras. */
export const SENHA_MINIMA = 6;

export function apenasDigitos(texto: string) {
  return texto.replace(/\D/g, '');
}

/** DDD (11 a 99) e o número: 10 dígitos para fixo, 11 para celular. Um 55 na frente é tirado. */
export function telefoneDoTexto(texto: string) {
  let digitos = apenasDigitos(texto);
  if ((digitos.length === 12 || digitos.length === 13) && digitos.startsWith('55')) {
    digitos = digitos.slice(2);
  }
  const valido = (digitos.length === 10 || digitos.length === 11) && Number(digitos.slice(0, 2)) >= 11;
  return valido ? digitos : null;
}

/** "88999990000" → "(88) 99999-0000"; "8835550000" → "(88) 3555-0000". */
export function textoDoTelefone(digitos: string) {
  const ddd = digitos.slice(0, 2);
  const resto = digitos.slice(2);
  const corte = resto.length === 9 ? 5 : 4;
  return `(${ddd}) ${resto.slice(0, corte)}-${resto.slice(corte)}`;
}

/** Senha fácil de adivinhar: tudo igual (111111) ou números em sequência (123456, 654321). */
export function senhaFacil(senha: string) {
  if (/^(.)\1+$/.test(senha)) return true;
  const sequencia = '0123456789012345678901234567890';
  return /^\d+$/.test(senha) && (sequencia.includes(senha) || sequencia.includes([...senha].reverse().join('')));
}

/** O que está errado em cada campo do cadastro, ou um objeto vazio se está tudo certo. */
export function errosDoCadastro(campos: CamposDoCadastro, cadastros: Cadastro[]): ErrosDoCadastro {
  const erros: ErrosDoCadastro = {};
  const telefone = telefoneDoTexto(campos.telefone);

  if (campos.nome.trim().length < 2) erros.nome = 'Escreva o seu nome.';
  if (!telefone) {
    erros.telefone = 'Escreva o DDD e o número, com 10 ou 11 dígitos.';
  } else if (cadastros.some((cadastro) => cadastro.telefone === telefone)) {
    erros.telefone = 'Já existe uma conta com esse telefone neste celular. Volte e entre com ela.';
  }
  if (campos.regiao.trim().length < 2) erros.regiao = 'Escreva a região onde você compra.';
  if (campos.senha.length < SENHA_MINIMA) {
    erros.senha = `A senha precisa ter pelo menos ${SENHA_MINIMA} letras ou números.`;
  } else if (senhaFacil(campos.senha)) {
    erros.senha = 'Essa senha é fácil de adivinhar. Evite números em sequência ou repetidos.';
  }
  if (campos.repetirSenha !== campos.senha) erros.repetirSenha = 'As duas senhas não são iguais.';

  return erros;
}

export function resumirSenha(senha: string, sal: string) {
  return sha256(`${sal}:${senha}`);
}

/** Um sal de 32 letras hexadecimais. Não precisa ser secreto, só diferente em cada conta. */
export function novoSal(aleatorio: () => number = Math.random) {
  return Array.from({ length: 32 }, () => Math.floor(aleatorio() * 16).toString(16)).join('');
}

/** A conta nova, já sem a senha. Os campos têm que ter passado pelo errosDoCadastro. */
export function novoCadastro(campos: CamposDoCadastro, sal: string): Cadastro {
  return {
    nome: campos.nome.trim(),
    telefone: telefoneDoTexto(campos.telefone) ?? '',
    regiao: campos.regiao.trim(),
    sal,
    resumoDaSenha: resumirSenha(campos.senha, sal),
  };
}

/** A conta do telefone, se a senha confere; senão null. */
export function cadastroQueEntra(cadastros: Cadastro[], telefone: string, senha: string) {
  const digitos = telefoneDoTexto(telefone);
  const cadastro = cadastros.find((item) => item.telefone === digitos);
  if (!cadastro || resumirSenha(senha, cadastro.sal) !== cadastro.resumoDaSenha) return null;
  return cadastro;
}

/** O primeiro nome, em maiúsculas e sem acento: "José Carlos" → "JOSE". */
export function codigoDoColetor(nome: string) {
  const primeiro = nome.trim().split(/\s+/)[0] ?? '';
  const codigo = primeiro
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^A-Za-z0-9]/g, '')
    .toUpperCase();
  return codigo || 'COLETOR';
}

/** Quem a sessão aponta, ou null se ninguém entrou (ou se a conta não existe mais). */
export function coletorDaSessao(sessao: Sessao | null, cadastros: Cadastro[]): ColetorAtual | null {
  if (!sessao) return null;
  if (sessao.tipo === 'exemplo') {
    return {
      nome: coletorDeExemplo.nome,
      regiao: coletorDeExemplo.regiao,
      telefone: null,
      codigo: coletorDeExemplo.codigo,
      exemplo: true,
    };
  }
  const cadastro = cadastros.find((item) => item.telefone === sessao.telefone);
  if (!cadastro) return null;
  return {
    nome: cadastro.nome,
    regiao: cadastro.regiao,
    telefone: cadastro.telefone,
    codigo: codigoDoColetor(cadastro.nome),
    exemplo: false,
  };
}

/** As contas salvas no celular, a partir do texto salvo. O que não serve fica de fora. */
export function cadastrosDoSalvo(texto: string | null): Cadastro[] {
  if (!texto) return [];
  try {
    const salvo = JSON.parse(texto);
    if (!Array.isArray(salvo)) return [];
    return salvo.filter(
      (item): item is Cadastro =>
        typeof item === 'object' &&
        item !== null &&
        ['nome', 'telefone', 'regiao', 'sal', 'resumoDaSenha'].every((campo) => typeof item[campo] === 'string'),
    );
  } catch {
    return [];
  }
}

/** A sessão salva no celular, ou null se não há (ou se o texto não serve). */
export function sessaoDoSalvo(texto: string | null): Sessao | null {
  if (!texto) return null;
  try {
    const salvo = JSON.parse(texto);
    if (salvo?.tipo === 'exemplo') return { tipo: 'exemplo' };
    if (salvo?.tipo === 'cadastro' && typeof salvo.telefone === 'string') {
      return { tipo: 'cadastro', telefone: salvo.telefone };
    }
    return null;
  } catch {
    return null;
  }
}
