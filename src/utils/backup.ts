/**
 * Backup dos dados em texto (S9.3). Os dados do Caçuá ficam só no celular (Async Storage, sem
 * servidor). Para não perder tudo se o app for desinstalado ou o celular quebrar, o coletor manda
 * o estado do app como mensagem para o próprio WhatsApp e, se precisar, cola o texto de volta.
 *
 * O backup leva os dados do app (produtores, agenda, coletas, entregas, custos e preços) e não leva
 * as contas de login nem as senhas, que ficam em outro lugar (acesso.tsx).
 */

import { estadoDoSalvo, estadoInicial, type EstadoCacua } from '@/state/estado';
import { ehDataValida } from '@/utils/preco-do-ceasa';

/** O formato do backup. Se mudar, suba a versão: o `lerBackup` só aceita esta. */
const VERSAO = 1;

/** O que o `lerBackup` devolve quando o texto não serve. */
const NAO_E_BACKUP = 'Esse texto não é um backup do Caçuá.';
const INCOMPLETO = 'O backup está incompleto. Copie a mensagem inteira.';

/** '2026-11-19' → "19/11/2026". */
function dataPorExtenso(data: string) {
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
}

/**
 * O texto do backup, para mandar pelo WhatsApp:
 *
 * Backup do Caçuá · 19/11/2026
 * Guarde esta mensagem. Para restaurar, copie o texto todo e cole em "Backup dos dados".
 * {"versao":1,"criadoEm":"2026-11-19","estado":{...}}
 *
 * `hoje` é 'AAAA-MM-DD' (hojeNoCelular), para o teste poder fixar o dia. Só entram os campos do
 * estado do app: o `useCacua()` também traz funções, que ficam de fora.
 */
export function textoDoBackup(estado: EstadoCacua, hoje: string) {
  const dados = Object.fromEntries(
    Object.keys(estadoInicial()).map((campo) => [campo, estado[campo as keyof EstadoCacua]]),
  );
  return [
    `Backup do Caçuá · ${dataPorExtenso(hoje)}`,
    'Guarde esta mensagem. Para restaurar, copie o texto todo e cole em "Backup dos dados".',
    JSON.stringify({ versao: VERSAO, criadoEm: hoje, estado: dados }),
  ].join('\n');
}

/**
 * Lê o texto colado de volta. Acha o JSON do primeiro "{" ao último "}", então o que o WhatsApp põe
 * antes ("[19/11 10:02] Edson: ") e depois da mensagem não atrapalha. Confere a `versao` e passa o
 * `estado` pelo `estadoDoSalvo`, o mesmo que lê o salvo do celular. Devolve `{ estado, criadoEm }`
 * ou `{ erro }`:
 * - sem JSON, ou JSON que não é do Caçuá (como o de outra versão): "Esse texto não é um backup…";
 * - JSON cortado, ou estado que não passa no `estadoDoSalvo`: "O backup está incompleto…".
 */
export function lerBackup(texto: string): { estado: EstadoCacua; criadoEm: string } | { erro: string } {
  const inicio = texto.indexOf('{');
  if (inicio < 0) return { erro: NAO_E_BACKUP };
  const fim = texto.lastIndexOf('}');

  let lido: unknown;
  try {
    lido = JSON.parse(texto.slice(inicio, fim + 1));
  } catch {
    // Um backup cortado ainda tem a "versao" no começo; qualquer outro texto com chaves não é do Caçuá.
    return { erro: texto.includes('"versao"') ? INCOMPLETO : NAO_E_BACKUP };
  }

  if (typeof lido !== 'object' || lido === null || Array.isArray(lido)) return { erro: NAO_E_BACKUP };
  const { versao, criadoEm, estado } = lido as Record<string, unknown>;
  if (versao !== VERSAO) return { erro: NAO_E_BACKUP };

  if (!ehDataValida(criadoEm)) return { erro: INCOMPLETO };
  const lidoDoSalvo = estadoDoSalvo(JSON.stringify(estado));
  if (lidoDoSalvo === null) return { erro: INCOMPLETO };

  return { estado: lidoDoSalvo, criadoEm };
}

/** "1 produtor", "6 produtores". */
function plural(quantos: number, singular: string, pluralDeFato: string) {
  return `${quantos} ${quantos === 1 ? singular : pluralDeFato}`;
}

/**
 * O que o backup tem, para o coletor conferir antes de restaurar: "6 produtores · 4 dias na agenda
 * · 1 coleta". Uma coleta é um produtor coletado num dia.
 */
export function resumoDoBackup(estado: EstadoCacua) {
  const coletas = Object.values(estado.coletas).reduce((soma, doDia) => soma + doDia.length, 0);
  return [
    plural(estado.produtores.length, 'produtor', 'produtores'),
    `${plural(estado.agenda.length, 'dia', 'dias')} na agenda`,
    plural(coletas, 'coleta', 'coletas'),
  ].join(' · ');
}
