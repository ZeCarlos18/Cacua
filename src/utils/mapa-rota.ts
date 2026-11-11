/**
 * Contas do mapa ilustrativo da Rota (S3.4): onde cada ponto fica no quadro, em porcentagem.
 * As posições são as do S3.1 (dados.js). O quadro cobre todos os sítios e o posto, com uma
 * margem, para o mapa ficar igual em qualquer dia.
 */

import type { Posicao } from '@/utils/rota';

/** Folga entre os pontos da borda e a borda do mapa, em unidades do mapa. */
const MARGEM = 20;

export type AreaDoMapa = { x: number; y: number; largura: number; altura: number };

/** A área do quadro: todos os sítios e o posto, com a margem (x 16–320, y 44–416 hoje). */
export function areaDoMapa(posto: Posicao, produtores: { posicao?: Posicao }[]): AreaDoMapa {
  const pontos = [posto, ...produtores.flatMap((produtor) => produtor.posicao ?? [])];
  const xs = pontos.map((ponto) => ponto.x);
  const ys = pontos.map((ponto) => ponto.y);
  const x = Math.min(...xs) - MARGEM;
  const y = Math.min(...ys) - MARGEM;

  return {
    x,
    y,
    largura: Math.max(...xs) + MARGEM - x,
    altura: Math.max(...ys) + MARGEM - y,
  };
}

/** Onde o ponto fica no quadro, em porcentagem da largura (esquerda) e da altura (topo). */
export function posicaoNoMapa(ponto: Posicao, area: AreaDoMapa) {
  return {
    esquerda: ((ponto.x - area.x) / area.largura) * 100,
    topo: ((ponto.y - area.y) / area.altura) * 100,
  };
}

/**
 * O contrário da posicaoNoMapa (S7.1): onde o dedo tocou no quadro, em pixels, vira o ponto do
 * mapa ilustrativo, arredondado e sem sair da área. Quadro de 304 × 372 px, toque em (152, 186) →
 * (168, 230); toque fora, em (−10, −10) → (16, 44), na borda.
 */
export function posicaoDoToque(
  toque: { x: number; y: number },
  tamanho: { largura: number; altura: number },
  area: AreaDoMapa,
): Posicao {
  // De 0 a 1 dentro do quadro. Quadro ainda sem tamanho (antes do onLayout) não divide por zero.
  const proporcao = (valor: number, total: number) =>
    total > 0 ? Math.min(Math.max(valor / total, 0), 1) : 0;
  return {
    x: Math.round(area.x + proporcao(toque.x, tamanho.largura) * area.largura),
    y: Math.round(area.y + proporcao(toque.y, tamanho.altura) * area.altura),
  };
}

/** O nome vai à direita do círculo, ou à esquerda quando o ponto está na metade direita do mapa. */
export function ladoDoNome(ponto: Posicao, area: AreaDoMapa) {
  return posicaoNoMapa(ponto, area).esquerda > 50 ? 'esquerda' : 'direita';
}

/** "Sítio Riacho Verde" → "Riacho Verde". */
export function nomeCurto(sitio: string) {
  return sitio.replace(/^Sítio\s+/, '');
}

/**
 * "Mapa ilustrativo da rota: posto, 1 Riacho Verde, coletada, 2 Pau d'Arco, 3 Olho d'Água":
 * a frase do leitor de tela, com as paradas já coletadas marcadas.
 */
export function descricaoDoMapa(
  paradas: { id: number; numero: number; sitio: string }[],
  coletados: number[],
) {
  const pontos = paradas.map((parada) => {
    const nome = `${parada.numero} ${nomeCurto(parada.sitio)}`;
    return coletados.includes(parada.id) ? `${nome}, coletada` : nome;
  });
  return ['Mapa ilustrativo da rota: posto', ...pontos].join(', ');
}
