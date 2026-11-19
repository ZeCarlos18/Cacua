import { useState } from 'react';
import { Pressable, Share, Text, View } from 'react-native';

import { styles } from './backup.styles';

type MandarBackupProps = {
  /** O texto do backup (textoDoBackup, S9.3). */
  texto: string;
};

/**
 * "Mandar backup" (S9.6): abre o compartilhar do celular com o texto do backup, para o coletor
 * mandar para o próprio WhatsApp e guardar a mensagem. "Ver o texto do backup" mostra o mesmo texto
 * na tela, para copiar à mão e para testar na web, onde o compartilhar pode não existir.
 */
export function MandarBackup({ texto }: MandarBackupProps) {
  const [vendo, setVendo] = useState(false);

  return (
    <View style={styles.cartao}>
      <Text style={styles.titulo} accessibilityRole="header">
        Mandar backup
      </Text>
      <Text style={styles.texto}>Mande para o seu próprio WhatsApp e guarde a mensagem.</Text>

      <View style={styles.botoes}>
        <Pressable
          accessibilityRole="button"
          accessibilityHint="Abre o compartilhar com o backup dos dados para mandar ao seu WhatsApp"
          onPress={() => mandarBackup(texto)}
          style={({ pressed }) => [styles.botao, pressed && styles.botaoPressionado]}>
          <Text style={styles.botaoTexto}>Mandar backup</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded: vendo }}
          onPress={() => setVendo(!vendo)}
          style={({ pressed }) => [styles.botaoContorno, pressed && styles.botaoContornoPressionado]}>
          <Text style={styles.botaoContornoTexto}>{vendo ? 'Esconder o texto do backup' : 'Ver o texto do backup'}</Text>
        </Pressable>
      </View>

      {vendo ? (
        <Text selectable style={styles.textoDoBackup}>
          {texto}
        </Text>
      ) : null}
    </View>
  );
}

/**
 * Abre o compartilhar do celular com o backup pronto. Na web, o compartilhar pode não existir: aí
 * nada abre, e o "Ver o texto do backup" serve (como no recibo).
 */
async function mandarBackup(texto: string) {
  try {
    await Share.share({ message: texto });
  } catch (erro) {
    console.warn('Não deu para abrir o compartilhar:', erro);
  }
}
