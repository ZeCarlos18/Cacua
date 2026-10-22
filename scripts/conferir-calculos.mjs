// Confere a conta do lucro (S1.6) com os números do Figma.
// Rodar na raiz do projeto: node --no-warnings scripts/conferir-calculos.mjs

import { agenda, custos, precos } from '../src/data/dados.js';
import { calcularLucroDoDia, formatarReais } from '../src/utils/calculos.js';

const esperado = {
  '30/set': { lucro: 30.3, selo: 'Vale com atenção' },
  '01/out': { lucro: 484.86, selo: 'Vale a pena', custosRota: 95.64 },
  '02/out': { lucro: 110.82, selo: 'Vale com atenção' },
  '03/out': { lucro: -9.66, selo: 'Não vale a pena' },
};

let falhas = 0;

for (const dia of agenda) {
  const conta = calcularLucroDoDia(dia, precos, custos);
  const alvo = esperado[dia.data];
  const ok =
    alvo &&
    conta.lucro === alvo.lucro &&
    conta.selo === alvo.selo &&
    (alvo.custosRota === undefined || conta.custosRota === alvo.custosRota);

  if (!ok) falhas++;
  console.log(
    `${ok ? 'OK   ' : 'FALHA'} ${dia.dia.slice(0, 3)} ${dia.data} · lucro ${formatarReais(conta.lucro)} · ` +
      `custos da rota ${formatarReais(conta.custosRota)} · ${conta.selo}`,
  );
}

if (falhas > 0) {
  console.error(`\n${falhas} dia(s) não batem com o Figma.`);
  process.exit(1);
}
console.log('\nOs 4 dias batem com o Figma.');
