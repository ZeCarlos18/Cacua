/**
 * O estado guardado no celular (S4.5), com o Async Storage. Na web, ele usa o localStorage do
 * navegador. Se o celular não conseguir ler ou salvar, o app continua com o que está na memória.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

import { estadoDoSalvo, type EstadoCacua } from '@/state/estado';

/** Onde o estado fica guardado. Se o formato mudar, troque o v1, e o app ignora o salvo antigo. */
const CHAVE = 'cacua:estado:v1';

/** O que foi salvo, ou null se não há nada (ou não deu para ler): aí o app usa o dados.js. */
export async function carregarEstado() {
  try {
    return estadoDoSalvo(await AsyncStorage.getItem(CHAVE));
  } catch {
    return null;
  }
}

export async function salvarEstado(estado: EstadoCacua) {
  try {
    await AsyncStorage.setItem(CHAVE, JSON.stringify(estado));
  } catch (erro) {
    console.warn('Não deu para salvar no celular:', erro);
  }
}

/** Apaga o que foi salvo; o app volta a abrir com o dados.js. */
export async function apagarEstadoSalvo() {
  try {
    await AsyncStorage.removeItem(CHAVE);
  } catch (erro) {
    console.warn('Não deu para apagar o que foi salvo no celular:', erro);
  }
}
