import { StyleSheet, Text, View } from 'react-native';

import { Lista } from '@/components/lista';
import { Selo } from '@/components/selo';
import { Tela } from '@/components/tela';
import { Cacua, Spacing } from '@/constants/theme';
import { agenda, pontoFocal, produtores } from '@/data/dados';
import { proximaColheita } from '@/utils/produtores';

export default function ProdutoresScreen() {
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
});
