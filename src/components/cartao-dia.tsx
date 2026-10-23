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
};

/**
 * Cartão de um dia da Agenda (S2.3), como no Figma: dia e Selo, frutas e sítios,
 * barra de carga, lucro estimado e o botão "Ver conta", que abre a Conta do dia (S2.4).
 */
export function CartaoDia({ dia, conta, cargaMinima }: CartaoDiaProps) {
  return (
    <View style={styles.cartao}>
      <View style={styles.cabecalho}>
        <Text style={styles.data}>
          {dia.dia} {dia.data}
        </Text>
        <Selo texto={conta.selo} />
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
