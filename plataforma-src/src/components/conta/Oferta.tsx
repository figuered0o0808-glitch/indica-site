'use client';
import { useEffect, useState, type FormEvent } from 'react';
import { Botao } from '@/components/Botao';
import type { Idioma } from '@/i18n/idiomas';
import { textos } from '@/i18n/strings';
import { ErroEnvio, motivoDoErro, type MotivoEnvio } from '@/lib/envio';
import { moeda } from '@/lib/format';
import type { Candidatura, OfertaProposta } from '@/lib/types';
import { useApp } from '@/state/AppState';
import styles from './AppPessoal.module.css';
export function Oferta({ idioma, proposta }: {
    idioma: Idioma;
    proposta: Candidatura;
}) {
    const t = textos(idioma), { carregarOferta, decidirOferta, atualizarConta, sessaoId } = useApp();
    const [oferta, setOferta] = useState<OfertaProposta | null>(), [escolha, setEscolha] = useState('');
    const [carregando, setCarregando] = useState(true), [busy, setBusy] = useState(false), [erro, setErro] = useState<MotivoEnvio>(), [conflito, setConflito] = useState(false), [tentativa, setTentativa] = useState(0);
    useEffect(() => {
        let ativo = true;
        setCarregando(true);
        setOferta(undefined);
        setEscolha('');
        setErro(undefined);
        carregarOferta(proposta.protocolo!).then(o => { if (ativo) {
            setOferta(o);
            setConflito(false);
            if (o && ((o.estado === 'aceita' && proposta.status !== 'selecionada') || (o.estado === 'recusada' && proposta.status !== 'recusada')))
                void atualizarConta().catch(() => { });
        } }).catch(e => { if (ativo)
            setErro(motivoDoErro(e)); }).finally(() => { if (ativo)
            setCarregando(false); });
        return () => { ativo = false; };
    }, [proposta.protocolo, proposta.oferta?.id, proposta.oferta?.versao, sessaoId, carregarOferta, atualizarConta, proposta.status, tentativa]);
    async function responder(e: FormEvent) {
        e.preventDefault();
        if (!oferta || !escolha || busy || conflito)
            return;
        setBusy(true);
        setErro(undefined);
        try {
            const r = await decidirOferta(proposta.protocolo!, oferta, escolha === 'aceitar');
            setOferta(r.oferta);
            setEscolha('');
        }
        catch (e) {
            if (e instanceof ErroEnvio && e.status === 409) {
                setConflito(true);
                setEscolha('');
            }
            else
                setErro(motivoDoErro(e));
        }
        finally {
            setBusy(false);
        }
    }
    if (carregando)
        return <p role="status">{t.comum.envio.atualizando}</p>;
    return <section className={`cartao ${styles.noPrint}`} id={`oferta-${proposta.protocolo}`}>
    <h3>{t.conta.ofertaTitulo}</h3>
    {!oferta ? <><p>{erro ? t.comum.envio[erro] : t.conta.ofertaIndisponivel}</p><Botao variante="secundario" onClick={() => setTentativa(x => x + 1)}>{t.comum.envio.tentar}</Botao></> : <>
      <div className={styles.grid}><div><p className="rotulo">{t.conta.ofertaSolicitado}</p><p className={styles.money}>{moeda(oferta.valorSolicitado, idioma)}</p></div><div><p className="rotulo">{t.conta.ofertaOfertado}</p><p className={styles.money}>{moeda(oferta.valorOfertado, idioma)}</p></div></div>
      <h4>{t.conta.ofertaRessalva}</h4><p className={styles.scope}>{oferta.ressalva || t.conta.ofertaSemRessalva}</p>
      <p>{t.conta.ofertaEscopo}</p>
      <details><summary>{proposta.projeto || t.fluxos.candidatura.projeto.titulo}</summary><div className="pilha" style={{ marginTop: 16 }}>{(['descricao', 'formato', 'justificativa', 'alcance', 'distribuicao'] as const).map(k => <div key={k}><p className="rotulo">{t.fluxos.candidatura.projeto[k]}</p><p className={styles.scope}>{proposta[k] || '—'}</p></div>)}</div></details>
      {oferta.estado === 'pendente' ? <form onSubmit={responder} className="pilha" aria-busy={busy}>
        <fieldset className="pilha" disabled={busy || conflito} style={{ border: 0, padding: 0, margin: 0 }}><legend>{t.conta.ofertaEscolha}</legend><label className={styles.choice}><input type="radio" name={`oferta-${proposta.protocolo}`} value="aceitar" checked={escolha === 'aceitar'} onChange={e => setEscolha(e.target.value)} required/>{t.conta.ofertaAceitar}</label><label className={styles.choice}><input type="radio" name={`oferta-${proposta.protocolo}`} value="recusar" checked={escolha === 'recusar'} onChange={e => setEscolha(e.target.value)}/>{t.conta.ofertaRecusar}</label><Botao type="submit" disabled={busy || !escolha || conflito}>{busy ? t.comum.envio.enviando : t.conta.ofertaConfirmar}</Botao></fieldset>
        {conflito ? <div role="alert" className={styles.notice}><p>{t.conta.ofertaConflito}</p><Botao variante="secundario" onClick={() => setTentativa(x => x + 1)}>{t.conta.ofertaRecarregar}</Botao></div> : null}
        {erro ? <p role="alert" className="campo__erro">{t.comum.envio[erro]}</p> : null}
      </form> : <p role="status">{oferta.estado === 'aceita' ? t.conta.ofertaAceita : t.conta.ofertaRecusada}</p>}
    </>}
  </section>;
}
