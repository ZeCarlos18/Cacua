import { Pressable, Share, Text, View } from 'react-native';

import { Selo } from '@/components/selo';
import { textoDasCaixas } from '@/utils/rota-do-dia';

import { styles } from './parada.styles';

type ParadaProps = {
  /** Ordem de visita, começando em 1 (o `numero` da montarRota). */
  numero: number;
  sitio: string;
  produtor: string;
  /** "Goiaba", ou "Goiaba, Manga" quando o produtor avisou mais de uma fruta. */
  fruta: string;
  caixas: number;
  coletada: boolean;
  /** O texto do recibo (textoDoRecibo), que o "Mandar recibo" abre no compartilhar (S5.2). */
  recibo: string;
  onRegistrar: () => void;
};

/**
 * Uma parada da Rota do dia (S3.2), como no Figma: o número no círculo, o sítio, o produtor e
 * "Goiaba · 12 caixas". Antes da coleta mostra o botão "Registrar coleta"; depois, o Selo
 * "Coletado" e o botão "Mandar recibo" (S5.2). Não guarda estado: quem sabe se está coletada é a
 * tela (S3.3).
 */
export function Parada({
  numero,
  sitio,
  produtor,
  fruta,
  caixas,
  coletada,
  recibo,
  onRegistrar,
}: ParadaProps) {
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
          </View>
        ) : (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Registrar coleta no ${sitio}`}
            onPress={onRegistrar}
            style={({ pressed }) => [styles.botao, pressed && styles.botaoPressionado]}>
            <Text style={styles.botaoTexto}>Registrar coleta</Text>
          </Pressable>
        )}
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
