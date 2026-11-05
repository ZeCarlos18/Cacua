// Confere a próxima colheita de cada produtor (S3.5) com os textos do Figma, e os avisos cumpridos
// somando as coletas registradas no app (S5.6).
// Rodar na raiz do projeto: npm run conferir

import { agenda, produtores } from '@/data/dados';
import { comColeta, estadoInicial } from '@/state/estado';
import { historicoDoProdutor, proximaColheita } from '@/utils/produtores';

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

// Avisos cumpridos (S5.6)
function conferir(nome: string, ok: boolean) {
  if (!ok) falhas++;
  console.log(`${ok ? 'OK   ' : 'FALHA'} ${nome}`);
}

const inicio = estadoInicial();
const iniciais = inicio.coletas;

function cumpridos(nome: string, coletas: Record<string, number[]>) {
  const produtor = produtores.find((p) => p.nome === nome);
  if (!produtor) throw new Error(`${nome} não está no dados.js`);
  const { cumpridos: feitos, avisos } = historicoDoProdutor(produtor, coletas, iniciais);
  return `${feitos} de ${avisos}`;
}

const doFigma: Record<string, string> = {
  'Seu Francisco': '4 de 4',
  'Seu Antônio': '6 de 7',
  'Dona Maria': '3 de 3',
  'Dona Lúcia': '5 de 5',
  'Seu Raimundo': '2 de 3',
  'Seu Pedro': '4 de 4',
};
for (const [nome, esperadoCumpridos] of Object.entries(doFigma)) {
  conferir(`Sem mudanças: ${nome} ${esperadoCumpridos}`, cumpridos(nome, inicio.coletas) === esperadoCumpridos);
}

const comLucia = comColeta(inicio, '30/set', 4);
conferir('Coleta da Dona Lúcia na quarta: 6 de 6', cumpridos('Dona Lúcia', comLucia.coletas) === '6 de 6');
conferir('A coleta da Dona Lúcia não muda os outros: Seu Antônio 6 de 7', cumpridos('Seu Antônio', comLucia.coletas) === '6 de 7');
conferir('A Dona Maria na quinta (do dados.js) não conta de novo: 3 de 3', cumpridos('Dona Maria', comLucia.coletas) === '3 de 3');
conferir(
  'Seu Antônio coletado na quinta e na sexta: 8 de 9',
  cumpridos('Seu Antônio', comColeta(comColeta(inicio, '01/out', 2), '02/out', 2).coletas) === '8 de 9',
);
conferir('"Voltar aos valores do Figma": Dona Lúcia 5 de 5 de novo', cumpridos('Dona Lúcia', estadoInicial().coletas) === '5 de 5');

if (falhas > 0) {
  console.error(`\n${falhas} produtor(es) não batem com o Figma.`);
  process.exit(1);
}
console.log('\nA próxima colheita e os avisos cumpridos dos 6 produtores batem com o Figma.');
