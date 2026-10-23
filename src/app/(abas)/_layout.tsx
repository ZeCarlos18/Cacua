import AppTabs from '@/components/app-tabs';

/**
 * As 5 abas do Caçuá. Ficam num grupo para que o Stack do _layout raiz
 * abra telas por cima delas, como a Conta do dia (S2.4).
 */
export default function AbasLayout() {
  return <AppTabs />;
}
