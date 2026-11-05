import { NativeTabs } from 'expo-router/native-tabs';

import { Cacua } from '@/constants/theme';

/**
 * Barra de abas do Caçuá. O Início (o painel do coletor) vem primeiro; depois a ordem do Figma.
 * Os Custos saíram da barra porque o Android aceita no máximo 5 abas: eles abrem pelo Início.
 * Ícones: `sf` = SF Symbols (iPhone), `md` = Material Symbols (Android).
 */
export default function AppTabs() {
  return (
    <NativeTabs
      backgroundColor={Cacua.superficie}
      tintColor={Cacua.verde}
      indicatorColor={Cacua.verdeClaro}
      iconColor={{ default: Cacua.textoSecundario, selected: Cacua.verde }}
      labelStyle={{
        default: { color: Cacua.textoSecundario },
        selected: { color: Cacua.verde },
      }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Início</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'house', selected: 'house.fill' }} md="home" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="agenda">
        <NativeTabs.Trigger.Label>Agenda</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="calendar" md="calendar_month" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="rota">
        <NativeTabs.Trigger.Label>Rota</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'map', selected: 'map.fill' }} md="route" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="previsao">
        <NativeTabs.Trigger.Label>Previsão</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'chart.bar', selected: 'chart.bar.fill' }}
          md="bar_chart"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="produtores">
        <NativeTabs.Trigger.Label>Produtores</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'person.2', selected: 'person.2.fill' }}
          md="groups"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
