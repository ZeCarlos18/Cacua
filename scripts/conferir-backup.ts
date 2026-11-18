// Confere o backup dos dados em texto (S9.3) com os números do cartão no Trello.
// Rodar na raiz do projeto: npm run conferir

import {
  comAviso,
  comColeta,
  comConfirmacao,
  comPreco,
  comProdutor,
  estadoInicial,
  type EstadoCacua,
} from '@/state/estado';
import { lerBackup, resumoDoBackup, textoDoBackup } from '@/utils/backup';

let falhas = 0;

function conferir(nome: string, ok: boolean) {
  if (!ok) falhas++;
  console.log(`${ok ? 'OK   ' : 'FALHA'} ${nome}`);
}

/** O JSON com as chaves em ordem, para comparar dois estados sem depender da ordem dos campos. */
function igual(a: unknown, b: unknown) {
  const ordenar = (valor: unknown): unknown => {
    if (Array.isArray(valor)) return valor.map(ordenar);
    if (typeof valor !== 'object' || valor === null) return valor;
    return Object.fromEntries(
      Object.entries(valor)
        .sort(([x], [y]) => x.localeCompare(y))
        .map(([chave, item]) => [chave, ordenar(item)]),
    );
  };
  return JSON.stringify(ordenar(a)) === JSON.stringify(ordenar(b));
}

const HOJE = '2026-11-19';
const inicio = estadoInicial();

// O estado do cartão: a Dona Rita cadastrada e a coleta do Seu Antônio com 10 caixas
const comRita = comProdutor(inicio, {
  nome: 'Dona Rita',
  sitio: 'Sítio Lagoa Seca',
  frutas: ['goiaba'],
  canal: 'WhatsApp',
  posicao: { x: 168, y: 230 },
});
const mudado = comColeta(comRita, '01/out', 2, { goiaba: 10 });
const texto = textoDoBackup(mudado, HOJE);
const linhas = texto.split('\n');

// O texto
conferir('Primeira linha: "Backup do Caçuá · 19/11/2026"', linhas[0] === 'Backup do Caçuá · 19/11/2026');
conferir(
  'Segunda linha: o aviso de como restaurar',
  linhas[1] === 'Guarde esta mensagem. Para restaurar, copie o texto todo e cole em "Backup dos dados".',
);
conferir(
  'Terceira linha: o JSON com versao 1 e criadoEm',
  linhas.length === 3 && linhas[2].startsWith('{"versao":1,"criadoEm":"2026-11-19","estado":{'),
);

// Ida e volta
const volta = lerBackup(texto);
conferir('Ida e volta: o texto é lido sem erro', !('erro' in volta));
conferir('Ida e volta: o mesmo estado', 'estado' in volta && igual(volta.estado, mudado));
conferir('O criadoEm volta como "2026-11-19"', 'criadoEm' in volta && volta.criadoEm === '2026-11-19');
conferir(
  'A Dona Rita e a coleta de 10 caixas voltam',
  'estado' in volta &&
    volta.estado.produtores.some((p) => p.nome === 'Dona Rita' && p.id === 7) &&
    volta.estado.entregas['01/out']?.['2:goiaba'] === 10,
);

// Texto que o WhatsApp mexe: antes e depois
conferir(
  'Com "[19/11 10:02] Edson: " antes e uma linha depois: lê igual',
  (() => {
    const lido = lerBackup(`[19/11 10:02] Edson: ${texto}\n[19/11 10:03] Edson: ok`);
    return 'estado' in lido && igual(lido.estado, mudado);
  })(),
);
conferir(
  'Só o JSON, sem as duas linhas de cima: lê igual',
  (() => {
    const lido = lerBackup(linhas[2]);
    return 'estado' in lido && igual(lido.estado, mudado);
  })(),
);

// Erros
const incompleto = 'O backup está incompleto. Copie a mensagem inteira.';
const naoEBackup = 'Esse texto não é um backup do Caçuá.';
const erroDe = (entrada: string) => {
  const lido = lerBackup(entrada);
  return 'erro' in lido ? lido.erro : null;
};
conferir('Texto cortado no meio: "O backup está incompleto…"', erroDe(texto.slice(0, texto.length / 2)) === incompleto);
conferir('Texto sem a última chave: "O backup está incompleto…"', erroDe(texto.slice(0, -1)) === incompleto);
conferir('"Bom dia": "Esse texto não é um backup do Caçuá."', erroDe('Bom dia') === naoEBackup);
conferir('Texto vazio: "Esse texto não é um backup do Caçuá."', erroDe('') === naoEBackup);
conferir(
  'JSON com versao 2: também não é backup',
  erroDe(texto.replace('"versao":1', '"versao":2')) === naoEBackup,
);
conferir('JSON de outra coisa ({"a":1}): não é backup', erroDe('{"a":1}') === naoEBackup);
conferir('Uma lista JSON ([1,2]) com chaves: não é backup', erroDe('{[1,2]}') === naoEBackup);
conferir(
  'Estado que não passa no estadoDoSalvo (sem a agenda): "incompleto"',
  (() => {
    const dados = JSON.parse(linhas[2]);
    delete dados.estado.agenda;
    return erroDe(JSON.stringify(dados)) === incompleto;
  })(),
);
conferir(
  'Backup sem o estado: "incompleto"',
  erroDe('{"versao":1,"criadoEm":"2026-11-19"}') === incompleto,
);
conferir(
  'criadoEm que não é data: "incompleto"',
  erroDe(texto.replace('"criadoEm":"2026-11-19"', '"criadoEm":"ontem"')) === incompleto,
);

// O resumo
conferir(
  'resumoDoBackup(estadoInicial()): "6 produtores · 4 dias na agenda · 1 coleta"',
  resumoDoBackup(inicio) === '6 produtores · 4 dias na agenda · 1 coleta',
);
conferir(
  'Com a Dona Rita e a coleta do Seu Antônio: "7 produtores · 4 dias na agenda · 2 coletas"',
  resumoDoBackup(mudado) === '7 produtores · 4 dias na agenda · 2 coletas',
);
conferir(
  'Singular: "1 produtor · 1 dia na agenda · 1 coleta"',
  resumoDoBackup({
    ...inicio,
    produtores: inicio.produtores.slice(0, 1),
    agenda: inicio.agenda.slice(0, 1),
    coletas: { '30/set': [4] },
  }) === '1 produtor · 1 dia na agenda · 1 coleta',
);
conferir(
  'O resumo conta coleta por produtor e dia (2 dias com 2 e 1 produtores = 3)',
  resumoDoBackup({ ...inicio, coletas: { '30/set': [4, 5], '01/out': [3] } }).endsWith('3 coletas'),
);

// Além do cartão
conferir(
  'As funções do useCacua() não entram no texto',
  !texto.includes('registrarColeta') && !texto.includes('restaurarBackup'),
);
conferir(
  'Só os campos do estado entram: nada de login nem senha',
  (() => {
    const estado = JSON.parse(linhas[2]).estado;
    return igual(Object.keys(estado), Object.keys(inicio)) && !/senha|telefone|sessao|cadastros/i.test(linhas[2]);
  })(),
);
const comDia = comConfirmacao(
  comPreco(comAviso(mudado, '03/out', { produtor: 6, fruta: 'coco', caixas: 8 }), 'goiaba', 70, '2026-11-17'),
  '30/set',
);
const idaEVolta = lerBackup(textoDoBackup(comDia, HOJE));
conferir(
  'Ida e volta com aviso de coco, goiaba a R$ 70,00 (com data) e dia confirmado',
  'estado' in idaEVolta && igual(idaEVolta.estado, comDia),
);
conferir(
  'Acento e aspas no nome do produtor (D\'Água, "Zé") sobrevivem à ida e volta',
  (() => {
    const estado: EstadoCacua = {
      ...inicio,
      produtores: inicio.produtores.map((p) => (p.id === 4 ? { ...p, sitio: 'Sítio "Olho d\'Água" · Zé' } : p)),
    };
    const lido = lerBackup(textoDoBackup(estado, HOJE));
    return 'estado' in lido && lido.estado.produtores[3].sitio === 'Sítio "Olho d\'Água" · Zé';
  })(),
);
conferir('Ler o backup não muda o estado de antes', igual(inicio, estadoInicial()));

if (falhas > 0) {
  console.error(`\n${falhas} conta(s) do backup não batem com o cartão.`);
  process.exit(1);
}
console.log('\nO backup dos dados bate com o cartão.');
