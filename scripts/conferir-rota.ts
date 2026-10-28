// Confere a montarRota (S3.1) com a ordem e os km do cartão no Trello.
// Rodar na raiz do projeto: npm run conferir

import { agenda, posto, produtores } from '@/data/dados';
import { montarRota } from '@/utils/rota';

const esperado: Record<string, { ordem: string[]; km: number }> = {
  '30/set': { ordem: ["Sítio Olho d'Água", 'Sítio Baixio'], km: 16.556 },
  '01/out': { ordem: ['Sítio Riacho Verde', "Sítio Pau d'Arco", "Sítio Olho d'Água"], km: 18.696 },
  '02/out': { ordem: ['Sítio Cajueiro', "Sítio Pau d'Arco"], km: 15.155 },
  '03/out': { ordem: ["Sítio Pau d'Arco"], km: 15.068 },
};

let falhas = 0;

for (const dia of agenda) {
  const { paradas, km } = montarRota(dia, produtores, posto);
  const alvo = esperado[dia.data];
  const ordem = paradas.map((parada) => parada.sitio);
  const ok =
    alvo !== undefined &&
    ordem.join(' → ') === alvo.ordem.join(' → ') &&
    km.toFixed(3) === alvo.km.toFixed(3);

  if (!ok) falhas++;
  console.log(
    `${ok ? 'OK   ' : 'FALHA'} ${dia.dia.slice(0, 3)} ${dia.data} · ${ordem.join(' → ')} · ` +
      `${km.toFixed(3).replace('.', ',')} km`,
  );
}

if (falhas > 0) {
  console.error(`\n${falhas} dia(s) não batem com o cartão.`);
  process.exit(1);
}
console.log('\nA ordem e os km dos 4 dias batem com o cartão.');
