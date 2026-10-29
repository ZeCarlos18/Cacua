// Confere a próxima colheita de cada produtor (S3.5) com os textos do Figma.
// Rodar na raiz do projeto: npm run conferir

import { agenda, produtores } from '@/data/dados';
import { proximaColheita } from '@/utils/produtores';

const esperado: Record<string, string> = {
  'Seu Francisco': 'Goiaba prevista (pela poda)',
  'Seu Antônio': 'Qui, sex e sáb',
  'Dona Maria': 'Quinta · 20 cx de manga',
  'Dona Lúcia': 'Qua e qui',
  'Seu Raimundo': 'Quarta · 10 cx de banana',
  'Seu Pedro': 'Sexta · 12 cx de banana',
};

let falhas = 0;

for (const produtor of produtores) {
  const texto = proximaColheita(produtor, agenda);
  const ok = texto === esperado[produtor.nome];

  if (!ok) falhas++;
  console.log(`${ok ? 'OK   ' : 'FALHA'} ${produtor.nome} · ${texto ?? '(sem texto)'}`);
}

if (falhas > 0) {
  console.error(`\n${falhas} produtor(es) não batem com o Figma.`);
  process.exit(1);
}
console.log('\nA próxima colheita dos 6 produtores bate com o Figma.');
