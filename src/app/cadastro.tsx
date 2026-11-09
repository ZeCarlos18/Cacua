import { FormularioCadastro } from '@/components/formulario-cadastro';
import { useAcesso } from '@/state/acesso';

/**
 * Criar conta (S6.4): abre por cima de Entrar. Quando o cadastro dá certo, o coletor já entra e o
 * _layout troca para as abas sozinho (Stack.Protected).
 */
export default function CadastroScreen() {
  const { cadastrar } = useAcesso();

  return <FormularioCadastro onCriar={cadastrar} />;
}
