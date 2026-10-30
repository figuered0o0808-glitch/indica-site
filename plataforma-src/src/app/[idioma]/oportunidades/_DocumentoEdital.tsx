import type { Idioma } from '@/i18n/idiomas';
import { textos } from '@/i18n/strings';
import { arquivoPublico } from '@/lib/format';
import type { Call } from '@/lib/types';

/** Documento original, com idioma explícito e sem sugerir inscrição aberta. */
export function DocumentoEdital({ idioma, edital }: { idioma: Idioma; edital: Call }) {
  const documento = edital.arquivoEdital;
  if (!documento) return null;
  const t = textos(idioma).editais;
  const codigo = documento.idioma.toLowerCase().split('-')[0];
  const nomeIdioma = codigo in t.idiomasDocumento ? t.idiomasDocumento[codigo as keyof typeof t.idiomasDocumento] : documento.idioma;
  const idiomaDoArquivo = codigo === 'pt' || codigo.startsWith('portugu') ? 'pt-BR' : ['en', 'es'].includes(codigo) ? codigo : undefined;
  return (
    <div className="pilha--p">
      <a className="btn btn--primario" href={arquivoPublico(documento.arquivo)} target="_blank" rel="noopener noreferrer"
        hrefLang={idiomaDoArquivo}>
        {t.lerPdf} ↗
      </a>
      <p className="texto-mini" style={{ margin: 0 }}>
        {t.idiomaDocumento} {nomeIdioma}
        {documento.paginas ? ` · ${documento.paginas} ${t.paginasDocumento}` : ''}
      </p>
    </div>
  );
}
