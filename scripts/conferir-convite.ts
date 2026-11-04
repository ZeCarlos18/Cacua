// Confere o convite para o produtor (S5.3): o link do Caçuá e a mensagem do cartão.
// Rodar na raiz do projeto: npm run conferir

import { coletor, numeroCacua } from '@/data/dados';
import { linkDoConvite, textoDoConvite } from '@/utils/convite';

let falhas = 0;

function conferir(nome: string, ok: boolean) {
  if (!ok) falhas++;
  console.log(`${ok ? 'OK   ' : 'FALHA'} ${nome}`);
}

const link = linkDoConvite(numeroCacua, coletor.codigo);

conferir('O código do Edson é EDSON', coletor.codigo === 'EDSON');
conferir('O número do Caçuá tem só dígitos, com 55 e DDD', /^55\d{10,11}$/.test(numeroCacua));
conferir(`O link abre o WhatsApp do Caçuá (https://wa.me/${numeroCacua})`, link.startsWith(`https://wa.me/${numeroCacua}?text=`));
conferir(
  'O link termina com "Oi, Caçuá! Código EDSON" codificado',
  link.endsWith('?text=Oi%2C%20Ca%C3%A7u%C3%A1!%20C%C3%B3digo%20EDSON'),
);
conferir(
  'Número escrito com +, espaço e parênteses vira só dígitos',
  linkDoConvite('+55 (88) 99999-0000', 'EDSON').startsWith('https://wa.me/5588999990000?text='),
);
conferir(
  'A mensagem é a do cartão, com o link e o nome do Edson no fim',
  textoDoConvite(coletor, link) ===
    'Oi! Agora eu recebo os avisos de colheita pelo Caçuá. Quando a fruta estiver quase pronta, ' +
      `toque no link e mande um áudio dizendo a fruta, quantas caixas e o dia: ${link} · Edson`,
);

if (falhas > 0) {
  console.error(`\n${falhas} regra(s) do convite não batem com o cartão.`);
  process.exit(1);
}
console.log('\nO convite bate com o cartão.');
