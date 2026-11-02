import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';

import { lerCampo, textoDoCampo, type Unidade } from '@/utils/custos';

import { styles } from './campo-numerico.styles';

const PREFIXO: Partial<Record<Unidade, string>> = { reais: 'R$' };
const SUFIXO: Partial<Record<Unidade, string>> = { porcentagem: '%', kmPorLitro: 'km/l' };

type CampoNumericoProps = {
  /** O valor no estado (0.8 para 80%). */
  valor: number;
  unidade: Unidade;
  /** O que o leitor de tela anuncia, como "Preço da caixa de banana". */
  rotulo: string;
  /** Recebe o valor para o estado, só quando ele é aceito e mudou. */
  onMudar: (valor: number) => void;
};

/**
 * Campo de um custo ou preço (S4.3), com teclado numérico e vírgula. O valor só vale ao sair do
 * campo: enquanto digita, ele fica no rascunho, para apagar "6,97" não virar 6,9 e 6 no estado.
 * Se o que foi digitado não vale (vazio, negativo, não é número), o campo volta para o valor anterior.
 */
export function CampoNumerico({ valor, unidade, rotulo, onMudar }: CampoNumericoProps) {
  const [rascunho, setRascunho] = useState<string | null>(null);
  const prefixo = PREFIXO[unidade];
  const sufixo = SUFIXO[unidade];

  function confirmar() {
    if (rascunho === null) return;
    const novo = lerCampo(rascunho, unidade);
    if (novo !== null && novo !== valor) onMudar(novo);
    setRascunho(null);
  }

  return (
    <View style={[styles.campo, rascunho !== null && styles.campoEditando]}>
      {prefixo ? <Text style={styles.unidade}>{prefixo}</Text> : null}
      <TextInput
        accessibilityLabel={rotulo}
        keyboardType="decimal-pad"
        selectTextOnFocus
        value={rascunho ?? textoDoCampo(valor, unidade)}
        onFocus={() => setRascunho(textoDoCampo(valor, unidade))}
        onChangeText={setRascunho}
        onBlur={confirmar}
        style={styles.entrada}
      />
      {sufixo ? <Text style={styles.unidade}>{sufixo}</Text> : null}
    </View>
  );
}
