import { useState, type Ref, type RefObject } from 'react';
import { Pressable, Text, TextInput, View, type TextInputInstance, type TextInputProps } from 'react-native';

import { styles } from './campo-texto.styles';

/** O que muda no teclado e no preenchimento automático do celular para cada tipo de campo. */
const TECLADO = {
  nome: { autoCapitalize: 'words', autoComplete: 'name' },
  texto: { autoCapitalize: 'words' },
  telefone: { keyboardType: 'phone-pad', autoComplete: 'tel' },
  senha: { autoCapitalize: 'none', autoCorrect: false, autoComplete: 'current-password' },
  novaSenha: { autoCapitalize: 'none', autoCorrect: false, autoComplete: 'new-password' },
} satisfies Record<string, TextInputProps>;

export type TipoDoCampo = keyof typeof TECLADO;

type CampoTextoProps = {
  /** O texto em cima do campo, que o leitor de tela também anuncia. */
  rotulo: string;
  valor: string;
  onMudar: (texto: string) => void;
  /** Aparece embaixo do campo, em vermelho. */
  erro?: string;
  tipo?: TipoDoCampo;
  /** Para o campo anterior chegar até este pelo "próximo" do teclado. */
  ref?: Ref<TextInputInstance>;
  /** O campo seguinte: o "próximo" do teclado leva até ele. */
  proximo?: RefObject<TextInputInstance | null>;
  /** No último campo, o "concluir" do teclado faz o mesmo que o botão do formulário. */
  onConcluir?: () => void;
};

/**
 * Campo de texto com rótulo e erro embaixo (S6.4), usado em Entrar e Criar conta. Os campos de
 * senha ficam escondidos e têm o "Mostrar", para conferir o que foi digitado.
 */
export function CampoTexto({
  rotulo,
  valor,
  onMudar,
  erro,
  tipo = 'texto',
  ref,
  proximo,
  onConcluir,
}: CampoTextoProps) {
  const [focado, setFocado] = useState(false);
  const [mostrando, setMostrando] = useState(false);
  const ehSenha = tipo === 'senha' || tipo === 'novaSenha';

  return (
    <View style={styles.campo}>
      <Text style={styles.rotulo}>{rotulo}</Text>
      <View style={[styles.caixa, focado && styles.caixaFocada, erro && styles.caixaComErro]}>
        <TextInput
          ref={ref}
          accessibilityLabel={rotulo}
          accessibilityHint={erro}
          value={valor}
          onChangeText={onMudar}
          onFocus={() => setFocado(true)}
          onBlur={() => setFocado(false)}
          secureTextEntry={ehSenha && !mostrando}
          returnKeyType={proximo ? 'next' : 'done'}
          submitBehavior={proximo ? 'submit' : 'blurAndSubmit'}
          onSubmitEditing={() => (proximo ? proximo.current?.focus() : onConcluir?.())}
          style={styles.entrada}
          {...TECLADO[tipo]}
        />
        {ehSenha ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={mostrando ? `Ocultar ${rotulo.toLowerCase()}` : `Mostrar ${rotulo.toLowerCase()}`}
            onPress={() => setMostrando(!mostrando)}
            hitSlop={8}
            style={styles.mostrar}>
            <Text style={styles.mostrarTexto}>{mostrando ? 'Ocultar' : 'Mostrar'}</Text>
          </Pressable>
        ) : null}
      </View>
      {erro ? (
        <Text style={styles.erro} accessibilityLiveRegion="polite">
          {erro}
        </Text>
      ) : null}
    </View>
  );
}
