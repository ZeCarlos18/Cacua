import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BotaoConvidar } from '@/components/botao-convidar';
import { BotaoNovoProdutor } from '@/components/botao-novo-produtor';
import { Lista } from '@/components/lista';
import { Selo } from '@/components/selo';
import { Tela } from '@/components/tela';
import { Cacua, Spacing } from '@/constants/theme';
import { pontoFocal, posto } from '@/data/dados';
import { useCacua } from '@/state/cacua';
import { estadoInicial } from '@/state/estado';
import { textoDoKm } from '@/utils/conta';
import { historicoDoProdutor, hrefDoProdutor, proximaColheita } from '@/utils/produtores';
import { kmEntre } from '@/utils/rota';

export default function ProdutoresScreen() {
  const { agenda, produtores, coletas } = useCacua();
  // As coletas que já vêm do dados.js (a Dona Maria na quinta) já estão no histórico (S5.6).
  const coletasIniciais = estadoInicial().coletas;

  return (
    <Tela
      titulo="Produtores da região"
      descricao="“Avisos cumpridos”: quantas vezes o produtor entregou o que avisou. Toque no produtor para ver os detalhes.">
      <Lista>
        {/* Cadastra o produtor e marca o sítio no mapa (S7.4); ele entra no fim da lista. */}
        <BotaoNovoProdutor />
        <View style={styles.cartao}>
          {produtores.map((produtor, i) => {
            const historico = historicoDoProdutor(produtor, coletas, coletasIniciais);
            // Do posto até o sítio, em linha reta (S6.6): "7,5 km".
            const km = textoDoKm(kmEntre(posto, produtor.posicao));
            return (
              // Cada produtor abre os detalhes dele (S6.6), em /produtor/{id}.
              <Pressable
                key={produtor.id}
                accessibilityRole="button"
                accessibilityHint="Abre os detalhes do produtor"
                onPress={() => router.push(hrefDoProdutor(produtor.id))}
                style={({ pressed }) => [
                  styles.produtor,
                  i > 0 && styles.divisoria,
                  pressed && styles.produtorPressionado,
                ]}>
                <View style={styles.cabecalho}>
                  <Text style={styles.nome}>{produtor.nome}</Text>
                  <View style={styles.seloESeta}>
                    <Selo
                      texto={produtor.canal}
                      cor={produtor.canal === 'WhatsApp' ? 'verde' : 'vermelho'}
                    />
                    <Text style={styles.seta} aria-hidden>
                      ›
                    </Text>
                  </View>
                </View>
                <Text style={styles.detalhe}>
                  {produtor.sitio} · {produtor.frutas.join(', ')} · {km}
                </Text>
                <View style={styles.rodape}>
                  {/* Avisos cumpridos (S5.6): o histórico do dados.js mais as coletas registradas. */}
                  <Text style={styles.cumpridos}>
                    Cumpridos{' '}
                    <Text style={styles.negrito}>
                      {historico.cumpridos} de {historico.avisos}
                    </Text>
                  </Text>
                  {/* Próxima colheita (S3.5): "Quinta · 20 cx de manga", "Qui, sex e sáb" ou a previsão. */}
                  <Text style={styles.colheita}>{proximaColheita(produtor, agenda)}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.pontoFocal}>
          <Text style={styles.negrito}>Ponto focal: {pontoFocal}.</Text> Registra os avisos de
          quem não usa WhatsApp, por ligação ou visita.
        </Text>

        <BotaoConvidar />
      </Lista>
    </Tela>
  );
}

const styles = StyleSheet.create({
  cartao: {
    // O fundo do produtor tocado não passa dos cantos arredondados.
    overflow: 'hidden',
    borderRadius: Spacing.three,
    borderWidth: 1,
    borderColor: Cacua.borda,
    backgroundColor: Cacua.superficie,
  },
  produtor: {
    gap: Spacing.one,
    padding: Spacing.three,
  },
  produtorPressionado: {
    backgroundColor: Cacua.fundo,
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
  seloESeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  seta: {
    fontSize: 24,
    lineHeight: 26,
    color: Cacua.textoSecundario,
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
