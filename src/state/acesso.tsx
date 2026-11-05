import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { coletor as coletorDeExemplo } from '@/data/dados';
import {
  cadastroQueEntra,
  cadastrosDoSalvo,
  coletorDaSessao,
  errosDoCadastro,
  novoCadastro,
  novoSal,
  sessaoDoSalvo,
  type Cadastro,
  type CamposDoCadastro,
  type ColetorAtual,
  type ErrosDoCadastro,
  type Sessao,
} from '@/state/acesso-regras';

/** Onde as contas e a sessão ficam no celular (separado do estado do app, cacua:estado:v2). */
const CHAVE_CADASTROS = 'cacua:cadastros:v1';
const CHAVE_SESSAO = 'cacua:sessao:v1';

type ValorAcesso = {
  /** Quem entrou, ou null se ninguém entrou ainda. */
  coletor: ColetorAtual | null;
  /** Cria a conta e já entra. Devolve os erros de cada campo, ou null se deu certo. */
  cadastrar: (campos: CamposDoCadastro) => ErrosDoCadastro | null;
  /** Entra com o telefone e a senha. Devolve false se não conferem. */
  entrar: (telefone: string, senha: string) => boolean;
  /** Entra com o Edson do dados.js, para testar o protótipo sem criar conta. */
  entrarComExemplo: () => void;
  sair: () => void;
};

const AcessoContext = createContext<ValorAcesso | null>(null);

async function ler(chave: string) {
  try {
    return await AsyncStorage.getItem(chave);
  } catch {
    return null;
  }
}

async function gravar(chave: string, valor: unknown) {
  try {
    if (valor === null) await AsyncStorage.removeItem(chave);
    else await AsyncStorage.setItem(chave, JSON.stringify(valor));
  } catch (erro) {
    console.warn('Não deu para salvar a conta no celular:', erro);
  }
}

/**
 * Login e cadastro do coletor, guardados só no celular. Ao abrir, o app lê as contas e a sessão;
 * sem sessão, as rotas protegidas do _layout mostram a tela Entrar.
 */
export function AcessoProvider({ children }: { children: ReactNode }) {
  const [cadastros, setCadastros] = useState<Cadastro[]>([]);
  const [sessao, setSessao] = useState<Sessao | null>(null);
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    let ativo = true;
    Promise.all([ler(CHAVE_CADASTROS), ler(CHAVE_SESSAO)]).then(([textoCadastros, textoSessao]) => {
      if (!ativo) return;
      setCadastros(cadastrosDoSalvo(textoCadastros));
      setSessao(sessaoDoSalvo(textoSessao));
      setCarregado(true);
    });
    return () => {
      ativo = false;
    };
  }, []);

  // Enquanto lê o celular, nada aparece: assim a tela Entrar não pisca para quem já entrou.
  if (!carregado) return null;

  function mudarSessao(nova: Sessao | null) {
    setSessao(nova);
    gravar(CHAVE_SESSAO, nova);
  }

  const valor: ValorAcesso = {
    coletor: coletorDaSessao(sessao, cadastros),
    cadastrar: (campos) => {
      const erros = errosDoCadastro(campos, cadastros);
      if (Object.keys(erros).length > 0) return erros;
      const cadastro = novoCadastro(campos, novoSal());
      const todos = [...cadastros, cadastro];
      setCadastros(todos);
      gravar(CHAVE_CADASTROS, todos);
      mudarSessao({ tipo: 'cadastro', telefone: cadastro.telefone });
      return null;
    },
    entrar: (telefone, senha) => {
      const cadastro = cadastroQueEntra(cadastros, telefone, senha);
      if (!cadastro) return false;
      mudarSessao({ tipo: 'cadastro', telefone: cadastro.telefone });
      return true;
    },
    entrarComExemplo: () => mudarSessao({ tipo: 'exemplo' }),
    sair: () => mudarSessao(null),
  };

  return <AcessoContext.Provider value={valor}>{children}</AcessoContext.Provider>;
}

/** O login do coletor. Precisa estar dentro do AcessoProvider. */
export function useAcesso() {
  const valor = useContext(AcessoContext);
  if (!valor) throw new Error('useAcesso precisa estar dentro do AcessoProvider');
  return valor;
}

/**
 * O coletor que entrou, para o topo, o recibo e o convite. As telas das abas só abrem depois do
 * login, mas, por garantia, sem ninguém entrar volta o Edson do dados.js.
 */
export function useColetor(): ColetorAtual {
  const { coletor } = useAcesso();
  return (
    coletor ?? {
      nome: coletorDeExemplo.nome,
      regiao: coletorDeExemplo.regiao,
      telefone: null,
      codigo: coletorDeExemplo.codigo,
      exemplo: true,
    }
  );
}
