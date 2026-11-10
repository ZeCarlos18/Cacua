// Confere os produtores no estado do app (S7.1) com os números do cartão no Trello.
// Rodar na raiz do projeto: npm run conferir

import { posto } from '@/data/dados';
import { comAviso, comProdutor, estadoDoSalvo, estadoInicial, type EstadoCacua } from '@/state/estado';
import { calcularLucroDoDia, formatarReais } from '@/utils/calculos';
import { textoDoKm } from '@/utils/conta';
import { areaDoMapa, posicaoDoToque } from '@/utils/mapa-rota';
import { errosDoProdutor, type CamposDoProdutor } from '@/utils/novo-produtor';
import { kmEntre, montarRota } from '@/utils/rota';

let falhas = 0;

function conferir(nome: string, ok: boolean) {
  if (!ok) falhas++;
  console.log(`${ok ? 'OK   ' : 'FALHA'} ${nome}`);
}

const inicio = estadoInicial();
conferir('No começo: 6 produtores', inicio.produtores.length === 6);

// Toque no mapa: o quadro de 304 × 372 px cobre a área do mapa (x 16–320, y 44–416).
const area = areaDoMapa(posto, inicio.produtores);
const quadro = { largura: 304, altura: 372 };
const meio = posicaoDoToque({ x: 152, y: 186 }, quadro, area);
conferir('Toque em (152, 186) → ponto (168, 230)', meio.x === 168 && meio.y === 230);
conferir('O ponto (168, 230) fica a 4,2 km do posto', textoDoKm(kmEntre(posto, meio)) === '4,2 km');
const fora = posicaoDoToque({ x: -10, y: -10 }, quadro, area);
conferir('Toque fora, em (−10, −10) → (16, 44), na borda', fora.x === 16 && fora.y === 44);
const depoisDoFim = posicaoDoToque({ x: 999, y: 999 }, quadro, area);
conferir('Toque depois do fim → (320, 416), na outra borda', depoisDoFim.x === 320 && depoisDoFim.y === 416);
const quadroDeOutroTamanho = posicaoDoToque({ x: 76, y: 93 }, { largura: 152, altura: 186 }, area);
conferir('Quadro com a metade do tamanho: o meio dele também é (168, 230)', quadroDeOutroTamanho.x === 168 && quadroDeOutroTamanho.y === 230);
const semTamanho = posicaoDoToque({ x: 10, y: 10 }, { largura: 0, altura: 0 }, area);
conferir('Quadro ainda sem tamanho não dá NaN', Number.isFinite(semTamanho.x) && Number.isFinite(semTamanho.y));

// Dona Rita no meio do mapa
const rita: CamposDoProdutor = {
  nome: 'Dona Rita',
  sitio: 'Sítio Lagoa Seca',
  frutas: ['goiaba'],
  canal: 'WhatsApp',
  posicao: { x: 168, y: 230 },
};
conferir('Dona Rita não tem erro', errosDoProdutor(rita, inicio.produtores) === null);
const comRita = comProdutor(inicio, rita);
const novaRita = comRita.produtores.at(-1);
conferir('Dona Rita entra com o id 7, no fim da lista', novaRita?.id === 7 && novaRita.nome === 'Dona Rita');
conferir('Dona Rita começa com 0 de 0 avisos cumpridos', novaRita?.cumpridos === 0 && novaRita.avisos === 0);
conferir('Dona Rita fica no lugar marcado (168, 230)', novaRita?.posicao.x === 168 && novaRita.posicao.y === 230);
conferir('Agora são 7 produtores', comRita.produtores.length === 7);
conferir('Os 6 do começo não mudam', inicio.produtores.length === 6);
conferir(
  'Nome e sítio sem os espaços das pontas',
  comProdutor(inicio, { ...rita, nome: '  Dona Rita ', sitio: ' Sítio Lagoa Seca  ' }).produtores.at(-1)?.nome === 'Dona Rita',
);
conferir(
  'As frutas ficam na ordem dos preços (manga e goiaba → goiaba, manga)',
  comProdutor(inicio, { ...rita, frutas: ['manga', 'goiaba'] }).produtores.at(-1)?.frutas.join(', ') === 'goiaba, manga',
);
conferir(
  'O próximo depois da Dona Rita é o 8',
  comProdutor(comRita, { ...rita, nome: 'Seu Zé' }).produtores.at(-1)?.id === 8,
);

// Erros
const vazio = errosDoProdutor({ nome: 'R', sitio: '', frutas: [], canal: 'WhatsApp', posicao: null }, inicio.produtores);
conferir(
  'Nome "R", sítio vazio, sem fruta e sem lugar → 4 erros',
  Object.keys(vazio ?? {}).length === 4 && !!vazio?.nome && !!vazio.sitio && !!vazio.frutas && !!vazio.posicao,
);
conferir('Nome "R" → "O nome precisa ter pelo menos 2 letras."', vazio?.nome === 'O nome precisa ter pelo menos 2 letras.');
conferir('Sítio vazio → "Digite o nome do sítio."', vazio?.sitio === 'Digite o nome do sítio.');
conferir('Sem fruta → "Escolha pelo menos uma fruta."', vazio?.frutas === 'Escolha pelo menos uma fruta.');
conferir('Sem lugar → "Toque no mapa para marcar o sítio."', vazio?.posicao === 'Toque no mapa para marcar o sítio.');
const nada = errosDoProdutor({ nome: '  ', sitio: '', frutas: [], canal: null, posicao: null }, inicio.produtores);
conferir('Tudo vazio → erro nos 5 campos', Object.keys(nada ?? {}).length === 5);
conferir('Nome vazio → "Digite o nome do produtor."', nada?.nome === 'Digite o nome do produtor.');
conferir('Sem canal → "Escolha como ele avisa."', nada?.canal === 'Escolha como ele avisa.');
conferir(
  'Fruta sem preço do Ceasa (coco) não vale',
  !!errosDoProdutor({ ...rita, frutas: ['coco'] }, inicio.produtores)?.frutas,
);

const REPETIDO = 'Esse produtor já está cadastrado nesse sítio.';
conferir(
  "Seu Antônio no Sítio Pau d'Arco de novo → repetido",
  errosDoProdutor({ ...rita, nome: 'Seu Antônio', sitio: "Sítio Pau d'Arco" }, inicio.produtores)?.nome === REPETIDO,
);
conferir(
  'Repetido sem ligar para maiúsculas, acentos, espaços e o apóstrofo curvo',
  errosDoProdutor({ ...rita, nome: ' seu  antonio', sitio: 'SITIO PAU D’ARCO' }, inicio.produtores)?.nome === REPETIDO,
);
conferir(
  "Seu Antônio em outro sítio pode (não é repetido)",
  errosDoProdutor({ ...rita, nome: 'Seu Antônio' }, inicio.produtores) === null,
);
conferir('Com erro, o comProdutor não muda nada', comProdutor(inicio, { ...rita, nome: 'R' }) === inicio);
conferir('Dona Rita duas vezes → a segunda é repetida', comProdutor(comRita, rita) === comRita);

// A quinta com o aviso da Dona Rita (goiaba, 10 caixas)
const quintaComRita = comAviso(comRita, '01/out', { produtor: 7, fruta: 'goiaba', caixas: 10 });
const quinta = quintaComRita.agenda.find((dia) => dia.data === '01/out');
if (!quinta) throw new Error('A quinta não está na agenda');
const rotaDaQuinta = montarRota(quinta, quintaComRita.produtores, posto);
conferir(
  'Rota de quinta com 4 paradas: Dona Rita, Dona Lúcia, Seu Antônio e Dona Maria',
  rotaDaQuinta.paradas.map((parada) => parada.produtor).join(', ') === 'Dona Rita, Dona Lúcia, Seu Antônio, Dona Maria',
);
conferir('Rota de quinta com 57 caixas', rotaDaQuinta.paradas.reduce((soma, parada) => soma + parada.caixas, 0) === 57);
conferir('Rota de quinta com 19,7 km', textoDoKm(rotaDaQuinta.km) === '19,7 km');
const contaDaQuinta = calcularLucroDoDia({ ...quinta, km: rotaDaQuinta.km }, quintaComRita.precos, quintaComRita.custos);
conferir(
  'Quinta: R$ 573,44 · Vale a pena',
  formatarReais(contaDaQuinta.lucro) === 'R$ 573,44' && contaDaQuinta.selo === 'Vale a pena',
);
conferir('Ninguém fica fora do mapa', rotaDaQuinta.semPosicao.length === 0);

// O que fica salvo no celular
const salvoComRita = estadoDoSalvo(JSON.stringify(quintaComRita));
conferir('Fechar e abrir o app: a Dona Rita continua lá', salvoComRita?.produtores.length === 7 && salvoComRita.produtores[6].nome === 'Dona Rita');

const { produtores: _semProdutores, ...salvoAntigo } = quintaComRita satisfies EstadoCacua;
const doSalvoAntigo = estadoDoSalvo(JSON.stringify(salvoAntigo));
conferir('Salvo antigo sem produtores → os 6 do dados.js', doSalvoAntigo?.produtores.length === 6);
conferir(
  'Salvo antigo sem produtores: a agenda salva continua',
  doSalvoAntigo?.agenda.find((dia) => dia.data === '01/out')?.avisos.length === 4,
);

const estragados = (produtores: unknown) => estadoDoSalvo(JSON.stringify({ ...quintaComRita, produtores }));
conferir('Produtores salvos que não são lista → os 6', estragados('Dona Rita')?.produtores.length === 6);
conferir('Lista vazia → os 6', estragados([])?.produtores.length === 6);
conferir(
  'Um produtor sem lugar no mapa → os 6, e a agenda continua',
  estragados([...inicio.produtores, { ...novaRita, posicao: undefined }])?.produtores.length === 6 &&
    estragados([...inicio.produtores, { ...novaRita, posicao: undefined }])?.agenda.find((dia) => dia.data === '01/out')?.avisos.length === 4,
);
conferir('Dois produtores com o mesmo id → os 6', estragados([...inicio.produtores, { ...novaRita, id: 2 }])?.produtores.length === 6);
conferir('Produtor sem nome → os 6', estragados([{ ...novaRita, nome: 7 }])?.produtores.length === 6);

if (falhas > 0) {
  console.error(`\n${falhas} conta(s) do produtor novo não batem com o cartão.`);
  process.exit(1);
}
console.log('\nO produtor novo bate com o cartão.');
