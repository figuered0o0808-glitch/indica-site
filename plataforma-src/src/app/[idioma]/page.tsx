import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Botao } from '@/components/Botao';
import { Carrossel } from '@/components/Carrossel';
import { AssinaturaIndica } from '@/components/AssinaturaIndica';
import { MascoteIndica } from '@/components/MascoteIndica';
import { Marcador } from '@/components/Marcador';
import { NumerosChamada } from '@/components/NumerosChamada';
import { Organizacao } from '@/components/Organizacao';
import { Participar } from '@/components/Participar';
import { Selo } from '@/components/Selo';
import { ehIdioma, type Idioma } from '@/i18n/idiomas';
import { textos } from '@/i18n/strings';
import { conteudo } from '@/lib/data';
import { rota } from '@/lib/rotas';
import { alternativas } from '@/lib/seo';
import type { Article, Call } from '@/lib/types';
import { textoDoApoio } from '@/lib/apoio';

import { Capa } from './biblioteca/materiais/_Capa';
import { ordenar } from './biblioteca/materiais/_regras';
import { DocumentoEdital } from './oportunidades/_DocumentoEdital';

export async function generateMetadata({ params }: { params: Promise<{ idioma: string }> }): Promise<Metadata> {
  const { idioma } = await params;
  if (!ehIdioma(idioma)) return {};
  return { alternates: alternativas(idioma) };
}

/** A abertura apresenta a plataforma e seus três caminhos; abaixo, o conteúdo. */

/** Quantos materiais a coluna amarela percorre antes de mandar para a Biblioteca. */
const RECENTES = 6;

/** Quanto tempo cada item fica antes de a coluna passar sozinha: da para ler o titulo e as linhas. */
const INTERVALO = 7000;

/* -------------------------------------------------------------------------- */
/* Coluna rosa: as chamadas abertas                                            */
/* -------------------------------------------------------------------------- */

function SlideChamada({ idioma, chamada }: { idioma: Idioma; chamada: Call }) {
  const tc = textos(idioma).home.coluna;
  return (
    <div className="carrossel__conteudo">
      <h2 className="coluna__titulo">{chamada.titulo}</h2>
      <div><Selo idioma={idioma} status={chamada.status} /></div>

      <NumerosChamada idioma={idioma} edital={chamada} compacto />

      <div className="coluna__linhas">
        {/* Apoio sem faixa e uma frase: desce para a linha de baixo em vez de espremer o rotulo. */}
        <div className={chamada.faixaApoio ? 'coluna__linha' : 'coluna__linha coluna__linha--longa'}>
          <span className="rotulo">{tc.apoio}</span>
          <span>{textoDoApoio(idioma, chamada)}</span>
        </div>
        {chamada.organizacao ? (
          <div className="coluna__linha">
            <span className="rotulo">{tc.proponente}</span>
            <Organizacao nome={chamada.organizacao} logo={chamada.logoOrganizacao} />
          </div>
        ) : null}
      </div>

      <div className="coluna__pe">
        <Botao href={rota(idioma, `oportunidades/${chamada.slug}`)} largo>
          {tc.verChamada}
        </Botao>
      </div>
    </div>
  );
}

function ColunaChamada({ idioma, chamadas }: { idioma: Idioma; chamadas: Call[] }) {
  const t = textos(idioma);
  const tc = t.home.coluna;
  const cabeca = (
    <>
      <Marcador arranjo={1} />
      <span className="rotulo">{t.home.chamadasTitulo}</span>
    </>
  );

  if (chamadas.length === 0) {
    return (
      <div className="coluna coluna--rosa">
        <div className="coluna__cabeca">{cabeca}</div>
        <p className="texto-guia" style={{ margin: 0 }}>
          {tc.semChamada}
        </p>
        <div className="coluna__pe">
          <Botao href={rota(idioma, 'oportunidades')} largo>
            {tc.verOportunidades}
          </Botao>
        </div>
      </div>
    );
  }

  if (chamadas.length === 1) {
    return <div className="coluna coluna--rosa"><div className="coluna__cabeca">{cabeca}</div><SlideChamada idioma={idioma} chamada={chamadas[0]} /></div>;
  }

  return (
    <div className="coluna coluna--rosa">
      <Carrossel
        cabeca={cabeca}
        rotulo={t.home.chamadasTitulo}
        anterior={tc.anterior}
        proximo={tc.proximo}
        posicao={tc.posicao}
        papel={tc.carrossel}
        automatico={INTERVALO}
        pausar={tc.pausar}
        continuar={tc.continuar}
        itens={chamadas.map((chamada) => (
          <SlideChamada key={chamada.slug} idioma={idioma} chamada={chamada} />
        ))}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Coluna menta: o cadastro                                                    */
/* -------------------------------------------------------------------------- */

function ColunaCadastro({ idioma }: { idioma: Idioma }) {
  const tc = textos(idioma).home.coluna;
  const destino = rota(idioma, 'cadastro');

  return (
    <div className="coluna coluna--menta">
      <div className="coluna__cabeca">
        <Marcador arranjo={2} />
        <span className="rotulo">{tc.cadastroOlho}</span>
      </div>

      <h2 className="coluna__titulo">{tc.cadastroTitulo}</h2>
      <p style={{ margin: 0, fontSize: 'var(--texto-m)', lineHeight: 1.45 }}>{tc.cadastroTexto}</p>

      {/*
       * Uma pilula por campo do cadastro. Nao sao o formulario: sao atalhos
       * para ele, e por isso sao links. Duplicar o formulario aqui seria
       * manter dois.
       */}
      <div className="pilha--p" style={{ gap: 'var(--esp-12)' }}>
        {tc.cadastroCampos.map((campo) => (
          <Link key={campo} href={destino} className="campo-atalho">
            {campo}
          </Link>
        ))}
      </div>

      <div className="coluna__pe">
        <Botao href={destino} largo>
          {tc.cadastroAcao}
        </Botao>
      </div>
    </div>
  );
}

function ColunaDocumento({ idioma, edital }: { idioma: Idioma; edital: Call }) {
  const t = textos(idioma);
  return <div className="coluna coluna--menta">
    <div className="coluna__cabeca"><Marcador arranjo={2} /><span className="rotulo">{t.home.documento.olho}</span></div>
    <h2 className="coluna__titulo">{t.home.documento.titulo}</h2>
    <p className="texto-pequeno">{t.home.documento.texto}</p>
    {edital.status === 'consulta' ? <p className="texto-pequeno texto-secundario">{t.editais.consultaAviso}</p> : null}
    <div className="coluna__pe"><DocumentoEdital idioma={idioma} edital={edital} /></div>
  </div>;
}

/* -------------------------------------------------------------------------- */
/* Coluna amarela: a biblioteca                                                */
/* -------------------------------------------------------------------------- */

function SlideMaterial({ idioma, material }: { idioma: Idioma; material: Article }) {
  const destino = rota(idioma, `biblioteca/materiais/${material.slug}`);
  return (
    <div className="carrossel__conteudo">
      {/* A capa encolhe antes do texto: numa coluna estreita e o titulo que precisa de largura. */}
      <div style={{ display: 'grid', gridTemplateColumns: 'clamp(72px, 34%, 112px) minmax(0, 1fr)', gap: 'var(--esp-16)', alignItems: 'start' }}>
        <Link
          href={destino}
          style={{ display: 'block', aspectRatio: '1414 / 2000', overflow: 'hidden', background: 'var(--areia)' }}
          aria-hidden="true"
          tabIndex={-1}
        >
          <Capa material={material} cor="var(--amarelo)" variante="cartao" />
        </Link>
        <div>
          {/* Ao lado da capa sobra pouca largura: palavra longa quebra em vez de vazar. */}
          <h2 className="coluna__titulo" style={{ marginBottom: 'var(--esp-8)', overflowWrap: 'anywhere', hyphens: 'auto' }}>
            <Link href={destino}>{material.titulo}</Link>
          </h2>
          <p className="texto-pequeno" style={{ margin: 0 }}>
            {material.autoria.join(', ')}
          </p>
        </div>
      </div>
      <p style={{ margin: 0, fontSize: 'var(--texto-m)', lineHeight: 1.45 }}>{material.resumo}</p>
    </div>
  );
}

function ColunaBiblioteca({ idioma, materiais }: { idioma: Idioma; materiais: Article[] }) {
  const t = textos(idioma);
  const tc = t.home.coluna;
  const cabeca = (
    <>
      <Marcador arranjo={3} />
      <span className="rotulo">{t.home.recursosTitulo}</span>
    </>
  );

  return (
    <div className="coluna coluna--amarelo">
      {materiais.length > 0 ? (
        <Carrossel
          cabeca={cabeca}
          rotulo={t.home.recursosTitulo}
          anterior={tc.anterior}
          proximo={tc.proximo}
          posicao={tc.posicao}
          papel={tc.carrossel}
          automatico={INTERVALO}
          pausar={tc.pausar}
          continuar={tc.continuar}
          itens={materiais.map((material) => (
            <SlideMaterial key={material.slug} idioma={idioma} material={material} />
          ))}
        />
      ) : (
        <>
          <div className="coluna__cabeca">{cabeca}</div>
          <p className="texto-guia" style={{ margin: 0 }}>
            {tc.semMaterial}
          </p>
        </>
      )}

      <div className="coluna__pe">
        <Link href={rota(idioma, 'biblioteca')} className="link-sublinhado">
          {t.home.recursosAcao}
        </Link>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Pagina                                                                      */
/* -------------------------------------------------------------------------- */

export default async function Home({ params }: { params: Promise<{ idioma: string }> }) {
  const { idioma } = await params;
  if (!ehIdioma(idioma)) notFound();

  const t = textos(idioma);
  const { editais, materiais } = conteudo(idioma);

  /* A coluna rosa passa pelas chamadas abertas; a amarela, pelos materiais, do mais novo ao mais antigo. */
  const chamadas = editais.filter((item) => !item.simulacao && (item.status === 'aberta' || item.status === 'consulta'));
  const aceitaCadastro = true;
  const documento = editais.find((item) => !item.simulacao && item.arquivoEdital);
  const recentes = ordenar(materiais, 'atualizacao').slice(0, RECENTES);

  return (
    <>
      <section className="hero hero--criadores" data-hero>
        <div className="container hero-criadores">
          <div className="hero-criadores__texto">
            <div className="hero-criadores__assinatura">
              <AssinaturaIndica tamanho={9} />
              <p className="olho">{t.home.marca}</p>
            </div>
            <h1 className="hero__frase">{t.home.frase}</h1>
            <p className="hero-criadores__introducao">{t.home.introducao}</p>
          </div>
          <MascoteIndica idioma={idioma} />
        </div>
      </section>

      <section className="colunas">
        <ColunaChamada idioma={idioma} chamadas={chamadas} />
        {aceitaCadastro ? <ColunaCadastro idioma={idioma} /> : documento ? <ColunaDocumento idioma={idioma} edital={documento} /> : null}
        <ColunaBiblioteca idioma={idioma} materiais={recentes} />
      </section>
      <Participar idioma={idioma}/>
    </>
  );
}
