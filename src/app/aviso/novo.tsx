import { router } from 'expo-router';

import { FormularioAviso } from '@/components/formulario-aviso';
import { useCacua } from '@/state/cacua';

/**
 * Registrar aviso (S4.4): a entrada manual de um aviso de colheita, para quem avisa por ligação
 * ou visita. Abre por cima das abas; ao salvar, o aviso entra na agenda e volta para a Agenda.
 */
export default function NovoAvisoScreen() {
  const { agenda, produtores, precos, adicionarAviso } = useCacua();

  return (
    <FormularioAviso
      dias={agenda}
      produtores={produtores}
      precos={precos}
      onSalvar={(data, aviso) => {
        adicionarAviso(data, aviso);
        router.back();
      }}
    />
  );
}
