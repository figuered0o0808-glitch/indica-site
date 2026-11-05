import { Botao } from '@/components/Botao';
import { NumerosChamada } from '@/components/NumerosChamada';
import { Selo } from '@/components/Selo';
import type { Idioma } from '@/i18n/idiomas';
import { arquivoPublico, data } from '@/lib/format';
import { rota } from '@/lib/rotas';
import { textoDoApoio } from '@/lib/apoio';
import { eletrificacaoJa } from '@/lib/eletrificacao';
import type { Call } from '@/lib/types';
import { DocumentoEdital } from '../_DocumentoEdital';
import { prazoDaChamada } from '../_prazo';
import styles from './_EletrificacaoJa.module.css';

const copy = {
  pt: { olho: 'Chamada pública de comunicação digital', enviar: 'Enviar proposta', organizacao: 'Organização', periodo: 'Período de inscrições', cronograma: 'Ver o cronograma', apoio: 'Apoio por projeto', orientacoes: 'Orientações da campanha', orientacoesDescricao: 'Os materiais de referência e os canais de divulgação serão informados pela INDICA durante o alinhamento com os selecionados.' },
  en: { olho: 'Public call for digital communication', enviar: 'Submit a proposal', organizacao: 'Organized by', periodo: 'Application period', cronograma: 'View the schedule', apoio: 'Support per project', orientacoes: 'Campaign guidance', orientacoesDescricao: 'INDICA will provide reference materials and communication channels during the alignment with selected applicants.' },
  es: { olho: 'Convocatoria pública de comunicación digital', enviar: 'Enviar propuesta', organizacao: 'Organización', periodo: 'Período de inscripción', cronograma: 'Ver el cronograma', apoio: 'Apoyo por proyecto', orientacoes: 'Orientaciones de la campaña', orientacoesDescricao: 'INDICA informará los materiales de referencia y los canales de divulgación durante la coordinación con los seleccionados.' },
} as const;

/** A identidade da campanha acompanha seu edital, dentro da plataforma INDICA. */
export function EletrificacaoAbertura({ idioma, edital }: { idioma: Idioma; edital: Call }) {
  const t = copy[idioma];
  const prazo = prazoDaChamada(idioma, edital);
  const inicio = edital.cronograma[0];
  return <header className={styles.hero}>
    <div className="container">
      <div className={styles.brandline}>
        <p>{t.olho} <span aria-hidden="true">/</span> 2026</p>
        <Selo idioma={idioma} status={edital.status} />
      </div>
      <div className={styles.grid}>
        <div className={styles.intro}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={styles.logo} src={arquivoPublico(eletrificacaoJa.marca.arquivo)} width={eletrificacaoJa.marca.largura} height={eletrificacaoJa.marca.altura} alt="Eletrificação Já" />
          <h1>{edital.titulo}</h1>
          <p className={styles.description}>{edital.resumo}</p>
          <div className={styles.actions}>
            {edital.status === 'aberta' ? <Botao href={rota(idioma, `oportunidades/${edital.slug}/candidatura`)}>{t.enviar} <span aria-hidden="true">↗</span></Botao> : null}
            <a href="#cronograma" className={styles.scheduleLink}>{t.cronograma} <span aria-hidden="true">↓</span></a>
          </div>
          <div className={styles.organizer}>
            <span>{t.organizacao}</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={arquivoPublico('/campanhas/eletrificacao-ja/indica.png')} alt="INDICA" width={160} height={48} />
          </div>
        </div>
        <aside className={styles.funding} aria-label={t.olho}>
          <NumerosChamada idioma={idioma} edital={edital} />
          <div className={styles.cap}><span>{t.apoio}</span><strong>{textoDoApoio(idioma, edital)}</strong></div>
          <div className={styles.period}>
            <span>{inicio?.dataFim ? t.periodo : prazo.rotulo}</span>
            <strong>{inicio?.dataFim ? <>{data(inicio.data, idioma)}<br /><span className={styles.until}>{idioma === 'en' ? 'to' : 'a'}</span> {data(inicio.dataFim, idioma)}</> : prazo.valor}</strong>
          </div>
          <DocumentoEdital idioma={idioma} edital={edital} />
        </aside>
      </div>
    </div>
  </header>;
}

export function EletrificacaoReferencias({ idioma }: { idioma: Idioma }) {
  const t = copy[idioma];
  return <aside className={styles.references} aria-labelledby="eletrificacao-orientacoes-titulo">
    <h3 id="eletrificacao-orientacoes-titulo">{t.orientacoes}</h3>
    <p>{t.orientacoesDescricao}</p>
  </aside>;
}
