import { arquivoPublico } from '@/lib/format';
import type { Article } from '@/lib/types';

import { siglaOrganizacao } from './_regras';

/**
 * Capa de uma publicacao, sem moldura em nenhum tamanho.
 *
 * Quando a organizacao envia imagem, ela sangra ate o corte. Quando nao envia,
 * entra a malha de pontos da marca sobre o tom da trilha com o logotipo de quem
 * publica, ou a sigla da organizacao. A capa gerada nao escreve o titulo: na
 * lista e na pagina do material ele ja esta ao lado, e repetir duas vezes a
 * mesma frase foi a reclamacao que fez a capa mudar.
 */
export function Capa({
  material,
  cor,
  variante,
}: {
  material: Article;
  cor: string;
  variante: 'cartao' | 'grande';
}) {
  const marca = (
    <span className="bib-capa-marca" style={{ background: cor }}>
      <span className="bib-capa-marca__malha" aria-hidden="true" />
      {material.logoOrganizacao ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={arquivoPublico(material.logoOrganizacao)}
          alt=""
          aria-hidden="true"
          className="bib-capa-marca__logo"
        />
      ) : (
        <span className="bib-capa-marca__sigla" aria-hidden="true">
          {siglaOrganizacao(material.organizacao)}
        </span>
      )}
    </span>
  );

  if (variante === 'cartao') {
    if (!material.capa) return marca;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={arquivoPublico(material.capa)} alt="" className="bib-capa" />
    );
  }

  if (!material.capa) {
    return <span className="bib-abertura__capa bib-abertura__gerada">{marca}</span>;
  }

  return (
    <span className="bib-abertura__capa">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={arquivoPublico(material.capa)} alt="" className="bib-capa" />
    </span>
  );
}
