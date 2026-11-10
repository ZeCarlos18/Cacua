import { useHeaderHeight } from 'expo-router/react-navigation';
import { useRef, useState, type ReactNode } from 'react';
import { KeyboardAvoidingView, Pressable, ScrollView, Text, View, type TextInputInstance } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CampoTexto } from '@/components/campo-texto';
import { MapaDoSitio } from '@/components/mapa-do-sitio';
import { Pilulas } from '@/components/pilulas';
import { PilulasVarias } from '@/components/pilulas-varias';
import { Spacing } from '@/constants/theme';
import { capitalizar } from '@/utils/agenda';
import type { AreaDoMapa } from '@/utils/mapa-rota';
import {
  CANAIS,
  FRUTAS_COM_PRECO,
  type CamposDoProdutor,
  type ErrosDoProdutor,
} from '@/utils/novo-produtor';
import type { Posicao } from '@/utils/rota';

import { styles } from './formulario-produtor.styles';

const VAZIO: CamposDoProdutor = { nome: '', sitio: '', frutas: [], canal: null, posicao: null };

type FormularioProdutorProps = {
  posto: Posicao;
  area: AreaDoMapa;
  /** Os sítios que já existem, para aparecerem no mapa. */
  sitios: { id: number; sitio: string; posicao: Posicao }[];
  /** Devolve os erros de cada campo, ou null se deu certo (e o produtor já entrou na lista). */
  onSalvar: (campos: CamposDoProdutor) => ErrosDoProdutor | null;
};

/**
 * Formulário "Novo produtor" (S7.4): nome, sítio, frutas, como ele avisa e o lugar do sítio no
 * mapa. Os erros aparecem embaixo de cada campo ao tocar em "Salvar produtor", e o erro de um
 * campo some quando ele é corrigido, como no Criar conta (S6.4).
 */
export function FormularioProdutor({ posto, area, sitios, onSalvar }: FormularioProdutorProps) {
  const insets = useSafeAreaInsets();
  const alturaDaBarra = useHeaderHeight();
  const [campos, setCampos] = useState(VAZIO);
  const [erros, setErros] = useState<ErrosDoProdutor>({});
  const sitio = useRef<TextInputInstance>(null);

  function mudar<K extends keyof CamposDoProdutor>(campo: K) {
    return (valor: CamposDoProdutor[K]) => {
      setCampos((atuais) => ({ ...atuais, [campo]: valor }));
      setErros((atuais) => ({ ...atuais, [campo]: undefined }));
    };
  }

  function salvar() {
    // Se deu certo, a tela volta para Produtores.
    setErros(onSalvar(campos) ?? {});
  }

  return (
    // A tela fica embaixo da barra "Novo produtor", então o teclado sobe descontando a altura dela.
    <KeyboardAvoidingView style={styles.tela} behavior="padding" keyboardVerticalOffset={alturaDaBarra}>
      <ScrollView
        contentContainerStyle={[styles.conteudo, { paddingBottom: insets.bottom + Spacing.four }]}
        keyboardShouldPersistTaps="handled">
        <CampoTexto rotulo="Nome" valor={campos.nome} onMudar={mudar('nome')} erro={erros.nome} proximo={sitio} />
        <CampoTexto
          ref={sitio}
          rotulo="Sítio"
          valor={campos.sitio}
          onMudar={mudar('sitio')}
          erro={erros.sitio}
        />

        <Secao titulo="Frutas" erro={erros.frutas}>
          <PilulasVarias
            opcoes={FRUTAS_COM_PRECO.map((fruta) => ({ valor: fruta, texto: capitalizar(fruta) }))}
            escolhidas={campos.frutas}
            onMudar={mudar('frutas')}
          />
        </Secao>

        <Secao titulo="Como ele avisa" erro={erros.canal}>
          <Pilulas
            opcoes={CANAIS.map((canal) => ({ valor: canal, texto: canal }))}
            escolhida={campos.canal}
            onEscolher={mudar('canal')}
          />
        </Secao>

        <Secao titulo="Onde fica o sítio">
          <MapaDoSitio
            posto={posto}
            area={area}
            sitios={sitios}
            marcado={campos.posicao}
            nomeDoSitio={campos.sitio}
            onMarcar={mudar('posicao')}
            erro={erros.posicao}
          />
        </Secao>

        <Pressable
          accessibilityRole="button"
          onPress={salvar}
          style={({ pressed }) => [styles.botao, pressed && styles.botaoPressionado]}>
          <Text style={styles.botaoTexto}>Salvar produtor</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

type SecaoProps = {
  titulo: string;
  /** Aparece embaixo, em vermelho, como no CampoTexto. */
  erro?: string;
  children: ReactNode;
};

/** O rótulo em cima, como no CampoTexto, e o erro embaixo. */
function Secao({ titulo, erro, children }: SecaoProps) {
  return (
    <View style={styles.secao}>
      <Text style={styles.rotulo}>{titulo}</Text>
      {children}
      {erro ? (
        <Text style={styles.erro} accessibilityLiveRegion="polite">
          {erro}
        </Text>
      ) : null}
    </View>
  );
}
