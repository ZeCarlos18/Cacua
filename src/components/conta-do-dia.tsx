import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BarraCarga } from '@/components/barra-carga';
import { Selo } from '@/components/selo';
import { Spacing } from '@/constants/theme';
import type { agenda, custos as custosDoColetor, produtores as produtoresDoColetor } from '@/data/dados';
import { custoPorCaixa, quemAvisou, textoDaPorcentagem, textoDoKm } from '@/utils/conta';
import { formatarReais, type calcularLucroDoDia } from '@/utils/calculos';

import { styles } from './conta-do-dia.styles';

type ContaDoDiaProps = {
  /** O dia da agenda com o km da montarRota (diaComKm). */
  dia: (typeof agenda)[number] & { km: number };
  conta: ReturnType<typeof calcularLucroDoDia>;
  custos: typeof custosDoColetor;
  produtores: typeof produtoresDoColetor;
  cargaMinima: number;
};

/**
 * Conta do dia (S2.4), como a tela "Conta da quinta" do Figma: resumo do dia,
 * a conta do lucro, quanto cada caixa precisa render e quem avisou.
 */
export function ContaDoDia({ dia, conta, custos, produtores, cargaMinima }: ContaDoDiaProps) {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.tela}
      contentContainerStyle={[styles.conteudo, { paddingBottom: insets.bottom + Spacing.four }]}>
      <View style={styles.cartao}>
        <View style={styles.cabecalho}>
          <Text style={styles.data} accessibilityRole="header">
            {dia.dia} {dia.data}
          </Text>
          <Selo texto={conta.selo} />
        </View>
        <BarraCarga caixas={conta.caixas} cargaMinima={cargaMinima} />
      </View>

      <View style={styles.cartao}>
        <Text style={styles.tituloSecao} accessibilityRole="header">
          Vale a pena mesmo assim?
        </Text>

        <View>
          <Linha rotulo="Venda no Ceasa" valor={conta.receita} />
          <Linha
            rotulo={`Pago aos produtores (${textoDaPorcentagem(custos.pagoProdutor)})`}
            valor={-conta.pagoProdutor}
          />
          <Linha rotulo={`Perda estimada (${textoDaPorcentagem(custos.perda)})`} valor={-conta.perda} />
          <Linha rotulo={`Diesel e desgaste (${textoDoKm(dia.km)})`} valor={-conta.dieselDesgaste} />
          <Linha rotulo="Outros custos" valor={-conta.outrosCustos} />
          <View style={styles.divisor} />
          <Linha rotulo="Lucro estimado" valor={conta.lucro} destaque />
        </View>

        {conta.frutasSemPreco.length > 0 ? (
          <Text style={styles.aviso}>Sem preço do Ceasa: {conta.frutasSemPreco.join(', ')}</Text>
        ) : null}

        <View style={styles.dica}>
          <Text style={styles.dicaTexto}>
            Os custos desta rota somam{' '}
            <Text style={styles.forte}>{formatarReais(conta.custosRota)}</Text>. Você cobre esse
            valor se ganhar a partir de{' '}
            <Text style={styles.forte}>
              {formatarReais(custoPorCaixa(conta.custosRota, conta.caixas))}
            </Text>{' '}
            por caixa.
          </Text>
        </View>
      </View>

      <View style={styles.cartao}>
        <Text style={styles.tituloSecao} accessibilityRole="header">
          Quem avisou
        </Text>
        {quemAvisou(dia.avisos, produtores).map((aviso) => (
          <View key={aviso.chave} style={styles.produtor}>
            <View style={styles.produtorTopo}>
              <Text style={styles.produtorNome}>{aviso.nome}</Text>
              <Text style={styles.produtorCaixas}>
                {aviso.fruta} · {aviso.caixas} caixas
              </Text>
            </View>
            <Text style={styles.produtorDetalhe}>
              {[aviso.sitio, aviso.canal].filter(Boolean).join(' · ')}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

/** Quando o endereço aponta para um dia que não está na agenda. */
export function ContaNaoEncontrada() {
  return (
    <View style={styles.vazio}>
      <Text style={styles.vazioTexto}>Não achamos esse dia na agenda.</Text>
    </View>
  );
}

type LinhaProps = {
  rotulo: string;
  valor: number;
  destaque?: boolean;
};

/** Uma linha da conta: rótulo à esquerda, valor à direita ("−R$ 70,00" para custos). */
function Linha({ rotulo, valor, destaque }: LinhaProps) {
  return (
    <View style={styles.linha}>
      <Text style={[styles.rotulo, destaque && styles.rotuloDestaque]}>{rotulo}</Text>
      <Text
        style={[
          styles.valor,
          destaque && styles.valorDestaque,
          destaque && valor < 0 && styles.valorNegativo,
        ]}>
        {formatarReais(valor)}
      </Text>
    </View>
  );
}
