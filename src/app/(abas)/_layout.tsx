import AppTabs from '@/components/app-tabs';

/**
 * As 5 abas do Caçuá: Início, Agenda, Rota, Previsão e Produtores. Ficam num grupo para que o
 * Stack do _layout raiz abra telas por cima delas, como a Conta do dia (S2.4) e os Custos.
 */
export default function AbasLayout() {
  return <AppTabs />;
}
