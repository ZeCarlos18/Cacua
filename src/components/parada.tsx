import { Pressable, Text, View } from 'react-native';

import { Selo } from '@/components/selo';

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
  onRegistrar: () => void;
};

/**
 * Uma parada da Rota do dia (S3.2), como no Figma: o número no círculo, o sítio, o produtor e
 * "Goiaba · 12 caixas". Antes da coleta mostra o botão "Registrar coleta"; depois, o Selo
 * "Coletado" e "recibo enviado". Não guarda estado: quem sabe se está coletada é a tela (S3.3).
 */
export function Parada({ numero, sitio, produtor, fruta, caixas, coletada, onRegistrar }: ParadaProps) {
  return (
    <View style={styles.parada}>
      <View
        style={[styles.circulo, coletada && styles.circuloColetado]}
        accessibilityLabel={coletada ? `Parada ${numero}, coletada` : `Parada ${numero}`}>
        <Text style={styles.circuloTexto}>{coletada ? '✓' : numero}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.sitio}>{sitio}</Text>
        <Text style={styles.detalhe}>{produtor}</Text>
        <Text style={styles.detalhe}>
          {fruta} · {textoDasCaixas(caixas)}
        </Text>
      </View>

      {coletada ? (
        <View style={styles.coletado}>
          {/* O Selo se alinha à esquerda (alignSelf); a linha o leva para a direita. */}
          <View style={styles.linhaDoSelo}>
            <Selo texto="Coletado" cor="verde" />
          </View>
          <Text style={styles.recibo}>recibo enviado</Text>
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
  );
}

/** "12 caixas", ou "1 caixa". */
function textoDasCaixas(caixas: number) {
  return `${caixas} ${caixas === 1 ? 'caixa' : 'caixas'}`;
}
