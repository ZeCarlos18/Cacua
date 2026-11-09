import { router } from 'expo-router';

import { FormularioEntrar } from '@/components/formulario-entrar';
import { useAcesso } from '@/state/acesso';

/**
 * Entrar (S6.4): a primeira tela para quem não entrou. Ao entrar, o _layout troca para as abas
 * sozinho (Stack.Protected), então aqui não precisa navegar.
 */
export default function EntrarScreen() {
  const { entrar, entrarComExemplo } = useAcesso();

  return (
    <FormularioEntrar
      onEntrar={entrar}
      onCriarConta={() => router.push('/cadastro')}
      onEntrarComExemplo={entrarComExemplo}
    />
  );
}
