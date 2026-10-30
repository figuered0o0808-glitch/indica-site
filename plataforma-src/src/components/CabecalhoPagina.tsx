import type { ReactNode } from 'react';

/** Cabecalho padrao de pagina: olho, titulo, descricao e acoes. */
export function CabecalhoPagina({
  olho,
  titulo,
  descricao,
  acoes,
  estreito,
  ilustracao,
}: {
  olho?: string;
  titulo: string;
  descricao?: string;
  acoes?: ReactNode;
  estreito?: boolean;
  ilustracao?: ReactNode;
}) {
  const conteudo = <>
    {olho ? <p className="olho">{olho}</p> : null}
    <div className="linha linha--fim cabecalho-pagina__topo">
      <div className="cabecalho-pagina__texto">
        <h1>{titulo}</h1>
        {descricao ? <p className="texto-guia">{descricao}</p> : null}
      </div>
      {acoes ? <div className="linha">{acoes}</div> : null}
    </div>
  </>;

  return (
    <header className="secao secao--curta cabecalho-pagina">
      <div className={estreito ? 'container-estreito' : 'container'}>
        {ilustracao ? <div className="cabecalho-pagina__abertura">
          <span className="cabecalho-pagina__marca">{ilustracao}</span>
          <div className="cabecalho-pagina__conteudo">{conteudo}</div>
        </div> : conteudo}
      </div>
    </header>
  );
}
