/**
 * Campos da aba Custos (S4.3): o que aparece no campo e o que vai para o estado. Na tela as
 * porcentagens são 80 e 5; no estado, 0,8 e 0,05.
 */

import { textoDaPorcentagem } from '@/utils/conta';

export type Unidade = 'reais' | 'porcentagem' | 'kmPorLitro';

/** O valor do estado no campo: 6.97 → "6,97", 70 → "70,00", 0.8 → "80", 8 → "8". */
export function textoDoCampo(valor: number, unidade: Unidade) {
  if (unidade === 'porcentagem') return textoDaPorcentagem(valor).slice(0, -1);
  const texto = unidade === 'reais' ? valor.toFixed(2) : String(valor);
  return texto.replace('.', ',');
}

/**
 * O que foi digitado, no valor do estado ("7,50" → 7.5, "80" em porcentagem → 0.8), com até duas
 * casas. Valor vazio, negativo ou que não é número devolve null, e o campo volta para o anterior.
 * O consumo também não pode ser zero: a conta do diesel divide por ele.
 */
export function lerCampo(texto: string, unidade: Unidade) {
  const digitado = texto.trim().replace(',', '.');
  if (!/^(\d+\.?\d*|\.\d+)$/.test(digitado)) return null;

  const numero = Math.round(Number(digitado) * 100) / 100;
  if (unidade === 'kmPorLitro' && numero === 0) return null;
  return unidade === 'porcentagem' ? numero / 100 : numero;
}
