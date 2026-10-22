import { StyleSheet, Text, View } from 'react-native';

import { Tela } from '@/components/tela';
import { Cacua, Spacing } from '@/constants/theme';
import { agenda, coletor, custos, precos } from '@/data/dados';
import { calcularLucroDoDia, formatarReais } from '@/utils/calculos';

export default function AgendaScreen() {
  return (
    <Tela titulo="Agenda" descricao="Próximas coletas e se vale a pena passar em cada dia.">
      {/* S1.6: uma linha por dia com o lucro da rota. O visual do Figma vem depois. */}
      <View style={styles.lista}>
        {agenda.map((dia) => {
          const conta = calcularLucroDoDia(dia, precos, custos);
          const linha =
            `${dia.dia.slice(0, 3)} ${dia.data} · ` +
            `${conta.caixas} de ${coletor.cargaMinima} caixas · ` +
            `Lucro ${formatarReais(conta.lucro)} · ${conta.selo}`;

          return (
            <View key={dia.data}>
              <Text style={styles.linha}>{linha}</Text>
              {conta.frutasSemPreco.length > 0 ? (
                <Text style={styles.aviso}>Sem preço do Ceasa: {conta.frutasSemPreco.join(', ')}</Text>
              ) : null}
            </View>
          );
        })}
      </View>
    </Tela>
  );
}

const styles = StyleSheet.create({
  lista: {
    marginTop: Spacing.three,
    gap: Spacing.three,
  },
  linha: {
    fontSize: 16,
    lineHeight: 22,
    color: Cacua.texto,
  },
  aviso: {
    fontSize: 14,
    color: Cacua.textoSecundario,
  },
});
