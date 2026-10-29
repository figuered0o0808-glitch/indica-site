# INDICA · Site institucional

Site estático de `agenciaindica.com`, servido pelo GitHub Pages a partir da branch `main`. HTML, CSS e JavaScript sem dependências de execução.

## Organização

- `/` e `/en/`: home editorial com trabalho em destaque, serviços, apresentação, publicações e contato.
- `/trabalhos/` e `/en/trabalhos/`: acervo dos 13 projetos, com filtros por eixo e produções audiovisuais.
- `/trabalhos/{slug}/`: página compartilhável de cada projeto, com descrição e indicadores existentes no portfólio. Os caminhos em inglês usam o prefixo `/en`.
- `/a-indica/`: história, eixos, rede, os 12 integrantes e os 14 parceiros.
- `/publicacoes/`: as duas séries e os quatro artigos, com acesso a todos os PDFs em português e inglês.

O seletor PT/EN troca para a página equivalente e funciona sem JavaScript. Os PDFs e seus caminhos originais foram preservados. Os fragmentos antigos `#publicacoes`, `#sobre`, `#atuacao`, `#servicos` e `#contato` seguem úteis na home. Os fragmentos de eixos, rede e produções são encaminhados ao acervo ou à página institucional.

## Conteúdo e geração

A fonte editorial é `assets/data/content.json`, extraída do site anterior para preservar as descrições, autores, perfis, parceiros, indicadores e versões em inglês. Para atualizar as páginas depois de editar os dados:

```sh
python3 scripts/build-site.py
```

O gerador não exige bibliotecas externas. Os arquivos HTML gerados fazem parte do repositório, por isso o servidor não executa nenhum build.

## Identidade

Logo oficial sem transformação, fontes locais Jost e Inter, preto e branco predominantes e azul, verde e rosa em pequenos marcadores de eixo. Os elementos gráficos das apresentações de projetos são composições tipográficas; não são apresentados como peças de campanha. Não foram criados resultados, clientes, depoimentos ou imagens de execução.

## Rodar e verificar

```sh
python3 -m http.server 4321
```

Abrir `http://localhost:4321`. Os caminhos começam na raiz, como no domínio de produção. Verificações estáticas: `node --check assets/js/main.js` e validação das referências locais/rotas.

## Contato

O formulário continua usando o FormSubmit no endereço já configurado pela INDICA. Campos obrigatórios e validação de e-mail permanecem nativos do navegador. A confirmação de retorno é exibida quando o endereço contém `?enviado=1`. O formulário não é enviado durante QA.
