import { Tabs, TabList, TabTrigger, TabSlot, TabTriggerSlotProps, TabListProps } from 'expo-router/ui';
import { Pressable, type PressableProps, StyleSheet, Text, View } from 'react-native';

import { Cacua, Spacing } from '@/constants/theme';

/**
 * Versão web das abas (para abrir no navegador com a tecla "w" no `npx expo start`).
 * Fica embaixo, como no celular, com as 5 abas dividindo a largura.
 */
export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="agenda" href="/" asChild>
            <TabButton>Agenda</TabButton>
          </TabTrigger>
          <TabTrigger name="rota" href="/rota" asChild>
            <TabButton>Rota</TabButton>
          </TabTrigger>
          <TabTrigger name="previsao" href="/previsao" asChild>
            <TabButton>Previsão</TabButton>
          </TabTrigger>
          <TabTrigger name="produtores" href="/produtores" asChild>
            <TabButton>Produtores</TabButton>
          </TabTrigger>
          <TabTrigger name="custos" href="/custos" asChild>
            <TabButton>Custos</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

export function TabButton({ children, isFocused, ...props }: TabTriggerSlotProps) {
  return (
    // O `ref` que o TabTrigger repassa é tipado para View; o cast evita o erro de tipo herdado do modelo do Expo.
    <Pressable
      {...(props as PressableProps)}
      style={({ pressed }) => [styles.tabButton, pressed && styles.pressed]}>
      <View style={[styles.tabButtonView, isFocused && styles.tabButtonSelected]}>
        <Text
          numberOfLines={1}
          style={[styles.tabButtonText, isFocused && styles.tabButtonTextSelected]}>
          {children}
        </Text>
      </View>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  return <View {...props} style={styles.tabList} />;
}

const styles = StyleSheet.create({
  tabList: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.one,
    backgroundColor: Cacua.superficie,
    borderTopWidth: 1,
    borderTopColor: Cacua.borda,
  },
  tabButton: {
    flex: 1,
  },
  pressed: {
    opacity: 0.7,
  },
  tabButtonView: {
    alignItems: 'center',
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.half,
    borderRadius: Spacing.three,
  },
  tabButtonSelected: {
    backgroundColor: Cacua.verdeClaro,
  },
  tabButtonText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: 500,
    color: Cacua.textoSecundario,
  },
  tabButtonTextSelected: {
    fontWeight: 700,
    color: Cacua.verdeEscuro,
  },
});
