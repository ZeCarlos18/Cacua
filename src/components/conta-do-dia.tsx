import { useHeaderHeight } from 'expo-router/react-navigation';
import { useState } from 'react';
import { KeyboardAvoidingView, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BarraCarga } from '@/components/barra-carga';
import { ConfirmarColeta } from '@/components/confirmar-coleta';
import { MudarAviso } from '@/components/mudar-aviso';
import { Selo } from '@/components/selo';
import { Spacing } from '@/constants/theme';
import type { agenda, custos as custosDoColetor } from '@/data/dados';
import type { Produtor } from '@/state/estado';
import { custoPorCaixa, quemAvisou, textoDaPorcentagem, textoDoKm } from '@/utils/conta';
import { formatarReais, type calcularLucroDoDia } from '@/utils/calculos';

import { styles } from './conta-do-dia.styles';

type ContaDoDiaProps = {
  /** O dia da agenda com o km da montarRota (diaComKm). */
  dia: (typeof agenda)[number] & { km: number };
  conta: ReturnType<typeof calcularLucroDoDia>;
  custos: typeof custosDoColetor;
  /** Os produtores do estado (S7.1), para o "Quem avisou". */
  produtores: Produtor[];
  cargaMinima: number;
  /** Se a coleta do dia já foi confirmada (S5.5). */
  confirmado: boolean;
  /** Ids dos produtores já coletados no dia: o aviso deles mostra "Coletado" e não muda (S7.5). */
  coletados: number[];
  onConfirmar: () => void;
  onDesfazer: () => void;
  /** Troca as caixas do aviso da posição no "Quem avisou" (S7.5). */
  onMudarCaixas: (posicao: number, caixas: number) => void;
  /** Tira o aviso da posição da agenda (S7.5). */
  onTirar: (posicao: number) => void;
};

/**
 * Conta do dia (S2.4), como a tela "Conta da quinta" do Figma: resumo do dia,
 * a conta do lucro, quanto cada caixa precisa render e quem avisou. No fim, o
 * "Confirmar coleta" (S5.5). Desde o S7.5, cada aviso do "Quem avisou" tem o "Mudar".
 */
export function ContaDoDia({
  dia,
  conta,
  custos,
  produtores,
  cargaMinima,
  confirmado,
  coletados,
  onConfirmar,
  onDesfazer,
  onMudarCaixas,
  onTirar,
}: ContaDoDiaProps) {
  const insets = useSafeAreaInsets();
  const alturaDaBarra = useHeaderHeight();
  // A posição do aviso com o "Mudar" aberto: um de cada vez.
  const [aberto, setAberto] = useState<number | null>(null);

  // Todos os avisos saíram (S7.2): sem viagem, não há conta nem coleta para confirmar.
  if (dia.avisos.length === 0) {
    return (
      <ScrollView style={styles.tela} contentContainerStyle={styles.conteudo}>
        <View style={styles.cartao}>
          <Text style={styles.data} accessibilityRole="header">
            {dia.dia} {dia.data}
          </Text>
          <Text style={styles.semAviso}>Nenhum aviso neste dia.</Text>
        </View>
      </ScrollView>
    );
  }

  return (
    // O campo de caixas do "Mudar" fica embaixo da barra com o título, então o teclado sobe
    // descontando a altura dela.
    <KeyboardAvoidingView style={styles.tela} behavior="padding" keyboardVerticalOffset={alturaDaBarra}>
      <ScrollView
        style={styles.tela}
        keyboardShouldPersistTaps="handled"
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
          {confirmado ? (
            <Text style={styles.aviso}>Dia confirmado. Desfaça a confirmação para mudar os avisos.</Text>
          ) : null}
          {quemAvisou(dia.avisos, produtores).map((aviso, posicao) => {
            const coletado = coletados.includes(dia.avisos[posicao].produtor);
            const mudando = aberto === posicao && !confirmado && !coletado;
            return (
              <View key={aviso.chave} style={styles.produtor}>
                <View style={styles.produtorTopo}>
                  <Text style={styles.produtorNome}>{aviso.nome}</Text>
                  <Text style={styles.produtorCaixas}>
                    {aviso.fruta} · {aviso.caixas} caixas
                  </Text>
                </View>
                <View style={styles.produtorBase}>
                  <Text style={styles.produtorDetalhe}>
                    {[aviso.sitio, aviso.canal].filter(Boolean).join(' · ')}
                  </Text>
                  {coletado ? <Selo texto="Coletado" cor="verde" /> : null}
                  {!coletado && !confirmado && !mudando ? (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`Mudar o aviso de ${aviso.nome}`}
                      onPress={() => setAberto(posicao)}
                      style={({ pressed }) => [styles.mudar, pressed && styles.mudarPressionado]}>
                      <Text style={styles.mudarTexto}>Mudar</Text>
                    </Pressable>
                  ) : null}
                </View>
                {mudando ? (
                  <MudarAviso
                    nome={aviso.nome}
                    fruta={aviso.fruta}
                    caixas={aviso.caixas}
                    onSalvar={(caixas) => {
                      onMudarCaixas(posicao, caixas);
                      setAberto(null);
                    }}
                    onTirar={() => {
                      onTirar(posicao);
                      setAberto(null);
                    }}
                    onCancelar={() => setAberto(null)}
                  />
                ) : null}
              </View>
            );
          })}
        </View>

        <ConfirmarColeta confirmado={confirmado} onConfirmar={onConfirmar} onDesfazer={onDesfazer} />
      </ScrollView>
    </KeyboardAvoidingView>
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
