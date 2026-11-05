import { Pressable, Text, View } from 'react-native';

import { BarraCarga } from '@/components/barra-carga';
import { Selo } from '@/components/selo';
import { formatarReais, type calcularLucroDoDia } from '@/utils/calculos';
import { textoDoKm } from '@/utils/conta';
import { textoDeUmDe, type resumoDaSemana, type resumoDoDia } from '@/utils/inicio';
import { subtituloDaRota, textoDasCaixas, textoDoColetado } from '@/utils/rota-do-dia';

import { styles } from './painel-inicio.styles';

type RotaDeHojeProps = {
  hoje: ReturnType<typeof resumoDoDia>;
  /** O horário de saída do dados.js ("7h"). */
  saida?: string;
  onAbrirRota: () => void;
  onVerConta: () => void;
};

/** O cartão de cima do Início: a rota de hoje, quanto já foi coletado, o lucro e a confirmação. */
export function RotaDeHoje({ hoje, saida, onAbrirRota, onVerConta }: RotaDeHojeProps) {
  const quantas = `${hoje.paradas} ${hoje.paradas === 1 ? 'parada' : 'paradas'}`;

  return (
    <View style={styles.cartao}>
      <Text style={styles.rotuloDaSecao}>Rota de hoje</Text>
      <View style={styles.cabecalho}>
        <Text style={styles.titulo} accessibilityRole="header">
          {hoje.dia.dia} {hoje.dia.data}
        </Text>
        <Selo texto={hoje.conta.selo} />
      </View>
      <Text style={styles.detalhe}>
        {subtituloDaRota(hoje.dia.dia, saida)} · {quantas} · {textoDasCaixas(hoje.caixas)} ·{' '}
        {textoDoKm(hoje.km)}
      </Text>
      {hoje.caixas > 0 ? (
        <BarraCarga
          caixas={hoje.caixasColetadas}
          cargaMinima={hoje.caixas}
          texto={textoDoColetado(hoje.caixasColetadas, hoje.caixas)}
        />
      ) : null}
      <View style={styles.linha}>
        <Text style={styles.rotulo}>Lucro estimado</Text>
        <Text style={styles.lucro}>{formatarReais(hoje.conta.lucro)}</Text>
      </View>
      {hoje.confirmado ? (
        <Selo texto="Coleta confirmada" cor="cheio" />
      ) : (
        <Text style={styles.pendente}>A coleta deste dia ainda não foi confirmada aos produtores.</Text>
      )}
      <View style={styles.botoes}>
        <Pressable
          accessibilityRole="button"
          onPress={onAbrirRota}
          style={({ pressed }) => [styles.botao, pressed && styles.botaoPressionado]}>
          <Text style={styles.botaoTexto}>Abrir a rota</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={onVerConta}
          style={({ pressed }) => [styles.botaoContorno, pressed && styles.botaoContornoPressionado]}>
          <Text style={styles.botaoContornoTexto}>Ver conta</Text>
        </Pressable>
      </View>
    </View>
  );
}

/** Os quatro números da semana: caixas, lucro, dias que valem a pena e paradas coletadas. */
export function ResumoDaSemana({ semana }: { semana: ReturnType<typeof resumoDaSemana> }) {
  const numeros = [
    { valor: String(semana.caixas), rotulo: 'caixas avisadas' },
    { valor: formatarReais(semana.lucro), rotulo: 'de lucro estimado' },
    { valor: textoDeUmDe(semana.diasQueValem, semana.dias), rotulo: 'dias valem a pena' },
    { valor: textoDeUmDe(semana.paradasColetadas, semana.paradas), rotulo: 'paradas coletadas' },
  ];

  return (
    <View style={styles.cartao}>
      <Text style={styles.tituloSecao} accessibilityRole="header">
        Resumo da semana
      </Text>
      <View style={styles.numeros}>
        {numeros.map((numero) => (
          <View key={numero.rotulo} style={styles.numero} accessible>
            <Text style={styles.numeroValor}>{numero.valor}</Text>
            <Text style={styles.numeroRotulo}>{numero.rotulo}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

type DiaParaConfirmar = {
  dia: string;
  data: string;
  conta: ReturnType<typeof calcularLucroDoDia>;
};

type DiasSemConfirmacaoProps = {
  dias: DiaParaConfirmar[];
  onAbrir: (data: string) => void;
};

/** Os dias que ainda não tiveram a coleta confirmada. Cada um abre a Conta do dia para confirmar. */
export function DiasSemConfirmacao({ dias, onAbrir }: DiasSemConfirmacaoProps) {
  return (
    <View style={styles.cartao}>
      <Text style={styles.tituloSecao} accessibilityRole="header">
        Coletas para confirmar
      </Text>
      {dias.length === 0 ? (
        <Text style={styles.tudoCerto}>Todos os dias da agenda já foram confirmados aos produtores.</Text>
      ) : (
        <>
          <Text style={styles.detalhe}>
            O produtor só colhe depois da confirmação. Toque no dia para ver a conta e confirmar.
          </Text>
          {dias.map((dia) => (
            <Pressable
              key={dia.data}
              accessibilityRole="button"
              accessibilityLabel={`${dia.dia} ${dia.data}, ${dia.conta.selo}, lucro ${formatarReais(dia.conta.lucro)}`}
              accessibilityHint="Abre a conta do dia"
              onPress={() => onAbrir(dia.data)}
              style={({ pressed }) => [styles.dia, pressed && styles.diaPressionado]}>
              <View style={styles.diaTextos}>
                <Text style={styles.diaNome}>
                  {dia.dia} {dia.data}
                </Text>
                <Text style={styles.detalhe}>
                  {textoDasCaixas(dia.conta.caixas)} · {formatarReais(dia.conta.lucro)}
                </Text>
              </View>
              <View style={styles.diaDireita}>
                <Selo texto={dia.conta.selo} />
                <Text style={styles.seta} accessibilityElementsHidden importantForAccessibility="no">
                  ›
                </Text>
              </View>
            </Pressable>
          ))}
        </>
      )}
    </View>
  );
}

/** Botão com contorno, para os atalhos do Início (como "Custos e preços"). */
export function BotaoAtalho({ texto, onPress }: { texto: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.botaoContorno, pressed && styles.botaoContornoPressionado]}>
      <Text style={styles.botaoContornoTexto}>{texto}</Text>
    </Pressable>
  );
}
