import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Pressable, StyleSheet, Text, View } from 'react-native';

import { CampoNumerico } from '@/components/campo-numerico';
import { Lista } from '@/components/lista';
import { Tela } from '@/components/tela';
import { Cacua, Spacing } from '@/constants/theme';
import { useCacua } from '@/state/cacua';
import type { Custos } from '@/state/estado';
import { capitalizar } from '@/utils/agenda';
import type { Unidade } from '@/utils/custos';

/** Os custos do coletor, na ordem do Figma: nome, explicação e unidade do campo. */
const SEUS_CUSTOS: { campo: keyof Custos; nome: string; explicacao: string; unidade: Unidade }[] = [
  { campo: 'pagoProdutor', nome: 'Você paga ao produtor', explicacao: '% do preço de referência', unidade: 'porcentagem' },
  { campo: 'perda', nome: 'Perda estimada', explicacao: 'fruta que estraga no caminho', unidade: 'porcentagem' },
  { campo: 'kmPorLitro', nome: 'Consumo do veículo', explicacao: 'km por litro', unidade: 'kmPorLitro' },
  { campo: 'diesel', nome: 'Diesel', explicacao: 'R$ por litro (média ANP)', unidade: 'reais' },
  { campo: 'desgastePorKm', nome: 'Desgaste e manutenção', explicacao: 'R$ por km', unidade: 'reais' },
  { campo: 'outrosCustos', nome: 'Outros custos da viagem', explicacao: 'ajudante, taxa da Ceasa', unidade: 'reais' },
  { campo: 'lucroMinimo', nome: 'Lucro mínimo da viagem', explicacao: 'abaixo disso: “vale com atenção”', unidade: 'reais' },
];

export default function CustosScreen() {
  const { custos, precos, atualizarCustos, atualizarPreco, restaurarPadrao } = useCacua();
  // Muda a cada "Voltar aos valores do Figma": os campos renascem e perdem o que estava sendo digitado.
  const [geracao, setGeracao] = useState(0);

  // Sair da aba com o teclado aberto tira o foco do campo, e o valor digitado vale na Agenda.
  useFocusEffect(useCallback(() => () => Keyboard.dismiss(), []));

  function voltarAoFigma() {
    restaurarPadrao();
    setGeracao((atual) => atual + 1);
  }

  return (
    <Tela
      titulo="Custos e preços"
      descricao="Ceasa Cariri · preço mais comum no boletim de 22/09/2026.">
      <KeyboardAvoidingView behavior="padding" style={styles.teclado}>
        <Lista keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
          <View style={styles.grade}>
            {Object.entries(precos).map(([fruta, { preco, kg }]) => (
              <View key={fruta} style={styles.preco}>
                <Text style={styles.nome}>{capitalizar(fruta)}</Text>
                <Text style={styles.explicacao}>cx {kg} kg</Text>
                <View style={styles.campoPreco}>
                  <CampoNumerico
                    key={geracao}
                    valor={preco}
                    unidade="reais"
                    rotulo={`Preço da caixa de ${fruta}`}
                    onMudar={(novo) => atualizarPreco(fruta, novo)}
                  />
                </View>
              </View>
            ))}
          </View>

          <Text style={styles.tituloSecao}>Seus custos</Text>
          <View style={styles.cartao}>
            {SEUS_CUSTOS.map((item, i) => (
              <View key={item.campo} style={[styles.custo, i > 0 && styles.divisoria]}>
                <View style={styles.textos}>
                  <Text style={styles.nome}>{item.nome}</Text>
                  <Text style={styles.explicacao}>{item.explicacao}</Text>
                </View>
                <CampoNumerico
                  key={geracao}
                  valor={custos[item.campo]}
                  unidade={item.unidade}
                  rotulo={`${item.nome}: ${item.explicacao}`}
                  onMudar={(novo) => atualizarCustos({ [item.campo]: novo })}
                />
              </View>
            ))}
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={voltarAoFigma}
            style={({ pressed }) => [styles.botao, pressed && styles.botaoPressionado]}>
            <Text style={styles.botaoTexto}>Voltar aos valores do Figma</Text>
          </Pressable>
        </Lista>
      </KeyboardAvoidingView>
    </Tela>
  );
}

const styles = StyleSheet.create({
  teclado: {
    flex: 1,
  },
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
  campoPreco: {
    marginTop: Spacing.two,
  },
  botao: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Spacing.two + Spacing.one,
    borderWidth: 1.5,
    borderColor: Cacua.verde,
    backgroundColor: Cacua.superficie,
  },
  botaoPressionado: {
    backgroundColor: Cacua.verdeClaro,
  },
  botaoTexto: {
    fontSize: 16,
    fontWeight: 700,
    color: Cacua.verdeEscuro,
  },
});
