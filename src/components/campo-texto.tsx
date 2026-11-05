import { useState, type Ref } from 'react';
import { Text, TextInput, View, type TextInputInstance, type TextInputProps } from 'react-native';

import { Cacua } from '@/constants/theme';

import { styles } from './campo-texto.styles';

type CampoTextoProps = Omit<TextInputProps, 'style' | 'ref'> & {
  /** Para o "próximo" do teclado pular para este campo. */
  ref?: Ref<TextInputInstance>;
  /** O nome do campo, em cima dele ("Telefone (WhatsApp)"). */
  rotulo: string;
  /** A explicação embaixo do campo, quando não há erro. */
  dica?: string;
  /** O que está errado no campo; troca a dica e deixa a borda vermelha. */
  erro?: string;
};

/** Campo de texto do login e do cadastro, com o nome em cima e a dica ou o erro embaixo. */
export function CampoTexto({ ref, rotulo, dica, erro, onFocus, onBlur, ...props }: CampoTextoProps) {
  const [focado, setFocado] = useState(false);

  return (
    <View style={styles.campo}>
      <Text style={styles.rotulo}>{rotulo}</Text>
      <TextInput
        ref={ref}
        accessibilityLabel={rotulo}
        placeholderTextColor={Cacua.textoSecundario}
        onFocus={(evento) => {
          setFocado(true);
          onFocus?.(evento);
        }}
        onBlur={(evento) => {
          setFocado(false);
          onBlur?.(evento);
        }}
        style={[styles.entrada, focado && styles.entradaFocada, erro ? styles.entradaComErro : null]}
        {...props}
      />
      {erro ? (
        <Text style={styles.erro} accessibilityLiveRegion="polite">
          {erro}
        </Text>
      ) : dica ? (
        <Text style={styles.dica}>{dica}</Text>
      ) : null}
    </View>
  );
}
