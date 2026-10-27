import { AvisoSemanaFraca } from '@/components/aviso-semana-fraca';
import { Lista } from '@/components/lista';
import { SemanasPrevisao } from '@/components/semanas-previsao';
import { Tela } from '@/components/tela';
import { coletor, previsao } from '@/data/dados';
import { viagensCheias } from '@/utils/previsao';

export default function PrevisaoScreen() {
  const { cargaMinima } = coletor;
  const semanasFracas = previsao.filter((semana) => viagensCheias(semana.caixas, cargaMinima) === 0);

  return (
    <Tela titulo="Previsão" descricao="Avisos já feitos + colheitas previstas.">
      <Lista>
        <SemanasPrevisao semanas={previsao} cargaMinima={cargaMinima} />
        {semanasFracas.map((semana) => (
          <AvisoSemanaFraca
            key={semana.periodo}
            periodo={semana.periodo}
            caixas={semana.caixas}
            cargaMinima={cargaMinima}
          />
        ))}
      </Lista>
    </Tela>
  );
}
