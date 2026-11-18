/**
 * Regras do produtor novo (S7.1): os erros de cada campo do formulário e o produtor que entra na
 * lista. Desde o S9.1, também as do editar e do apagar. Funções puras; quem guarda é o estado do app
 * (comProdutor, comProdutorEditado e semProdutor, em estado.ts).
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

/**
 * Os erros de cada campo do produtor, ou null se está tudo certo. Com o `id` (editar, S9.1), o
 * próprio produtor não conta como repetido, e a fruta sem preço do Ceasa que ele já tinha (o coco
 * do Seu Pedro) continua valendo.
 */
export function errosDoProdutor(
  campos: CamposDoProdutor,
  produtores: Produtor[],
  id?: number,
): ErrosDoProdutor | null {
  const erros: ErrosDoProdutor = {};
  const atual = id === undefined ? undefined : produtores.find((produtor) => produtor.id === id);

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
        produtor.id !== id &&
        paraComparar(produtor.nome) === paraComparar(nome) &&
        paraComparar(produtor.sitio) === paraComparar(sitio),
    )
  ) {
    erros.nome = 'Esse produtor já está cadastrado nesse sítio.';
  }

  // O formulário só mostra as frutas com preço; uma fruta de fora conta como não ter escolhido. Ao
  // editar, a fruta sem preço que ele já tinha (que não aparece nas pílulas) conta como escolhida.
  const jaTinhaSemPreco = (atual?.frutas ?? []).some((fruta) => !FRUTAS_COM_PRECO.includes(fruta));
  if (
    (campos.frutas.length === 0 && !jaTinhaSemPreco) ||
    !campos.frutas.every((fruta) => FRUTAS_COM_PRECO.includes(fruta))
  ) {
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

/**
 * Os campos do formulário já preenchidos com o que o produtor tem (S9.1). A fruta sem preço do
 * Ceasa (o coco do Seu Pedro) não aparece nas pílulas, então fica de fora dos campos; o
 * produtorEditado a mantém.
 */
export function camposDoProdutor(produtor: Produtor): CamposDoProdutor {
  return {
    nome: produtor.nome,
    sitio: produtor.sitio,
    frutas: produtor.frutas.filter((fruta) => FRUTAS_COM_PRECO.includes(fruta)),
    canal: CANAIS.find((canal) => canal === produtor.canal) ?? null,
    posicao: produtor.posicao,
  };
}

/**
 * O produtor depois de editado (S9.1), a partir de campos já conferidos (sem erros). Troca nome,
 * sítio, frutas, canal e lugar no mapa, e mantém todo o resto: o id, os avisos cumpridos, a
 * previsão e o preço combinado (S9.2). A fruta sem preço do Ceasa que ele já tinha continua, no
 * fim da lista, mesmo sem aparecer nas pílulas.
 */
export function produtorEditado(produtor: Produtor, campos: CamposDoProdutor): Produtor {
  const frutasComPreco = FRUTAS_COM_PRECO.filter((fruta) => campos.frutas.includes(fruta));
  const frutasSemPreco = produtor.frutas.filter((fruta) => !FRUTAS_COM_PRECO.includes(fruta));
  return {
    ...produtor,
    nome: campos.nome.trim(),
    sitio: campos.sitio.trim(),
    frutas: [...frutasComPreco, ...frutasSemPreco],
    canal: campos.canal ?? produtor.canal,
    posicao: campos.posicao ?? produtor.posicao,
  };
}

/**
 * O nome com o artigo: "o Seu Antônio" e "a Dona Lúcia"; um nome sem Seu nem Dona (como "Rita") fica
 * sem artigo, para nunca errar o gênero. Com `noComeco`, a primeira letra do artigo é maiúscula.
 */
export function nomeComArtigo(nome: string, noComeco = false) {
  const artigo = /^seu\b/i.test(nome) ? 'o' : /^dona\b/i.test(nome) ? 'a' : null;
  if (!artigo) return nome;
  return `${noComeco ? artigo.toUpperCase() : artigo} ${nome}`;
}

/**
 * Por que o produtor não pode ser apagado (S9.1), ou null quando pode. Com aviso na agenda: "O Seu
 * Antônio tem 3 avisos na agenda. Tire os avisos antes de apagar." (com um só: "tem 1 aviso"). O
 * último produtor também não sai, para o app nunca ficar sem nenhum.
 */
export function motivoParaNaoApagar(
  estado: { produtores: Produtor[]; agenda: { avisos: { produtor: number }[] }[] },
  id: number,
) {
  const produtor = estado.produtores.find((item) => item.id === id);
  if (!produtor) return 'Esse produtor não está na lista.';

  const avisos = estado.agenda.reduce(
    (soma, dia) => soma + dia.avisos.filter((aviso) => aviso.produtor === id).length,
    0,
  );
  if (avisos > 0) {
    return `${nomeComArtigo(produtor.nome, true)} tem ${avisos} ${avisos === 1 ? 'aviso' : 'avisos'} na agenda. Tire os avisos antes de apagar.`;
  }
  if (estado.produtores.length <= 1) return 'É o único produtor. Cadastre outro antes de apagar.';
  return null;
}
