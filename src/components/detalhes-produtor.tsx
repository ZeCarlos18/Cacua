import { useState } from 'react';
import { Pressable, Share, Text, View } from 'react-native';

import { BarraCarga } from '@/components/barra-carga';
import { MudarPrecoCombinado } from '@/components/mudar-preco-combinado';
import { Selo } from '@/components/selo';
import type { CorDoSelo } from '@/components/selo.styles';
import { capitalizar } from '@/utils/agenda';
import { rotuloDoDia } from '@/utils/aviso';
import { formatarReais } from '@/utils/calculos';
import { textoDaPorcentagem, textoDoKm } from '@/utils/conta';
import type { LinhaDoExtrato } from '@/utils/extrato';
import type { AvisoDoProdutor, SituacaoDoAviso } from '@/utils/produtores';
import { textoDasCaixas } from '@/utils/rota-do-dia';

import { styles } from './detalhes-produtor.styles';

/** O texto e a cor do selo de cada situação: Coletado como o selo da Rota, Confirmado como o da Agenda. */
const SELO_DA_SITUACAO: Record<SituacaoDoAviso, { texto: string; cor: CorDoSelo }> = {
  coletado: { texto: 'Coletado', cor: 'verde' },
  confirmado: { texto: 'Confirmado', cor: 'cheio' },
  aguardando: { texto: 'Aguardando', cor: 'neutro' },
};

type DetalhesProdutorProps = {
  produtor: { sitio: string; canal: string; frutas: string[] };
  /** Do posto até o sítio, em linha reta (kmEntre, S6.3). */
  km: number;
  /** "Qui, sex e sáb", "Quinta · 20 cx de manga" ou a previsão; null se não tiver. */
  proximaColheita: string | null;
  /** "Avisa pelo WhatsApp do Caçuá." (comoAvisa, S6.3). */
  comoAvisa: string;
  /** Os avisos cumpridos com as coletas do app (historicoDoProdutor, S5.6). */
  historico: { cumpridos: number; avisos: number };
  /** 86, ou null sem nenhum aviso (taxaDeCumprimento, S6.3). */
  taxa: number | null;
  avisos: AvisoDoProdutor[];
  total: { caixas: number; valor: number };
  /** O quanto do preço do Ceasa vai para o produtor (0.8 → "80%"): a combinada com ele, ou a padrão. */
  pagoProdutor: number;
  /** "Você paga 80% do preço do Ceasa (o padrão)" ou "… (combinado)" (textoDoPrecoDoProdutor, S9.5). */
  precoDoProdutor: string;
  /** Se ele tem preço combinado: só aí o "Voltar ao padrão" aparece. */
  combinado: boolean;
  /** Combina a porcentagem (0.85) ou volta para a padrão (null), pelo "Mudar" (S9.5). */
  onCombinar: (fracao: number | null) => void;
  /** O que ele já entregou: uma linha por coleta (extratoDoProdutor, S8.3). */
  entregues: LinhaDoExtrato[];
  /** As caixas e o valor de tudo o que ele entregou (totalDoExtrato, S8.3). */
  totalEntregue: { caixas: number; valor: number };
  /** O texto que o "Mandar extrato" compartilha (textoDoExtrato, S8.3), ou null sem coleta. */
  extrato: string | null;
};

/**
 * Detalhes do produtor (S6.6), em cartões como a Conta do dia: o sítio, os avisos cumpridos, os
 * avisos na agenda, com o que o coletor paga por cada um, e o que ele já entregou, com o "Mandar
 * extrato" (S8.6).
 */
export function DetalhesProdutor({
  produtor,
  km,
  proximaColheita,
  comoAvisa,
  historico,
  taxa,
  avisos,
  total,
  pagoProdutor,
  precoDoProdutor,
  combinado,
  onCombinar,
  entregues,
  totalEntregue,
  extrato,
}: DetalhesProdutorProps) {
  // O "Mudar" da porcentagem aberto, na mesma linha do "Você paga…" (S9.5).
  const [mudandoPreco, setMudandoPreco] = useState(false);

  return (
    <>
      <View style={styles.cartao}>
        <View style={styles.cabecalho}>
          <Text style={styles.titulo} accessibilityRole="header">
            {produtor.sitio}
          </Text>
          <Selo texto={produtor.canal} cor={produtor.canal === 'WhatsApp' ? 'verde' : 'vermelho'} />
        </View>
        <View>
          <Linha rotulo="Frutas" valor={produtor.frutas.map(capitalizar).join(', ')} />
          <Linha rotulo="Distância do posto" valor={`${textoDoKm(km)} em linha reta`} />
          {proximaColheita ? <Linha rotulo="Próxima colheita" valor={proximaColheita} /> : null}
        </View>
        <View style={styles.dica}>
          <Text style={styles.dicaTexto}>{comoAvisa}</Text>
        </View>
        {mudandoPreco ? (
          <MudarPrecoCombinado
            fracao={pagoProdutor}
            combinado={combinado}
            onSalvar={(fracao) => {
              onCombinar(fracao);
              setMudandoPreco(false);
            }}
            onCancelar={() => setMudandoPreco(false)}
          />
        ) : (
          <View style={styles.precoDoProdutor}>
            <Text style={styles.precoTexto}>{precoDoProdutor}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Mudar a porcentagem do preço do Ceasa"
              onPress={() => setMudandoPreco(true)}
              style={({ pressed }) => [styles.precoMudar, pressed && styles.precoMudarPressionado]}>
              <Text style={styles.precoMudarTexto}>Mudar</Text>
            </Pressable>
          </View>
        )}
      </View>

      <View style={styles.cartao}>
        <Text style={styles.tituloSecao} accessibilityRole="header">
          Avisos cumpridos
        </Text>
        <Text style={styles.destaque}>
          {historico.cumpridos} de {historico.avisos}
        </Text>
        {taxa === null ? (
          <Text style={styles.textoSecundario}>Ainda não tem nenhum aviso.</Text>
        ) : (
          <BarraCarga
            caixas={historico.cumpridos}
            cargaMinima={historico.avisos}
            texto={`${taxa}% dos avisos foram entregues como combinado`}
          />
        )}
      </View>

      <View style={styles.cartao}>
        <Text style={styles.tituloSecao} accessibilityRole="header">
          Avisos na agenda
        </Text>
        {avisos.length === 0 ? (
          <Text style={styles.textoSecundario}>Nenhum aviso na agenda desta semana.</Text>
        ) : (
          <>
            {avisos.map((aviso) => (
              <AvisoNaAgenda key={`${aviso.data}-${aviso.fruta}`} aviso={aviso} />
            ))}
            <View style={styles.total}>
              <Text style={styles.totalTexto}>
                <Text style={styles.forte}>{total.caixas} caixas nesta semana</Text> · você paga cerca
                de <Text style={styles.forte}>{formatarReais(total.valor)}</Text> (
                {textoDaPorcentagem(pagoProdutor)} do preço do Ceasa)
              </Text>
            </View>
          </>
        )}
      </View>

      <OQueJaEntregou entregues={entregues} total={totalEntregue} extrato={extrato} />
    </>
  );
}

type OQueJaEntregouProps = {
  entregues: LinhaDoExtrato[];
  total: { caixas: number; valor: number };
  extrato: string | null;
};

/**
 * "O que já entregou" (S8.6): uma linha por coleta, com o valor à direita ou "a combinar", o total e
 * o "Mandar extrato", que abre o compartilhar com o texto do extrato. Sem coleta, só o aviso.
 */
function OQueJaEntregou({ entregues, total, extrato }: OQueJaEntregouProps) {
  const comPreco = entregues.some((linha) => linha.valor !== null);

  return (
    <View style={styles.cartao}>
      <Text style={styles.tituloSecao} accessibilityRole="header">
        O que já entregou
      </Text>
      {entregues.length === 0 || extrato === null ? (
        <Text style={styles.textoSecundario}>Nenhuma coleta registrada ainda.</Text>
      ) : (
        <>
          {entregues.map((linha) => (
            <View key={`${linha.data}-${linha.fruta}`} style={styles.entrega}>
              <Text style={styles.entregaTexto}>
                {rotuloDoDia(linha)} · {capitalizar(linha.fruta)} · {textoDasCaixas(linha.caixas)}
              </Text>
              <Text style={[styles.entregaValor, linha.valor === null && styles.entregaACombinar]}>
                {linha.valor === null ? 'a combinar' : formatarReais(linha.valor)}
              </Text>
            </View>
          ))}
          <View style={styles.total}>
            <Text style={styles.totalTexto}>
              <Text style={styles.forte}>{textoDasCaixas(total.caixas)}</Text>
              {comPreco ? (
                <>
                  {' · '}
                  <Text style={styles.forte}>{formatarReais(total.valor)}</Text>
                </>
              ) : null}
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityHint="Abre o compartilhar com o extrato para mandar ao produtor"
            onPress={() => mandarExtrato(extrato)}
            style={({ pressed }) => [styles.botao, pressed && styles.botaoPressionado]}>
            <Text style={styles.botaoTexto}>Mandar extrato</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

/**
 * Abre o compartilhar do celular com o extrato pronto; o coletor escolhe o WhatsApp e o produtor.
 * Na web, o compartilhar pode não existir: aí nada abre, e o app continua normal (como no recibo).
 */
async function mandarExtrato(extrato: string) {
  try {
    await Share.share({ message: extrato });
  } catch (erro) {
    console.warn('Não deu para abrir o compartilhar:', erro);
  }
}

/** Um aviso: dia e selo da situação, fruta, caixas e preço da caixa, e quanto o coletor paga. */
function AvisoNaAgenda({ aviso }: { aviso: AvisoDoProdutor }) {
  const selo = SELO_DA_SITUACAO[aviso.situacao];

  return (
    <View style={styles.aviso}>
      <View style={styles.avisoTopo}>
        <Text style={styles.avisoDia}>
          {aviso.dia} {aviso.data}
        </Text>
        <Selo texto={selo.texto} cor={selo.cor} />
      </View>
      <Text style={styles.avisoFruta}>
        {capitalizar(aviso.fruta)} · {aviso.caixas} caixas
        {aviso.precoDaCaixa === null ? '' : ` · ${formatarReais(aviso.precoDaCaixa)} a caixa`}
      </Text>
      <Text style={styles.avisoValor}>
        {aviso.valor === null ? (
          'Sem preço do Ceasa'
        ) : (
          <>
            Você paga cerca de <Text style={styles.forte}>{formatarReais(aviso.valor)}</Text>
          </>
        )}
      </Text>
    </View>
  );
}

/** Rótulo à esquerda e valor à direita, como as linhas da Conta do dia. */
function Linha({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <View style={styles.linha}>
      <Text style={styles.rotulo}>{rotulo}</Text>
      <Text style={styles.valor}>{valor}</Text>
    </View>
  );
}

/** Quando o endereço aponta para um produtor que não está no dados.js (/produtor/99). */
export function ProdutorNaoEncontrado() {
  return (
    <View style={styles.vazio}>
      <Text style={styles.vazioTexto}>Não achamos esse produtor.</Text>
    </View>
  );
}
