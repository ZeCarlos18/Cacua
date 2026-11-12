import { useState } from 'react';
import { Pressable, Share, Text, View } from 'react-native';

import { CampoCaixas } from '@/components/campo-caixas';
import { Selo } from '@/components/selo';
import { capitalizar } from '@/utils/agenda';
import { lerCaixas } from '@/utils/aviso';
import type { CaixasPorFruta } from '@/utils/coleta';
import { textoDasCaixas } from '@/utils/rota-do-dia';

import { styles } from './parada.styles';

type ParadaProps = {
  /** Ordem de visita, começando em 1 (o `numero` da montarRota). */
  numero: number;
  sitio: string;
  produtor: string;
  /** "Goiaba", ou "Goiaba, Manga" quando o produtor avisou mais de uma fruta. */
  fruta: string;
  /** As caixas da parada: as que vieram, depois da coleta (S7.6), ou as avisadas. */
  caixas: number;
  /** As caixas avisadas de cada fruta (caixasAvisadas, S7.3): o formulário já vem com elas. */
  avisadas: CaixasPorFruta;
  coletada: boolean;
  /** Sem "Desfazer coleta" em dia confirmado (S7.3). */
  podeDesfazer: boolean;
  /** O texto do recibo (textoDoRecibo), que o "Mandar recibo" abre no compartilhar (S5.2). */
  recibo: string;
  /** Registra a coleta com as caixas que vieram de cada fruta ({ goiaba: 10 }). */
  onRegistrar: (caixas: CaixasPorFruta) => void;
  onDesfazer: () => void;
};

/**
 * Uma parada da Rota do dia (S3.2), como no Figma: o número no círculo, o sítio, o produtor e
 * "Goiaba · 12 caixas". O "Registrar coleta" pergunta, na própria parada, quantas caixas vieram
 * (S7.6). Depois da coleta: o Selo "Coletado", "10 caixas (avisou 12)" quando o número mudou, e os
 * botões "Mandar recibo" (S5.2) e "Desfazer coleta". Quem sabe se está coletada é a tela (S3.3).
 */
export function Parada({
  numero,
  sitio,
  produtor,
  fruta,
  caixas,
  avisadas,
  coletada,
  podeDesfazer,
  recibo,
  onRegistrar,
  onDesfazer,
}: ParadaProps) {
  const [perguntando, setPerguntando] = useState(false);
  const totalAvisado = Object.values(avisadas).reduce((soma, quantas) => soma + quantas, 0);
  const avisou = coletada && caixas !== totalAvisado ? ` (avisou ${totalAvisado})` : '';

  return (
    <View style={styles.parada}>
      {/* accessible: no iOS e no Android, o leitor de tela lê o rótulo, e não o "✓" ou o número soltos. */}
      <View
        accessible
        style={[styles.circulo, coletada && styles.circuloColetado]}
        accessibilityLabel={coletada ? `Parada ${numero}, coletada` : `Parada ${numero}`}>
        <Text style={styles.circuloTexto}>{coletada ? '✓' : numero}</Text>
      </View>

      {/* O botão (ou o Selo) fica ao lado do texto quando cabe e desce para baixo dele quando não cabe. */}
      <View style={styles.conteudo}>
        <View style={styles.info}>
          <Text style={styles.sitio}>{sitio}</Text>
          <Text style={styles.detalhe}>{produtor}</Text>
          <Text style={styles.detalhe}>
            {fruta} · {textoDasCaixas(caixas)}
            {avisou}
          </Text>
        </View>

        {coletada ? (
          <View style={styles.coletado}>
            <Selo texto="Coletado" cor="verde" />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Mandar recibo para ${produtor}`}
              onPress={() => mandarRecibo(recibo)}
              style={({ pressed }) => [styles.botaoRecibo, pressed && styles.botaoPressionado]}>
              <Text style={styles.botaoReciboTexto}>Mandar recibo</Text>
            </Pressable>
            {podeDesfazer ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Desfazer a coleta no ${sitio}`}
                onPress={onDesfazer}
                hitSlop={8}
                style={styles.desfazer}>
                <Text style={styles.desfazerTexto}>Desfazer coleta</Text>
              </Pressable>
            ) : null}
          </View>
        ) : perguntando ? (
          <QuantasVieram
            avisadas={avisadas}
            onConfirmar={(vieram) => {
              onRegistrar(vieram);
              setPerguntando(false);
            }}
            onCancelar={() => setPerguntando(false)}
          />
        ) : (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Registrar coleta no ${sitio}`}
            onPress={() => setPerguntando(true)}
            style={({ pressed }) => [styles.botao, pressed && styles.botaoPressionado]}>
            <Text style={styles.botaoTexto}>Registrar coleta</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

type QuantasVieramProps = {
  avisadas: CaixasPorFruta;
  onConfirmar: (vieram: CaixasPorFruta) => void;
  onCancelar: () => void;
};

/**
 * "Quantas caixas vieram?" (S7.6): um campo de caixas com − e + para cada fruta, já com o que foi
 * avisado. As caixas têm que ser inteiras e maiores que zero, como no Registrar aviso.
 */
function QuantasVieram({ avisadas, onConfirmar, onCancelar }: QuantasVieramProps) {
  const [textos, setTextos] = useState(() =>
    Object.fromEntries(Object.entries(avisadas).map(([fruta, quantas]) => [fruta, String(quantas)])),
  );
  const vieram = Object.fromEntries(Object.entries(textos).map(([fruta, texto]) => [fruta, lerCaixas(texto)]));
  const valem = Object.values(vieram).every((quantas) => quantas !== null);

  return (
    <View style={styles.pergunta} accessibilityLiveRegion="polite">
      <Text style={styles.perguntaTitulo}>Quantas caixas vieram?</Text>
      {Object.keys(textos).map((frutaDoCampo) => (
        <View key={frutaDoCampo} style={styles.campoDaFruta}>
          <Text style={styles.rotuloDaFruta}>{capitalizar(frutaDoCampo)}</Text>
          <CampoCaixas
            rotulo={`Caixas de ${frutaDoCampo}`}
            texto={textos[frutaDoCampo]}
            onMudar={(texto) => setTextos((atuais) => ({ ...atuais, [frutaDoCampo]: texto }))}
          />
        </View>
      ))}
      {valem ? null : <Text style={styles.erro}>Digite um número inteiro de caixas.</Text>}
      <View style={styles.botoesDaPergunta}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: !valem }}
          disabled={!valem}
          onPress={() => onConfirmar(vieram as CaixasPorFruta)}
          style={({ pressed }) => [styles.botaoCheio, pressed && styles.botaoCheioPressionado, !valem && styles.desligado]}>
          <Text style={styles.botaoCheioTexto}>Confirmar coleta</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={onCancelar}
          style={({ pressed }) => [styles.botao, pressed && styles.botaoPressionado]}>
          <Text style={styles.botaoTexto}>Cancelar</Text>
        </Pressable>
      </View>
    </View>
  );
}

/**
 * Abre o compartilhar do celular com o recibo pronto; o coletor escolhe o WhatsApp e o produtor.
 * Na web, o compartilhar pode não existir: aí nada abre, e o app continua normal.
 */
async function mandarRecibo(recibo: string) {
  try {
    await Share.share({ message: recibo });
  } catch (erro) {
    console.warn('Não deu para abrir o compartilhar:', erro);
  }
}
