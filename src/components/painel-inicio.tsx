import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { AvisoSemanaFraca } from '@/components/aviso-semana-fraca';
import { BarraCarga } from '@/components/barra-carga';
import { BotaoConvidar } from '@/components/botao-convidar';
import { BotaoRegistrarAviso } from '@/components/botao-registrar-aviso';
import { Selo } from '@/components/selo';
import { hrefDaConta, hrefDaRota } from '@/utils/agenda';
import { rotuloDoDia } from '@/utils/aviso';
import { formatarReais } from '@/utils/calculos';
import { textoDoKm } from '@/utils/conta';
import type { resumoDaSemana, resumoDoDia } from '@/utils/inicio';
import { subtituloDaRota, textoDoColetado } from '@/utils/rota-do-dia';

import { styles } from './painel-inicio.styles';

type ResumoDoDia = ReturnType<typeof resumoDoDia>;

type PainelInicioProps = {
  /** A rota de hoje (a quinta do dados.js), ou null se o dia não está na agenda. */
  hoje: ResumoDoDia | null;
  /** O horário de saída da rota de hoje (rota.saida). */
  saida: string;
  semana: ReturnType<typeof resumoDaSemana>;
  /** Os dias que faltam confirmar, já com a conta de cada um. */
  paraConfirmar: ResumoDoDia[];
  semanaFraca: { periodo: string; caixas: number } | null;
  cargaMinima: number;
};

/**
 * Painel do Início (S6.5), de cima para baixo: a rota de hoje, o resumo da semana, as coletas que
 * faltam confirmar, o aviso de semana fraca e os atalhos. As contas vêm do utils/inicio.ts (S6.2),
 * então os números batem com a Agenda, a Rota e a Previsão.
 */
export function PainelInicio({ hoje, saida, semana, paraConfirmar, semanaFraca, cargaMinima }: PainelInicioProps) {
  return (
    <>
      {hoje ? <RotaDeHoje hoje={hoje} saida={saida} /> : null}

      <View style={styles.cartao}>
        <Text style={styles.tituloSecao} accessibilityRole="header">
          Resumo da semana
        </Text>
        <View style={styles.numeros}>
          <Numero valor={String(semana.caixas)} rotulo="caixas avisadas" />
          <Numero valor={formatarReais(semana.lucro)} rotulo="lucro estimado" />
          <Numero valor={`${semana.diasQueValem} de ${semana.dias}`} rotulo="dias valem a pena" />
          <Numero valor={`${semana.paradasColetadas} de ${semana.paradas}`} rotulo="paradas coletadas" />
        </View>
      </View>

      <View style={styles.cartao}>
        <Text style={styles.tituloSecao} accessibilityRole="header">
          Coletas para confirmar
        </Text>
        {paraConfirmar.length === 0 ? (
          <Text style={styles.detalhe}>Todas as coletas da semana estão confirmadas.</Text>
        ) : (
          paraConfirmar.map((dia, indice) => (
            <Pressable
              key={dia.dia.data}
              accessibilityRole="button"
              accessibilityLabel={`${dia.dia.dia} ${dia.dia.data}, ${dia.conta.caixas} caixas, ${formatarReais(dia.conta.lucro)}, ${dia.conta.selo}. Abre a conta do dia`}
              onPress={() => router.push(hrefDaConta(dia.dia.data))}
              style={({ pressed }) => [styles.item, indice > 0 && styles.divisor, pressed && styles.itemPressionado]}>
              <View style={styles.itemTextos}>
                <Text style={styles.itemDia}>{rotuloDoDia(dia.dia)}</Text>
                <Text style={styles.detalhe}>
                  {dia.conta.caixas} caixas · {formatarReais(dia.conta.lucro)}
                </Text>
              </View>
              <Selo texto={dia.conta.selo} />
              <Text style={styles.seta} aria-hidden>
                ›
              </Text>
            </Pressable>
          ))
        )}
      </View>

      {semanaFraca ? (
        <AvisoSemanaFraca periodo={semanaFraca.periodo} caixas={semanaFraca.caixas} cargaMinima={cargaMinima} />
      ) : null}

      <View style={styles.atalhos}>
        <BotaoRegistrarAviso />
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/custos')}
          style={({ pressed }) => [styles.botaoContorno, pressed && styles.botaoContornoPressionado]}>
          <Text style={styles.botaoContornoTexto}>Custos e preços</Text>
        </Pressable>
        <BotaoConvidar />
      </View>
    </>
  );
}

type RotaDeHojeProps = {
  hoje: ResumoDoDia;
  saida: string;
};

/** O cartão da rota de hoje: dia, selo, a rota, o coletado, o lucro, se foi confirmada e os botões. */
function RotaDeHoje({ hoje, saida }: RotaDeHojeProps) {
  const { dia, conta } = hoje;
  const rotaDoDia = [
    subtituloDaRota(dia.dia, saida),
    `${hoje.paradas} ${hoje.paradas === 1 ? 'parada' : 'paradas'}`,
    `${hoje.caixas} caixas`,
    textoDoKm(hoje.km),
  ].join(' · ');

  return (
    <View style={styles.cartao}>
      <Text style={styles.rotulo}>Rota de hoje</Text>
      <View style={styles.cabecalho}>
        <Text style={styles.dia} accessibilityRole="header">
          {dia.dia} {dia.data}
        </Text>
        <Selo texto={conta.selo} />
      </View>
      <Text style={styles.detalhe}>{rotaDoDia}</Text>

      <BarraCarga
        caixas={hoje.caixasColetadas}
        cargaMinima={hoje.caixas}
        texto={textoDoColetado(hoje.caixasColetadas, hoje.caixas)}
      />

      <Text style={styles.lucro}>
        Lucro estimado: <Text style={styles.lucroValor}>{formatarReais(conta.lucro)}</Text>
      </Text>
      <Text style={[styles.confirmacao, hoje.confirmado && styles.confirmada]}>
        {hoje.confirmado ? 'Coleta confirmada.' : 'Coleta ainda não confirmada.'}
      </Text>

      <View style={styles.botoes}>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.navigate(hrefDaRota(dia.data))}
          style={({ pressed }) => [styles.botao, styles.botaoMetade, pressed && styles.botaoPressionado]}>
          <Text style={styles.botaoTexto}>Abrir a rota</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push(hrefDaConta(dia.data))}
          style={({ pressed }) => [
            styles.botaoContorno,
            styles.botaoMetade,
            pressed && styles.botaoContornoPressionado,
          ]}>
          <Text style={styles.botaoContornoTexto}>Ver conta</Text>
        </Pressable>
      </View>
    </View>
  );
}

/** Um número do resumo da semana, com o que ele conta embaixo. */
function Numero({ valor, rotulo }: { valor: string; rotulo: string }) {
  return (
    <View style={styles.numero} accessible accessibilityLabel={`${valor} ${rotulo}`}>
      <Text style={styles.numeroValor}>{valor}</Text>
      <Text style={styles.numeroRotulo}>{rotulo}</Text>
    </View>
  );
}
