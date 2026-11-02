/**
 * Regras do formulário "Registrar aviso" (S4.4): as escolhas, as caixas e quando o Salvar libera.
 * A tela só junta estas regras; o aviso entra na agenda pelo adicionarAviso (S4.1).
 */

import { capitalizar, type Aviso } from '@/utils/agenda';

/** "Qua 30/set": o dia abreviado e a data, como nos botões do formulário. */
export function rotuloDoDia(dia: { dia: string; data: string }) {
  return `${dia.dia.slice(0, 3)} ${dia.data}`;
}

/** As caixas digitadas: só inteiro maior que zero ("20" → 20; "0", "-3", "2,5" e "abc" → null). */
export function lerCaixas(texto: string) {
  const digitado = texto.trim();
  if (!/^\d+$/.test(digitado)) return null;
  const caixas = Number(digitado);
  return caixas > 0 ? caixas : null;
}

/** Os botões − e +: não descem de 1, e com o campo vazio o + começa em 1. */
export function caixasComPasso(caixas: number | null, passo: 1 | -1) {
  if (caixas === null) return passo === 1 ? 1 : null;
  return Math.max(1, caixas + passo);
}

/**
 * A fruta ao escolher (ou trocar) o produtor: continua se o novo produtor também tem; se ele tem
 * uma fruta só (Dona Maria: manga), ela já vem marcada; senão, fica sem fruta.
 */
export function frutaAoTrocarProdutor(fruta: string | null, produtor: { frutas: string[] }) {
  if (fruta && produtor.frutas.includes(fruta)) return fruta;
  return produtor.frutas.length === 1 ? produtor.frutas[0] : null;
}

/** "Coco ainda não tem preço do Ceasa: ...", ou null se a fruta tem preço (ou não foi escolhida). */
export function avisoSemPreco(fruta: string | null, precos: Record<string, unknown>) {
  if (!fruta || precos[fruta]) return null;
  return `${capitalizar(fruta)} ainda não tem preço do Ceasa: entra na agenda, mas não soma no lucro.`;
}

type Escolhas = {
  data: string | null;
  produtor: number | null;
  fruta: string | null;
  caixas: number | null;
};

/** O aviso pronto para o adicionarAviso, ou null enquanto falta algo (o Salvar fica desligado). */
export function avisoPronto({ data, produtor, fruta, caixas }: Escolhas) {
  if (!data || produtor === null || !fruta || caixas === null) return null;
  const aviso: Aviso = { produtor, fruta, caixas };
  return { data, aviso };
}
