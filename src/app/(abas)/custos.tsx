import { StyleSheet, Text, View } from 'react-native';

import { Lista } from '@/components/lista';
import { Tela } from '@/components/tela';
import { Cacua, Spacing } from '@/constants/theme';
import { custos, precos } from '@/data/dados';
import { capitalizar } from '@/utils/agenda';
import { formatarReais } from '@/utils/calculos';
import { textoDaPorcentagem } from '@/utils/conta';

/** Os custos do coletor, na ordem do Figma: nome, explicação e valor. */
const seusCustos = [
  { nome: 'Você paga ao produtor', explicacao: '% do preço de referência', valor: textoDaPorcentagem(custos.pagoProdutor) },
  { nome: 'Perda estimada', explicacao: 'fruta que estraga no caminho', valor: textoDaPorcentagem(custos.perda) },
  { nome: 'Consumo do veículo', explicacao: 'km por litro', valor: `${custos.kmPorLitro} km/l` },
  { nome: 'Diesel', explicacao: 'R$ por litro (média ANP)', valor: formatarReais(custos.diesel) },
  { nome: 'Desgaste e manutenção', explicacao: 'R$ por km', valor: formatarReais(custos.desgastePorKm) },
  { nome: 'Outros custos da viagem', explicacao: 'ajudante, taxa da Ceasa', valor: formatarReais(custos.outrosCustos) },
  { nome: 'Lucro mínimo da viagem', explicacao: 'abaixo disso: “vale com atenção”', valor: formatarReais(custos.lucroMinimo) },
];

export default function CustosScreen() {
  return (
    <Tela
      titulo="Custos e preços"
      descricao="Ceasa Cariri · preço mais comum no boletim de 22/09/2026.">
      <Lista>
        <View style={styles.grade}>
          {Object.entries(precos).map(([fruta, { preco, kg }]) => (
            <View key={fruta} style={styles.preco}>
              <Text style={styles.nome}>{capitalizar(fruta)}</Text>
              <Text style={styles.explicacao}>cx {kg} kg</Text>
              <Text style={styles.valorPreco}>{formatarReais(preco)}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.tituloSecao}>Seus custos</Text>
        <View style={styles.cartao}>
          {seusCustos.map((item, i) => (
            <View key={item.nome} style={[styles.custo, i > 0 && styles.divisoria]}>
              <View style={styles.textos}>
                <Text style={styles.nome}>{item.nome}</Text>
                <Text style={styles.explicacao}>{item.explicacao}</Text>
              </View>
              <Text style={styles.valor}>{item.valor}</Text>
            </View>
          ))}
        </View>
      </Lista>
    </Tela>
  );
}

const styles = StyleSheet.create({
  grade: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  preco: {
    width: '48%',
    padding: Spacing.three,
    borderRadius: Spacing.three,
    borderWidth: 1,
    borderColor: Cacua.borda,
    backgroundColor: Cacua.superficie,
  },
  tituloSecao: {
    fontSize: 20,
    fontWeight: 700,
    color: Cacua.texto,
  },
  cartao: {
    borderRadius: Spacing.three,
    borderWidth: 1,
    borderColor: Cacua.borda,
    backgroundColor: Cacua.superficie,
  },
  custo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
  },
  divisoria: {
    borderTopWidth: 1,
    borderTopColor: Cacua.borda,
  },
  textos: {
    flex: 1,
  },
  nome: {
    fontSize: 16,
    fontWeight: 700,
    color: Cacua.texto,
  },
  explicacao: {
    fontSize: 14,
    color: Cacua.textoSecundario,
  },
  valor: {
    fontSize: 16,
    fontWeight: 700,
    color: Cacua.texto,
  },
  valorPreco: {
    marginTop: Spacing.two,
    fontSize: 18,
    fontWeight: 700,
    color: Cacua.verdeEscuro,
  },
});
