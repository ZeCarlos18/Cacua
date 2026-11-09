import { Image } from 'expo-image';
import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Pressable, ScrollView, Text, View, type TextInputInstance } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CampoTexto } from '@/components/campo-texto';
import { Spacing } from '@/constants/theme';

import { styles } from './formulario-entrar.styles';

const ERRO_AO_ENTRAR = 'Telefone ou senha não conferem. Confira e tente de novo.';

type FormularioEntrarProps = {
  /** Devolve false se o telefone e a senha não conferem. */
  onEntrar: (telefone: string, senha: string) => boolean;
  onCriarConta: () => void;
  onEntrarComExemplo: () => void;
};

/**
 * Tela Entrar (S6.4): logo, telefone, senha e os botões Entrar, Criar conta e a conta de exemplo,
 * para apresentar o app sem cadastrar. O erro some quando a pessoa mexe num dos campos.
 */
export function FormularioEntrar({ onEntrar, onCriarConta, onEntrarComExemplo }: FormularioEntrarProps) {
  const insets = useSafeAreaInsets();
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [errou, setErrou] = useState(false);
  const campoSenha = useRef<TextInputInstance>(null);

  function entrar() {
    // Com um campo vazio, não confere: o erro é o mesmo.
    if (!onEntrar(telefone, senha)) setErrou(true);
  }

  function mudar(setCampo: (texto: string) => void) {
    return (texto: string) => {
      setCampo(texto);
      setErrou(false);
    };
  }

  return (
    <KeyboardAvoidingView style={styles.tela} behavior="padding">
      <ScrollView
        contentContainerStyle={[
          styles.conteudo,
          { paddingTop: insets.top + Spacing.five, paddingBottom: insets.bottom + Spacing.four },
        ]}
        keyboardShouldPersistTaps="handled">
        <View style={styles.marca}>
          <Image
            source={require('@/assets/images/logo-cacua.png')}
            style={styles.logo}
            accessibilityIgnoresInvertColors
          />
          <Text style={styles.nome} accessibilityRole="header">
            Caçuá
          </Text>
          <Text style={styles.frase}>Os avisos de colheita viram a sua rota e o seu lucro.</Text>
        </View>

        <View style={styles.campos}>
          <CampoTexto
            rotulo="Telefone (WhatsApp)"
            tipo="telefone"
            valor={telefone}
            onMudar={mudar(setTelefone)}
            proximo={campoSenha}
          />
          <CampoTexto
            ref={campoSenha}
            rotulo="Senha"
            tipo="senha"
            valor={senha}
            onMudar={mudar(setSenha)}
            onConcluir={entrar}
          />
          {errou ? (
            <View style={styles.erro} accessibilityLiveRegion="polite">
              <Text style={styles.erroTexto}>{ERRO_AO_ENTRAR}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.botoes}>
          <Pressable
            accessibilityRole="button"
            onPress={entrar}
            style={({ pressed }) => [styles.botao, pressed && styles.botaoPressionado]}>
            <Text style={styles.botaoTexto}>Entrar</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={onCriarConta}
            style={({ pressed }) => [styles.botaoContorno, pressed && styles.botaoContornoPressionado]}>
            <Text style={styles.botaoContornoTexto}>Criar conta</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityHint="Abre o app como o Edson, sem cadastrar"
            onPress={onEntrarComExemplo}
            style={styles.link}>
            <Text style={styles.linkTexto}>Entrar com a conta de exemplo</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
