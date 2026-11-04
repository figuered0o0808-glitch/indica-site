'use client';

import { Botao } from '@/components/Botao';
import { textosAnexos, type ErroAnexos } from '@/i18n/anexos';
import type { Idioma } from '@/i18n/idiomas';
import type { ControleAnexos } from './useAnexos';
import styles from './AnexosCandidatura.module.css';

function preencher(texto: string, valores: Record<string, string>) {
  return texto.replace(/\{(\w+)\}/g, (_, chave: string) => valores[chave] ?? '');
}

export function AnexosCandidatura({ idioma, controle, pessoaJuridica, disabled = false, revisao = false, erroValidacao }: {
  idioma: Idioma;
  controle: ControleAnexos;
  pessoaJuridica: boolean;
  disabled?: boolean;
  revisao?: boolean;
  erroValidacao?: ErroAnexos;
}) {
  const t = textosAnexos(idioma);
  const consulta = controle.consulta, erro = controle.erro ?? erroValidacao;
  const numero = (valor: number) => new Intl.NumberFormat(idioma === 'pt' ? 'pt-BR' : idioma, { maximumFractionDigits: 1 }).format(valor);
  const mb = (bytes: number) => numero(bytes / (1024 * 1024));
  const bloqueado = disabled || controle.ocupado || !consulta?.aceitaEnvio || controle.precisaConferir;

  return <section className="pilha" aria-busy={controle.ocupado} aria-labelledby="anexos-titulo">
    <div>
      <h3 id="anexos-titulo" className={styles.titulo}>{revisao ? t.revisar : t.titulo}</h3>
      {!revisao ? <p className="texto-pequeno">{t.introducao}</p> : null}
      <p className="nota">{t.privacidade}</p>
      {consulta ? <p className="texto-mini">{preencher(t.limites, { arquivo: mb(consulta.requisitos.maxArquivoBytes), quantidade: numero(consulta.requisitos.maxArquivos), total: mb(consulta.requisitos.maxTotalBytes) })}</p> : null}
    </div>
    {controle.carregando ? <p role="status">{t.carregando}</p> : null}
    {erro ? <p role="alert" className="campo__erro">{t.erros[erro]}{controle.erroNome ? ` (${controle.erroNome})` : ''}</p> : null}
    {controle.operacao === 'fila' && controle.progresso?.nome ? <p role="status" aria-live="polite">{preencher(t.progresso, { atual: numero(controle.progresso.processados + 1), total: numero(controle.progresso.total), nome: controle.progresso.nome })}</p> : null}
    {consulta && !consulta.aceitaEnvio ? <p role="alert" className="campo__erro">{t.erros.fechado}</p> : null}
    <div className="linha">
      {consulta ? <p className="texto-mini" role="status">{preencher(t.uso, { quantidade: numero(consulta.uso.arquivos), total: mb(consulta.uso.totalBytes) })}</p> : null}
      <Botao variante="secundario" tamanho="pequeno" disabled={disabled || controle.ocupado} onClick={() => void controle.recarregar()}>{t.atualizar}</Botao>
    </div>
    {consulta ? <div className={styles.categorias}>{consulta.requisitos.categorias.map(categoria => {
      const id = categoria.id, arquivos = consulta.anexos.filter(a => a.categoria === id), fila = controle.fila.filter(a => a.categoria === id);
      const permitidos = categoria.tiposPermitidos ?? consulta.requisitos.tiposPermitidos;
      const ajuda = id === 'identificacao' ? (pessoaJuridica ? t.identificacaoPj : t.identificacaoPf) : t.ajudas[id];
      return <section className={styles.categoria} key={id} aria-labelledby={`anexo-${id}-titulo`}>
        <div className={styles.cabeca}>
          <h4 id={`anexo-${id}-titulo`}>{t.categorias[id]}</h4>
          <span className="texto-mini">{t.opcional}</span>
        </div>
        {!revisao ? <p id={`anexo-${id}-ajuda`} className="texto-pequeno">{ajuda}</p> : null}
        {!revisao ? <p className="texto-mini">{t.formatos}: {permitidos.map(tipo => tipo.slice(1).toUpperCase()).join(', ')}.</p> : null}
        {arquivos.length ? <ul className={styles.arquivos}>{arquivos.map(anexo => <li key={anexo.id} className={styles.arquivo}>
          <div className={styles.nome}><strong>{anexo.nome}</strong><span className="texto-mini">{mb(anexo.tamanho)} MB · {t.recebido}</span></div>
          <div className={styles.acoes}>
            <Botao variante="discreto" tamanho="pequeno" disabled={disabled || controle.ocupado} onClick={() => void controle.baixar(anexo)} aria-label={`${t.baixar}: ${anexo.nome}`}>{t.baixar}</Botao>
            {!revisao ? <Botao variante="discreto" tamanho="pequeno" disabled={bloqueado} onClick={() => void controle.remover(anexo)} aria-label={`${t.remover}: ${anexo.nome}`}>{t.remover}</Botao> : null}
          </div>
        </li>)}</ul> : <p className="texto-mini">{t.vazio}</p>}
        {!revisao ? <div className={styles.envio}>
          <label className="campo__rotulo" htmlFor={`anexo-${id}-arquivo`}>{t.escolher} — {t.categorias[id]}</label>
          <input className={styles.entrada} id={`anexo-${id}-arquivo`} type="file" multiple
            accept={permitidos.join(',')} disabled={bloqueado}
            aria-describedby={`anexo-${id}-ajuda`} onChange={e => { controle.selecionar(id, Array.from(e.target.files ?? [])); e.target.value = ''; }} />
          {fila.length ? <ul className={styles.arquivos}>{fila.map(item => <li className={`${styles.arquivo} ${styles.pendente}`} key={item.chave}>
            <div className={styles.nome}><strong>{item.arquivo.name}</strong><span className="texto-mini">{mb(item.arquivo.size)} MB · {item.estado === 'enviando' ? t.enviando : item.estado === 'erro' ? t.falhou : t.selecionado}</span>{item.erro ? <span className="campo__erro">{t.erros[item.erro]}</span> : null}</div>
            <Botao variante="discreto" tamanho="pequeno" disabled={disabled || controle.ocupado} onClick={() => controle.removerSelecionado(item.chave)} aria-label={`${t.remover}: ${item.arquivo.name}`}>{t.remover}</Botao>
          </li>)}</ul> : null}
        </div> : null}
      </section>;
    })}</div> : null}
  </section>;
}
