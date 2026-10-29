/**
 * Contas do mapa ilustrativo da Rota (S3.4): onde cada ponto fica no quadro, em porcentagem.
 * As posições são as do S3.1 (dados.js). O quadro cobre todos os sítios e o posto, com uma
 * margem, para o mapa ficar igual em qualquer dia.
 */

type Posicao = { x: number; y: number };

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
