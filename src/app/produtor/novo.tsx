import { router } from 'expo-router';

import { FormularioProdutor } from '@/components/formulario-produtor';
import { posto } from '@/data/dados';
import { useCacua } from '@/state/cacua';
import { areaDoMapa } from '@/utils/mapa-rota';

/**
 * Novo produtor (S7.4): abre pelo "+ Novo produtor" da aba Produtores, por cima das abas. É uma
 * rota fixa na mesma pasta da produtor/[id]; o Expo Router escolhe a fixa antes da dinâmica.
 */
export default function NovoProdutorScreen() {
  const { produtores, adicionarProdutor } = useCacua();

  return (
    <FormularioProdutor
      posto={posto}
      area={areaDoMapa(posto, produtores)}
      sitios={produtores}
      onSalvar={(campos) => {
        const erros = adicionarProdutor(campos);
        // Volta para a aba Produtores, onde o produtor novo aparece no fim da lista. O dismissTo
        // fecha o formulário (não fica na pilha) e, se a tela foi aberta direto pelo endereço, sem
        // Produtores por baixo, troca o formulário pela aba Produtores.
        if (!erros) router.dismissTo('/produtores');
        return erros;
      }}
    />
  );
}
