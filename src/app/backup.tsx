import { useHeaderHeight } from 'expo-router/react-navigation';
import { KeyboardAvoidingView } from 'react-native';

import { Lista } from '@/components/lista';
import { MandarBackup } from '@/components/mandar-backup';
import { RestaurarBackup } from '@/components/restaurar-backup';
import { Tela } from '@/components/tela';
import { useCacua } from '@/state/cacua';
import { textoDoBackup } from '@/utils/backup';
import { hojeNoCelular } from '@/utils/preco-do-ceasa';

/**
 * Backup dos dados (S9.6): abre pelo Início, por cima das abas. Os dados do Caçuá ficam só no
 * celular; aqui o coletor manda um backup para o próprio WhatsApp e, se precisar, cola a mensagem
 * de volta para restaurar. As contas são do S9.3.
 */
export default function BackupScreen() {
  const alturaDaBarra = useHeaderHeight();
  const { restaurarBackup, ...estado } = useCacua();

  return (
    // O campo de colar fica embaixo da barra com o título, então o teclado sobe descontando a altura dela.
    <Tela
      titulo="Backup dos dados"
      descricao="Guarde uma cópia dos seus dados fora do celular, para o caso de perder o aparelho ou o app."
      cabecalhoNativo>
      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={alturaDaBarra} style={{ flex: 1 }}>
        <Lista keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
          <MandarBackup texto={textoDoBackup(estado, hojeNoCelular())} />
          <RestaurarBackup onRestaurar={restaurarBackup} />
        </Lista>
      </KeyboardAvoidingView>
    </Tela>
  );
}
