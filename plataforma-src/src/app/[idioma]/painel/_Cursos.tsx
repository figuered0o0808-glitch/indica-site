'use client';

/**
 * Cursos do painel: as inscricoes feitas neste navegador, cruzadas com o
 * catalogo que a pagina entrega do servidor. So e montado com o cadastro
 * aberto.
 */

import Link from 'next/link';

import { Botao } from '@/components/Botao';
import { EstadoVazio } from '@/components/EstadoVazio';
import { Selo } from '@/components/Selo';
import type { Idioma } from '@/i18n/idiomas';
import { textos } from '@/i18n/strings';
import { rota } from '@/lib/rotas';
import type { Course, CursoDoCriador } from '@/lib/types';

import { BarraProgresso } from './_PainelUI';

export interface CursoDoPainel extends CursoDoCriador {
  duracao: string;
  modulos: number;
  /** Inscricao feita aqui, que por enquanto so existe neste navegador. */
  inscricaoLocal: boolean;
}

/** As inscricoes deste navegador, com duracao e modulos vindos do catalogo. */
export function cursosDoPainel(cursos: Course[], cursosInscritos: string[]): CursoDoPainel[] {
  const catalogo = new Map(cursos.map((curso) => [curso.slug, curso]));
  const linhas: CursoDoPainel[] = [];

  cursosInscritos.forEach((slug) => {
    const doCatalogo = catalogo.get(slug);
    if (!doCatalogo) return;
    if (linhas.some((linha) => linha.cursoSlug === slug)) return;
    linhas.push({
      cursoSlug: slug,
      titulo: doCatalogo.titulo,
      status: 'inscrito',
      progresso: 0,
      duracao: doCatalogo.duracao,
      modulos: doCatalogo.modulos.length,
      inscricaoLocal: true,
    });
  });

  return linhas;
}

export function Cursos({ idioma, linhas }: { idioma: Idioma; linhas: CursoDoPainel[] }) {
  const s = textos(idioma).paineis;
  if (linhas.length === 0) {
    return (
      <EstadoVazio
        desenho="lista"
        titulo={s.cursosVazio}
        acao={
          <Botao href={rota(idioma, 'biblioteca')} variante="secundario" tamanho="pequeno">
            {s.verBiblioteca}
          </Botao>
        }
      />
    );
  }

  return (
    <div className={linhas.length >= 3 ? 'grade--3' : 'grade--2'}>
      {linhas.map((linha) => (
        <article key={linha.cursoSlug} className="cartao">
          <div className="linha linha--fim" style={{ alignItems: 'flex-start' }}>
            <h3 className="cartao__titulo" style={{ maxWidth: '18rem' }}>
              {linha.titulo}
            </h3>
            <Selo idioma={idioma} status={linha.status} />
          </div>

          <BarraProgresso valor={linha.progresso} rotulo={s.cursoProgresso} />

          {linha.inscricaoLocal ? <p className="nota">{s.cursoInscricaoLocal}</p> : null}

          <div className="cartao__rodape">
            <span className="texto-mini">
              {[linha.duracao, linha.modulos ? `${linha.modulos} ${s.cursoModulos}` : '']
                .filter(Boolean)
                .join(' | ')}
            </span>
            <Link href={rota(idioma, `biblioteca/cursos/${linha.cursoSlug}`)} className="link-seta">
              {textos(idioma).comum.acoes.verCurso}
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
