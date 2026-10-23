import type { ReactNode } from 'react';
import { ScrollView } from 'react-native';

import { styles } from './lista.styles';

type ListaProps = {
  children: ReactNode;
};

/** Lista que rola dentro da Tela, com espaço entre os itens (os cartões da Agenda, por exemplo). */
export function Lista({ children }: ListaProps) {
  return (
    <ScrollView
      style={styles.lista}
      contentContainerStyle={styles.conteudo}
      showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  );
}
