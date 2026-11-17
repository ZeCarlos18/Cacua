import { router, useLocalSearchParams } from 'expo-router';

import { ProdutorNaoEncontrado } from '@/components/detalhes-produtor';
import { FormularioProdutor } from '@/components/formulario-produtor';
import { Tela } from '@/components/tela';
import { posto } from '@/data/dados';
import { useCacua } from '@/state/cacua';
import { areaDoMapa } from '@/utils/mapa-rota';
import { camposDoProdutor } from '@/utils/novo-produtor';
import { hrefDoProdutor } from '@/utils/produtores';

/**
 * Editar produtor (S9.4): abre pelo "Editar produtor" dos detalhes, em /produtor/editar?id=1, por
 * cima das abas, com o mesmo formulário do Novo produtor (S7.4), já preenchido e com o sítio
 * marcado no mapa. Como a produtor/novo, é uma rota fixa na pasta da produtor/[id]: o Expo Router
 * escolhe a fixa antes da dinâmica.
 */
export default function EditarProdutorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { produtores, editarProdutor } = useCacua();
  const produtor = produtores.find((item) => String(item.id) === id);

  if (!produtor) {
    return (
      <Tela titulo="Editar produtor" cabecalhoNativo>
        <ProdutorNaoEncontrado />
      </Tela>
    );
  }

  return (
    <FormularioProdutor
      // O id na chave: com outro produtor no endereço, o formulário recomeça com os campos dele.
      key={produtor.id}
      posto={posto}
      area={areaDoMapa(posto, produtores)}
      // O lugar antigo do próprio produtor não aparece em cinza: o ponto verde já é o dele.
      sitios={produtores.filter((item) => item.id !== produtor.id)}
      campos={camposDoProdutor(produtor)}
      botao="Salvar mudanças"
      onSalvar={(campos) => {
        const erros = editarProdutor(produtor.id, campos);
        // Volta para os detalhes dele. O dismissTo fecha o formulário (não fica na pilha) e, se a
        // tela foi aberta direto pelo endereço, sem os detalhes por baixo, troca o formulário por eles.
        if (!erros) router.dismissTo(hrefDoProdutor(produtor.id));
        return erros;
      }}
    />
  );
}
