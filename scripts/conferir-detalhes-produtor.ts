// Confere as contas da tela de detalhes do produtor: a distância do posto, a taxa de avisos
// cumpridos e os avisos da semana, com o valor que o coletor paga e a situação de cada um.
// Rodar na raiz do projeto: npm run conferir

import { posto, produtores } from '@/data/dados';
import { comColeta, comConfirmacao, estadoInicial } from '@/state/estado';
import { formatarReais } from '@/utils/calculos';
import { textoDoKm } from '@/utils/conta';
import {
  avisosDoProdutor,
  comoAvisa,
  historicoDoProdutor,
  taxaDeCumprimento,
  textoDasFrutasDoProdutor,
  totalDosAvisos,
} from '@/utils/produtores';
import { kmEntre } from '@/utils/rota';

let falhas = 0;

function conferir(nome: string, ok: boolean) {
  if (!ok) falhas++;
  console.log(`${ok ? 'OK   ' : 'FALHA'} ${nome}`);
}

function produtor(nome: string) {
  const achado = produtores.find((p) => p.nome === nome);
  if (!achado) throw new Error(`${nome} não está no dados.js`);
  return achado;
}

const inicio = estadoInicial();

function avisos(nome: string, estado = inicio) {
  return avisosDoProdutor(
    produtor(nome),
    estado.agenda,
    estado.precos,
    estado.custos.pagoProdutor,
    estado.coletas,
    estado.confirmados,
  );
}

// Distância do posto, em linha reta no mapa ilustrativo
const kmEsperado: Record<string, string> = {
  'Seu Francisco': '4,7 km',
  'Seu Antônio': '7,5 km',
  'Dona Maria': '5,6 km',
  'Dona Lúcia': '5,9 km',
  'Seu Raimundo': '7,4 km',
  'Seu Pedro': '2,5 km',
};
for (const [nome, km] of Object.entries(kmEsperado)) {
  const texto = textoDoKm(kmEntre(posto, produtor(nome).posicao));
  conferir(`${nome} fica a ${km} do posto (${texto})`, texto === km);
}

// Taxa de cumprimento
const taxa = (nome: string) =>
  taxaDeCumprimento(historicoDoProdutor(produtor(nome), inicio.coletas, inicio.coletas));
conferir('Seu Antônio cumpriu 86% (6 de 7)', taxa('Seu Antônio') === 86);
conferir('Seu Raimundo cumpriu 67% (2 de 3)', taxa('Seu Raimundo') === 67);
conferir('Dona Lúcia cumpriu 100% (5 de 5)', taxa('Dona Lúcia') === 100);
conferir('Sem nenhum aviso, a taxa fica vazia', taxaDeCumprimento({ cumpridos: 0, avisos: 0 }) === null);

// Avisos da semana e valores (80% do preço do Ceasa)
const antonio = avisos('Seu Antônio');
conferir(
  'Seu Antônio tem 3 avisos: quinta, sexta e sábado',
  antonio.map((aviso) => aviso.data).join(',') === '01/out,02/out,03/out',
);
conferir(
  'Goiaba 12 cx na quinta: você paga R$ 576,00 (12 × R$ 60 × 80%)',
  formatarReais(antonio[0].valorDoProdutor ?? 0) === 'R$ 576,00',
);
const totalAntonio = totalDosAvisos(antonio);
conferir(
  `Seu Antônio: 35 caixas e R$ 1.680,00 na semana (${totalAntonio.caixas} · ${formatarReais(totalAntonio.valor)})`,
  totalAntonio.caixas === 35 && formatarReais(totalAntonio.valor) === 'R$ 1.680,00',
);
const totalLucia = totalDosAvisos(avisos('Dona Lúcia'));
conferir(
  'Dona Lúcia: 23 caixas e R$ 1.880,00 na semana',
  totalLucia.caixas === 23 && formatarReais(totalLucia.valor) === 'R$ 1.880,00',
);
conferir('Seu Francisco não tem aviso na agenda', avisos('Seu Francisco').length === 0);

// Situação de cada aviso
conferir('A manga da Dona Maria na quinta já vem coletada', avisos('Dona Maria')[0].situacao === 'coletado');
conferir(
  'Sem coleta nem confirmação, os avisos da Dona Lúcia estão aguardando',
  avisos('Dona Lúcia').every((aviso) => aviso.situacao === 'aguardando'),
);
const depois = comConfirmacao(comColeta(inicio, '30/set', 4), '01/out');
conferir(
  'Coletada na quarta e quinta confirmada: "coletado" e "confirmado"',
  avisos('Dona Lúcia', depois).map((aviso) => aviso.situacao).join(',') === 'coletado,confirmado',
);

// Textos
conferir('Frutas com "e": goiaba e manga', textoDasFrutasDoProdutor(['goiaba', 'manga']) === 'goiaba e manga');
conferir(
  'Quem é do ponto focal avisa pela Joana',
  comoAvisa('Ponto focal', 'Joana') === 'Avisa pela Joana, a ponto focal, por ligação ou visita.',
);
conferir('Quem é do WhatsApp avisa pelo Caçuá', comoAvisa('WhatsApp', 'Joana') === 'Avisa pelo WhatsApp do Caçuá.');

if (falhas > 0) {
  console.error(`\n${falhas} conta(s) dos detalhes do produtor não batem.`);
  process.exit(1);
}
console.log('\nOs detalhes do produtor batem.');
