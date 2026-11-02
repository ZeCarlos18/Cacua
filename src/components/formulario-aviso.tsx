import { useState, type ReactNode } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CampoCaixas } from '@/components/campo-caixas';
import { Pilulas } from '@/components/pilulas';
import { Spacing } from '@/constants/theme';
import { capitalizar, type Aviso } from '@/utils/agenda';
import {
  avisoPronto,
  avisoSemPreco,
  frutaAoTrocarProdutor,
  lerCaixas,
  rotuloDoDia,
} from '@/utils/aviso';

import { styles } from './formulario-aviso.styles';

type FormularioAvisoProps = {
  /** Os dias da agenda (Qua 30/set, Qui 01/out...). */
  dias: { dia: string; data: string }[];
  produtores: { id: number; nome: string; frutas: string[] }[];
  /** Para avisar quando a fruta não tem preço do Ceasa. */
  precos: Record<string, unknown>;
  onSalvar: (data: string, aviso: Aviso) => void;
};

/**
 * Formulário "Registrar aviso" (S4.4): dia, produtor, fruta (só as do produtor) e caixas. O
 * Salvar só liga com tudo preenchido e as caixas maiores que zero.
 */
export function FormularioAviso({ dias, produtores, precos, onSalvar }: FormularioAvisoProps) {
  const insets = useSafeAreaInsets();
  const [data, setData] = useState<string | null>(null);
  const [produtorId, setProdutorId] = useState<number | null>(null);
  const [fruta, setFruta] = useState<string | null>(null);
  const [textoCaixas, setTextoCaixas] = useState('');

  const produtor = produtores.find((item) => item.id === produtorId);
  const pronto = avisoPronto({ data, produtor: produtorId, fruta, caixas: lerCaixas(textoCaixas) });
  const semPreco = avisoSemPreco(fruta, precos);

  function escolherProdutor(id: number) {
    const novo = produtores.find((item) => item.id === id);
    setProdutorId(id);
    if (novo) setFruta(frutaAoTrocarProdutor(fruta, novo));
  }

  return (
    <ScrollView
      style={styles.tela}
      contentContainerStyle={[styles.conteudo, { paddingBottom: insets.bottom + Spacing.four }]}
      keyboardShouldPersistTaps="handled">
      <Secao titulo="Dia">
        <Pilulas
          opcoes={dias.map((dia) => ({ valor: dia.data, texto: rotuloDoDia(dia) }))}
          escolhida={data}
          onEscolher={setData}
        />
      </Secao>

      <Secao titulo="Produtor">
        <Pilulas
          opcoes={produtores.map((item) => ({ valor: item.id, texto: item.nome }))}
          escolhida={produtorId}
          onEscolher={escolherProdutor}
        />
      </Secao>

      <Secao titulo="Fruta">
        {produtor ? (
          <Pilulas
            opcoes={produtor.frutas.map((item) => ({ valor: item, texto: capitalizar(item) }))}
            escolhida={fruta}
            onEscolher={setFruta}
          />
        ) : (
          <Text style={styles.dica}>Escolha o produtor para ver as frutas dele.</Text>
        )}
        {semPreco ? (
          <View style={styles.aviso}>
            <Text style={styles.avisoTexto}>{semPreco}</Text>
          </View>
        ) : null}
      </Secao>

      <Secao titulo="Caixas">
        <CampoCaixas texto={textoCaixas} onMudar={setTextoCaixas} />
      </Secao>

      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: !pronto }}
        disabled={!pronto}
        onPress={() => pronto && onSalvar(pronto.data, pronto.aviso)}
        style={({ pressed }) => [
          styles.botao,
          pressed && styles.botaoPressionado,
          !pronto && styles.botaoDesligado,
        ]}>
        <Text style={[styles.botaoTexto, !pronto && styles.botaoTextoDesligado]}>Salvar</Text>
      </Pressable>
    </ScrollView>
  );
}

type SecaoProps = {
  titulo: string;
  children: ReactNode;
};

function Secao({ titulo, children }: SecaoProps) {
  return (
    <View style={styles.secao}>
      <Text style={styles.tituloSecao} accessibilityRole="header">
        {titulo}
      </Text>
      {children}
    </View>
  );
}
