import { Pressable, Share, Text } from 'react-native';

import { numeroCacua } from '@/data/dados';
import { useColetor } from '@/state/acesso';
import type { Coletor } from '@/state/acesso-regras';
import { linkDoConvite, textoDoConvite } from '@/utils/convite';

import { styles } from './botao-convidar.styles';

/** Abre o compartilhar do celular com o convite (S5.3), para o coletor mandar pelo WhatsApp. */
async function convidarProdutor(coletor: Coletor) {
  const link = linkDoConvite(numeroCacua, coletor.codigo);
  try {
    await Share.share({ message: textoDoConvite(coletor, link) });
  } catch (erro) {
    // Cancelar o compartilhar não é erro. Isto só acontece num navegador sem compartilhar.
    console.warn('Não deu para abrir o compartilhar:', erro);
  }
}

/**
 * Botão no fim da aba Produtores (S5.3) que manda o convite com o link do Caçuá. O convite sai
 * com o nome e o código de quem entrou (S6.4), como JOSE.
 */
export function BotaoConvidar() {
  const coletor = useColetor();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityHint="Abre o compartilhar com o link do Caçuá para mandar ao produtor"
      onPress={() => convidarProdutor(coletor)}
      style={({ pressed }) => [styles.botao, pressed && styles.botaoPressionado]}>
      <Text style={styles.texto}>Convidar produtor</Text>
    </Pressable>
  );
}
