import Link from 'next/link';

import { LogoIndica } from '@/components/LogoIndica';
import { Organizacao } from '@/components/Organizacao';
import { PROGRAM_NAME, EXECUTORAS, LOGO_INDICA } from '@/config/program';
import type { Idioma } from '@/i18n/idiomas';
import { textos } from '@/i18n/strings';
import { rota } from '@/lib/rotas';
import { participar } from '@/lib/participar';

const AGENCIA = 'https://agenciaindica.com/';

export function SiteFooter({ idioma }: { idioma: Idioma }) {
  const t = textos(idioma);
  const agencia = idioma === 'en' ? `${AGENCIA}en/` : AGENCIA;

  /* A cor do site mora nas colunas; o pe fecha com o fio preto, sem faixa. */
  return (
      <footer className="rodape">
        <div className="container">
          <div className="rodape__grade">
            <div>
              <p className="rodape__marca">
                <a href={agencia} aria-label={t.comum.navegacao.inicioAgencia}>
                  <LogoIndica altura={26} rotulo={PROGRAM_NAME} />
                </a>
              </p>
              <p className="rotulo rodape__tagline">
                {t.home.marca}
              </p>
              <p className="texto-pequeno rodape__descricao">{t.comum.rodape.descricao}</p>
            </div>
            <div>
              <p className="rodape__titulo">{t.comum.rodape.navegue}</p>
              <ul className="rodape__lista">
                <li>
                  <Link href={rota(idioma)}>{t.comum.navegacao.plataforma}</Link>
                </li>
                <li>
                  <Link href={rota(idioma, 'oportunidades')}>{t.comum.navegacao.editais}</Link>
                </li>
                <li>
                  <Link href={rota(idioma, 'biblioteca')}>{t.comum.navegacao.biblioteca}</Link>
                </li>
                <li>
                  <a href={agencia}>{t.comum.rodape.voltarAgencia}</a>
                </li>
                <li><Link href={rota(idioma, 'como-funciona/')}>{participar(idioma).como}</Link></li>
                <li><Link href={rota(idioma, 'painel/')}>{participar(idioma).painel}</Link></li>
              </ul>
            </div>
            <div>
              <p className="rodape__titulo">{t.comum.rodape.programa}</p>
              {/* A plataforma é uma iniciativa da INDICA. */}
              <ul className="rodape__lista" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--esp-12)' }}>
                <li>
                  <Organizacao nome={EXECUTORAS.indica} logo={LOGO_INDICA} altura={16} />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
  );
}
