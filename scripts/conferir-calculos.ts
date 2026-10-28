// Confere a conta do lucro (S1.6) com os números do Figma, usando o km da montarRota (S3.1).
// Rodar na raiz do projeto: npm run conferir

import { agenda, custos, posto, precos, produtores } from '@/data/dados';
import { calcularLucroDoDia, formatarReais } from '@/utils/calculos';
import { diaComKm } from '@/utils/rota';

const esperado: Record<string, { lucro: number; selo: string; custosRota?: number }> = {
  '30/set': { lucro: 30.3, selo: 'Vale com atenção' },
  '01/out': { lucro: 484.86, selo: 'Vale a pena', custosRota: 95.64 },
  '02/out': { lucro: 110.82, selo: 'Vale com atenção' },
  '03/out': { lucro: -9.66, selo: 'Não vale a pena' },
};

let falhas = 0;

for (const dia of agenda) {
  const conta = calcularLucroDoDia(diaComKm(dia, produtores, posto), precos, custos);
  const alvo = esperado[dia.data];
  const ok =
    alvo !== undefined &&
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
