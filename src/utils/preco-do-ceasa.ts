/**
 * A data do preço do Ceasa (S8.1): quando cada preço foi atualizado e quais estão antigos. As
 * datas são texto 'AAAA-MM-DD', e as funções recebem o `hoje` no mesmo formato, para o teste poder
 * fixar o dia. As cotações das Ceasas saem todo dia ou toda semana, então mais de 7 dias é antigo.
 */

/** Com mais dias que isso desde a atualização, o preço é antigo. */
const DIAS_ATE_FICAR_ANTIGO = 7;

const DIA_EM_MS = 24 * 60 * 60 * 1000;

/** A data 'AAAA-MM-DD' como número de dias, pelo calendário (sem fuso e sem horário de verão). */
function diaDoCalendario(data: string) {
  const [ano, mes, dia] = data.split('-').map(Number);
  return Date.UTC(ano, mes - 1, dia) / DIA_EM_MS;
}

/** O texto é uma data 'AAAA-MM-DD' que existe (2026-02-31 não existe). */
export function ehDataValida(data: unknown): data is string {
  if (typeof data !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(data)) return false;
  const [ano, mes, dia] = data.split('-').map(Number);
  const montada = new Date(Date.UTC(ano, mes - 1, dia));
  return montada.getUTCFullYear() === ano && montada.getUTCMonth() === mes - 1 && montada.getUTCDate() === dia;
}

/**
 * O dia de hoje no celular, em 'AAAA-MM-DD'. Usa o dia local (getFullYear, getMonth, getDate), e
 * não o toISOString(), que usa o horário UTC e já vira o dia seguinte depois das 21h no Brasil.
 */
export function hojeNoCelular(agora = new Date()) {
  const doisDigitos = (numero: number) => String(numero).padStart(2, '0');
  return `${agora.getFullYear()}-${doisDigitos(agora.getMonth() + 1)}-${doisDigitos(agora.getDate())}`;
}

/**
 * Quantos dias passaram de `data` até `hoje`, pelo calendário: de 22/09 a 13/11, 52 dias. Uma
 * data depois de hoje (o relógio do celular foi atrasado) conta como hoje: 0.
 */
export function diasDesde(data: string, hoje: string) {
  return Math.max(0, Math.round(diaDoCalendario(hoje) - diaDoCalendario(data)));
}

/** "atualizado hoje", "atualizado ontem" ou "atualizado há 5 dias". */
export function textoDaDataDoPreco(data: string, hoje: string) {
  const dias = diasDesde(data, hoje);
  if (dias === 0) return 'atualizado hoje';
  if (dias === 1) return 'atualizado ontem';
  return `atualizado há ${dias} dias`;
}

/** '2026-11-13' → "13/11", para o recibo e o extrato. */
export function dataCurta(data: string) {
  const [, mes, dia] = data.split('-');
  return `${dia}/${mes}`;
}

/** O preço tem mais de 7 dias: de 05/11 a 13/11 (8 dias) é antigo; de 06/11 (7 dias), ainda não. */
export function precoAntigo(data: string, hoje: string) {
  return diasDesde(data, hoje) > DIAS_ATE_FICAR_ANTIGO;
}

/** As frutas com o preço antigo, na ordem de `precos`. */
export function frutasComPrecoAntigo(precos: Record<string, { data: string }>, hoje: string) {
  return Object.entries(precos)
    .filter(([, { data }]) => precoAntigo(data, hoje))
    .map(([fruta]) => fruta);
}
