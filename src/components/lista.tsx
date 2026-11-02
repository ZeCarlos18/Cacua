import { ScrollView, type ScrollViewProps } from 'react-native';

import { styles } from './lista.styles';

/** Lista que rola dentro da Tela, com espaço entre os itens (os cartões da Agenda, por exemplo). */
export function Lista({ children, ...props }: ScrollViewProps) {
  return (
    <ScrollView
      style={styles.lista}
      contentContainerStyle={styles.conteudo}
      showsVerticalScrollIndicator={false}
      {...props}>
      {children}
    </ScrollView>
  );
}
