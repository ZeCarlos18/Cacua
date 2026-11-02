import { createContext, useContext, useState, type ReactNode } from 'react';

import {
  comAviso,
  comColeta,
  comCustos,
  comPreco,
  estadoInicial,
  type Custos,
  type EstadoCacua,
} from '@/state/estado';
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
  /** Volta tudo para os valores do dados.js. */
  restaurarPadrao: () => void;
};

const CacuaContext = createContext<ValorCacua | null>(null);

type CacuaProviderProps = {
  children: ReactNode;
};

/**
 * Estado compartilhado do app (S4.1): agenda, custos, preços e coletas. Uma mudança aqui já
 * recalcula as telas que leem pelo useCacua(). Ao fechar o app, volta ao dados.js.
 */
export function CacuaProvider({ children }: CacuaProviderProps) {
  const [estado, setEstado] = useState(estadoInicial);

  const valor: ValorCacua = {
    ...estado,
    adicionarAviso: (data, aviso) => setEstado((atual) => comAviso(atual, data, aviso)),
    atualizarCustos: (mudancas) => setEstado((atual) => comCustos(atual, mudancas)),
    atualizarPreco: (fruta, preco) => setEstado((atual) => comPreco(atual, fruta, preco)),
    registrarColeta: (produtor) => setEstado((atual) => comColeta(atual, produtor)),
    restaurarPadrao: () => setEstado(estadoInicial()),
  };

  return <CacuaContext.Provider value={valor}>{children}</CacuaContext.Provider>;
}

/** Os dados e as funções do estado compartilhado. Precisa estar dentro do CacuaProvider. */
export function useCacua() {
  const valor = useContext(CacuaContext);
  if (!valor) throw new Error('useCacua precisa estar dentro do CacuaProvider');
  return valor;
}
