# INDICA — site público e Plataforma

Uma publicação pública em **https://agenciaindica.com/**:

- `/`: apresentação da agência, atuação, serviços, trabalhos, equipe e contato.
- `/plataforma/`: oportunidades e biblioteca para criadores, em português, inglês e espanhol.

A administração, a Fábrica de Criadores e as métricas ficam no projeto e servidor separados. Este repositório público não contém suas telas, banco ou credenciais.

## Plataforma integrada

O fonte em `plataforma-src/` foi incorporado de `figuered0o0808-glitch/tilt-plataforma`, revisão `e4858c3aedd4f52203851869d3b20c0a55cd1cc7`. A exportação publicada fica em `plataforma/`. Para atualizar, com Node.js 20 ou posterior:

```sh
cd plataforma-src
npm ci
cd ..
node scripts/atualizar-plataforma.mjs
```

O build do Next.js verifica tipos e gera as páginas. A saída anterior só é substituída depois de o build passar. O comando fixa `/plataforma` como caminho e `https://agenciaindica.com` como origem canônica e corrige o idioma dos HTML exportados. A saída `plataforma/` deve acompanhar cada alteração no fonte.

O GitHub Pages mantém a raiz da branch `main` e o domínio existente. Preserve `.nojekyll` para servir `_next`. A integração não altera DNS. Na prévia local abaixo, a plataforma abre em `/plataforma/`.

A biblioteca é o catálogo canônico; a home da agência mostra suas publicações como prévia. Os PDFs antigos da agência continuam disponíveis para preservar links existentes.

Esta etapa mantém o edital de carros elétricos em **consulta**, sem turma aberta, e o canal de envio externo desligado. A ligação dos formulários ao banco administrativo será implementada separadamente. Não inclua `.env`, chaves, sessões ou dados administrativos neste repositório.

## Site institucional

Site institucional (one-page) da agência **INDICA**, reconstruído a partir do portfólio.
HTML/CSS/JS puro, sem build e sem dependências — abre direto no navegador.

## Estrutura

```
indica-site/
├── index.html              # todo o conteúdo da página
├── assets/
│   ├── css/style.css       # estilos + sistema de cores por eixo + responsivo
│   ├── js/main.js          # nav, reveal no scroll, contadores animados
│   └── img/
│       ├── logo-white.png  # logo (fundo escuro)
│       ├── logo-dark.png   # logo (fundo claro)
│       ├── favicon.svg
│       └── team-*.png      # fotos da equipe (extraídas do PDF)
└── README.md
```

## Rodar localmente

```bash
cd indica-site
python3 -m http.server 4321
# abrir http://localhost:4321
```

## Seções

Hero · Quem somos (equipe) · Cenário/dados · Atuação (3 eixos) · Cases ·
Produções audiovisuais · Serviços · Rede de comunicadores · Parceiros · Contato.

Sistema de cores por eixo: **Democracia** (azul), **Ciência** (verde), **Meio Ambiente** (rosa).

## O que atualizar antes de publicar

No `index.html`:
- **Contato** (seção `#contato`): trocar `contato@indica.ag` pelo e-mail real e o link do
  Instagram da agência (`href="https://instagram.com"`).
- **Handles da equipe**: confira os `@` em `#sobre` (foram lidos do portfólio).
- Estatísticas e cases já refletem os números do portfólio (fonte: Quaest/2025 e Influence.me/2026).

## Publicar (grátis)

Por ser estático, sobe em qualquer um destes arrastando a pasta:
- **Netlify** (netlify.com/drop) — arrasta a pasta `indica-site`.
- **Vercel** — `vercel` na pasta.
- **GitHub Pages** — push do repositório e ativar Pages.
- **Render** — Static Site apontando para o repositório.
