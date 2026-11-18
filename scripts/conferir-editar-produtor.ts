// Confere o editar e o apagar produtor (S9.1) com os números do cartão no Trello.
// Rodar na raiz do projeto: npm run conferir

import { posto } from '@/data/dados';
import {
  comColeta,
  comProdutorEditado,
  estadoDoSalvo,
  estadoInicial,
  semProdutor,
  type EstadoCacua,
  type Produtor,
} from '@/state/estado';
import { textoDoKm } from '@/utils/conta';
import { chaveDaEntrega } from '@/utils/coleta';
import {
  camposDoProdutor,
  errosDoProdutor,
  motivoParaNaoApagar,
  nomeComArtigo,
  type CamposDoProdutor,
} from '@/utils/novo-produtor';
import { kmEntre } from '@/utils/rota';

let falhas = 0;

function conferir(nome: string, ok: boolean) {
  if (!ok) falhas++;
  console.log(`${ok ? 'OK   ' : 'FALHA'} ${nome}`);
}

const inicio = estadoInicial();

function produtor(estado: EstadoCacua, nome: string) {
  const achado = estado.produtores.find((item) => item.nome === nome);
  if (!achado) throw new Error(`${nome} não está na lista`);
  return achado;
}

const francisco = produtor(inicio, 'Seu Francisco');
const antonio = produtor(inicio, 'Seu Antônio');
const pedro = produtor(inicio, 'Seu Pedro');

// camposDoProdutor: o formulário já preenchido
const camposDoFrancisco = camposDoProdutor(francisco);
conferir(
  'camposDoProdutor: Seu Francisco com tudo o que ele tem',
  camposDoFrancisco.nome === 'Seu Francisco' &&
    camposDoFrancisco.sitio === 'Sítio Boa Vista' &&
    camposDoFrancisco.frutas.join(', ') === 'goiaba, manga' &&
    camposDoFrancisco.canal === 'WhatsApp' &&
    camposDoFrancisco.posicao?.x === 160 &&
    camposDoFrancisco.posicao.y === 196,
);
conferir('camposDoProdutor: o coco do Seu Pedro não aparece nas pílulas', camposDoProdutor(pedro).frutas.join(', ') === 'banana');
conferir('Um produtor sem mudar nada não tem erro', errosDoProdutor(camposDoFrancisco, inicio.produtores, francisco.id) === null);

// Seu Francisco: canal para Ponto focal e lugar para (168, 230)
const editadoFrancisco = comProdutorEditado(inicio, francisco.id, {
  ...camposDoFrancisco,
  canal: 'Ponto focal',
  posicao: { x: 168, y: 230 },
});
const novoFrancisco = produtor(editadoFrancisco, 'Seu Francisco');
conferir('Seu Francisco: canal Ponto focal', novoFrancisco.canal === 'Ponto focal');
conferir(
  'Seu Francisco: lugar (168, 230) a 4,2 km do posto (antes 4,7 km)',
  textoDoKm(kmEntre(posto, novoFrancisco.posicao)) === '4,2 km' && textoDoKm(kmEntre(posto, francisco.posicao)) === '4,7 km',
);
conferir(
  'Seu Francisco: continua com 4 de 4 avisos cumpridos e o id 1',
  novoFrancisco.cumpridos === 4 && novoFrancisco.avisos === 4 && novoFrancisco.id === 1,
);
conferir('Seu Francisco: continua com a previsão "Goiaba prevista (pela poda)"', novoFrancisco.previsao === 'Goiaba prevista (pela poda)');
conferir('Seu Francisco: o estado de antes não muda', inicio.produtores[0].canal === 'WhatsApp' && editadoFrancisco !== inicio);
conferir('Os outros 5 produtores não mudam', editadoFrancisco.produtores.slice(1).every((item, i) => item === inicio.produtores[i + 1]));
conferir('A lista continua com 6 produtores', editadoFrancisco.produtores.length === 6);

// Nome, sítio e frutas
const renomeado = comProdutorEditado(inicio, francisco.id, { ...camposDoFrancisco, nome: '  Seu Chico ', sitio: ' Sítio Novo  ', frutas: ['manga', 'goiaba', 'banana'] });
conferir(
  'Nome e sítio sem os espaços das pontas, frutas na ordem dos preços',
  produtor(renomeado, 'Seu Chico').sitio === 'Sítio Novo' && produtor(renomeado, 'Seu Chico').frutas.join(', ') === 'goiaba, manga, banana',
);

// Repetido
const REPETIDO = 'Esse produtor já está cadastrado nesse sítio.';
conferir(
  'Seu Francisco com o nome "Seu Antônio" e o sítio "Sítio Pau d\'Arco" → repetido',
  errosDoProdutor({ ...camposDoFrancisco, nome: 'Seu Antônio', sitio: "Sítio Pau d'Arco" }, inicio.produtores, francisco.id)?.nome === REPETIDO,
);
conferir(
  'O Seu Antônio salvo com o próprio nome → sem erro',
  errosDoProdutor(camposDoProdutor(antonio), inicio.produtores, antonio.id) === null,
);
conferir(
  'O Seu Antônio com o próprio nome, só que sem o id (como um produtor novo) → repetido',
  errosDoProdutor(camposDoProdutor(antonio), inicio.produtores)?.nome === REPETIDO,
);
conferir(
  'Repetido sem ligar para maiúsculas, acentos e espaços',
  errosDoProdutor({ ...camposDoFrancisco, nome: ' seu  ANTONIO', sitio: 'sitio pau d’arco' }, inicio.produtores, francisco.id)?.nome === REPETIDO,
);
conferir(
  'Com erro, o comProdutorEditado não muda nada',
  comProdutorEditado(inicio, francisco.id, { ...camposDoFrancisco, nome: 'R' }) === inicio &&
    comProdutorEditado(inicio, francisco.id, { ...camposDoFrancisco, nome: 'Seu Antônio', sitio: "Sítio Pau d'Arco" }) === inicio,
);
const semFruta = errosDoProdutor({ ...camposDoFrancisco, frutas: [] }, inicio.produtores, francisco.id);
conferir('Seu Francisco sem fruta → "Escolha pelo menos uma fruta."', semFruta?.frutas === 'Escolha pelo menos uma fruta.');
conferir(
  'Seu Francisco sem lugar e sem canal → 2 erros',
  Object.keys(errosDoProdutor({ ...camposDoFrancisco, canal: null, posicao: null }, inicio.produtores, francisco.id) ?? {}).length === 2,
);
conferir('Produtor que não existe: nada muda', comProdutorEditado(inicio, 99, camposDoFrancisco) === inicio);

// Seu Pedro só com a banana marcada: continua com banana e coco
const editadoPedro = comProdutorEditado(inicio, pedro.id, { ...camposDoProdutor(pedro), frutas: ['banana'] });
conferir('Seu Pedro só com a banana marcada → continua com banana e coco', produtor(editadoPedro, 'Seu Pedro').frutas.join(', ') === 'banana, coco');
const pedroSoCoco: EstadoCacua = {
  ...inicio,
  produtores: inicio.produtores.map((item) => (item.id === pedro.id ? { ...item, frutas: ['coco'] } : item)),
};
conferir(
  'Produtor só com coco, sem nenhuma pílula marcada: a fruta sem preço conta como escolhida',
  errosDoProdutor({ ...camposDoProdutor(produtor(pedroSoCoco, 'Seu Pedro')), nome: 'Seu Pedrinho' }, pedroSoCoco.produtores, pedro.id) === null &&
    produtor(comProdutorEditado(pedroSoCoco, pedro.id, { ...camposDoProdutor(produtor(pedroSoCoco, 'Seu Pedro')), nome: 'Seu Pedrinho' }), 'Seu Pedrinho').frutas.join() === 'coco',
);
conferir(
  'Fruta sem preço que ele NÃO tinha (coco no Seu Francisco) continua não valendo',
  !!errosDoProdutor({ ...camposDoFrancisco, frutas: ['coco'] }, inicio.produtores, francisco.id)?.frutas,
);

// O preço combinado (S9.2) e qualquer campo a mais ficam como estavam
const comPrecoCombinado: EstadoCacua = {
  ...inicio,
  produtores: inicio.produtores.map((item) => (item.id === antonio.id ? ({ ...item, pagoProdutor: 0.85 } as Produtor) : item)),
};
const antonioEditado = comProdutorEditado(comPrecoCombinado, antonio.id, { ...camposDoProdutor(antonio), canal: 'Ponto focal' });
conferir(
  'Editar mantém o preço combinado (pagoProdutor) e os avisos cumpridos',
  (produtor(antonioEditado, 'Seu Antônio') as Produtor & { pagoProdutor?: number }).pagoProdutor === 0.85 &&
    produtor(antonioEditado, 'Seu Antônio').cumpridos === 6,
);

// Apagar: o artigo
conferir('Artigo: "o Seu Antônio" e "O Seu Antônio"', nomeComArtigo('Seu Antônio') === 'o Seu Antônio' && nomeComArtigo('Seu Antônio', true) === 'O Seu Antônio');
conferir('Artigo: "a Dona Lúcia" e "A Dona Lúcia"', nomeComArtigo('Dona Lúcia') === 'a Dona Lúcia' && nomeComArtigo('Dona Lúcia', true) === 'A Dona Lúcia');
conferir('Artigo: "Rita" fica sem artigo, e "Seuzinho" também', nomeComArtigo('Rita') === 'Rita' && nomeComArtigo('Seuzinho') === 'Seuzinho');

// Apagar o Seu Francisco (sem aviso) e tentar apagar o Seu Antônio (3 avisos)
conferir('Seu Francisco (sem aviso) pode ser apagado', motivoParaNaoApagar(inicio, francisco.id) === null);
const semFrancisco = semProdutor(inicio, francisco.id);
conferir('Apagar o Seu Francisco → 5 produtores', semFrancisco.produtores.length === 5 && !semFrancisco.produtores.some((item) => item.id === 1));
conferir('O estado de antes continua com 6', inicio.produtores.length === 6);
conferir(
  'Apagar o Seu Antônio → o motivo fala dos 3 avisos',
  motivoParaNaoApagar(inicio, antonio.id) === 'O Seu Antônio tem 3 avisos na agenda. Tire os avisos antes de apagar.',
);
conferir('Apagar o Seu Antônio → nada muda', semProdutor(inicio, antonio.id) === inicio);
conferir(
  'Com um só aviso: "A Dona Maria tem 1 aviso na agenda…"',
  motivoParaNaoApagar(inicio, 3) === 'A Dona Maria tem 1 aviso na agenda. Tire os avisos antes de apagar.',
);
conferir('Produtor que não existe: motivo e nada muda', motivoParaNaoApagar(inicio, 99) === 'Esse produtor não está na lista.' && semProdutor(inicio, 99) === inicio);
const rita = { ...francisco, id: 7, nome: 'Rita' } as Produtor;
const comRita: EstadoCacua = { ...inicio, produtores: [...inicio.produtores, rita] };
conferir('Produtor sem Seu nem Dona: "Rita tem 1 aviso…" (sem artigo)', (() => {
  const comAviso: EstadoCacua = {
    ...comRita,
    agenda: comRita.agenda.map((dia) => (dia.data === '01/out' ? { ...dia, avisos: [...dia.avisos, { produtor: 7, fruta: 'goiaba', caixas: 5 }] } : dia)),
  };
  return motivoParaNaoApagar(comAviso, 7) === 'Rita tem 1 aviso na agenda. Tire os avisos antes de apagar.';
})());

// O último produtor não sai
const soFrancisco: EstadoCacua = { ...inicio, produtores: [francisco], agenda: inicio.agenda.map((dia) => ({ ...dia, avisos: [] })) };
conferir(
  'O último produtor não pode ser apagado',
  motivoParaNaoApagar(soFrancisco, francisco.id) === 'É o único produtor. Cadastre outro antes de apagar.' && semProdutor(soFrancisco, francisco.id) === soFrancisco,
);

// Os restos do apagado nas coletas e nas entregas
const comRestos: EstadoCacua = {
  ...semFrancisco,
  produtores: inicio.produtores,
  coletas: { '01/out': [3, 1, 21], '02/out': [1] },
  entregas: {
    '01/out': { [chaveDaEntrega(1, 'goiaba')]: 5, [chaveDaEntrega(21, 'goiaba')]: 7 },
    '02/out': { [chaveDaEntrega(1, 'manga')]: 4 },
  },
};
const semRestos = semProdutor(comRestos, francisco.id);
conferir(
  'Apagar tira o id das coletas, sem mexer no 21',
  semRestos.coletas['01/out'].join() === '3,21' && semRestos.coletas['02/out'] === undefined,
);
conferir(
  'Apagar tira as entregas dele, sem mexer nas do 21, e o dia que fica vazio sai',
  Object.keys(semRestos.entregas).join() === '01/out' && Object.keys(semRestos.entregas['01/out']).join() === chaveDaEntrega(21, 'goiaba'),
);
const novoNoLugar = comColeta(semRestos, '01/out', 1);
conferir('Um produtor novo com o id 1 não herda coleta do apagado', !semRestos.coletas['01/out'].includes(1) && novoNoLugar.coletas['01/out'].includes(1));

// Salvar e ler de novo
const salvoEditado = estadoDoSalvo(JSON.stringify(editadoFrancisco));
conferir(
  'Salvar e ler de novo: a edição continua',
  salvoEditado?.produtores[0].canal === 'Ponto focal' && salvoEditado.produtores[0].posicao.x === 168 && salvoEditado.produtores[0].previsao === 'Goiaba prevista (pela poda)',
);
const salvoApagado = estadoDoSalvo(JSON.stringify(semFrancisco));
conferir('Salvar e ler de novo: o apagado continua apagado (5 produtores)', salvoApagado?.produtores.length === 5 && !salvoApagado.produtores.some((item) => item.id === 1));
conferir('"Voltar aos valores do Figma": os 6 produtores voltam', estadoInicial().produtores.length === 6);

if (falhas > 0) {
  console.error(`\n${falhas} conta(s) de editar e apagar produtor não batem com o cartão.`);
  process.exit(1);
}
console.log('\nO editar e o apagar produtor batem com o cartão.');
