/**
 * Regras do formulário "Registrar aviso" (S4.4): as escolhas, as caixas e quando o Salvar libera.
 * A tela só junta estas regras; o aviso entra na agenda pelo adicionarAviso (S4.1).
 */

import type { EstadoCacua } from '@/state/estado';
import { capitalizar, type Aviso } from '@/utils/agenda';

/** "Qua 30/set": o dia abreviado e a data, como nos botões do formulário. */
export function rotuloDoDia(dia: { dia: string; data: string }) {
  return `${dia.dia.slice(0, 3)} ${dia.data}`;
}

/** Caixas que valem num aviso: inteiro maior que zero (20 vale; 0, -3 e 2,5 não). */
export function caixasValem(caixas: number) {
  return Number.isInteger(caixas) && caixas > 0;
}

/** As caixas digitadas: só inteiro maior que zero ("20" → 20; "0", "-3", "2,5" e "abc" → null). */
export function lerCaixas(texto: string) {
  const digitado = texto.trim();
  if (!/^\d+$/.test(digitado)) return null;
  const caixas = Number(digitado);
  return caixasValem(caixas) ? caixas : null;
}

/**
 * Por que o aviso não pode mudar nem sair da agenda (S7.2), ou null quando pode. O aviso é achado
 * pela posição na lista do dia (0, 1, 2…), a mesma ordem do "Quem avisou" da Conta.
 */
export function motivoParaNaoMudar(estado: EstadoCacua, data: string, posicao: number) {
  const aviso = estado.agenda.find((dia) => dia.data === data)?.avisos[posicao];
  if (!aviso) return 'Esse aviso não está na agenda.';
  if (estado.confirmados.includes(data)) {
    return 'Dia confirmado. Desfaça a confirmação para mudar os avisos.';
  }
  if ((estado.coletas[data] ?? []).includes(aviso.produtor)) {
    return 'Já coletado. Desfaça a coleta na Rota para mudar.';
  }
  return null;
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
