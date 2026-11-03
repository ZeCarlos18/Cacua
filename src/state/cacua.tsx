import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

import {
  comAviso,
  comColeta,
  comCustos,
  comPreco,
  estadoInicial,
  type Custos,
  type EstadoCacua,
} from '@/state/estado';
import { apagarEstadoSalvo, carregarEstado, salvarEstado } from '@/state/salvo';
import type { Aviso } from '@/utils/agenda';

type ValorCacua = EstadoCacua & {
  /** Coloca o aviso no dia (ex.: '30/set'). */
  adicionarAviso: (data: string, aviso: Aviso) => void;
  /** Muda só os campos enviados (ex.: { diesel: 7.5 }). */
  atualizarCustos: (mudancas: Partial<Custos>) => void;
  /** Muda o preço da caixa (ex.: 'banana', 50). */
  atualizarPreco: (fruta: string, preco: number) => void;
  /** Marca a coleta pelo id do produtor. */
  registrarColeta: (produtor: number) => void;
  /** Volta tudo para os valores do dados.js e apaga o que foi salvo no celular. */
  restaurarPadrao: () => void;
};

const CacuaContext = createContext<ValorCacua | null>(null);

type CacuaProviderProps = {
  children: ReactNode;
};

/**
 * Estado compartilhado do app (S4.1): agenda, custos, preços e coletas. Uma mudança aqui já
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
    adicionarAviso: (data, aviso) => setEstado((atual) => comAviso(atual, data, aviso)),
    atualizarCustos: (mudancas) => setEstado((atual) => comCustos(atual, mudancas)),
    atualizarPreco: (fruta, preco) => setEstado((atual) => comPreco(atual, fruta, preco)),
    registrarColeta: (produtor) => setEstado((atual) => comColeta(atual, produtor)),
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
