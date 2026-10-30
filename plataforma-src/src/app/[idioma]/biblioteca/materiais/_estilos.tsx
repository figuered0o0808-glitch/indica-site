/**
 * Estilo do acervo.
 *
 * Fica aqui, junto das paginas da Biblioteca, e nao na folha geral: sao classes
 * que so a Biblioteca usa. Todas com prefixo bib- e escritas com as variaveis
 * do sistema, para herdar paleta, tipografia e o canto reto de 2px.
 */
const CSS = `
/* Barra de busca e filtros: um cartao denso em cima; a estante embaixo usa a largura toda. */
.bib-controles {
  background: var(--branco);
  border: 1px solid var(--preto);
  border-radius: 2px;
  padding: 14px 18px 6px;
}
.bib-busca { padding-bottom: 12px; }
.bib-busca input[type='search'] {
  padding: 10px 14px;
  font-size: 1rem;
}
.bib-linha {
  display: grid;
  grid-template-columns: 108px minmax(0, 1fr);
  gap: 16px;
  align-items: center;
  padding: 8px 0;
  border-top: 1px solid var(--linha);
}
.bib-linha__rotulo {
  font-family: var(--mono);
  font-size: var(--texto-xp);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--tinta-suave);
  margin: 0;
}
.bib-opcoes { display: flex; flex-wrap: wrap; gap: 6px; }

.bib-pilula {
  font-family: var(--mono);
  font-size: var(--texto-xp);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  line-height: 1;
  padding: 7px 11px;
  border: 1px solid var(--linha);
  border-radius: var(--raio-pilula);
  background: var(--branco);
  color: var(--tinta-media);
  cursor: pointer;
}
/* A pilula marcada ja e preta: o hover so vale para as outras, senao o texto some. */
.bib-pilula:hover:not(:disabled):not([aria-pressed='true']) { border-color: var(--preto); color: var(--preto); }
.bib-pilula[aria-pressed='true'] {
  background: var(--preto);
  border-color: var(--preto);
  color: var(--branco);
}
.bib-pilula:disabled { opacity: 0.3; cursor: not-allowed; }
.bib-pilula__n { color: var(--tinta-suave); margin-left: 6px; }
.bib-pilula[aria-pressed='true'] .bib-pilula__n { color: rgba(255, 255, 255, 0.7); }

/*
 * A estante: capas em pe, tantas por fileira quantas couberem. O minimo de
 * 156px e o menor tamanho em que o titulo impresso numa capa ainda se le;
 * abaixo disso a capa vira mancha e o titulo de baixo faz o trabalho sozinho.
 */
.estante {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(156px, 1fr));
  gap: 28px 20px;
}
.livro {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
  color: var(--preto);
  text-decoration: none;
}
.livro:hover { text-decoration: none; }
.livro:hover .livro__titulo { text-decoration: underline; text-underline-offset: 3px; }
.livro:focus-visible { outline: 2px solid var(--foco-cor); outline-offset: 4px; border-radius: 2px; }
.livro__capa {
  display: block;
  aspect-ratio: 1414 / 2000;
  overflow: hidden;
  border-radius: 2px;
  background: var(--areia);
  margin-bottom: 4px;
}
.livro__capa .bib-capa { height: 100%; }
.livro__capa .bib-capa-marca { height: 100%; }
.livro__org {
  font-family: var(--mono);
  font-size: var(--texto-xp);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--tinta-suave);
  line-height: 1.3;
  min-height: 20px;
  display: flex;
  align-items: center;
}
/* Logotipo de duas linhas precisa dos 20px para a linha menor ainda se ler. */
.livro__logo { height: 20px; max-width: 100%; width: auto; display: block; }
.livro__titulo {
  font-family: var(--serif);
  font-size: var(--texto-xg);
  line-height: 1.25;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.livro__meta,
.livro__trilha {
  font-family: var(--mono);
  font-size: var(--texto-xp);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--tinta-suave);
  line-height: 1.4;
}
.livro__trilha { display: flex; align-items: center; gap: 6px; }
.livro__ponto {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 1px solid var(--preto);
  flex: none;
}

/* Dentro de uma coluna de cor a estante aperta um pouco: seis capas cabem na fileira. */
.coluna .estante {
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 24px 16px;
}

/* Prateleira: o nome do grupo e quantos tem, sobre um fio, e a estante embaixo. */
.bib-prateleira { display: grid; gap: 18px; }
.bib-prateleira__cabeca {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--preto);
}
.bib-prateleira__titulo {
  margin: 0;
  font-family: var(--serif);
  font-weight: 400;
  font-size: var(--titulo-m);
  line-height: 1.2;
}
.bib-prateleira__n {
  font-family: var(--mono);
  font-size: var(--texto-xp);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--tinta-suave);
  white-space: nowrap;
}

/* Contagem do acervo: numeros em monoespacada, sempre visiveis. */
.bib-contagem {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  font-family: var(--mono);
  font-size: var(--texto-xp);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--tinta-suave);
}
.bib-contagem strong { color: var(--preto); font-weight: 500; }

/* Abertura da pagina de um material: capa em tamanho digno ao lado da ficha. */
.bib-abertura {
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
  gap: 26px;
  align-items: start;
}
.bib-abertura__capa { display: block; overflow: hidden; border-radius: 2px; }
.bib-abertura__capa .bib-capa { height: auto; }
.bib-abertura__gerada { aspect-ratio: 3 / 4; background: var(--areia); }

.bib-ficha { display: grid; gap: 0; margin: 0; }
.bib-ficha__linha {
  display: grid;
  grid-template-columns: 104px minmax(0, 1fr);
  gap: 14px;
  padding: 9px 0;
  border-top: 1px solid var(--linha);
}
.bib-ficha__linha:first-child { border-top: 0; padding-top: 0; }
.bib-ficha dt {
  font-family: var(--mono);
  font-size: var(--texto-xp);
  letter-spacing: 0.11em;
  text-transform: uppercase;
  color: var(--tinta-suave);
  padding-top: 0.3em;
}
.bib-ficha dd { margin: 0; font-size: 1rem; line-height: 1.4; }

/* Sumario: numero e titulo da secao, uma linha por secao. */
.bib-sumario { display: grid; gap: 0; }
.bib-sumario__item {
  display: grid;
  grid-template-columns: 30px minmax(0, 1fr);
  gap: 10px;
  padding: 8px 2px;
  border-top: 1px solid var(--linha);
  font-size: 1rem;
  color: var(--preto);
  text-decoration: none;
}
.bib-sumario__item:first-child { border-top: 0; }
.bib-sumario__item:hover { background: var(--areia); text-decoration: none; }
.bib-sumario__item:hover .bib-sumario__titulo {
  text-decoration: underline;
  text-underline-offset: 3px;
}
.bib-sumario__n {
  font-family: var(--mono);
  font-size: var(--texto-xp);
  letter-spacing: 0.1em;
  color: var(--tinta-suave);
  padding-top: 0.3em;
}

/*
 * Texto completo: um botao por idioma publicado, lado a lado enquanto couberem.
 * O rotulo do botao nomeia o idioma do arquivo, e a linha abaixo diz o formato
 * e o peso. E a decisao que a pagina pede: qual dos PDFs baixar.
 */
.bib-baixar {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px 16px;
}
.bib-baixar__item { display: grid; gap: 6px; align-content: start; }
.bib-baixar__ficha {
  margin: 0;
  font-family: var(--mono);
  font-size: var(--texto-xp);
  letter-spacing: 0.11em;
  text-transform: uppercase;
  text-align: center;
  color: var(--tinta-suave);
}

@media (max-width: 880px) {
  .bib-abertura { grid-template-columns: 184px minmax(0, 1fr); gap: 20px; }
}

@media (max-width: 640px) {
  .bib-abertura { grid-template-columns: minmax(0, 1fr); }
  .bib-abertura__capa { max-width: 200px; }
  .bib-linha { grid-template-columns: minmax(0, 1fr); gap: 8px; }
  /* No celular cabem duas capas por fileira, e e o que se quer: ainda e uma estante. */
  .estante,
  .coluna .estante { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 22px 14px; }
}
`;

/** Injeta o estilo do acervo na pagina. Sem dependencia externa. */
export function EstilosAcervo() {
  return <style dangerouslySetInnerHTML={{ __html: CSS }} />;
}
