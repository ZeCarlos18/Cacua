import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

import {
  cadastroQueConfere,
  cadastrosDoSalvo,
  coletorDaSessao,
  coletorDeExemplo,
  errosDoCadastro,
  novoCadastro,
  novoSal,
  sessaoDoSalvo,
  type Cadastro,
  type CamposDoCadastro,
  type Coletor,
  type ErrosDoCadastro,
  type Sessao,
} from '@/state/acesso-regras';

/** Onde ficam as contas e quem entrou, no Async Storage (na web, no localStorage). */
const CHAVE_CADASTROS = 'cacua:cadastros:v1';
const CHAVE_SESSAO = 'cacua:sessao:v1';

type ValorAcesso = {
  /** Quem entrou, ou null. */
  coletor: Coletor | null;
  /** Os erros de cada campo, ou null se deu certo (e já entra). */
  cadastrar: (campos: CamposDoCadastro) => ErrosDoCadastro | null;
  /** Entra com o telefone e a senha; devolve false se não confere. */
  entrar: (telefone: string, senha: string) => boolean;
  /** Entra como o Edson do dados.js, sem cadastro. */
  entrarComExemplo: () => void;
  /** Sai. A agenda, as coletas e os custos continuam salvos. */
  sair: () => void;
};

const AcessoContext = createContext<ValorAcesso | null>(null);

async function guardar(chave: string, valor: unknown) {
  try {
    if (valor === null) await AsyncStorage.removeItem(chave);
    else await AsyncStorage.setItem(chave, JSON.stringify(valor));
  } catch (erro) {
    console.warn('Não deu para guardar a conta no celular:', erro);
  }
}

type AcessoProviderProps = {
  children: ReactNode;
};

/**
 * Conta do coletor (S6.1): os cadastros e quem entrou, guardados no celular. É o protótipo, sem
 * servidor, mas a senha nunca é guardada: só o resumo dela. Sem ninguém dentro, o _layout mostra
 * só Entrar e Criar conta (S6.4).
 */
export function AcessoProvider({ children }: AcessoProviderProps) {
  const [cadastros, setCadastros] = useState<Cadastro[]>([]);
  const [sessao, setSessao] = useState<Sessao | null>(null);
  const [carregado, setCarregado] = useState(false);
  // O cadastrar confere o telefone repetido na hora, então lê a lista mais nova por aqui.
  const cadastrosAtuais = useRef<Cadastro[]>([]);

  useEffect(() => {
    let ativo = true;
    Promise.all([AsyncStorage.getItem(CHAVE_CADASTROS), AsyncStorage.getItem(CHAVE_SESSAO)])
      .then(([textoDosCadastros, textoDaSessao]) => {
        if (!ativo) return;
        const lidos = cadastrosDoSalvo(textoDosCadastros);
        cadastrosAtuais.current = lidos;
        setCadastros(lidos);
        setSessao(sessaoDoSalvo(textoDaSessao));
      })
      .catch(() => {
        // Sem ler o celular, ninguém entrou.
      })
      .finally(() => {
        if (ativo) setCarregado(true);
      });
    return () => {
      ativo = false;
    };
  }, []);

  // Enquanto lê o celular, as telas esperam: assim a tela Entrar não pisca para quem já entrou.
  if (!carregado) return null;

  function entrarCom(nova: Sessao) {
    setSessao(nova);
    guardar(CHAVE_SESSAO, nova);
  }

  const valor: ValorAcesso = {
    coletor: coletorDaSessao(sessao, cadastros),
    cadastrar: (campos) => {
      const erros = errosDoCadastro(campos, cadastrosAtuais.current);
      if (erros) return erros;

      const cadastro = novoCadastro(campos, novoSal());
      const novos = [...cadastrosAtuais.current, cadastro];
      cadastrosAtuais.current = novos;
      setCadastros(novos);
      guardar(CHAVE_CADASTROS, novos);
      entrarCom({ telefone: cadastro.telefone });
      return null;
    },
    entrar: (telefone, senha) => {
      const cadastro = cadastroQueConfere(telefone, senha, cadastrosAtuais.current);
      if (!cadastro) return false;
      entrarCom({ telefone: cadastro.telefone });
      return true;
    },
    entrarComExemplo: () => entrarCom({ exemplo: true }),
    sair: () => {
      setSessao(null);
      guardar(CHAVE_SESSAO, null);
    },
  };

  return <AcessoContext.Provider value={valor}>{children}</AcessoContext.Provider>;
}

/** A conta do coletor: quem entrou e as funções de entrar e sair. Precisa estar dentro do AcessoProvider. */
export function useAcesso() {
  const valor = useContext(AcessoContext);
  if (!valor) throw new Error('useAcesso precisa estar dentro do AcessoProvider');
  return valor;
}

/**
 * Quem entrou, para o topo, o recibo e o convite. Essas telas só abrem depois de entrar; se
 * ninguém entrou, devolve o Edson do dados.js.
 */
export function useColetor() {
  return useAcesso().coletor ?? coletorDeExemplo();
}
