# Caçuá

O Caçuá é um app para o coletor de frutas que compra dos pequenos produtores da região e revende no Ceasa. Os produtores avisam quando vão colher (pelo WhatsApp ou pela ponto focal), e o app junta esses avisos numa agenda. Para cada dia, ele calcula se a viagem vale a pena: soma a venda no Ceasa e desconta o que vai para os produtores, a perda, o diesel e os outros custos. Também monta a melhor ordem das paradas, registra cada coleta, mostra a previsão das próximas semanas e deixa o coletor ajustar os próprios custos e preços.

O app tem 5 abas: **Agenda**, **Rota**, **Previsão**, **Produtores** e **Custos**. Por enquanto, ele usa os dados de exemplo de `src/data/dados.js` (o coletor Edson, de Boa Vista, e 6 produtores).

## Instalar

Precisa do [Node.js](https://nodejs.org) (versão LTS). Depois de clonar o repositório, na pasta do projeto:

```bash
npm install
```

Rode o `npm install` de novo sempre que puxar a `main` e o `package.json` tiver mudado.

## Rodar na web

É o jeito mais rápido de ver o app, sem celular:

```bash
npx expo start --web
```

O app abre no navegador em `http://localhost:8081`. Para ver no tamanho de celular, aperte **F12** e depois **Ctrl + Shift + M**. Na web, o que o app salva (avisos, custos e coletas) fica no próprio navegador.

## Rodar no celular (Android)

Há dois jeitos. O mais simples é pelo **Expo Go**. O **build de desenvolvimento** instala o próprio Caçuá no celular, como um app de verdade.

### Pelo Expo Go (o mais simples)

1. Instale o **Expo Go** pela Play Store, ou atualize se já tiver.
2. Deixe o celular e o computador na mesma rede Wi-Fi.
3. Na pasta do projeto, rode:

   ```bash
   npx expo start
   ```

4. No Expo Go, toque em **Scan QR code** e leia o QR code que aparece no terminal.

As mudanças no código aparecem no celular assim que o arquivo é salvo.

### Pelo build de desenvolvimento

#### O que precisa estar instalado (uma vez só)

1. **JDK 17.** No PowerShell: `choco install -y microsoft-openjdk17`.
2. **Android Studio**, na instalação padrão (Standard). Em **Settings › Languages & Frameworks › Android SDK**, instale o **Android SDK Platform 37** e o **Android SDK Build-Tools 37.0.0**, as versões que o React Native do projeto usa para compilar.
3. **Variáveis de ambiente do Windows** (em "Editar as variáveis de ambiente da sua conta"):
   - `ANDROID_HOME` apontando para `%LOCALAPPDATA%\Android\Sdk`;
   - no `Path`, a pasta `%LOCALAPPDATA%\Android\Sdk\platform-tools`.
4. **No celular, a depuração USB:** em **Configurações › Sobre o telefone**, toque 7 vezes em **Número da versão** para liberar as opções do desenvolvedor. Depois, em **Opções do desenvolvedor**, ligue a **Depuração USB**.

Ligue o celular no computador pelo cabo USB, aceite a pergunta de depuração que aparece na tela e confira:

```bash
adb devices
```

O celular tem que aparecer na lista com a palavra `device` do lado.

#### Gerar o build e instalar no celular

```bash
npm run android
```

Esse comando (`expo run:android`) compila o app, instala no celular e já abre o servidor de desenvolvimento. A primeira vez demora alguns minutos.

#### Abrir depois

Com o celular ligado no computador pelo cabo USB, há dois jeitos de abrir o Caçuá instalado:

- **O mais simples:** rodar `npm run android` de novo. Como o app já foi compilado uma vez, essa vez é bem mais rápida, e o comando instala, abre o app e liga o servidor sozinho.
- **Sem compilar:** ligar a porta do celular ao computador e subir só o servidor (ele fica rodando no terminal):

  ```bash
  adb reverse tcp:8081 tcp:8081
  npx expo start
  ```

  Com o servidor rodando, abra o Caçuá direto no celular. Aqui, não use o **a** do terminal: como o projeto não tem o pacote `expo-dev-client`, o **a** abre o projeto no Expo Go, e não no Caçuá instalado. O `adb reverse` precisa ser rodado de novo sempre que o cabo for reconectado.

As mudanças no código chegam ao app sem compilar de novo.

**Quando gerar o build de novo:** depois de instalar uma biblioteca com código nativo (como o Async Storage, que entrou no S4.5) ou de mudar o `app.json`. Aí rode `npm run android` outra vez.

## Conferir os números

```bash
npm run conferir
```

Roda os scripts da pasta `scripts/` e compara as contas do app com os números do Figma: a ordem das paradas e os km da rota, o lucro de cada dia, a próxima colheita dos produtores, o estado do app, os custos editáveis, o formulário de novo aviso e o que fica salvo no celular. Cada linha mostra `OK` ou `FALHA`. Se um script falhar, o comando termina com erro e os scripts seguintes não rodam. Ele tem que continuar passando depois de qualquer mudança.

Antes de abrir um pull request, rode também:

```bash
npx tsc --noEmit
npx expo lint
```

## Pastas

| Pasta | O que tem |
|---|---|
| `src/app` | As telas. Cada arquivo é uma rota (Expo Router): as 5 abas ficam em `src/app/(abas)`, e telas como a Conta do dia e o Registrar aviso abrem por cima delas. |
| `src/components` | Os componentes das telas (cartão do dia, parada, mapa, selo…), cada um com os estilos num `*.styles.ts` ao lado. |
| `src/utils` | As contas e os textos: lucro do dia, rota, previsão, custos. |
| `src/state` | O estado do app (S4.1): o `CacuaProvider` e o `useCacua()`, com a agenda, os custos, os preços e as coletas, e o que fica salvo no celular (S4.5). |
| `src/data` | Os dados de exemplo (`dados.js`), o ponto de partida do app. |
| `src/constants` | As cores e os espaçamentos do Caçuá (`theme.ts`). |
| `scripts` | Os scripts do `npm run conferir`. |
| `assets` | Ícone, splash e imagens do app. |

## Como a equipe trabalha

- **Trello:** cada tarefa é um cartão (S1.1, S2.4, S4.2…), com responsável, prazo e o que precisa ser entregue.
- **Uma branch por cartão**, criada a partir da `main` atualizada, por exemplo `feat/s4.2-readme`.
- **Pull request:** quando o cartão fica pronto, abrimos um PR para a `main`, descrevendo o que mudou e como foi testado.
- **Revisão:** outro integrante revisa e testa antes do merge. O `npm run conferir`, o `npx tsc --noEmit` e o `npx expo lint` têm que passar.
- **Concluído:** o cartão só vai para "Concluído" depois de testado no celular, com o print no card "Como está o app".

Equipe: Caique de Souza Oliveira, José Carlos e Teogenes Cordeiro.
