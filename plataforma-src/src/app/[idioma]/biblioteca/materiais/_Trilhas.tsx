import type { CSSProperties } from 'react';

import type { Idioma } from '@/i18n/idiomas';
import { textos } from '@/i18n/strings';
import type { Article, Trilha } from '@/lib/types';

import { marcaDaTrilha } from './_Estante';

/**
 * As duas trilhas dos materiais, com o que cada uma reune e quanto ja reune.
 * Sao tambem as ancoras usadas pelo pe de cada material. A cor da regua e a
 * mesma do chip de trilha no cartao.
 */
export function Trilhas({ idioma, materiais }: { idioma: Idioma; materiais: Article[] }) {
  const t = textos(idioma);
  const r = t.aprendizado.materiais;

  function quantos(trilha: Trilha): string {
    const total = materiais.filter((material) => material.trilha === trilha).length;
    return `${total} ${total === 1 ? r.acervo.contagemUm : r.acervo.contagemVarios}`;
  }

  const trilhas: { chave: Trilha; titulo: string; nota: string }[] = [
    { chave: 'criadores', titulo: r.trilhaCriadores, nota: r.trilhaCriadoresNota },
    { chave: 'organizacoes', titulo: r.trilhaOrganizacoes, nota: r.trilhaOrganizacoesNota },
  ];

  return (
    <div className="grade--2">
      {trilhas.map((trilha) => (
        <article
          key={trilha.chave}
          className="cartao cartao--marcado cartao--compacto"
          id={trilha.chave}
          style={{ '--marca': marcaDaTrilha(trilha.chave) } as CSSProperties}
        >
          <div className="linha linha--fim">
            <p className="olho" style={{ margin: 0 }}>
              {r.trilha}
            </p>
            <span className="chip chip--vazado">{quantos(trilha.chave)}</span>
          </div>
          <h2 className="cartao__titulo">{trilha.titulo}</h2>
          <p className="cartao__texto">{trilha.nota}</p>
        </article>
      ))}
    </div>
  );
}
