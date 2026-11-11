/**
 * Regras do produtor novo (S7.1): os erros de cada campo do formulário e o produtor que entra na
 * lista. Funções puras; quem guarda é o estado do app (comProdutor, em estado.ts).
 */

import { precos } from '@/data/dados';
import type { Produtor } from '@/state/estado';
import type { Posicao } from '@/utils/rota';
import { contarLetras, semAcento } from '@/utils/texto';

/** Como o produtor avisa a colheita: pelo WhatsApp do Caçuá ou pela ponto focal. */
export const CANAIS = ['WhatsApp', 'Ponto focal'] as const;
export type Canal = (typeof CANAIS)[number];

/** Só as frutas com preço do Ceasa, para o lucro do dia poder ser calculado. */
export const FRUTAS_COM_PRECO = Object.keys(precos);

export type CamposDoProdutor = {
  nome: string;
  sitio: string;
  frutas: string[];
  canal: Canal | null;
  /** O lugar marcado no mapa (posicaoDoToque), ou null se ainda não marcou. */
  posicao: Posicao | null;
};

/** Só os campos com erro; o texto aparece embaixo do campo (S7.4). */
export type ErrosDoProdutor = Partial<Record<keyof CamposDoProdutor, string>>;

/** "  Seu  ANTÔNIO " e "seu antonio" são o mesmo nome; "Pau d’Arco" e "Pau d'Arco", o mesmo sítio. */
function paraComparar(texto: string) {
  return semAcento(texto).toLowerCase().replace(/[’‘`´]/g, "'").replace(/\s+/g, ' ').trim();
}

const ehPonto = (posicao: Posicao | null): posicao is Posicao =>
  posicao !== null && Number.isFinite(posicao.x) && Number.isFinite(posicao.y);

/** Os erros de cada campo do produtor novo, ou null se está tudo certo. */
export function errosDoProdutor(campos: CamposDoProdutor, produtores: Produtor[]): ErrosDoProdutor | null {
  const erros: ErrosDoProdutor = {};

  const nome = campos.nome.trim();
  const sitio = campos.sitio.trim();
  if (!nome) erros.nome = 'Digite o nome do produtor.';
  else if (contarLetras(nome) < 2) erros.nome = 'O nome precisa ter pelo menos 2 letras.';

  if (!sitio) erros.sitio = 'Digite o nome do sítio.';

  if (
    !erros.nome &&
    !erros.sitio &&
    produtores.some(
      (produtor) =>
        paraComparar(produtor.nome) === paraComparar(nome) &&
        paraComparar(produtor.sitio) === paraComparar(sitio),
    )
  ) {
    erros.nome = 'Esse produtor já está cadastrado nesse sítio.';
  }

  // O formulário só mostra as frutas com preço; uma fruta de fora conta como não ter escolhido.
  if (campos.frutas.length === 0 || !campos.frutas.every((fruta) => FRUTAS_COM_PRECO.includes(fruta))) {
    erros.frutas = 'Escolha pelo menos uma fruta.';
  }

  if (!campos.canal || !CANAIS.includes(campos.canal)) erros.canal = 'Escolha como ele avisa.';

  if (!ehPonto(campos.posicao)) erros.posicao = 'Toque no mapa para marcar o sítio.';

  return Object.keys(erros).length > 0 ? erros : null;
}

/**
 * O produtor para entrar na lista, a partir de campos já conferidos (sem erros): 0 de 0 avisos
 * cumpridos e as frutas na ordem dos preços do Ceasa (goiaba, manga, maracujá, mamão, banana).
 */
export function novoProdutor(campos: CamposDoProdutor, id: number): Produtor {
  return {
    id,
    nome: campos.nome.trim(),
    sitio: campos.sitio.trim(),
    frutas: FRUTAS_COM_PRECO.filter((fruta) => campos.frutas.includes(fruta)),
    canal: campos.canal ?? 'WhatsApp',
    cumpridos: 0,
    avisos: 0,
    posicao: campos.posicao ?? { x: 0, y: 0 },
  };
}
