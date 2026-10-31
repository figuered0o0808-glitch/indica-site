import { Botao } from '@/components/Botao';
import type { Idioma } from '@/i18n/idiomas';
import { participar } from '@/lib/participar';
import { rota } from '@/lib/rotas';
import css from './Participar.module.css';

export function PassosParticipacao({ idioma }: { idioma: Idioma }) {
  return <ol className={css.passos}>{participar(idioma).passos.map(([titulo, texto]) => <li key={titulo}><h3>{titulo}</h3><p>{texto}</p></li>)}</ol>;
}

export function Participar({ idioma }: { idioma: Idioma }) {
  const t = participar(idioma);
  return <section className="secao" aria-labelledby="participar-titulo"><div className="container">
    <div className={css.abertura}><div><p className="olho">{t.olho}</p><h2 id="participar-titulo">{t.titulo}</h2></div><div><p>{t.descricao}</p><Botao href={rota(idioma, 'como-funciona/')} variante="secundario">{t.como} <span aria-hidden>↗</span></Botao></div></div>
    <PassosParticipacao idioma={idioma}/>
  </div></section>;
}
