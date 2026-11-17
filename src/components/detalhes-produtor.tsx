import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { BarraCarga } from '@/components/barra-carga';
import { Selo } from '@/components/selo';
import type { CorDoSelo } from '@/components/selo.styles';
import { capitalizar } from '@/utils/agenda';
import { formatarReais } from '@/utils/calculos';
import { textoDaPorcentagem, textoDoKm } from '@/utils/conta';
import { nomeComArtigo } from '@/utils/novo-produtor';
import type { AvisoDoProdutor, SituacaoDoAviso } from '@/utils/produtores';

import { styles } from './detalhes-produtor.styles';

/** O texto e a cor do selo de cada situação: Coletado como o selo da Rota, Confirmado como o da Agenda. */
const SELO_DA_SITUACAO: Record<SituacaoDoAviso, { texto: string; cor: CorDoSelo }> = {
  coletado: { texto: 'Coletado', cor: 'verde' },
  confirmado: { texto: 'Confirmado', cor: 'cheio' },
  aguardando: { texto: 'Aguardando', cor: 'neutro' },
};

type DetalhesProdutorProps = {
  produtor: { nome: string; sitio: string; canal: string; frutas: string[] };
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
  /** O quanto do preço do Ceasa vai para o produtor (0.8 → "80%"). */
  pagoProdutor: number;
  /** "Editar produtor" abre o formulário já preenchido (S9.4). */
  onEditar: () => void;
  /** "Sim, apagar", depois da pergunta (S9.4). */
  onApagar: () => void;
  /** Por que ele não pode ser apagado (motivoParaNaoApagar, S9.1), ou null: o botão fica desligado. */
  motivoParaNaoApagar: string | null;
};

/**
 * Detalhes do produtor (S6.6), em cartões como a Conta do dia: o sítio, os avisos cumpridos e os
 * avisos na agenda, com o que o coletor paga por cada um. No fim, "Editar produtor" e "Apagar
 * produtor" (S9.4).
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
  onEditar,
  onApagar,
  motivoParaNaoApagar,
}: DetalhesProdutorProps) {
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

      <AcoesDoProdutor
        nome={produtor.nome}
        motivoParaNaoApagar={motivoParaNaoApagar}
        onEditar={onEditar}
        onApagar={onApagar}
      />
    </>
  );
}

type AcoesDoProdutorProps = {
  nome: string;
  motivoParaNaoApagar: string | null;
  onEditar: () => void;
  onApagar: () => void;
};

/**
 * "Editar produtor" e "Apagar produtor" (S9.4). O apagar pergunta antes, na própria tela ("Apagar o
 * Seu Francisco? Isso não tem volta."), porque o Alert não faz nada na web. Com aviso na agenda,
 * ou sendo o último produtor, o botão fica desligado, com o motivo embaixo.
 */
function AcoesDoProdutor({ nome, motivoParaNaoApagar, onEditar, onApagar }: AcoesDoProdutorProps) {
  const [perguntando, setPerguntando] = useState(false);

  if (perguntando) {
    return (
      <View style={styles.cartao} accessibilityLiveRegion="polite">
        <Text style={styles.pergunta}>Apagar {nomeComArtigo(nome)}? Isso não tem volta.</Text>
        <View style={styles.botoes}>
          <Botao texto="Sim, apagar" tipo="acaoPerigo" onPress={onApagar} />
          <Botao texto="Não" tipo="acaoContorno" onPress={() => setPerguntando(false)} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.cartao}>
      <View style={styles.botoes}>
        <Botao texto="Editar produtor" tipo="acaoContorno" onPress={onEditar} />
        <Botao
          texto="Apagar produtor"
          tipo="acaoPerigoContorno"
          desligado={motivoParaNaoApagar !== null}
          onPress={() => setPerguntando(true)}
        />
      </View>
      {motivoParaNaoApagar ? <Text style={styles.motivo}>{motivoParaNaoApagar}</Text> : null}
    </View>
  );
}

type BotaoProps = {
  texto: string;
  tipo: 'acaoContorno' | 'acaoPerigo' | 'acaoPerigoContorno';
  desligado?: boolean;
  onPress: () => void;
};

function Botao({ texto, tipo, desligado, onPress }: BotaoProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: desligado }}
      disabled={desligado}
      onPress={onPress}
      style={({ pressed }) => [styles.acao, styles[tipo], pressed && styles.acaoPressionada, desligado && styles.acaoDesligada]}>
      <Text style={[styles.acaoTexto, styles[`${tipo}Texto`]]}>{texto}</Text>
    </Pressable>
  );
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
