import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Pressable, ScrollView, Text, View, type TextInputInstance } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { styles } from '@/components/acesso.styles';
import { CampoTexto } from '@/components/campo-texto';
import { Spacing } from '@/constants/theme';
import { coletor as coletorDeExemplo } from '@/data/dados';
import { useAcesso } from '@/state/acesso';

/**
 * Entrar: a primeira tela de quem ainda não entrou. O coletor entra com o telefone e a senha do
 * cadastro, cria uma conta ou usa a conta de exemplo (Edson) para conhecer o protótipo.
 */
export default function EntrarScreen() {
  const insets = useSafeAreaInsets();
  const { entrar, entrarComExemplo } = useAcesso();
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const campoSenha = useRef<TextInputInstance>(null);

  function tentarEntrar() {
    if (!telefone.trim() || !senha) {
      setErro('Escreva o telefone e a senha.');
      return;
    }
    // Se der certo, as rotas protegidas do _layout levam para o Início sozinhas.
    if (!entrar(telefone, senha)) setErro('Telefone ou senha não conferem. Confira e tente de novo.');
  }

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.tela}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.conteudo,
          { paddingTop: insets.top + Spacing.four, paddingBottom: insets.bottom + Spacing.four },
        ]}>
        <View style={styles.marca}>
          <Image
            source={require('@/assets/images/logo-cacua.png')}
            style={styles.logo}
            accessibilityLabel="Logo do Caçuá"
          />
          <Text style={styles.nomeDoApp} accessibilityRole="header">
            Caçuá
          </Text>
          <Text style={styles.frase}>A colheita de todo sítio no caminho do comprador.</Text>
        </View>

        <View style={styles.cartao}>
          <Text style={styles.titulo}>Entrar</Text>
          <CampoTexto
            rotulo="Telefone (WhatsApp)"
            placeholder="(88) 99999-0000"
            keyboardType="phone-pad"
            autoComplete="tel"
            textContentType="telephoneNumber"
            returnKeyType="next"
            value={telefone}
            onChangeText={(texto) => {
              setTelefone(texto);
              setErro(null);
            }}
            onSubmitEditing={() => campoSenha.current?.focus()}
          />
          <CampoTexto
            ref={campoSenha}
            rotulo="Senha"
            secureTextEntry
            autoComplete="current-password"
            textContentType="password"
            returnKeyType="go"
            value={senha}
            onChangeText={(texto) => {
              setSenha(texto);
              setErro(null);
            }}
            onSubmitEditing={tentarEntrar}
          />
          {erro ? (
            <Text style={styles.erro} accessibilityLiveRegion="polite">
              {erro}
            </Text>
          ) : null}
          <Pressable
            accessibilityRole="button"
            onPress={tentarEntrar}
            style={({ pressed }) => [styles.botao, pressed && styles.botaoPressionado]}>
            <Text style={styles.botaoTexto}>Entrar</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/cadastro')}
            style={({ pressed }) => [styles.botaoContorno, pressed && styles.botaoContornoPressionado]}>
            <Text style={styles.botaoContornoTexto}>Criar conta</Text>
          </Pressable>
        </View>

        <View style={styles.exemplo}>
          <Text style={styles.exemploTexto}>
            Só quer conhecer o protótipo? Entre com o {coletorDeExemplo.nome}, o coletor de exemplo da região{' '}
            {coletorDeExemplo.regiao}.
          </Text>
          <Pressable accessibilityRole="button" onPress={entrarComExemplo} style={styles.link}>
            <Text style={styles.linkTexto}>Entrar com a conta de exemplo</Text>
          </Pressable>
        </View>

        <Text style={styles.nota}>A conta fica guardada só neste celular.</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
