import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

import {
  comAviso,
  comCaixasDoAviso,
  comColeta,
  comConfirmacao,
  comCustos,
  comPreco,
  comProdutor,
  estadoInicial,
  semAviso,
  semColeta,
  semConfirmacao,
  type Custos,
  type EstadoCacua,
} from '@/state/estado';
import { apagarEstadoSalvo, carregarEstado, salvarEstado } from '@/state/salvo';
import type { Aviso } from '@/utils/agenda';
import type { CaixasPorFruta } from '@/utils/coleta';
import { errosDoProdutor, type CamposDoProdutor, type ErrosDoProdutor } from '@/utils/novo-produtor';

type ValorCacua = EstadoCacua & {
  /** Cadastra o produtor novo (S7.1). Devolve os erros de cada campo, ou null se deu certo. */
  adicionarProdutor: (campos: CamposDoProdutor) => ErrosDoProdutor | null;
  /** Coloca o aviso no dia (ex.: '30/set'). */
  adicionarAviso: (data: string, aviso: Aviso) => void;
  /**
   * Troca as caixas do aviso da posição no dia (S7.2), ex.: ('03/out', 0, 15, aviso). Com o aviso
   * que a tela mostrou, só muda se ele ainda estiver nessa posição.
   */
  mudarCaixasDoAviso: (data: string, posicao: number, caixas: number, esperado?: Aviso) => void;
  /**
   * Tira o aviso da posição no dia (S7.2); o dia continua na agenda. Com o aviso que a tela
   * mostrou, dois toques seguidos não tiram o aviso que subiu para a posição.
   */
  tirarAviso: (data: string, posicao: number, esperado?: Aviso) => void;
  /** Muda só os campos enviados (ex.: { diesel: 7.5 }). */
  atualizarCustos: (mudancas: Partial<Custos>) => void;
  /** Muda o preço da caixa (ex.: 'banana', 50). */
  atualizarPreco: (fruta: string, preco: number) => void;
  /**
   * Marca a coleta do produtor no dia (ex.: '30/set', 4). Desde o S7.3, com as caixas que vieram de
   * cada fruta ('01/out', 2, { goiaba: 10 }); sem elas, vale o que foi avisado.
   */
  registrarColeta: (data: string, produtor: number, caixas?: CaixasPorFruta) => void;
  /** Desfaz a coleta registrada por engano (S7.3). Em dia confirmado, nada muda. */
  desfazerColeta: (data: string, produtor: number) => void;
  /** Confirma a coleta do dia (ex.: '30/set'). */
  confirmarDia: (data: string) => void;
  /** Desfaz a confirmação do dia. */
  desfazerConfirmacao: (data: string) => void;
  /** Volta tudo para os valores do dados.js e apaga o que foi salvo no celular. */
  restaurarPadrao: () => void;
};

const CacuaContext = createContext<ValorCacua | null>(null);

type CacuaProviderProps = {
  children: ReactNode;
};

/**
 * Estado compartilhado do app (S4.1): agenda, produtores (S7.1), custos, preços e coletas. Uma mudança aqui já
 * recalcula as telas que leem pelo useCacua(). Desde o S4.5, ele fica salvo no celular: ao abrir,
 * o app carrega o que foi salvo (ou o dados.js, se não houver nada) e salva a cada mudança.
 */
export function CacuaProvider({ children }: CacuaProviderProps) {
  const [estado, setEstado] = useState(estadoInicial);
  const [carregado, setCarregado] = useState(false);
  // O estado do dados.js não vai para o celular: nem ao abrir sem nada salvo, nem depois do
  // restaurarPadrao, que apaga o salvo.
  const naoSalvar = useRef(estado);

  useEffect(() => {
    let ativo = true;
    carregarEstado().then((salvo) => {
      if (!ativo) return;
      if (salvo) setEstado(salvo);
      setCarregado(true);
    });
    return () => {
      ativo = false;
    };
  }, []);

  useEffect(() => {
    if (!carregado || estado === naoSalvar.current) return;
    salvarEstado(estado);
  }, [estado, carregado]);

  // Enquanto lê o celular, as telas esperam: assim não piscam com os valores do dados.js, e
  // nenhuma mudança feita nesse instante é trocada pelo que foi salvo.
  if (!carregado) return null;

  const valor: ValorCacua = {
    ...estado,
    adicionarProdutor: (campos) => {
      const erros = errosDoProdutor(campos, estado.produtores);
      if (!erros) setEstado((atual) => comProdutor(atual, campos));
      return erros;
    },
    adicionarAviso: (data, aviso) => setEstado((atual) => comAviso(atual, data, aviso)),
    mudarCaixasDoAviso: (data, posicao, caixas, esperado) =>
      setEstado((atual) => comCaixasDoAviso(atual, data, posicao, caixas, esperado)),
    tirarAviso: (data, posicao, esperado) => setEstado((atual) => semAviso(atual, data, posicao, esperado)),
    atualizarCustos: (mudancas) => setEstado((atual) => comCustos(atual, mudancas)),
    atualizarPreco: (fruta, preco) => setEstado((atual) => comPreco(atual, fruta, preco)),
    registrarColeta: (data, produtor, caixas) => setEstado((atual) => comColeta(atual, data, produtor, caixas)),
    desfazerColeta: (data, produtor) => setEstado((atual) => semColeta(atual, data, produtor)),
    confirmarDia: (data) => setEstado((atual) => comConfirmacao(atual, data)),
    desfazerConfirmacao: (data) => setEstado((atual) => semConfirmacao(atual, data)),
    restaurarPadrao: () => {
      const padrao = estadoInicial();
      naoSalvar.current = padrao;
      setEstado(padrao);
      apagarEstadoSalvo();
    },
  };

  return <CacuaContext.Provider value={valor}>{children}</CacuaContext.Provider>;
}

/** Os dados e as funções do estado compartilhado. Precisa estar dentro do CacuaProvider. */
export function useCacua() {
  const valor = useContext(CacuaContext);
  if (!valor) throw new Error('useCacua precisa estar dentro do CacuaProvider');
  return valor;
}
