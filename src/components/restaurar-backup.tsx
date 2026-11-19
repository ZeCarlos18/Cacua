import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import type { EstadoCacua } from '@/state/estado';
import { lerBackup, resumoDoBackup } from '@/utils/backup';
import { dataCurta } from '@/utils/preco-do-ceasa';

import { styles } from './backup.styles';

type RestaurarBackupProps = {
  /** Troca o estado do app pelo do backup (restaurarBackup, S9.3). */
  onRestaurar: (estado: EstadoCacua) => void;
};

/** O backup que passou na conferência, esperando o "Sim, restaurar". */
type Conferido = { estado: EstadoCacua; criadoEm: string };

/**
 * "Restaurar backup" (S9.6): o campo para colar a mensagem e o "Conferir backup". Com erro, o texto
 * do erro embaixo do campo. Certo, mostra o resumo e avisa que restaurar troca tudo, com "Sim,
 * restaurar" e "Não" (o Alert não faz nada na web). Depois de restaurar: "Pronto, os dados do backup
 * voltaram.". Mexer no texto limpa o erro, a conferência e o "Pronto".
 */
export function RestaurarBackup({ onRestaurar }: RestaurarBackupProps) {
  const [texto, setTexto] = useState('');
  const [focado, setFocado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [conferido, setConferido] = useState<Conferido | null>(null);
  const [restaurado, setRestaurado] = useState(false);

  function mudar(novo: string) {
    setTexto(novo);
    setErro(null);
    setConferido(null);
    setRestaurado(false);
  }

  function conferir() {
    const lido = lerBackup(texto);
    setRestaurado(false);
    if ('erro' in lido) {
      setErro(lido.erro);
      setConferido(null);
      return;
    }
    setErro(null);
    setConferido(lido);
  }

  function restaurar() {
    if (!conferido) return;
    onRestaurar(conferido.estado);
    setTexto('');
    setConferido(null);
    setRestaurado(true);
  }

  return (
    <View style={styles.cartao}>
      <Text style={styles.titulo} accessibilityRole="header">
        Restaurar backup
      </Text>

      <View style={styles.campo}>
        <Text style={styles.rotulo}>Cole aqui a mensagem do backup</Text>
        <TextInput
          accessibilityLabel="Cole aqui a mensagem do backup"
          accessibilityHint={erro ?? undefined}
          multiline
          autoCapitalize="none"
          autoCorrect={false}
          value={texto}
          onChangeText={mudar}
          onFocus={() => setFocado(true)}
          onBlur={() => setFocado(false)}
          style={[styles.caixaDeTexto, focado && styles.caixaFocada, erro !== null && styles.caixaComErro]}
        />
        {erro ? (
          <Text style={styles.erro} accessibilityLiveRegion="polite">
            {erro}
          </Text>
        ) : null}
      </View>

      {conferido ? (
        <View style={styles.conferido} accessibilityLiveRegion="polite">
          <Text style={styles.conferidoTitulo}>
            Backup de {dataCurta(conferido.criadoEm)} · {resumoDoBackup(conferido.estado)}
          </Text>
          <View style={styles.aviso}>
            <Text style={styles.avisoTexto}>Restaurar troca tudo o que está no app agora.</Text>
          </View>
          <View style={styles.botoes}>
            <Pressable
              accessibilityRole="button"
              onPress={restaurar}
              style={({ pressed }) => [styles.botaoPerigo, pressed && styles.botaoPerigoPressionado]}>
              <Text style={styles.botaoTexto}>Sim, restaurar</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => setConferido(null)}
              style={({ pressed }) => [styles.botaoContorno, pressed && styles.botaoContornoPressionado]}>
              <Text style={styles.botaoContornoTexto}>Não</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <Pressable
          accessibilityRole="button"
          onPress={conferir}
          style={({ pressed }) => [styles.botaoContorno, pressed && styles.botaoContornoPressionado]}>
          <Text style={styles.botaoContornoTexto}>Conferir backup</Text>
        </Pressable>
      )}

      {restaurado ? (
        <View style={styles.pronto} accessibilityLiveRegion="polite">
          <Text style={styles.prontoTexto}>Pronto, os dados do backup voltaram.</Text>
        </View>
      ) : null}
    </View>
  );
}
