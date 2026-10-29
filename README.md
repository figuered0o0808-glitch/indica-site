# INDICA — Site Vitrine

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
