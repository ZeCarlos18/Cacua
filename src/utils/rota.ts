/**
 * Rota do dia (S3.1): a ordem das paradas e os km de ida e volta, pelo "melhor caminho" do pitch.
 *
 * Sai do posto, vai sempre para o sítio mais perto que ainda não visitou e, no fim, volta para o
 * posto (vizinho mais próximo). A distância é a soma das retas entre os pontos do mapa
 * ilustrativo, × 0,02 km. O km sai com o valor completo; só a tela arredonda (18,7 km).
 */

import { capitalizar, type Aviso } from '@/utils/agenda';

/** Cada unidade do mapa ilustrativo vale 0,02 km. */
const KM_POR_UNIDADE = 0.02;

type Posicao = { x: number; y: number };
type Produtor = { id: number; nome: string; sitio: string; posicao?: Posicao };
type DiaComAvisos = { avisos: Aviso[] };

export type Parada = {
  /** Ordem de visita, começando em 1. */
  numero: number;
  /** Id do produtor no dados.js (o mesmo de `rota.coletados`). */
  id: number;
  produtor: string;
  sitio: string;
  /** "Manga", ou "Goiaba, Manga" quando o produtor avisou mais de uma fruta. */
  fruta: string;
  caixas: number;
  posicao: Posicao;
};

type ParadaSemNumero = Omit<Parada, 'numero' | 'fruta'> & { frutas: string[] };

function distancia(a: Posicao, b: Posicao) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/**
 * Uma parada por sítio, na ordem dos avisos: os avisos do mesmo produtor se juntam (frutas sem
 * repetir, caixas somadas). Produtor sem cadastro ou sem posição fica de fora, em `semPosicao`.
 */
function paradasDoDia(avisos: Aviso[], produtores: Produtor[]) {
  const porProdutor = new Map<number, ParadaSemNumero>();
  const semPosicao: number[] = [];

  for (const aviso of avisos) {
    const produtor = produtores.find((p) => p.id === aviso.produtor);
    if (!produtor?.posicao) {
      if (!semPosicao.includes(aviso.produtor)) semPosicao.push(aviso.produtor);
      continue;
    }

    const fruta = capitalizar(aviso.fruta);
    const parada = porProdutor.get(produtor.id);
    if (parada) {
      if (!parada.frutas.includes(fruta)) parada.frutas.push(fruta);
      parada.caixas += aviso.caixas;
    } else {
      porProdutor.set(produtor.id, {
        id: produtor.id,
        produtor: produtor.nome,
        sitio: produtor.sitio,
        frutas: [fruta],
        caixas: aviso.caixas,
        posicao: produtor.posicao,
      });
    }
  }

  return { pendentes: [...porProdutor.values()], semPosicao };
}

/**
 * Monta a rota do dia: `paradas` na ordem de visita, `km` da ida e volta e `semPosicao` com os ids
 * dos produtores que ficaram de fora.
 */
export function montarRota(dia: DiaComAvisos, produtores: Produtor[], posto: Posicao) {
  const { pendentes, semPosicao } = paradasDoDia(dia.avisos, produtores);
  const paradas: Parada[] = [];
  let atual = posto;
  let unidades = 0;

  while (pendentes.length > 0) {
    // O mais perto de onde o coletor está; no empate, fica o que foi avisado primeiro.
    let maisPerto = 0;
    for (let i = 1; i < pendentes.length; i++) {
      if (distancia(atual, pendentes[i].posicao) < distancia(atual, pendentes[maisPerto].posicao)) {
        maisPerto = i;
      }
    }

    const [{ frutas, ...proxima }] = pendentes.splice(maisPerto, 1);
    unidades += distancia(atual, proxima.posicao);
    paradas.push({ numero: paradas.length + 1, ...proxima, fruta: frutas.join(', ') });
    atual = proxima.posicao;
  }

  unidades += distancia(atual, posto);
  return { paradas, km: unidades * KM_POR_UNIDADE, semPosicao };
}

/** O dia da agenda com o `km` da montarRota, para o calcularLucroDoDia e para a Conta. */
export function diaComKm<T extends DiaComAvisos>(dia: T, produtores: Produtor[], posto: Posicao) {
  return { ...dia, km: montarRota(dia, produtores, posto).km };
}
