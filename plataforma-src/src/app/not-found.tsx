'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Botao } from '@/components/Botao';
import { EstadoVazio } from '@/components/EstadoVazio';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { IDIOMA_PADRAO, TAG_HTML, type Idioma } from '@/i18n/idiomas';
import { textos } from '@/i18n/strings';
import { idiomaDoCaminho, rota } from '@/lib/rotas';

/**
 * O GitHub Pages serve um unico 404.html para qualquer caminho, inclusive
 * /en/ e /es/. O HTML exportado sai no idioma padrao (foi gerado sem saber
 * o endereco); depois de montar, o idioma vem do endereco que a pessoa abriu
 * e o resto da pagina (cabecalho, rodape, lang) acompanha. Trocar so depois
 * de montar e o que evita divergencia entre o HTML servido e a hidratacao.
 */
export default function NaoEncontrado() {
  const caminho = usePathname();
  const [idioma, setIdioma] = useState<Idioma>(IDIOMA_PADRAO);
  const t = textos(idioma);

  useEffect(() => {
    setIdioma(idiomaDoCaminho(caminho ?? ''));
  }, [caminho]);

  useEffect(() => {
    document.documentElement.lang = TAG_HTML[idioma];
  }, [idioma]);

  return (
    <>
      <a href="#conteudo" className="pular">
        {t.comum.navegacao.pularParaConteudo}
      </a>
      <SiteHeader idioma={idioma} temConteudo={false} marcaNoCabecalho />
      <main id="conteudo" tabIndex={-1}>
        <div className="secao">
          <div className="container-estreito">
            <h1 className="sr-only">{t.comum.naoEncontrado.titulo}</h1>
            <EstadoVazio
              titulo={t.comum.naoEncontrado.titulo}
              descricao={t.comum.naoEncontrado.texto}
              acao={<Botao href={rota(idioma)}>{t.comum.naoEncontrado.acao}</Botao>}
              desenho="busca"
            />
          </div>
        </div>
      </main>
      <SiteFooter idioma={idioma} />
    </>
  );
}
