/**
 * Contas de texto que a conta do coletor (S6.1) e o produtor novo (S7.1) usam: tirar os acentos e
 * contar as letras de um nome.
 */

const SEM_ACENTO: Record<string, string> = {
  á: 'a', à: 'a', â: 'a', ã: 'a', ä: 'a', é: 'e', è: 'e', ê: 'e', ë: 'e', í: 'i', ì: 'i', î: 'i',
  ï: 'i', ó: 'o', ò: 'o', ô: 'o', õ: 'o', ö: 'o', ú: 'u', ù: 'u', û: 'u', ü: 'u', ç: 'c', ñ: 'n',
};

/** "José" → "Jose". Sem o normalize, que nem todo motor de JavaScript do celular tem. */
export function semAcento(texto: string) {
  return [...texto]
    .map((letra) => {
      const minuscula = letra.toLowerCase();
      const trocada = SEM_ACENTO[minuscula];
      if (!trocada) return letra;
      return letra === minuscula ? trocada : trocada.toUpperCase();
    })
    .join('');
}

/** Quantas letras de A a Z o texto tem, com ou sem acento: "1 Ana" → 3. */
export function contarLetras(texto: string) {
  return (semAcento(texto).match(/[a-z]/gi) ?? []).length;
}
