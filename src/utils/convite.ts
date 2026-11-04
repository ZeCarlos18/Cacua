/**
 * Convite para o produtor (S5.3): o link do WhatsApp do Caçuá com o código do coletor e a mensagem
 * que o coletor manda pelo compartilhar do celular.
 */

/**
 * "https://wa.me/55...?text=Oi%2C%20Ca%C3%A7u%C3%A1!%20C%C3%B3digo%20EDSON": tocando no link, o
 * WhatsApp abre a conversa com o Caçuá e "Oi, Caçuá! Código EDSON" já escrito. O wa.me só aceita
 * dígitos, então "+55 (88) ..." vira "5588...".
 */
export function linkDoConvite(numero: string, codigo: string) {
  const mensagem = encodeURIComponent(`Oi, Caçuá! Código ${codigo}`);
  return `https://wa.me/${numero.replace(/\D/g, '')}?text=${mensagem}`;
}

/** A mensagem para o produtor, com o link e o nome do coletor no fim. */
export function textoDoConvite(coletor: { nome: string }, link: string) {
  return (
    'Oi! Agora eu recebo os avisos de colheita pelo Caçuá. Quando a fruta estiver quase pronta, ' +
    `toque no link e mande um áudio dizendo a fruta, quantas caixas e o dia: ${link} · ${coletor.nome}`
  );
}
