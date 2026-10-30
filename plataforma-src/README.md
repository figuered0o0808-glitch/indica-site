# INDICA · Plataforma de criadores

Plataforma pública da INDICA para editais, publicações e materiais de apoio a criadores de conteúdo de interesse público. Interface em português, inglês e espanhol.

## Identidade

Logotipo oficial em `public/marca/indica.png`, ícones e imagem de compartilhamento na mesma pasta. Fontes locais Jost e Inter em `public/fonts/`. Visual predominantemente preto e branco, sem faixa em degradê no topo. As cores ficam na assinatura de três bolinhas e em detalhes das carinhas, com os mesmos degradês e ordem azul, verde e rosa de agenciaindica.com. Tokens e estilos em `src/app/globals.css`.

## Desenvolvimento e publicação

Este fonte integra o repositório do site público da agência. `npm ci`, `npm run dev` e `npm run typecheck` atendem o desenvolvimento; `npm run publicar` chama o gerador do repositório pai, que verifica tipos, exporta e atualiza a pasta pública `../plataforma/`.
O GitHub Pages publica a raiz do repositório pai, com `.nojekyll`, no domínio `agenciaindica.com`. O caminho da plataforma é `/plataforma`, configurado em `next.config.mjs`; a origem canônica está em `src/lib/seo.ts`. O painel administrativo permanece em servidor separado e não é incluído neste fonte público.

## Conteúdo e estado

Conteúdo em `data/`, textos em `src/i18n/` e nome em `src/config/program.ts`. Cadastros e candidaturas continuam no navegador; registros locais anteriores são lidos por compatibilidade. A API opcional é configurada por `NEXT_PUBLIC_INDICA_API`; o contrato de rotas anterior foi preservado.

O catálogo contém somente quatro publicações reais da INDICA e o edital Carros elétricos no Brasil, com o PDF original de cinco páginas. Chamadas, resultados, bancas, cursos, artigos e marcas fictícias foram retirados. O edital está no status `consulta`: valores, critérios e cronograma foram transcritos do documento sem alterar datas; a candidatura fica indisponível até a revisão do calendário e abertura do processo. Não há faixa de apoio fixa por proposta: o orçamento global é de até R$ 100 mil, para 3 a 14 propostas. O slug real é `carros-eletricos-no-brasil`, separado do antigo exemplo para não reapresentar candidaturas locais de demonstração. Catálogos vazios de cursos não são promovidos, e a rota antiga do catálogo redireciona à Biblioteca. Ações locais novas usam a data real do navegador; o painel filtra registros pelos catálogos atuais sem apagar o armazenamento anterior.

## Motion e carinhas

As três carinhas originais aparecem juntas nos caminhos da abertura. O branco predomina; os degradês oficiais ficam em partes selecionadas: sobrancelha direita e boca em azul nas oportunidades, olho esquerdo e boca em verde no cadastro, e olho direito em verde/rosa na biblioteca. `CarinhaIndica` preserva os traços dos PNGs com máscaras de tinta, gradientes por parte e pivôs SVG nativos. Depois que as imagens carregam e a navegação entra na tela, cada personagem faz uma coreografia de entrada finita, com piscadas, aceno e mudança de olhar, terminando em repouso em até 3,4 s. Foco e ponteiro montam a logo a partir das peças da carinha correspondente; a entrada e a montagem têm grupos independentes. Movimento reduzido desliga os grupos animados e preserva as translações estruturais. A navegação funciona diretamente e não depende da animação. Na confirmação de cadastro há um aceno finito. As artes e o vídeo de referência permanecem em `public/marca/`, sem carregamento do vídeo pela interface.

Ao receber hover ou foco, cada personagem rearranja suas peças na logo oficial e volta à carinha ao sair. O acabamento usa máscaras dos glifos de `indica.png`, mantendo os degradês nas letras correspondentes: n e sublinhado azuis, n e a verdes, a verde/rosa. As peças viajam com translação, rotação e escala antes da composição final; o retorno usa a mesma geometria. A área da marca é reservada no layout para evitar deslocar os textos. Com movimento reduzido, a troca acontece sem animação. Sem chamada com inscrições abertas, o caminho verde leva ao edital real e a coluna central oferece o PDF original.
