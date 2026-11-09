import { router } from 'expo-router';

import { FormularioCadastro } from '@/components/formulario-cadastro';
import { useAcesso } from '@/state/acesso';

/**
 * Criar conta (S6.4): abre por cima de Entrar. Quando o cadastro dá certo, o coletor já entra e o
 * _layout troca para as abas sozinho (Stack.Protected).
 */
export default function CadastroScreen() {
  const { cadastrar } = useAcesso();

  return <FormularioCadastro onCriar={cadastrar} onJaTenhoConta={voltarParaEntrar} />;
}

/**
 * Pelo caminho normal, Entrar está por baixo e é só voltar. Abrindo /cadastro direto (link ou
 * recarregar na web), não há tela por baixo, então troca por Entrar.
 */
function voltarParaEntrar() {
  if (router.canGoBack()) router.back();
  else router.replace('/entrar');
}
