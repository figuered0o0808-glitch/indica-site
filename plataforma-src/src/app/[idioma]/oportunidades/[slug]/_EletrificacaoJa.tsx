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
  pt: { olho: 'Chamada pública de comunicação digital', enviar: 'Enviar proposta', organizacao: 'Organização', periodo: 'Período de inscrições', cronograma: 'Ver o cronograma', apoio: 'Apoio por projeto', site: 'Acesse o site Eletrificação Já', materiais: 'Materiais de apoio', siteTitulo: 'Site da campanha', siteDescricao: 'Dados e referências sobre mobilidade elétrica.', cartilhaTitulo: 'Cartilha Eletrificação Já', cartilhaDescricao: 'PDF · 38 páginas', abrirSite: 'Acessar site', abrirCartilha: 'Abrir cartilha' },
  en: { olho: 'Public call for digital communication', enviar: 'Submit a proposal', organizacao: 'Organized by', periodo: 'Application period', cronograma: 'View the schedule', apoio: 'Support per project', site: 'Visit the Eletrificação Já website', materiais: 'Supporting materials', siteTitulo: 'Campaign website', siteDescricao: 'Data and references on electric mobility.', cartilhaTitulo: 'Eletrificação Já guide', cartilhaDescricao: 'PDF · 38 pages · Portuguese', abrirSite: 'Visit website', abrirCartilha: 'Open guide' },
  es: { olho: 'Convocatoria pública de comunicación digital', enviar: 'Enviar propuesta', organizacao: 'Organización', periodo: 'Período de inscripción', cronograma: 'Ver el cronograma', apoio: 'Apoyo por proyecto', site: 'Visita el sitio Eletrificação Já', materiais: 'Materiales de apoyo', siteTitulo: 'Sitio de la campaña', siteDescricao: 'Datos y referencias sobre movilidad eléctrica.', cartilhaTitulo: 'Guía Eletrificação Já', cartilhaDescricao: 'PDF · 38 páginas · Portugués', abrirSite: 'Visitar sitio', abrirCartilha: 'Abrir guía' },
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
          <a className={styles.campaignLink} href={eletrificacaoJa.site} target="_blank" rel="noopener noreferrer">{t.site} <span aria-hidden="true">↗</span></a>
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
  return <aside className={styles.references} aria-labelledby="eletrificacao-materiais-titulo">
    <h3 id="eletrificacao-materiais-titulo">{t.materiais}</h3>
    <div className={styles.referenceGrid}>
      <a className={styles.referenceCard} href={eletrificacaoJa.site} target="_blank" rel="noopener noreferrer">
        <strong>{t.siteTitulo}</strong>
        <span>{t.siteDescricao}</span>
        <span className={styles.referenceAction}>{t.abrirSite} <span aria-hidden="true">↗</span></span>
      </a>
      <a className={styles.referenceCard} href={eletrificacaoJa.cartilha} target="_blank" rel="noopener noreferrer">
        <strong>{t.cartilhaTitulo}</strong>
        <span>{t.cartilhaDescricao}</span>
        <span className={styles.referenceAction}>{t.abrirCartilha} <span aria-hidden="true">↗</span></span>
      </a>
    </div>
  </aside>;
}
