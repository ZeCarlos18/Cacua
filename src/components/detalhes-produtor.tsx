import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BarraCarga } from '@/components/barra-carga';
import { Selo } from '@/components/selo';
import type { CorDoSelo } from '@/components/selo.styles';
import { Spacing } from '@/constants/theme';
import { capitalizar } from '@/utils/agenda';
import { formatarReais } from '@/utils/calculos';
import { textoDaPorcentagem, textoDoKm } from '@/utils/conta';
import {
  comoAvisa,
  TEXTO_DA_SITUACAO,
  textoDasFrutasDoProdutor,
  totalDosAvisos,
  type AvisoDoProdutor,
  type SituacaoDoAviso,
} from '@/utils/produtores';
import { textoDasCaixas } from '@/utils/rota-do-dia';

import { styles } from './detalhes-produtor.styles';

const COR_DA_SITUACAO: Record<SituacaoDoAviso, CorDoSelo> = {
  coletado: 'cheio',
  confirmado: 'verde',
  aguardando: 'neutro',
};

type DetalhesDoProdutorProps = {
  produtor: { nome: string; sitio: string; frutas: string[]; canal: string };
  /** Os avisos cumpridos, com as coletas registradas no app (historicoDoProdutor). */
  historico: { cumpridos: number; avisos: number };
  /** De 0 a 100 (taxaDeCumprimento), ou null sem nenhum aviso. */
  taxa: number | null;
  /** Os km em linha reta do posto até o sítio, no mapa ilustrativo. */
  km: number;
  /** O texto da próxima colheita (proximaColheita), ou null. */
  proximaColheita: string | null;
  avisos: AvisoDoProdutor[];
  /** A parte do produtor no preço do Ceasa (0,8 = 80%), da aba Custos. */
  pagoProdutor: number;
  pontoFocal: string;
};

/**
 * Detalhes do produtor, abertos pela aba Produtores: o sítio, como ele avisa, a distância do
 * posto, os avisos cumpridos e os avisos desta semana, com quanto o coletor paga por eles.
 */
export function DetalhesDoProdutor({
  produtor,
  historico,
  taxa,
  km,
  proximaColheita,
  avisos,
  pagoProdutor,
  pontoFocal,
}: DetalhesDoProdutorProps) {
  const insets = useSafeAreaInsets();
  const total = totalDosAvisos(avisos);

  return (
    <ScrollView
      style={styles.tela}
      contentContainerStyle={[styles.conteudo, { paddingBottom: insets.bottom + Spacing.four }]}>
      <View style={styles.cartao}>
        <View style={styles.cabecalho}>
          <Text style={styles.sitio} accessibilityRole="header">
            {produtor.sitio}
          </Text>
          <Selo texto={produtor.canal} cor={produtor.canal === 'WhatsApp' ? 'verde' : 'vermelho'} />
        </View>
        <Linha rotulo="Frutas" valor={capitalizar(textoDasFrutasDoProdutor(produtor.frutas))} />
        <Linha rotulo="Distância do posto" valor={`${textoDoKm(km)} em linha reta`} />
        <Linha rotulo="Próxima colheita" valor={proximaColheita ?? 'Sem aviso nem previsão'} />
        <Text style={styles.nota}>{comoAvisa(produtor.canal, pontoFocal)}</Text>
      </View>

      <View style={styles.cartao}>
        <Text style={styles.tituloSecao} accessibilityRole="header">
          Avisos cumpridos
        </Text>
        <Text style={styles.numeroGrande}>
          {historico.cumpridos} de {historico.avisos}
        </Text>
        {taxa === null ? null : (
          <BarraCarga
            caixas={historico.cumpridos}
            cargaMinima={historico.avisos}
            texto={`${taxa}% dos avisos foram entregues como combinado`}
          />
        )}
        <Text style={styles.explicacao}>
          Conta as entregas que já estavam no histórico e as coletas registradas na aba Rota.
        </Text>
      </View>

      <View style={styles.cartao}>
        <Text style={styles.tituloSecao} accessibilityRole="header">
          Avisos na agenda
        </Text>
        {avisos.length === 0 ? (
          <Text style={styles.vazio}>Nenhum aviso desta semana.</Text>
        ) : (
          <>
            {avisos.map((aviso) => (
              <AvisoDaAgenda key={`${aviso.data}-${aviso.fruta}`} aviso={aviso} />
            ))}
            <View style={styles.total}>
              <Text style={styles.totalTexto}>{textoDasCaixas(total.caixas)} nesta semana</Text>
              <Text style={styles.explicacao}>
                Você paga cerca de {formatarReais(total.valor)} ({textoDaPorcentagem(pagoProdutor)}{' '}
                do preço do Ceasa){total.semPreco ? ', sem contar a fruta que não tem preço no Ceasa' : ''}.
              </Text>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}

function Linha({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <View style={styles.linha}>
      <Text style={styles.rotulo}>{rotulo}</Text>
      <Text style={styles.valor}>{valor}</Text>
    </View>
  );
}

function AvisoDaAgenda({ aviso }: { aviso: AvisoDoProdutor }) {
  const preco =
    aviso.precoDaCaixa === null ? 'sem preço no Ceasa' : `${formatarReais(aviso.precoDaCaixa)} a caixa`;

  return (
    <View style={styles.aviso}>
      <View style={styles.cabecalho}>
        <Text style={styles.diaDoAviso}>
          {aviso.dia} {aviso.data}
        </Text>
        <Selo texto={TEXTO_DA_SITUACAO[aviso.situacao]} cor={COR_DA_SITUACAO[aviso.situacao]} />
      </View>
      <Text style={styles.detalhe}>
        {capitalizar(aviso.fruta)} · {textoDasCaixas(aviso.caixas)} · {preco}
      </Text>
      {aviso.valorDoProdutor === null ? null : (
        <Text style={styles.valorDoAviso}>Você paga cerca de {formatarReais(aviso.valorDoProdutor)}</Text>
      )}
    </View>
  );
}

/** Quando o endereço tem um id que não está no dados.js (/produtor/99). */
export function ProdutorNaoEncontrado() {
  return <Text style={styles.naoEncontrado}>Não achamos esse produtor. Volte e escolha outro na lista.</Text>;
}
