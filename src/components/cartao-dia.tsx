import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { BarraCarga } from '@/components/barra-carga';
import { Selo } from '@/components/selo';
import type { agenda } from '@/data/dados';
import { hrefDaConta, resumoDasFrutas, textoDosSitios } from '@/utils/agenda';
import { formatarReais, type calcularLucroDoDia } from '@/utils/calculos';

import { styles } from './cartao-dia.styles';

type CartaoDiaProps = {
  dia: (typeof agenda)[number];
  conta: ReturnType<typeof calcularLucroDoDia>;
  cargaMinima: number;
  /** Se a coleta do dia já foi confirmada na Conta do dia (S5.5). */
  confirmado: boolean;
};

/**
 * Cartão de um dia da Agenda (S2.3), como no Figma: dia e Selo, frutas e sítios,
 * barra de carga, lucro estimado e o botão "Ver conta", que abre a Conta do dia (S2.4).
 * Depois de confirmar a coleta, o dia ganha o selo "Confirmada" (S5.5).
 */
export function CartaoDia({ dia, conta, cargaMinima, confirmado }: CartaoDiaProps) {
  // Todos os avisos saíram (S7.5): sem viagem, o dia não tem selo nem lucro.
  if (dia.avisos.length === 0) {
    return (
      <View style={styles.cartao}>
        <Text style={styles.data}>
          {dia.dia} {dia.data}
        </Text>
        <Text style={styles.sitios}>Nenhum aviso</Text>
      </View>
    );
  }

  return (
    <View style={styles.cartao}>
      <View style={styles.cabecalho}>
        <Text style={styles.data}>
          {dia.dia} {dia.data}
        </Text>
        {/* O "Confirmada" fica embaixo do selo do dia: os dois lado a lado não cabem com a data. */}
        <View style={styles.selos}>
          <Selo texto={conta.selo} />
          {confirmado ? <Selo texto="Confirmada" cor="cheio" /> : null}
        </View>
      </View>

      <View>
        <Text style={styles.frutas}>{resumoDasFrutas(dia.avisos)}</Text>
        <Text style={styles.sitios}>{textoDosSitios(dia.avisos)}</Text>
      </View>

      <BarraCarga caixas={conta.caixas} cargaMinima={cargaMinima} />

      <Text style={styles.lucro}>
        Lucro estimado: <Text style={styles.lucroValor}>{formatarReais(conta.lucro)}</Text>
      </Text>

      {conta.frutasSemPreco.length > 0 ? (
        <Text style={styles.aviso}>Sem preço do Ceasa: {conta.frutasSemPreco.join(', ')}</Text>
      ) : null}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Ver conta de ${dia.dia} ${dia.data}`}
        onPress={() => router.push(hrefDaConta(dia.data))}
        style={({ pressed }) => [styles.botao, pressed && styles.botaoPressionado]}>
        <Text style={styles.botaoTexto}>Ver conta</Text>
      </Pressable>
    </View>
  );
}
