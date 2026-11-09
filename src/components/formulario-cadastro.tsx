import { useHeaderHeight } from 'expo-router/react-navigation';
import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Pressable, ScrollView, Text, type TextInputInstance } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CampoTexto } from '@/components/campo-texto';
import { Spacing } from '@/constants/theme';
import type { CamposDoCadastro, ErrosDoCadastro } from '@/state/acesso-regras';

import { styles } from './formulario-cadastro.styles';

const VAZIO: CamposDoCadastro = { nome: '', telefone: '', regiao: '', senha: '', repetirSenha: '' };

type FormularioCadastroProps = {
  /** Devolve os erros de cada campo, ou null se deu certo (e já entra). */
  onCriar: (campos: CamposDoCadastro) => ErrosDoCadastro | null;
};

/**
 * Tela Criar conta (S6.4): nome, telefone, região, senha e "Repita a senha". Os erros aparecem
 * embaixo de cada campo ao tocar no botão, e o erro de um campo some quando ele é corrigido.
 */
export function FormularioCadastro({ onCriar }: FormularioCadastroProps) {
  const insets = useSafeAreaInsets();
  const alturaDaBarra = useHeaderHeight();
  const [campos, setCampos] = useState(VAZIO);
  const [erros, setErros] = useState<ErrosDoCadastro>({});
  const telefone = useRef<TextInputInstance>(null);
  const regiao = useRef<TextInputInstance>(null);
  const senha = useRef<TextInputInstance>(null);
  const repetirSenha = useRef<TextInputInstance>(null);

  function mudar(campo: keyof CamposDoCadastro) {
    return (texto: string) => {
      setCampos((atuais) => ({ ...atuais, [campo]: texto }));
      setErros((atuais) => ({ ...atuais, [campo]: undefined }));
    };
  }

  function criar() {
    // Se deu certo, o _layout troca para as abas sozinho.
    setErros(onCriar(campos) ?? {});
  }

  return (
    // A tela fica embaixo da barra "Criar conta", então o teclado sobe descontando a altura dela.
    <KeyboardAvoidingView style={styles.tela} behavior="padding" keyboardVerticalOffset={alturaDaBarra}>
      <ScrollView
        contentContainerStyle={[styles.conteudo, { paddingBottom: insets.bottom + Spacing.four }]}
        keyboardShouldPersistTaps="handled">
        <CampoTexto
          rotulo="Nome"
          tipo="nome"
          valor={campos.nome}
          onMudar={mudar('nome')}
          erro={erros.nome}
          proximo={telefone}
        />
        <CampoTexto
          ref={telefone}
          rotulo="Telefone (WhatsApp)"
          tipo="telefone"
          valor={campos.telefone}
          onMudar={mudar('telefone')}
          erro={erros.telefone}
          proximo={regiao}
        />
        <CampoTexto
          ref={regiao}
          rotulo="Região"
          valor={campos.regiao}
          onMudar={mudar('regiao')}
          erro={erros.regiao}
          proximo={senha}
        />
        <CampoTexto
          ref={senha}
          rotulo="Senha"
          tipo="novaSenha"
          valor={campos.senha}
          onMudar={mudar('senha')}
          erro={erros.senha}
          proximo={repetirSenha}
        />
        <CampoTexto
          ref={repetirSenha}
          rotulo="Repita a senha"
          tipo="novaSenha"
          valor={campos.repetirSenha}
          onMudar={mudar('repetirSenha')}
          erro={erros.repetirSenha}
          onConcluir={criar}
        />

        <Pressable
          accessibilityRole="button"
          onPress={criar}
          style={({ pressed }) => [styles.botao, pressed && styles.botaoPressionado]}>
          <Text style={styles.botaoTexto}>Criar conta e entrar</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
