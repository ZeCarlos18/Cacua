import { Pressable, Share, StyleSheet, Text, View } from 'react-native';

import { Lista } from '@/components/lista';
import { Selo } from '@/components/selo';
import { Tela } from '@/components/tela';
import { Cacua, Spacing } from '@/constants/theme';
import { coletor, numeroCacua, pontoFocal, produtores } from '@/data/dados';
import { useCacua } from '@/state/cacua';
import { linkDoConvite, textoDoConvite } from '@/utils/convite';
import { proximaColheita } from '@/utils/produtores';

/** Abre o compartilhar do celular com o convite (S5.3), para o coletor mandar pelo WhatsApp. */
async function convidarProdutor() {
  const link = linkDoConvite(numeroCacua, coletor.codigo);
  try {
    await Share.share({ message: textoDoConvite(coletor, link) });
  } catch (erro) {
    // Cancelar o compartilhar não é erro. Isto só acontece num navegador sem compartilhar.
    console.warn('Não deu para abrir o compartilhar:', erro);
  }
}

export default function ProdutoresScreen() {
  const { agenda } = useCacua();

  return (
    <Tela
      titulo="Produtores da região"
      descricao="“Avisos cumpridos”: quantas vezes o produtor entregou o que avisou.">
      <Lista>
        <View style={styles.cartao}>
          {produtores.map((produtor, i) => (
            <View key={produtor.id} style={[styles.produtor, i > 0 && styles.divisoria]}>
              <View style={styles.cabecalho}>
                <Text style={styles.nome}>{produtor.nome}</Text>
                <Selo
                  texto={produtor.canal}
                  cor={produtor.canal === 'WhatsApp' ? 'verde' : 'vermelho'}
                />
              </View>
              <Text style={styles.detalhe}>
                {produtor.sitio} · {produtor.frutas.join(', ')}
              </Text>
              <View style={styles.rodape}>
                <Text style={styles.cumpridos}>
                  Cumpridos{' '}
                  <Text style={styles.negrito}>
                    {produtor.cumpridos} de {produtor.avisos}
                  </Text>
                </Text>
                {/* Próxima colheita (S3.5): "Quinta · 20 cx de manga", "Qui, sex e sáb" ou a previsão. */}
                <Text style={styles.colheita}>{proximaColheita(produtor, agenda)}</Text>
              </View>
            </View>
          ))}
        </View>

        <Text style={styles.pontoFocal}>
          <Text style={styles.negrito}>Ponto focal: {pontoFocal}.</Text> Registra os avisos de
          quem não usa WhatsApp, por ligação ou visita.
        </Text>

        <Pressable
          accessibilityRole="button"
          accessibilityHint="Abre o compartilhar com o link do Caçuá para mandar ao produtor"
          onPress={convidarProdutor}
          style={({ pressed }) => [styles.botao, pressed && styles.botaoPressionado]}>
          <Text style={styles.botaoTexto}>Convidar produtor</Text>
        </Pressable>
      </Lista>
    </Tela>
  );
}

const styles = StyleSheet.create({
  cartao: {
    borderRadius: Spacing.three,
    borderWidth: 1,
    borderColor: Cacua.borda,
    backgroundColor: Cacua.superficie,
  },
  produtor: {
    gap: Spacing.one,
    padding: Spacing.three,
  },
  divisoria: {
    borderTopWidth: 1,
    borderTopColor: Cacua.borda,
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nome: {
    fontSize: 18,
    fontWeight: 700,
    color: Cacua.texto,
  },
  detalhe: {
    fontSize: 15,
    color: Cacua.textoSecundario,
  },
  rodape: {
    // A próxima colheita fica ao lado do "Cumpridos" quando cabe e desce para a linha de baixo
    // quando não cabe (em celulares de 360 px, "Goiaba prevista (pela poda)").
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    columnGap: Spacing.two,
  },
  cumpridos: {
    fontSize: 15,
    color: Cacua.texto,
  },
  colheita: {
    flexGrow: 1,
    flexShrink: 1,
    textAlign: 'right',
    fontSize: 15,
    color: Cacua.texto,
  },
  negrito: {
    fontWeight: 700,
  },
  pontoFocal: {
    padding: Spacing.three,
    borderRadius: Spacing.three,
    backgroundColor: Cacua.verdeClaro,
    fontSize: 15,
    lineHeight: 22,
    color: Cacua.verdeEscuro,
  },
  botao: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Spacing.two + Spacing.one,
    backgroundColor: Cacua.verde,
  },
  botaoPressionado: {
    backgroundColor: Cacua.verdeEscuro,
  },
  botaoTexto: {
    fontSize: 16,
    fontWeight: 700,
    color: Cacua.superficie,
  },
});
