import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Botao } from '@/components/Botao';
import { CabecalhoPagina } from '@/components/CabecalhoPagina';
import { PassosParticipacao } from '@/components/Participar';
import css from '@/components/Participar.module.css';
import { ehIdioma } from '@/i18n/idiomas';
import { participar } from '@/lib/participar';
import { alternativas } from '@/lib/seo';
import { rota } from '@/lib/rotas';

export async function generateMetadata({ params }: { params: Promise<{ idioma: string }> }): Promise<Metadata> {
  const { idioma } = await params;
  if (!ehIdioma(idioma)) return {};
  const t = participar(idioma);
  return { title: t.como, description: t.descricao, alternates: alternativas(idioma, 'como-funciona') };
}

export default async function ComoFunciona({ params }: { params: Promise<{ idioma: string }> }) {
  const { idioma } = await params;
  if (!ehIdioma(idioma)) notFound();
  const t = participar(idioma);
  return <>
    <CabecalhoPagina olho={t.olho} titulo={t.como} descricao={t.descricao}/>
    <section className="secao"><div className="container"><PassosParticipacao idioma={idioma}/><p className={css.aviso}>{t.prazo}</p>
      <div className="linha"><Botao href={rota(idioma, 'cadastro/')}>{t.criar}</Botao><Botao href={rota(idioma, 'painel/')} variante="secundario">{t.painel}</Botao></div>
    </div></section>
    <section className="secao"><div className="container"><h2>{t.perguntasTitulo}</h2><div className={css.faq}>{t.perguntas.map(([pergunta,resposta]) => <details key={pergunta}><summary>{pergunta}</summary><p>{resposta}</p></details>)}</div>
      <div className={css.contato}><h3>{t.contato}</h3><p>{t.contatoTexto}</p><Botao href={rota(idioma,'contato/')} variante="secundario">{{pt:'Enviar mensagem à equipe',en:'Message the team',es:'Enviar un mensaje al equipo'}[idioma]}</Botao></div>
      <div className="linha" style={{marginTop:24}}><Botao href={rota(idioma, 'oportunidades/')} variante="secundario">{t.oportunidades}</Botao><Botao href={rota(idioma, 'biblioteca/')} variante="secundario">{t.biblioteca}</Botao></div>
    </div></section>
  </>;
}
