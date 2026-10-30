'use client';

import { CarinhaIndica } from '@/components/CarinhaIndica';

/**
 * Cadastro: publico unico, criadores de conteudo.
 *
 * A pagina tem dois estados e quem decide e `cadastroAberto()` (src/lib/data.ts):
 *
 * - Enquanto nao houver chamada com inscricoes abertas nem curso com turma
 *   aberta, o cadastro nao desbloqueia nada e a pagina nao pede dado nenhum.
 * - Assim que /data trouxer uma chamada aberta ou um curso com turma aberta,
 *   o formulario abaixo volta a aparecer sozinho, sem mexer neste arquivo.
 *
 * A condicao e lida por idioma: cada idioma mostra apenas o que foi publicado
 * nele.
 */

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';

import type { RedeDoCriador } from '@/lib/types';

import { Botao } from '@/components/Botao';
import { CabecalhoPagina } from '@/components/CabecalhoPagina';
import { CampoSelecao, CampoTexto } from '@/components/Campo';
import { Marcador } from '@/components/Marcador';
import { Selo } from '@/components/Selo';
import type { Idioma } from '@/i18n/idiomas';
import { textos } from '@/i18n/strings';
import { PAIS_PADRAO, opcoesDePais } from '@/lib/paises';
import { telefoneCompleto } from '@/lib/telefone';
import { motivoDoErro, type MotivoEnvio } from '@/lib/envio';
import { rota } from '@/lib/rotas';
import { useApp } from '@/state/AppState';

import { EstilosCadastro } from './_estilos';

/** Localidade de cada idioma, para o separador de milhar da audiencia somada. */
const LOCALIDADE: Record<Idioma, string> = { pt: 'pt-BR', en: 'en', es: 'es' };

/**
 * Estado de hoje: sem chamada aberta e sem curso com turma aberta.
 *
 * A pagina inteira e um aviso, entao ela e o bloco preto: unica ancora forte,
 * sem cor chapada e sem lista repetindo o que o titulo ja diz.
 */
function CadastroFechado({ idioma }: { idioma: Idioma }) {
  const tc = textos(idioma).cadastro;
  const f = tc.fechado;

  return (
    <section className="secao secao--alta secao--preto">
      <div className="container-estreito">
        <p className="olho">{tc.olho}</p>
        <h1>{f.titulo}</h1>
        <p className="texto-guia">{f.descricao}</p>

        <div className="linha" style={{ marginTop: 30 }}>
          <Botao href={rota(idioma, 'oportunidades')} variante="secundario">
            {tc.verOportunidades}
          </Botao>
          <Botao href={rota(idioma, 'biblioteca')} variante="secundario">
            {tc.verBiblioteca}
          </Botao>
        </div>
      </div>
    </section>
  );
}

/** Acoes oferecidas depois que o cadastro existe. */
function Acoes({ idioma }: { idioma: Idioma }) {
  const tc = textos(idioma).cadastro;

  return (
    <div className="linha">
      <Botao href={rota(idioma, 'painel')}>{tc.irAoPainel}</Botao>
      <Botao href={rota(idioma, 'oportunidades')} variante="secundario">
        {tc.verOportunidades}
      </Botao>
    </div>
  );
}

/**
 * Formulario de cadastro. So e montado quando o cadastro esta aberto.
 *
 * Dois blocos, e nao uma pilha unica de campos. O primeiro identifica a pessoa
 * e e a coluna menta da home que continuou: mesma superficie, mesmo marcador.
 * O segundo sao as redes declaradas, que e o que de fato descreve um criador:
 * fica em branco sobre a menta de cima, e e esse contraste que o destaca. A
 * audiencia somada aparece no pe das redes enquanto a pessoa digita: e a conta
 * que ela mesma faria.
 *
 * A confirmação só aparece depois de o servidor registrar o cadastro.
 * Falhas preservam os campos para outra tentativa.
 */
function CadastroFormulario({ idioma }: { idioma: Idioma }) {
  const { cadastrado, nome: nomeCadastrado, perfil, hidratado, cadastrar } = useApp();

  const t = textos(idioma);
  const tc = t.cadastro;

  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState<MotivoEnvio>();
  const emVoo = useRef(false);
  const confirmacao = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (enviado) confirmacao.current?.focus();
  }, [enviado]);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [erroTelefone, setErroTelefone] = useState<string | undefined>(undefined);
  const campoTelefone = useRef<HTMLInputElement>(null);
  const [pais, setPais] = useState(PAIS_PADRAO);
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');
  const [nichos, setNichos] = useState<string[]>([]);

  const paises = useMemo(() => opcoesDePais(idioma), [idioma]);
  const noBrasil = pais === PAIS_PADRAO;

  /*
   * Trocar de pais limpa a regiao. Sem isso, quem marcasse Sao Paulo e depois
   * mudasse para Portugal seguiria cadastrado como SP, numa lista de UF que
   * nem aparece mais na tela.
   */
  function trocarPais(codigo: string) {
    setPais(codigo);
    setUf('');
  }

  function alternarNicho(nicho: string) {
    setNichos((atuais) =>
      atuais.includes(nicho) ? atuais.filter((n) => n !== nicho) : [...atuais, nicho],
    );
  }

  /* O peso do cadastro esta aqui: onde a pessoa publica e para quantos. */
  const [redes, setRedes] = useState<RedeDoCriador[]>([
    { plataforma: '', perfil: '', seguidores: '' },
  ]);
  const restaurado = useRef(false);
  useEffect(() => {
    if (!hidratado || restaurado.current) return;
    restaurado.current = true;
    if (!perfil || cadastrado) return;
    setNome((v) => v || perfil.nome); setEmail((v) => v || perfil.email);
    setTelefone((v) => v || perfil.telefone); setPais(perfil.pais);
    setCidade((v) => v || perfil.cidade); setUf(perfil.uf);
    setNichos(perfil.nichos); if (perfil.redes.length) setRedes(perfil.redes);
  }, [hidratado, perfil, cadastrado]);

  function alterarRede(indice: number, campo: keyof RedeDoCriador, valor: string) {
    setRedes((atuais) =>
      atuais.map((rede, i) => (i === indice ? { ...rede, [campo]: valor } : rede)),
    );
  }

  function acrescentarRede() {
    setRedes((atuais) => [...atuais, { plataforma: '', perfil: '', seguidores: '' }]);
  }

  function removerRede(indice: number) {
    setRedes((atuais) => atuais.filter((_, i) => i !== indice));
  }

  /* Soma dos seguidores ja digitados. Campo vazio nao conta como zero: some. */
  const audiencia = redes.reduce((soma, rede) => soma + (Number(rede.seguidores) || 0), 0);

  async function enviar(evento: React.FormEvent) {
    evento.preventDefault();
    if (emVoo.current) return;
    /*
     * O navegador ja exige o campo; o que ele nao confere e se o numero esta
     * inteiro. A regra depende do pais (ver src/lib/telefone.ts): no Brasil,
     * DDD mais o numero; fora, o codigo do pais mais o numero.
     */
    if (!telefoneCompleto(telefone, pais)) {
      setErroTelefone(tc.telefoneConfira);
      campoTelefone.current?.focus();
      return;
    }
    emVoo.current = true;
    setEnviando(true); setErroEnvio(undefined);
    try {
      await cadastrar({
      nome,
      email,
      telefone,
      pais,
      cidade,
      uf,
      nichos,
      redes: redes.filter((rede) => rede.plataforma && rede.perfil),
      });
      setEnviado(true);
    } catch (erro) { setErroEnvio(motivoDoErro(erro)); }
    finally { emVoo.current = false; setEnviando(false); }
  }

  const jaCadastrado = hidratado && cadastrado && !enviado;

  return (
    <>
      <EstilosCadastro />
      <CabecalhoPagina estreito olho={tc.olho} titulo={tc.titulo} descricao={tc.descricao} />

      <div className="secao">
        <div className="container-estreito">
          {enviado ? (
            <div className="cartao">
              <div className="destaque" role="status" tabIndex={-1} ref={confirmacao}>
                <div className="confirmacao-indica">
                  <CarinhaIndica expressao="01" cor="verde" estado="confirmacao" />
                  <div><p className="destaque__titulo">{tc.confirmacaoTitulo}</p>
                  <p className="destaque__texto">{tc.confirmacaoTexto}</p></div>
                </div>
              </div>
              <Acoes idioma={idioma} />
            </div>
          ) : jaCadastrado ? (
            <section className="cartao" aria-labelledby="cadastro-existente-titulo">
              <div className="linha">
                <Selo idioma={idioma} status="aberta" rotulo={tc.jaCadastradoSelo} />
              </div>
              <h2 className="cartao__titulo" id="cadastro-existente-titulo">
                {tc.jaCadastradoTitulo}
              </h2>
              {nomeCadastrado ? (
                <div className="registro">
                  <p className="registro__rotulo">{tc.nomeRotulo}</p>
                  <p style={{ margin: 0 }}>{nomeCadastrado}</p>
                </div>
              ) : null}
              <Acoes idioma={idioma} />
            </section>
          ) : (
            <form onSubmit={enviar} className="pilha--g" aria-busy={enviando}>
              <fieldset disabled={enviando} className="pilha--g" style={{ border: 0, margin: 0, padding: 0, minWidth: 0 }}>
              {/* A coluna menta da home que continuou: o cadastro mora nela. */}
              <section className="cartao coluna--menta coluna--solta" aria-labelledby="cadastro-dados-titulo">
                <div className="coluna__cabeca">
                  <Marcador arranjo={2} />
                  <h2 className="cartao__titulo" id="cadastro-dados-titulo" style={{ margin: 0 }}>
                    {tc.formularioTitulo}
                  </h2>
                </div>

                <div className="pilha">
                  <CampoTexto
                    idioma={idioma}
                    id="cadastro-nome"
                    rotulo={tc.campos.nome}
                    value={nome}
                    onChange={(evento) => setNome(evento.target.value)}
                    autoComplete="name"
                    required
                  />
                  <CampoTexto
                    idioma={idioma}
                    id="cadastro-email"
                    rotulo={tc.campos.email}
                    type="email"
                    value={email}
                    onChange={(evento) => setEmail(evento.target.value)}
                    autoComplete="email"
                    required
                  />
                  <CampoTexto
                    idioma={idioma}
                    id="cadastro-telefone"
                    rotulo={tc.campos.telefone}
                    ajuda={tc.telefoneAjuda}
                    erro={erroTelefone}
                    type="tel"
                    inputMode="tel"
                    value={telefone}
                    onChange={(evento) => {
                      setTelefone(evento.target.value);
                      if (erroTelefone) setErroTelefone(undefined);
                    }}
                    ref={campoTelefone}
                    autoComplete="tel"
                    required
                  />
                  <CampoSelecao
                    idioma={idioma}
                    id="cadastro-pais"
                    rotulo={tc.campos.pais}
                    opcoes={paises}
                    autoComplete="country"
                    value={pais}
                    onChange={(evento) => trocarPais(evento.target.value)}
                    required
                  />
                  <div className="grade--2" style={{ gap: 14 }}>
                    <CampoTexto
                      idioma={idioma}
                      id="cadastro-cidade"
                      rotulo={tc.campos.cidade}
                      value={cidade}
                      onChange={(evento) => setCidade(evento.target.value)}
                      autoComplete="address-level2"
                      required
                    />
                    {/*
                     * A lista de UF e brasileira. Quem se cadastra de fora do
                     * Brasil escreve a regiao no proprio idioma, e o campo deixa
                     * de ser obrigatorio: ha pais que nao divide o territorio em
                     * nada que caiba nesta linha.
                     */}
                    {noBrasil ? (
                      <CampoSelecao
                        idioma={idioma}
                        id="cadastro-uf"
                        rotulo={tc.campos.uf}
                        vazio={t.fluxos.candidatura.selecioneUf}
                        opcoes={t.fluxos.candidatura.ufs.map((sigla) => ({
                          valor: sigla,
                          rotulo: sigla,
                        }))}
                        value={uf}
                        onChange={(evento) => setUf(evento.target.value)}
                        required
                      />
                    ) : (
                      <CampoTexto
                        idioma={idioma}
                        id="cadastro-regiao"
                        rotulo={tc.campos.regiao}
                        value={uf}
                        onChange={(evento) => setUf(evento.target.value)}
                        autoComplete="off"
                        opcional
                      />
                    )}
                  </div>
                </div>

                <fieldset
                  style={{
                    border: 0,
                    padding: 0,
                    margin: '10px 0 0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                  }}
                >
                  <legend style={{ padding: 0 }}>
                    <span className="campo__rotulo">{tc.nichos.titulo}</span>
                  </legend>
                  <p className="campo__ajuda" style={{ marginTop: -4 }}>
                    {tc.nichos.ajuda}
                  </p>
                  <div className="nichos">
                    {tc.nichos.lista.map((nicho, indice) => {
                      const marcado = nichos.includes(nicho);
                      const id = `nicho-${indice}`;
                      return (
                        <label
                          key={nicho}
                          htmlFor={id}
                          className={`nicho${marcado ? ' nicho--marcado' : ''}`}
                        >
                          <input
                            id={id}
                            type="checkbox"
                            className="sr-only"
                            checked={marcado}
                            onChange={() => alternarNicho(nicho)}
                          />
                          {nicho}
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              </section>

              {/* As redes sao o peso do cadastro: em branco, sobre a menta de cima, e o que se destaca. */}
              <section className="cartao" aria-labelledby="cadastro-redes-titulo">
                <h2 className="cartao__titulo" id="cadastro-redes-titulo">
                  {tc.redes.titulo}
                </h2>
                <p className="cartao__texto">{tc.redes.ajuda}</p>

                <div>
                  {redes.map((rede, indice) => (
                    <div key={indice} className="cad-rede">
                      <div className="cad-rede__topo">
                        <p className="rotulo rotulo--forte" style={{ margin: 0 }}>
                          {`${tc.redes.rede} ${indice + 1}`}
                        </p>
                        {redes.length > 1 ? (
                          <button
                            type="button"
                            className="btn btn--discreto btn--pequeno"
                            onClick={() => removerRede(indice)}
                          >
                            {tc.redes.remover}
                          </button>
                        ) : null}
                      </div>

                      <div className="cad-rede__campos">
                        <CampoSelecao
                          idioma={idioma}
                          id={`rede-plataforma-${indice}`}
                          rotulo={tc.redes.plataforma}
                          vazio={tc.redes.escolhaPlataforma}
                          opcoes={tc.redes.plataformas.map((nome) => ({
                            valor: nome,
                            rotulo: nome,
                          }))}
                          value={rede.plataforma}
                          onChange={(evento) =>
                            alterarRede(indice, 'plataforma', evento.target.value)
                          }
                          required={indice === 0}
                        />
                        <CampoTexto
                          idioma={idioma}
                          id={`rede-perfil-${indice}`}
                          rotulo={tc.redes.perfil}
                          placeholder={tc.redes.perfilExemplo}
                          value={rede.perfil}
                          onChange={(evento) => alterarRede(indice, 'perfil', evento.target.value)}
                          autoComplete="off"
                          required={indice === 0}
                        />
                        <CampoTexto
                          idioma={idioma}
                          id={`rede-seguidores-${indice}`}
                          rotulo={tc.redes.seguidores}
                          placeholder={tc.redes.seguidoresExemplo}
                          inputMode="numeric"
                          value={rede.seguidores}
                          onChange={(evento) =>
                            alterarRede(indice, 'seguidores', evento.target.value.replace(/\D/g, ''))
                          }
                          autoComplete="off"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="linha">
                  <Botao variante="secundario" tamanho="pequeno" onClick={acrescentarRede}>
                    {tc.redes.acrescentar}
                  </Botao>
                </div>

                {/* Aparece no primeiro numero digitado e acompanha cada tecla. */}
                {audiencia > 0 ? (
                  <div className="cad-soma">
                    <p className="rotulo rotulo--forte" style={{ margin: 0 }}>
                      {tc.redes.soma}
                    </p>
                    <p className="numero-grande cad-soma__valor">
                      {new Intl.NumberFormat(LOCALIDADE[idioma]).format(audiencia)}
                    </p>
                  </div>
                ) : null}
              </section>

              {erroEnvio ? <p className="campo__erro" role="alert">{t.comum.envio[erroEnvio]}</p> : null}
              <Botao type="submit" largo disabled={enviando}>
                {enviando ? t.comum.envio.enviando : erroEnvio ? t.comum.envio.tentar : tc.acao}
              </Botao>
              </fieldset>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

export function Cadastro({ idioma, aberto }: { idioma: Idioma; aberto: boolean }) {
  return aberto ? <CadastroFormulario idioma={idioma} /> : <CadastroFechado idioma={idioma} />;
}
