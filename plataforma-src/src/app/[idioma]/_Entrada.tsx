'use client';

/**
 * Entrada da home, nos dois estados da pagina.
 *
 * Com chamada, curso ou material publicado, o caminho principal e o cadastro
 * (ou a area de trabalho, para quem ja tem). Enquanto nada foi publicado nao ha
 * a que se candidatar, entao os botoes levam direto as duas areas do site.
 */

import { Botao } from '@/components/Botao';
import type { Idioma } from '@/i18n/idiomas';
import { textos } from '@/i18n/strings';
import { rota } from '@/lib/rotas';
import { useApp } from '@/state/AppState';

export function Entrada({ idioma, temConteudo }: { idioma: Idioma; temConteudo: boolean }) {
  const { cadastrado, hidratado } = useApp();
  const t = textos(idioma);
  const entrou = hidratado && cadastrado;

  if (!temConteudo) {
    return (
      <div className="pilha" style={{ gap: 14, marginTop: 30, alignItems: 'flex-start' }}>
        <div className="linha" style={{ gap: 18 }}>
          <Botao href={rota(idioma, 'oportunidades')}>{t.home.inicioAcao}</Botao>
          <Botao href={rota(idioma, 'biblioteca')} variante="discreto">
            {t.home.inicioAcaoAreas}
          </Botao>
        </div>
        <p className="texto-mini" style={{ margin: 0 }}>
          {t.home.inicioNota}
        </p>
      </div>
    );
  }

  /*
   * Os dois botoes, em pilula. A nota sobre o cadastro ser gratuito saiu daqui
   * e mora na coluna de cadastro, logo abaixo, onde e o assunto.
   */
  return (
    <div className="linha" style={{ gap: 12 }}>
      <Botao href={rota(idioma, entrou ? 'painel' : 'cadastro')}>
        {entrou ? t.home.entrarPainel : t.home.entrarPrincipal}
      </Botao>
      <Botao href={rota(idioma, 'oportunidades')} variante="secundario">
        {t.home.entrarSecundario}
      </Botao>
    </div>
  );
}
