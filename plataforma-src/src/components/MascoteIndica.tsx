'use client';

import Link from 'next/link';
import { useState } from 'react';

import { MarcaVivaIndica } from '@/components/MarcaVivaIndica';
import type { Idioma } from '@/i18n/idiomas';
import { textos } from '@/i18n/strings';
import { rota } from '@/lib/rotas';

type Caminho = 'oportunidades' | 'biblioteca';

/** Dois caminhos distintos, cada um com a marca viva que acompanha sua seção. */
export function MascoteIndica({ idioma }: { idioma: Idioma }) {
  const [ponteiro, setPonteiro] = useState<Caminho | null>(null);
  const [foco, setFoco] = useState<Caminho | null>(null);
  const ativo = ponteiro ?? foco;
  const t = textos(idioma).home.caminhos;
  const caminhos = [
    { id: 'oportunidades', titulo: t.oportunidades, descricao: t.oportunidadesTexto, expressao: '03', cor: 'azul' },
    { id: 'biblioteca', titulo: t.biblioteca, descricao: t.bibliotecaTexto, expressao: '02', cor: 'rosa' },
  ] as const;

  return (
    <nav className="indica-caminhos" aria-label={t.rotulo} data-ativo={ativo ?? 'neutro'}
      onPointerLeave={() => setPonteiro(null)}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setFoco(null); }}>
      <div className="indica-caminhos__links">
        {caminhos.map((caminho, indice) => (
          <Link key={caminho.id} href={rota(idioma, caminho.id)}
            className="indica-caminhos__link" data-caminho={caminho.id}
            onPointerEnter={(e) => { if (e.pointerType !== 'touch') { setPonteiro(caminho.id); setFoco(null); } }}
            onFocus={() => { setFoco(caminho.id); setPonteiro(null); }}>
            <span className="indica-caminhos__carinha">
              <MarcaVivaIndica expressao={caminho.expressao} cor={caminho.cor}
                interagindo={ativo === caminho.id} atraso={indice * 1100} />
            </span>
            <span className="indica-caminhos__conteudo">
              <span className="indica-caminhos__titulo">{caminho.titulo}</span>
              <span className="indica-caminhos__descricao">{caminho.descricao}</span>
            </span>
            <span className="indica-caminhos__seta" aria-hidden="true">→</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
