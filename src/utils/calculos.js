/**
 * Conta do lucro da rota de cada dia (S1.6), igual à tela "Conta da quinta" do Figma.
 *
 * Tudo chega por parâmetro (o dia, os preços e os custos), então a função não
 * depende de dados.js e dá para conferir com outros números.
 *
 *   Receita              = soma de caixas × preço do Ceasa
 *   Pago ao produtor     = 80% da receita
 *   Perda                = 5% da receita
 *   Diesel e desgaste    = km × (diesel ÷ consumo + desgaste por km)
 *   Custos da rota       = diesel e desgaste + outros custos
 *   Lucro                = receita − pago − perda − custos da rota
 *
 * A conta usa o km completo (18,696); só a tela arredonda (18,7 km).
 */

export const SELOS = {
  valeAPena: 'Vale a pena',
  valeComAtencao: 'Vale com atenção',
  naoVale: 'Não vale a pena',
};

/**
 * Arredonda para centavos.
 * @param {number} valor
 */
function centavos(valor) {
  return Math.round(valor * 100) / 100;
}

/**
 * Selo do dia: R$ 200 ou mais → vale a pena; acima de zero → vale com atenção;
 * zero ou menos → não vale a pena.
 * @param {number} lucro
 * @param {number} lucroMinimo
 */
export function seloDoLucro(lucro, lucroMinimo) {
  if (lucro >= lucroMinimo) return SELOS.valeAPena;
  if (lucro > 0) return SELOS.valeComAtencao;
  return SELOS.naoVale;
}

/**
 * Calcula o lucro da rota de um dia da agenda.
 *
 * @param {{ km: number, avisos: { fruta: string, caixas: number }[] }} dia
 * @param {Record<string, { preco: number }>} precos  preço da caixa no Ceasa, por fruta
 * @param {{ pagoProdutor: number, perda: number, kmPorLitro: number, diesel: number,
 *           desgastePorKm: number, outrosCustos: number, lucroMinimo: number }} custos
 */
export function calcularLucroDoDia(dia, precos, custos) {
  let caixas = 0;
  let receita = 0;
  /** @type {string[]} */
  const frutasSemPreco = [];

  for (const aviso of dia.avisos) {
    caixas += aviso.caixas;
    const preco = precos[aviso.fruta];
    if (preco) {
      receita += aviso.caixas * preco.preco;
    } else if (!frutasSemPreco.includes(aviso.fruta)) {
      // Sem preço do Ceasa a fruta entra na conta valendo zero, e a tela avisa.
      frutasSemPreco.push(aviso.fruta);
    }
  }

  const pagoProdutor = receita * custos.pagoProdutor;
  const perda = receita * custos.perda;
  const dieselDesgaste = dia.km * (custos.diesel / custos.kmPorLitro + custos.desgastePorKm);
  const custosRota = dieselDesgaste + custos.outrosCustos;
  const lucro = centavos(receita - pagoProdutor - perda - custosRota);

  return {
    caixas,
    receita: centavos(receita),
    pagoProdutor: centavos(pagoProdutor),
    perda: centavos(perda),
    dieselDesgaste: centavos(dieselDesgaste),
    outrosCustos: custos.outrosCustos,
    custosRota: centavos(custosRota),
    lucro,
    selo: seloDoLucro(lucro, custos.lucroMinimo),
    frutasSemPreco,
  };
}

/**
 * Formata em reais, do jeito do Figma: "R$ 1.344,00" e "−R$ 9,66".
 * @param {number} valor
 */
export function formatarReais(valor) {
  const arredondado = centavos(valor);
  const [inteiro, decimal] = Math.abs(arredondado).toFixed(2).split('.');
  const comPontos = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${arredondado < 0 ? '−' : ''}R$ ${comPontos},${decimal}`;
}
