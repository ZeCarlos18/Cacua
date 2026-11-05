import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Pressable, ScrollView, Text, View, type TextInputInstance } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { styles } from '@/components/acesso.styles';
import { CampoTexto } from '@/components/campo-texto';
import { Spacing } from '@/constants/theme';
import { useAcesso } from '@/state/acesso';
import { SENHA_MINIMA, type CamposDoCadastro, type ErrosDoCadastro } from '@/state/acesso-regras';

const VAZIO: CamposDoCadastro = { nome: '', telefone: '', regiao: '', senha: '', repetirSenha: '' };

/**
 * Criar conta: o cadastro do coletor, guardado só neste celular. Ao criar, o coletor já entra, e
 * as rotas protegidas do _layout levam para o Início.
 */
export default function CadastroScreen() {
  const insets = useSafeAreaInsets();
  const { cadastrar } = useAcesso();
  const [campos, setCampos] = useState(VAZIO);
  const [erros, setErros] = useState<ErrosDoCadastro>({});
  const telefone = useRef<TextInputInstance>(null);
  const regiao = useRef<TextInputInstance>(null);
  const senha = useRef<TextInputInstance>(null);
  const repetirSenha = useRef<TextInputInstance>(null);

  function mudar(campo: keyof CamposDoCadastro, valor: string) {
    setCampos((atuais) => ({ ...atuais, [campo]: valor }));
    // O erro do campo some quando ele é corrigido; os outros ficam até tentar de novo.
    setErros((atuais) => ({ ...atuais, [campo]: undefined }));
  }

  function criarConta() {
    setErros(cadastrar(campos) ?? {});
  }

  const temErro = Object.values(erros).some(Boolean);

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.tela}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.conteudo,
          { paddingTop: Spacing.three, paddingBottom: insets.bottom + Spacing.four },
        ]}>
        <Text style={styles.frase}>
          Com a conta, a agenda, as rotas e os seus custos ficam com o seu nome neste celular.
        </Text>

        <View style={styles.cartao}>
          <CampoTexto
            rotulo="Seu nome"
            placeholder="Como os produtores te conhecem"
            autoComplete="name"
            textContentType="name"
            autoCapitalize="words"
            returnKeyType="next"
            value={campos.nome}
            erro={erros.nome}
            onChangeText={(texto) => mudar('nome', texto)}
            onSubmitEditing={() => telefone.current?.focus()}
          />
          <CampoTexto
            ref={telefone}
            rotulo="Telefone (WhatsApp)"
            placeholder="(88) 99999-0000"
            dica="É com ele que você entra no app."
            keyboardType="phone-pad"
            autoComplete="tel"
            textContentType="telephoneNumber"
            returnKeyType="next"
            value={campos.telefone}
            erro={erros.telefone}
            onChangeText={(texto) => mudar('telefone', texto)}
            onSubmitEditing={() => regiao.current?.focus()}
          />
          <CampoTexto
            ref={regiao}
            rotulo="Região onde você compra"
            placeholder="Ex.: Boa Vista"
            autoCapitalize="words"
            returnKeyType="next"
            value={campos.regiao}
            erro={erros.regiao}
            onChangeText={(texto) => mudar('regiao', texto)}
            onSubmitEditing={() => senha.current?.focus()}
          />
          <CampoTexto
            ref={senha}
            rotulo="Senha"
            dica={`Pelo menos ${SENHA_MINIMA} letras ou números. Evite 123456.`}
            secureTextEntry
            autoComplete="new-password"
            textContentType="newPassword"
            returnKeyType="next"
            value={campos.senha}
            erro={erros.senha}
            onChangeText={(texto) => mudar('senha', texto)}
            onSubmitEditing={() => repetirSenha.current?.focus()}
          />
          <CampoTexto
            ref={repetirSenha}
            rotulo="Repita a senha"
            secureTextEntry
            autoComplete="new-password"
            textContentType="newPassword"
            returnKeyType="done"
            value={campos.repetirSenha}
            erro={erros.repetirSenha}
            onChangeText={(texto) => mudar('repetirSenha', texto)}
            onSubmitEditing={criarConta}
          />
          {temErro ? (
            <Text style={styles.erro} accessibilityLiveRegion="polite">
              Confira os campos marcados em vermelho.
            </Text>
          ) : null}
          <Pressable
            accessibilityRole="button"
            onPress={criarConta}
            style={({ pressed }) => [styles.botao, pressed && styles.botaoPressionado]}>
            <Text style={styles.botaoTexto}>Criar conta e entrar</Text>
          </Pressable>
        </View>

        <Text style={styles.nota}>
          Protótipo: a conta fica só neste celular. A senha não é guardada, só um resumo dela.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
