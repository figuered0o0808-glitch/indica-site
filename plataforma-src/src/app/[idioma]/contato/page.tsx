import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CabecalhoPagina } from '@/components/CabecalhoPagina';
import { FormularioContato } from '@/components/Contato';
import { Botao } from '@/components/Botao';
import { ehIdioma } from '@/i18n/idiomas';
import { contato } from '@/lib/contato';
import { alternativas } from '@/lib/seo';
import { rota } from '@/lib/rotas';

export async function generateMetadata({params}:{params:Promise<{idioma:string}>}):Promise<Metadata>{
  const {idioma}=await params;if(!ehIdioma(idioma))return {};
  const t=contato(idioma);return {title:t.titulo,description:t.descricao,alternates:alternativas(idioma,'contato')};
}
export default async function Contato({params}:{params:Promise<{idioma:string}>}){
  const {idioma}=await params;if(!ehIdioma(idioma))notFound();const t=contato(idioma);
  return <><CabecalhoPagina olho={t.olho} titulo={t.titulo} descricao={t.descricao}/><section className="secao"><div className="container"><FormularioContato idioma={idioma}/><div className="linha" style={{marginTop:40}}><Botao href={rota(idioma,'como-funciona/')} variante="secundario">{t.voltar}</Botao></div></div></section></>;
}
