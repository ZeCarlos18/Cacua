/**
 * SHA-256 em TypeScript puro (o algoritmo da FIPS 180-4), para o resumo da senha (S6.1) sem
 * biblioteca nativa: assim não precisa gerar o build de novo. Recebe um texto e devolve o resumo
 * em hexadecimal, igual ao do Node (`crypto.createHash('sha256').update(texto).digest('hex')`).
 */

/** As constantes da FIPS 180-4: a parte fracionária da raiz cúbica dos 64 primeiros primos. */
const K = new Uint32Array([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
]);

/** O valor inicial: a parte fracionária da raiz quadrada dos 8 primeiros primos. */
const INICIO = [
  0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
];

/** O texto em bytes UTF-8, como o Node faz ("ç" vira 2 bytes; metade de um emoji vira U+FFFD). */
function bytesUtf8(texto: string) {
  const bytes: number[] = [];
  for (const caractere of texto) {
    let c = caractere.codePointAt(0) ?? 0;
    if (c >= 0xd800 && c <= 0xdfff) c = 0xfffd;
    if (c < 0x80) {
      bytes.push(c);
    } else if (c < 0x800) {
      bytes.push(0xc0 | (c >> 6), 0x80 | (c & 0x3f));
    } else if (c < 0x10000) {
      bytes.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 0x3f), 0x80 | (c & 0x3f));
    } else {
      bytes.push(0xf0 | (c >> 18), 0x80 | ((c >> 12) & 0x3f), 0x80 | ((c >> 6) & 0x3f), 0x80 | (c & 0x3f));
    }
  }
  return bytes;
}

/** Gira os 32 bits de x para a direita. */
function girar(x: number, n: number) {
  return (x >>> n) | (x << (32 - n));
}

/** O resumo SHA-256 do texto, em hexadecimal: sha256('abc') → 'ba7816bf...'. */
export function sha256(texto: string) {
  const bytes = bytesUtf8(texto);
  const bits = bytes.length * 8;

  // Completa até sobrar 8 bytes no bloco de 64 e termina com o tamanho em bits (64 bits).
  bytes.push(0x80);
  while (bytes.length % 64 !== 56) bytes.push(0);
  for (const parte of [Math.floor(bits / 0x100000000), bits >>> 0]) {
    bytes.push((parte >>> 24) & 0xff, (parte >>> 16) & 0xff, (parte >>> 8) & 0xff, parte & 0xff);
  }

  const h = new Uint32Array(INICIO);
  const w = new Uint32Array(64);

  for (let bloco = 0; bloco < bytes.length; bloco += 64) {
    for (let t = 0; t < 16; t++) {
      const i = bloco + t * 4;
      w[t] = (bytes[i] << 24) | (bytes[i + 1] << 16) | (bytes[i + 2] << 8) | bytes[i + 3];
    }
    for (let t = 16; t < 64; t++) {
      const s0 = girar(w[t - 15], 7) ^ girar(w[t - 15], 18) ^ (w[t - 15] >>> 3);
      const s1 = girar(w[t - 2], 17) ^ girar(w[t - 2], 19) ^ (w[t - 2] >>> 10);
      w[t] = w[t - 16] + s0 + w[t - 7] + s1; // o Uint32Array guarda só os 32 bits de baixo
    }

    let [a, b, c, d, e, f, g, hh] = h;
    for (let t = 0; t < 64; t++) {
      const soma1 = girar(e, 6) ^ girar(e, 11) ^ girar(e, 25);
      const escolha = (e & f) ^ (~e & g);
      const temp1 = (hh + soma1 + escolha + K[t] + w[t]) >>> 0;
      const soma0 = girar(a, 2) ^ girar(a, 13) ^ girar(a, 22);
      const maioria = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (soma0 + maioria) >>> 0;
      hh = g;
      g = f;
      f = e;
      e = (d + temp1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) >>> 0;
    }

    h[0] += a;
    h[1] += b;
    h[2] += c;
    h[3] += d;
    h[4] += e;
    h[5] += f;
    h[6] += g;
    h[7] += hh;
  }

  return Array.from(h, (parte) => parte.toString(16).padStart(8, '0')).join('');
}
