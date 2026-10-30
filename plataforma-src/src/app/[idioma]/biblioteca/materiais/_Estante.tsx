import Link from 'next/link';

import type { CorChip } from '@/components/Chip';
import type { Idioma } from '@/i18n/idiomas';
import { textos } from '@/i18n/strings';
import { arquivoPublico, dataCurta } from '@/lib/format';
import { rota } from '@/lib/rotas';
import type { Article, Trilha } from '@/lib/types';

import { Capa } from './_Capa';

/** Nome da trilha em texto de interface. */
export function rotuloTrilha(idioma: Idioma, trilha: Trilha): string {
  const t = textos(idioma);
  return trilha === 'criadores'
    ? t.aprendizado.materiais.trilhaCriadores
    : t.aprendizado.materiais.trilhaOrganizacoes;
}

/** Cor fixa por trilha, para que o leitor reconheca a trilha de relance. */
export function corDaTrilha(trilha: Trilha): CorChip {
  return trilha === 'criadores' ? 'menta' : 'azul';
}

/** A mesma cor da trilha, para a regua fina no alto de um cartao. */
export function marcaDaTrilha(trilha: Trilha): string {
  return `var(--${corDaTrilha(trilha)})`;
}

/**
 * Um material na estante: a capa em pe e, embaixo, quem publica, o titulo e a
 * ficha curta. E a capa virada para a frente, como na mesa de uma livraria: o
 * que se ve de longe e a capa, e o que decide a leitura e o titulo.
 *
 * A trilha entra como o ponto da marca, na cor da trilha, com o nome ao lado:
 * a cor sozinha nao diz nada a quem nao a distingue.
 *
 * O nome do link e so o titulo; organizacao, formato, data e trilha entram
 * como descricao. Sem isso o leitor de tela ouviria os quatro emendados,
 * comecando pela organizacao.
 *
 * Sem hooks: serve a lista, o indice da Biblioteca e a faixa de vizinhos ao pe
 * de cada texto.
 */
export function Livro({ idioma, material }: { idioma: Idioma; material: Article }) {
  const id = `livro-${material.slug}`;

  return (
    <Link
      href={rota(idioma, `biblioteca/materiais/${material.slug}`)}
      className="livro"
      title={material.titulo}
      aria-labelledby={`${id}-titulo`}
      aria-describedby={`${id}-org ${id}-meta ${id}-trilha`}
    >
      <span className="livro__capa">
        <Capa material={material} cor={marcaDaTrilha(material.trilha)} variante="cartao" />
      </span>

      <span className="livro__org" id={`${id}-org`}>
        {material.logoOrganizacao ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={arquivoPublico(material.logoOrganizacao)}
            alt={material.organizacao}
            className="livro__logo"
          />
        ) : (
          material.organizacao
        )}
      </span>

      <span className="livro__titulo" id={`${id}-titulo`}>
        {material.titulo}
      </span>

      <span className="livro__meta" id={`${id}-meta`}>
        {material.formato} · {dataCurta(material.atualizadoEm, idioma)}
      </span>
      <span className="livro__trilha" id={`${id}-trilha`}>
        <span
          className="livro__ponto"
          style={{ background: marcaDaTrilha(material.trilha) }}
          aria-hidden="true"
        />
        {rotuloTrilha(idioma, material.trilha)}
      </span>
    </Link>
  );
}

/**
 * A estante: uma grade de capas que se enche na largura que houver. Quantas
 * cabem por fileira depende da tela, nunca de um numero fixo: e o que faz a
 * pagina inteira ser usada.
 */
export function Estante({ idioma, materiais }: { idioma: Idioma; materiais: Article[] }) {
  return (
    <div className="estante">
      {materiais.map((material) => (
        <Livro key={material.slug} idioma={idioma} material={material} />
      ))}
    </div>
  );
}
