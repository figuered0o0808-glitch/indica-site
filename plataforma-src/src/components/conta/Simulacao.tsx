import type { Idioma } from '@/i18n/idiomas';
import { textos } from '@/i18n/strings';
export function Simulacao({idioma}:{idioma:Idioma}){
 const t=textos(idioma).conta;
 return <aside className="container" role="note" style={{marginTop:24}}><div className="cartao" style={{border:'2px solid currentColor'}}><p className="rotulo rotulo--forte">{t.simulacaoTitulo}</p><p>{t.simulacaoTexto}</p></div></aside>;
}
