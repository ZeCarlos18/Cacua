/**
 * Textos da tela Conta do dia (S2.4). Os valores vêm do calcularLucroDoDia (calculos.js);
 * aqui só o que a tela mostra em volta deles.
 */

import { capitalizar, idDoDia, type Aviso } from '@/utils/agenda';

type Produtor = { id: number; nome: string; sitio: string; canal: string };

/** Acha o dia da agenda pelo id do endereço ("01-out" → quinta 01/out). */
export function diaPeloId<T extends { data: string }>(agenda: T[], id: string) {
  return agenda.find((dia) => idDoDia(dia.data) === id);
}

/** "Conta da quinta", "Conta do sábado". */
export function tituloDaConta(dia: string) {
  const artigo = ['Sábado', 'Domingo'].includes(dia) ? 'do' : 'da';
  return `Conta ${artigo} ${dia.toLowerCase()}`;
}

/** 0.8 → "80%". */
export function textoDaPorcentagem(fracao: number) {
  return `${Math.round(fracao * 100)}%`;
}

/** 18.696 → "18,7 km": a conta usa o km completo, a tela mostra uma casa. */
export function textoDoKm(km: number) {
  return `${km.toFixed(1).replace('.', ',')} km`;
}

/** Quanto cada caixa precisa render para cobrir os custos da rota (R$ 95,64 ÷ 47 = R$ 2,03). */
export function custoPorCaixa(custosRota: number, caixas: number) {
  return caixas > 0 ? custosRota / caixas : 0;
}

/** Um item por aviso do dia, com o nome, o sítio e o canal do produtor. */
export function quemAvisou(avisos: Aviso[], produtores: Produtor[]) {
  return avisos.map((aviso, posicao) => {
    const produtor = produtores.find((p) => p.id === aviso.produtor);
    return {
      // A posição entra na chave porque o mesmo produtor pode avisar a mesma fruta duas vezes no dia.
      chave: `${posicao}-${aviso.produtor}-${aviso.fruta}`,
      nome: produtor?.nome ?? 'Produtor sem cadastro',
      sitio: produtor?.sitio ?? '',
      canal: produtor?.canal ?? '',
      fruta: capitalizar(aviso.fruta),
      caixas: aviso.caixas,
    };
  });
}
