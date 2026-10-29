export const coletor = {
  nome: 'Edson',
  regiao: 'Boa Vista',
  cargaMinima: 60, 
};

export const precos = {
  goiaba: { preco: 60, kg: 25 },
  manga: { preco: 60, kg: 20 },
  maracujá: { preco: 130, kg: 18 },
  mamão: { preco: 50, kg: 20 },
  banana: { preco: 42, kg: 16 },
};

export const custos = {
  pagoProdutor: 0.8, 
  perda: 0.05, 
  kmPorLitro: 8,
  diesel: 6.97, 
  desgastePorKm: 0.5,
  outrosCustos: 70, 
  lucroMinimo: 200, 
};

export const pontoFocal = 'Joana'; 

// Posições (x, y) no mapa ilustrativo do protótipo. A rota sai do posto e volta para ele (S3.1).
export const posto = { nome: 'Posto', x: 36, y: 396 };

export const produtores = [
  // previsao: o texto da próxima colheita quando o produtor não tem aviso na agenda (S3.5).
  { id: 1, nome: 'Seu Francisco', sitio: 'Sítio Boa Vista', frutas: ['goiaba', 'manga'], canal: 'WhatsApp', cumpridos: 4, avisos: 4, posicao: { x: 160, y: 196 }, previsao: 'Goiaba prevista (pela poda)' },
  { id: 2, nome: 'Seu Antônio', sitio: "Sítio Pau d'Arco", frutas: ['goiaba', 'manga'], canal: 'WhatsApp', cumpridos: 6, avisos: 7, posicao: { x: 214, y: 64 } },
  { id: 3, nome: 'Dona Maria', sitio: 'Sítio Riacho Verde', frutas: ['manga'], canal: 'Ponto focal', cumpridos: 3, avisos: 3, posicao: { x: 84, y: 118 } },
  { id: 4, nome: 'Dona Lúcia', sitio: "Sítio Olho d'Água", frutas: ['maracujá', 'mamão'], canal: 'WhatsApp', cumpridos: 5, avisos: 5, posicao: { x: 300, y: 262 } },
  { id: 5, nome: 'Seu Raimundo', sitio: 'Sítio Baixio', frutas: ['banana'], canal: 'Ponto focal', cumpridos: 2, avisos: 3, posicao: { x: 262, y: 104 } },
  { id: 6, nome: 'Seu Pedro', sitio: 'Sítio Cajueiro', frutas: ['banana', 'coco'], canal: 'WhatsApp', cumpridos: 4, avisos: 4, posicao: { x: 118, y: 300 } },
];

export const agenda = [
  {
    dia: 'Quarta', data: '30/set',
    avisos: [
      { produtor: 5, fruta: 'banana', caixas: 10 },
      { produtor: 4, fruta: 'mamão', caixas: 8 },
    ],
  },
  {
    dia: 'Quinta', data: '01/out',
    avisos: [
      { produtor: 3, fruta: 'manga', caixas: 20 },
      { produtor: 2, fruta: 'goiaba', caixas: 12 },
      { produtor: 4, fruta: 'maracujá', caixas: 15 },
    ],
  },
  {
    dia: 'Sexta', data: '02/out',
    avisos: [
      { produtor: 2, fruta: 'manga', caixas: 14 },
      { produtor: 6, fruta: 'banana', caixas: 12 },
    ],
  },
  {
    dia: 'Sábado', data: '03/out',
    avisos: [
      { produtor: 2, fruta: 'goiaba', caixas: 9 },
    ],
  },
];

export const rota = { data: '01/out', saida: '7h', coletados: [3] };

export const previsao = [
  { periodo: '28/set – 04/out', caixas: 100, avisado: true, frutas: ['goiaba', 'manga', 'maracujá', 'banana', 'mamão'] },
  { periodo: '05 – 11/out', caixas: 118, avisado: false, frutas: ['goiaba', 'manga', 'banana'] },
  { periodo: '12 – 18/out', caixas: 131, avisado: false, frutas: ['goiaba', 'manga', 'mamão'] },
  { periodo: '19 – 25/out', caixas: 86, avisado: false, frutas: ['manga', 'banana'] },
  { periodo: '26/out – 01/nov', caixas: 38, avisado: false, frutas: ['banana'] },
  { periodo: '02 – 08/nov', caixas: 72, avisado: false, frutas: ['goiaba', 'banana', 'coco'] },
];
