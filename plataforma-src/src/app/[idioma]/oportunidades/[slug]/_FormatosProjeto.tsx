import type { Idioma } from '@/i18n/idiomas';

import styles from './_FormatosProjeto.module.css';

type Formato = { titulo: string; descricao: string; icone: 'curto' | 'video' | 'audio' | 'texto' | 'presencial' | 'rede' };

const textosFormatos: Record<Idioma, { titulo: string; introducao: string; nota: string; formatos: Formato[] }> = {
  pt: {
    titulo: 'Formatos de projeto',
    introducao: 'Vídeo, áudio, texto e ações presenciais integradas à distribuição digital. Os formatos podem ser combinados na mesma proposta.',
    nota: 'São exemplos previstos no item 3 do Anexo I do edital. Ações presenciais são opcionais e precisam gerar conteúdo e engajamento nas plataformas digitais. Todas as propostas devem atender ao briefing orientador e às regras da chamada.',
    formatos: [
      { titulo: 'Vídeos curtos', descricao: 'Reels, TikToks e outros vídeos curtos de comunicação científica e educativa sobre veículos elétricos.', icone: 'curto' },
      { titulo: 'Produções para YouTube', descricao: 'Vídeos longos para aprofundar os temas de custos, políticas públicas, sustentabilidade e eletrificação.', icone: 'video' },
      { titulo: 'Podcasts e áudio', descricao: 'Podcasts e outros conteúdos em áudio, conforme a solução de comunicação proposta.', icone: 'audio' },
      { titulo: 'Carrosséis, textos e threads', descricao: 'Carrosséis educativos, artigos e threads para explicar dados, conceitos e informações do briefing.', icone: 'texto' },
      { titulo: 'Presencial + digital', descricao: 'Intervenções de rua, ativações e outras ações presenciais que gerem conteúdo e engajamento nos canais digitais.', icone: 'presencial' },
      { titulo: 'Projetos multiplataforma', descricao: 'Combinações de vídeo, áudio, texto e ações presenciais, com estratégia integrada de distribuição digital.', icone: 'rede' },
    ],
  },
  en: {
    titulo: 'Project formats',
    introducao: 'Video, audio, text and in-person activities connected to digital distribution. A proposal may combine several formats.',
    nota: 'These examples appear in item 3 of Annex I of the call document. In-person activities are optional and must generate content and engagement on digital platforms. All proposals must follow the guiding brief and the rules of the call.',
    formatos: [
      { titulo: 'Short videos', descricao: 'Reels, TikToks and other short videos for science communication and education about electric vehicles.', icone: 'curto' },
      { titulo: 'YouTube productions', descricao: 'Long-form videos exploring costs, public policy, sustainability and electrification.', icone: 'video' },
      { titulo: 'Podcasts and audio', descricao: 'Podcasts and other audio content, according to the proposed communication project.', icone: 'audio' },
      { titulo: 'Carousels, articles and threads', descricao: 'Educational carousels, articles and threads explaining the data, concepts and information in the brief.', icone: 'texto' },
      { titulo: 'In person + digital', descricao: 'Street interventions, public activities and other in-person actions that generate content and engagement on digital channels.', icone: 'presencial' },
      { titulo: 'Multiplatform projects', descricao: 'Combinations of video, audio, text and in-person activities with an integrated digital distribution strategy.', icone: 'rede' },
    ],
  },
  es: {
    titulo: 'Formatos de proyecto',
    introducao: 'Video, audio, texto y actividades presenciales integradas a la distribución digital. Una propuesta puede combinar varios formatos.',
    nota: 'Estos ejemplos figuran en el punto 3 del Anexo I del documento de la convocatoria. Las actividades presenciales son opcionales y deben generar contenido e interacción en las plataformas digitales. Todas las propuestas deben cumplir el briefing orientador y las reglas de la convocatoria.',
    formatos: [
      { titulo: 'Videos cortos', descricao: 'Reels, TikToks y otros videos cortos de comunicación científica y educativa sobre vehículos eléctricos.', icone: 'curto' },
      { titulo: 'Producciones para YouTube', descricao: 'Videos largos para profundizar en costos, políticas públicas, sostenibilidad y electrificación.', icone: 'video' },
      { titulo: 'Pódcast y audio', descricao: 'Pódcast y otros contenidos de audio, según la solución de comunicación propuesta.', icone: 'audio' },
      { titulo: 'Carruseles, textos e hilos', descricao: 'Carruseles educativos, artículos e hilos para explicar datos, conceptos e información del briefing.', icone: 'texto' },
      { titulo: 'Presencial + digital', descricao: 'Intervenciones callejeras, actividades con el público y otras acciones presenciales que generen contenido e interacción en los canales digitales.', icone: 'presencial' },
      { titulo: 'Proyectos multiplataforma', descricao: 'Combinaciones de video, audio, texto y actividades presenciales con una estrategia integrada de distribución digital.', icone: 'rede' },
    ],
  },
};

function IconeFormato({ tipo }: { tipo: Formato['icone'] }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {tipo === 'curto' ? <><rect x="13" y="4" width="22" height="40" rx="4" /><path d="m21 17 9 7-9 7Z" /><path d="M21 38h6" /></> : null}
      {tipo === 'video' ? <><rect x="4" y="10" width="40" height="28" rx="5" /><path d="m20 17 11 7-11 7Z" /></> : null}
      {tipo === 'audio' ? <><rect x="18" y="4" width="12" height="25" rx="6" /><path d="M11 22a13 13 0 0 0 26 0M24 35v9M17 44h14" /></> : null}
      {tipo === 'texto' ? <><rect x="5" y="8" width="29" height="33" rx="3" /><path d="M13 17h13M13 24h13M13 31h8M14 3h27a3 3 0 0 1 3 3v29" /></> : null}
      {tipo === 'presencial' ? <><circle cx="16" cy="13" r="6" /><path d="M5 34v-4a11 11 0 0 1 22 0v4M31 7a8 8 0 0 1 0 16M34 29a11 11 0 0 1 9 11M9 42h22" /></> : null}
      {tipo === 'rede' ? <><rect x="18" y="18" width="12" height="12" rx="2" /><circle cx="7" cy="7" r="4" /><circle cx="41" cy="7" r="4" /><circle cx="7" cy="41" r="4" /><circle cx="41" cy="41" r="4" /><path d="m10 10 8 8m12 12 8 8m-8-20 8-8M10 38l8-8" /></> : null}
    </svg>
  );
}

/** Exemplos do Anexo I: apresenta os formatos sem substituir as regras do edital. */
export function FormatosProjeto({ idioma }: { idioma: Idioma }) {
  const texto = textosFormatos[idioma];
  return (
    <section id="formatos-projeto" className={styles.secao} aria-labelledby="formatos-projeto-titulo">
      <div className={styles.cabecalho}>
        <h2 id="formatos-projeto-titulo">{texto.titulo}</h2>
        <p>{texto.introducao}</p>
      </div>
      <div className={styles.grade}>
        {texto.formatos.map((formato, indice) => (
          <article key={formato.icone} className={`${styles.cartao} ${indice === 5 ? styles.combinado : ''}`}>
            <div className={styles.cabeca}><span className={styles.icone}><IconeFormato tipo={formato.icone} /></span><span className={styles.numero}>{String(indice + 1).padStart(2, '0')}</span></div>
            <h3>{formato.titulo}</h3>
            <p>{formato.descricao}</p>
          </article>
        ))}
      </div>
      <p className={styles.nota}>{texto.nota}</p>
    </section>
  );
}
