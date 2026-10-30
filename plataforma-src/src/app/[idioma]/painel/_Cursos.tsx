'use client';

/**
 * Inscrições confirmadas pela API, cruzadas com o catálogo publicado.
 */

import Link from 'next/link';

import { Botao } from '@/components/Botao';
import { EstadoVazio } from '@/components/EstadoVazio';
import { Selo } from '@/components/Selo';
import type { Idioma } from '@/i18n/idiomas';
import { textos } from '@/i18n/strings';
import { rota } from '@/lib/rotas';
import type { Course, CursoDoCriador, ReciboPublico } from '@/lib/types';


export interface CursoDoPainel extends Omit<CursoDoCriador, 'status'> {
  status: string;
  duracao: string;
  modulos: number;
  reciboToken?: string;
}

/** As inscricoes deste navegador, com duracao e modulos vindos do catalogo. */
export function cursosDoPainel(cursos: Course[], cursosInscritos: string[], recibos: ReciboPublico[] = []): CursoDoPainel[] {
  const catalogo = new Map(cursos.map((curso) => [curso.slug, curso]));
  const linhas: CursoDoPainel[] = [];

  cursosInscritos.forEach((slug) => {
    const doCatalogo = catalogo.get(slug);
    if (!doCatalogo) return;
    const recibo = recibos.find((r) => r.tipo.includes('curso') && r.referencia === slug);
    if (!recibo) return;
    if (linhas.some((linha) => linha.cursoSlug === slug)) return;
    linhas.push({
      cursoSlug: slug,
      titulo: doCatalogo.titulo,
      status: recibo.estado,
      progresso: 0,
      duracao: doCatalogo.duracao,
      modulos: doCatalogo.modulos.length,
      reciboToken: recibo.reciboToken,
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

          <div className="cartao__rodape">
            <span className="texto-mini">
              {[linha.duracao, linha.modulos ? `${linha.modulos} ${s.cursoModulos}` : '']
                .filter(Boolean)
                .join(' | ')}
            </span>
            <Link href={rota(idioma, `biblioteca/cursos/#curso-${linha.cursoSlug}`)} className="link-seta">
              {textos(idioma).comum.acoes.verCurso}
            </Link>
          </div>
          {linha.reciboToken ? <Botao href={rota(idioma, `painel/?recibo=${encodeURIComponent(linha.reciboToken)}`)} variante="secundario" tamanho="pequeno">{textos(idioma).comum.envio.linkComprovante}</Botao> : null}
        </article>
      ))}
    </div>
  );
}
