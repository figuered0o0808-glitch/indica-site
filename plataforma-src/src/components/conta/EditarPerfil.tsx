'use client';
import { useState, type FormEvent } from 'react';
import { Botao } from '@/components/Botao';
import { CampoSelecao, CampoTexto } from '@/components/Campo';
import type { Idioma } from '@/i18n/idiomas';
import { textos } from '@/i18n/strings';
import type { PerfilCadastro } from '@/lib/types';
import { motivoDoErro, type MotivoEnvio } from '@/lib/envio';
import { opcoesDePais, PAIS_PADRAO } from '@/lib/paises';
import { telefoneCompleto } from '@/lib/telefone';
import { useApp } from '@/state/AppState';
export function EditarPerfil({ idioma, perfil }: {
    idioma: Idioma;
    perfil: PerfilCadastro;
}) {
    const t = textos(idioma), { salvarPerfil } = useApp();
    const [dados, setDados] = useState<PerfilCadastro>(() => ({ ...perfil, redes: perfil.redes.map(r => ({ ...r })) }));
    const [busy, setBusy] = useState(false), [erro, setErro] = useState<MotivoEnvio>(), [salvo, setSalvo] = useState(false), [erroTelefone, setErroTelefone] = useState(false);
    function campo(chave: 'nome' | 'telefone' | 'cidade' | 'uf', valor: string) { setDados(a => ({ ...a, [chave]: valor })); setSalvo(false); setErroTelefone(false); }
    async function enviar(evento: FormEvent) {
        evento.preventDefault();
        if (busy)
            return;
        if (!telefoneCompleto(dados.telefone, dados.pais)) {
            setErroTelefone(true);
            return;
        }
        setBusy(true);
        setErro(undefined);
        setSalvo(false);
        try {
            await salvarPerfil({ ...dados, email: perfil.email, redes: dados.redes.filter(r => r.plataforma.trim() && r.perfil.trim()) });
            setSalvo(true);
        }
        catch (e) {
            setErro(motivoDoErro(e));
        }
        finally {
            setBusy(false);
        }
    }
    return <form className="pilha" onSubmit={enviar} aria-busy={busy}>
    <p>{t.conta.snapshotAjuda}</p>
    <fieldset className="pilha" disabled={busy} style={{ border: 0, margin: 0, padding: 0, minWidth: 0 }}>
      <CampoTexto idioma={idioma} id="perfil-nome" rotulo={t.cadastro.campos.nome} value={dados.nome} maxLength={120} required onChange={e => campo('nome', e.target.value)}/>
      <CampoTexto idioma={idioma} id="perfil-email" rotulo={t.conta.email} value={perfil.email} ajuda={t.conta.emailImutavel} readOnly/>
      <CampoTexto idioma={idioma} id="perfil-telefone" type="tel" rotulo={t.conta.telefone} value={dados.telefone} required erro={erroTelefone ? t.cadastro.telefoneConfira : undefined} onChange={e => campo('telefone', e.target.value)}/>
      <CampoSelecao idioma={idioma} id="perfil-pais" rotulo={t.cadastro.campos.pais} value={dados.pais} opcoes={opcoesDePais(idioma)} onChange={e => { setDados(a => ({ ...a, pais: e.target.value, uf: '' })); setSalvo(false); }}/>
      <div className="grade--2"><CampoTexto idioma={idioma} id="perfil-cidade" rotulo={t.conta.cidade} value={dados.cidade} required onChange={e => campo('cidade', e.target.value)}/>{dados.pais === PAIS_PADRAO ? <CampoSelecao idioma={idioma} id="perfil-uf" rotulo={t.conta.uf} value={dados.uf} vazio={t.fluxos.candidatura.selecioneUf} opcoes={t.fluxos.candidatura.ufs.map(uf => ({ valor: uf, rotulo: uf }))} required onChange={e => campo('uf', e.target.value)}/> : <CampoTexto idioma={idioma} id="perfil-uf" rotulo={t.cadastro.campos.regiao} value={dados.uf} opcional onChange={e => campo('uf', e.target.value)}/>}</div>
      <p className="nota">{t.conta.redesOpcionais}</p>
      {dados.redes.map((rede, i) => <div className="cartao" key={i}><CampoSelecao idioma={idioma} id={`perfil-rede-${i}`} rotulo={t.cadastro.redes.plataforma} value={rede.plataforma} vazio={t.cadastro.redes.escolhaPlataforma} opcoes={t.cadastro.redes.plataformas.map(p => ({ valor: p, rotulo: p }))} onChange={e => { setDados(a => ({ ...a, redes: a.redes.map((r, n) => n === i ? { ...r, plataforma: e.target.value } : r) })); setSalvo(false); }} required={Boolean(rede.perfil)}/><CampoTexto idioma={idioma} id={`perfil-rede-perfil-${i}`} rotulo={t.cadastro.redes.perfil} value={rede.perfil} required={Boolean(rede.plataforma)} onChange={e => { setDados(a => ({ ...a, redes: a.redes.map((r, n) => n === i ? { ...r, perfil: e.target.value } : r) })); setSalvo(false); }}/><CampoTexto idioma={idioma} id={`perfil-rede-seguidores-${i}`} rotulo={t.cadastro.redes.seguidores} inputMode="numeric" value={rede.seguidores} opcional onChange={e => { setDados(a => ({ ...a, redes: a.redes.map((r, n) => n === i ? { ...r, seguidores: e.target.value.replace(/\D/g, '') } : r) })); setSalvo(false); }}/><Botao variante="discreto" tamanho="pequeno" onClick={() => { setDados(a => ({ ...a, redes: a.redes.filter((_, n) => n !== i) })); setSalvo(false); }}>{t.cadastro.redes.remover}</Botao></div>)}
      {dados.redes.length < 20 ? <Botao variante="secundario" tamanho="pequeno" onClick={() => setDados(a => ({ ...a, redes: [...a.redes, { plataforma: '', perfil: '', seguidores: '' }] }))}>{t.cadastro.redes.acrescentar}</Botao> : null}
      {erro ? <p role="alert" className="campo__erro">{t.comum.envio[erro]}</p> : null}{salvo ? <p role="status">{t.conta.perfilSalvo}</p> : null}
      <Botao type="submit" disabled={busy}>{busy ? t.comum.envio.enviando : t.conta.salvar}</Botao>
    </fieldset>
  </form>;
}
