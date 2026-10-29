import { useState } from 'react';

import { Lista } from '@/components/lista';
import { RotaDoDia, RotaNaoEncontrada } from '@/components/rota-do-dia';
import { Tela } from '@/components/tela';
import { agenda, custos, posto, precos, produtores, rota } from '@/data/dados';
import { calcularLucroDoDia } from '@/utils/calculos';
import { montarRota } from '@/utils/rota';
import { nomesDosProdutores, subtituloDaRota } from '@/utils/rota-do-dia';

/** Rota do dia (S3.3): as paradas na ordem da montarRota e o "Registrar coleta" de cada uma. */
export default function RotaScreen() {
  // Começa com quem já foi coletado no dados.js. Ao fechar o app, volta ao início (salvar fica para depois).
  const [coletados, setColetados] = useState<number[]>(rota.coletados);
  const dia = agenda.find((item) => item.data === rota.data);

  if (!dia) {
    return (
      <Tela titulo="Rota do dia">
        <RotaNaoEncontrada />
      </Tela>
    );
  }

  const { paradas, km, semPosicao } = montarRota(dia, produtores, posto);

  return (
    <Tela titulo="Rota do dia" descricao={subtituloDaRota(dia.dia, rota.saida)}>
      <Lista>
        <RotaDoDia
          paradas={paradas}
          km={km}
          conta={calcularLucroDoDia({ ...dia, km }, precos, custos)}
          coletados={coletados}
          semPosicao={nomesDosProdutores(semPosicao, produtores)}
          onRegistrar={(id) =>
            setColetados((atuais) => (atuais.includes(id) ? atuais : [...atuais, id]))
          }
        />
      </Lista>
    </Tela>
  );
}
