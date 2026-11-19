import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { lerPorcentagemCombinada } from '@/utils/produtores';
import { textoDoCampo } from '@/utils/custos';

import { styles as estiloDoCampo } from './campo-numerico.styles';
import { styles } from './mudar-preco-combinado.styles';

type MudarPrecoCombinadoProps = {
  /** O que o produtor recebe hoje, no valor do estado (0.8 → "80" no campo). */
  fracao: number;
  /** Se já tem preço combinado: só aí o "Voltar ao padrão" faz alguma coisa. */
  combinado: boolean;
  /** A porcentagem nova, no valor do estado (0.85), ou null para voltar ao padrão. */
  onSalvar: (fracao: number | null) => void;
  onCancelar: () => void;
};

/**
 * O "Mudar" aberto nos detalhes do produtor (S9.5): o campo da porcentagem e os botões "Salvar",
 * "Voltar ao padrão" e "Cancelar". O campo tem a mesma cara do de Custos e preços, mas o valor só
 * é lido ao tocar em "Salvar" (como o CampoCaixas do Mudar aviso): assim o "Salvar" vale também no
 * celular, onde o teclado aberto mantém o foco no campo ao tocar no botão.
 */
export function MudarPrecoCombinado({ fracao, combinado, onSalvar, onCancelar }: MudarPrecoCombinadoProps) {
  const [texto, setTexto] = useState(textoDoCampo(fracao, 'porcentagem'));
  const nova = lerPorcentagemCombinada(texto);

  return (
    <View style={styles.caixa}>
      <Text style={styles.rotulo}>Porcentagem do preço do Ceasa</Text>
      <View style={[estiloDoCampo.campo, estiloDoCampo.campoEditando]}>
        <TextInput
          accessibilityLabel="Porcentagem do preço do Ceasa que ele recebe"
          keyboardType="decimal-pad"
          selectTextOnFocus
          value={texto}
          onChangeText={setTexto}
          style={estiloDoCampo.entrada}
        />
        <Text style={estiloDoCampo.unidade}>%</Text>
      </View>
      {nova === null ? <Text style={styles.erro}>Digite uma porcentagem de 1 a 100.</Text> : null}
      <View style={styles.botoes}>
        <Botao texto="Salvar" tipo="cheio" desligado={nova === null} onPress={() => nova !== null && onSalvar(nova)} />
        {combinado ? <Botao texto="Voltar ao padrão" tipo="contorno" onPress={() => onSalvar(null)} /> : null}
        <Botao texto="Cancelar" tipo="texto" onPress={onCancelar} />
      </View>
    </View>
  );
}

type BotaoProps = {
  texto: string;
  tipo: 'cheio' | 'contorno' | 'texto';
  desligado?: boolean;
  onPress: () => void;
};

function Botao({ texto, tipo, desligado, onPress }: BotaoProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: desligado }}
      disabled={desligado}
      onPress={onPress}
      style={({ pressed }) => [styles.botao, styles[tipo], pressed && styles.pressionado, desligado && styles.desligado]}>
      <Text style={[styles.botaoTexto, styles[`${tipo}Texto`]]}>{texto}</Text>
    </Pressable>
  );
}
