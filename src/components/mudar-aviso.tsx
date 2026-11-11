import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { CampoCaixas } from '@/components/campo-caixas';
import { lerCaixas, perguntaParaTirar } from '@/utils/aviso';

import { styles } from './mudar-aviso.styles';

type MudarAvisoProps = {
  /** Para a pergunta: "Tirar o aviso de 12 caixas de banana do Seu Pedro?". */
  nome: string;
  fruta: string;
  caixas: number;
  onSalvar: (caixas: number) => void;
  onTirar: () => void;
  onCancelar: () => void;
};

/**
 * O "Mudar" aberto na linha do aviso (S7.5): as caixas com − e + (o CampoCaixas do Registrar
 * aviso), já com as caixas do aviso, e os botões "Salvar", "Tirar da agenda" e "Cancelar". O
 * "Tirar da agenda" pergunta antes, na mesma linha (o Alert não faz nada na web).
 */
export function MudarAviso({ nome, fruta, caixas, onSalvar, onTirar, onCancelar }: MudarAvisoProps) {
  const [texto, setTexto] = useState(String(caixas));
  const [perguntando, setPerguntando] = useState(false);
  const caixasNovas = lerCaixas(texto);

  if (perguntando) {
    return (
      <View style={styles.caixa} accessibilityLiveRegion="polite">
        <Text style={styles.pergunta}>{perguntaParaTirar(nome, fruta, caixas)}</Text>
        <View style={styles.botoes}>
          <Botao texto="Sim, tirar" tipo="perigo" onPress={onTirar} />
          <Botao texto="Não" tipo="contorno" onPress={() => setPerguntando(false)} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.caixa}>
      <Text style={styles.rotulo}>Caixas</Text>
      <CampoCaixas texto={texto} onMudar={setTexto} />
      {caixasNovas === null ? <Text style={styles.erro}>Digite um número inteiro de caixas.</Text> : null}
      <View style={styles.botoes}>
        <Botao
          texto="Salvar"
          tipo="cheio"
          desligado={caixasNovas === null}
          // Sem mudança nas caixas, só fecha.
          onPress={() => (caixasNovas === caixas ? onCancelar() : caixasNovas && onSalvar(caixasNovas))}
        />
        <Botao texto="Tirar da agenda" tipo="perigoContorno" onPress={() => setPerguntando(true)} />
        <Botao texto="Cancelar" tipo="texto" onPress={onCancelar} />
      </View>
    </View>
  );
}

type BotaoProps = {
  texto: string;
  tipo: 'cheio' | 'contorno' | 'perigo' | 'perigoContorno' | 'texto';
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
      style={({ pressed }) => [
        styles.botao,
        styles[tipo],
        pressed && styles.pressionado,
        desligado && styles.desligado,
      ]}>
      <Text style={[styles.botaoTexto, styles[`${tipo}Texto`]]}>{texto}</Text>
    </Pressable>
  );
}
