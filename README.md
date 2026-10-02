# Site IMar Júnior · v2

Nova proposta do site da **IMar Júnior**, Empresa Júnior do Instituto do Mar da Unifesp.

Feito com **Astro** (organização e build), **GSAP** (animações de rolagem), **Lenis** (rolagem suave) e **Three.js** (oceano 3D do topo). O site é 100% estático e roda de graça no GitHub Pages.

Páginas:

| Página | Endereço | Arquivo |
| --- | --- | --- |
| Início (landing, com o oceano 3D) | `/` | `src/pages/index.astro` |
| Quem somos (+ equipe e Faça parte) | `/quem-somos` | `src/pages/quem-somos.astro` |
| Serviços (+ método e ODS) | `/servicos` | `src/pages/servicos.astro` |
| Projetos | `/projetos` | `src/pages/projetos.astro` |
| Contato (formulário) | `/contato` | `src/pages/contato.astro` |
| Opções de identidade visual (interna, fora do menu) | `/identidade` | `src/pages/identidade.astro` |

A troca entre páginas tem uma animação de onda (`src/components/Onda.astro`).

---

## 1. Rodar no seu computador

Pré-requisito: [Node.js](https://nodejs.org) 22 ou mais recente (você já tem).

```bash
npm install      # só na primeira vez
npm run dev      # abre em http://localhost:4321
```

O site recarrega sozinho quando você salva um arquivo.

| Comando           | O que faz                                          |
| ----------------- | -------------------------------------------------- |
| `npm run dev`     | Servidor de desenvolvimento                        |
| `npm run build`   | Gera o site final na pasta `dist/`                 |
| `npm run preview` | Mostra a versão final gerada pelo `build`          |

---

## 2. Editar textos (sem programar)

Todo o conteúdo fica em **`src/data/`**:

| Arquivo        | O que tem                                                                   |
| -------------- | --------------------------------------------------------------------------- |
| `site.ts`      | E-mail, WhatsApp, redes sociais, ano de fundação, chave do formulário       |
| `servicos.ts`  | Os 6 serviços (aparecem nos cards **e** no formulário automaticamente)      |
| `conteudo.ts`  | Hero, quem somos, missão/visão, públicos, método, projetos, parceiros, ODS  |
| `equipe.ts`    | Membros da equipe (nome, cargo, foto em `public/img/equipe/`)               |
| `depoimentos.ts` | Depoimentos de clientes (carrossel da página inicial)                    |

Regras de ouro: edite só o texto entre aspas `'assim'`, não apague vírgulas, chaves `{ }` ou colchetes `[ ]`. Para adicionar um item, copie um bloco `{ ... },` inteiro.

### Fotos

Coloque os arquivos em **`public/img/`** e aponte para eles no conteúdo, ex.: `imagem: 'img/feira-cultura-inglesa.jpg'`.
Fotos atuais: `equipe.jpg`, `banner-time.jpg`, `evento.jpg` (as mesmas da v1).

> **Pendências marcadas com `TODO`** (busque por "TODO" no VS Code):
> - foto e texto final da **Feira de Educação Ambiental com a Cultura Inglesa** (`conteudo.ts`)
> - confirmar o **@ do TikTok** (`site.ts`)

---

## 3. Formulário de contato (Web3Forms)

Escolhemos o **[Web3Forms](https://web3forms.com)**: gratuito (250 envios/mês), sem precisar de servidor, sem login, com proteção anti-spam, e as mensagens chegam direto no e-mail.

1. Acesse https://web3forms.com, digite `contato@imarjunior.com.br` e clique em **Create Access Key**.
2. A chave chega no e-mail. Cole em `src/data/site.ts`, no campo `web3formsKey: ''`.
3. Pronto. Enquanto a chave estiver vazia, o formulário abre o app de e-mail da pessoa com a mensagem pronta (nada se perde).

O botão flutuante de WhatsApp continua sendo o canal mais rápido: ele já abre a conversa com uma mensagem pronta.

---

## 4. Publicar no GitHub Pages (passo a passo)

O projeto já tem um robô (`.github/workflows/deploy.yml`) que publica o site sozinho a cada envio.

### 4.1 Criar o repositório no GitHub

1. Entre em https://github.com/new
2. **Repository name**: por exemplo `site-imar-v2`
3. Deixe **Public** (o GitHub Pages gratuito exige repositório público)
4. **Não** marque "Add a README" nem ".gitignore" (o projeto já tem)
5. Clique em **Create repository**

### 4.2 Enviar os arquivos

Abra o terminal na pasta do projeto (`C:\Users\gianl\SiteImar-v2`) e rode, trocando `SEU-USUARIO`:

```bash
git remote add origin https://github.com/SEU-USUARIO/site-imar-v2.git
git push -u origin main
```

> O repositório local já foi criado e o primeiro commit já foi feito. Se o Git pedir login, use sua conta do GitHub (o navegador abre para autorizar).

### 4.3 Ligar o GitHub Pages

1. No repositório, vá em **Settings → Pages**
2. Em **Source**, escolha **GitHub Actions**
3. Vá na aba **Actions** e acompanhe o "Publicar no GitHub Pages" (leva 1 ou 2 minutos)
4. O site fica em `https://SEU-USUARIO.github.io/site-imar-v2/`

Se a primeira execução falhar porque o Pages ainda não estava ligado, abra a aba **Actions**, clique no workflow e em **Re-run all jobs**.

### 4.4 Atualizar o site depois

```bash
git add .
git commit -m "Descreva a mudança"
git push
```

Cada `push` publica de novo automaticamente.

### 4.5 Quando tiverem domínio próprio

1. **Settings → Pages → Custom domain**: digite o domínio (ex.: `imarjunior.com.br`)
2. No painel onde o domínio foi comprado, crie os registros DNS que o GitHub indicar
3. Marque **Enforce HTTPS**

O workflow ajusta os caminhos sozinho; não precisa mudar código.

---

## 5. Identidade visual

- **Base**: azuis do logo (`#0A2C52`, `#3B8FD9`, `#8CC8F0`) e o abismo `#01060E`
- **Destaque**: *Bioluminescência* `#3DF2C9` (substitui o laranja da v1). Alternativas na página `/identidade`
- **Títulos**: Fraunces (serifada macia, com itálico fluido). **Texto**: Manrope. **Rótulos técnicos**: JetBrains Mono
- **Modo claro ("superfície") e escuro ("abismo")**: segue o sistema e tem botão no topo

Para trocar a cor de destaque ou a fonte, edite as variáveis no topo de `src/styles/global.css`.

## 6. Animações

| Onde               | O que acontece                                                                 |
| ------------------ | ------------------------------------------------------------------------------ |
| Abertura           | Logo "enche de água" e a tela sobe com uma onda (só na 1ª visita da sessão)    |
| Hero               | Oceano 3D de partículas que reage ao mouse; palavra em itálico que se alterna   |
| Página toda        | Rolagem suave; o fundo escurece conforme a "profundidade"; profundímetro lateral |
| Quem somos         | Texto que acende palavra por palavra; foto revelada com cortina e parallax       |
| Serviços           | Rolagem horizontal fixa (desktop) com ícones que se desenham                    |
| Método             | Linha de sonar que se desenha e acende cada etapa                              |
| ODS / cards        | Inclinação 3D ao passar o mouse                                               |
| Botões             | Efeito magnético e preenchimento animado                                       |
| Tema               | Troca claro/escuro com uma onda circular                                      |

Quem tem "reduzir movimento" ligado no sistema vê o site sem animações.

## 7. Estrutura

```
src/
  data/        ← textos e contatos (o que você mais vai editar)
  components/  ← cada seção do site
  pages/       ← index (site), identidade, 404
  scripts/     ← animações (main.ts), oceano 3D (ocean.ts), partículas (snow.ts)
  styles/      ← cores, fontes e estilos gerais
public/img/    ← fotos e logo
```
