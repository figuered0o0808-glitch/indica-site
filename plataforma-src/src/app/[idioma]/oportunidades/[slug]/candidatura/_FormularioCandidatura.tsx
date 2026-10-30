'use client';

import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';

import { Botao } from '@/components/Botao';
import { CampoArea, CampoSelecao, CampoTexto } from '@/components/Campo';
import { Ilustracao } from '@/components/Ilustracao';
import { Passos } from '@/components/Passos';
import { Selo } from '@/components/Selo';
import type { Idioma } from '@/i18n/idiomas';
import { textos, type Strings } from '@/i18n/strings';
import { textoDaFaixa } from '@/lib/apoio';
import { data, moeda } from '@/lib/format';
import { PAIS_PADRAO, nomeDoPais, opcoesDePais } from '@/lib/paises';
import { rota } from '@/lib/rotas';
import type { Candidatura } from '@/lib/types';
import { useApp } from '@/state/AppState';

export interface EditalResumo {
  slug: string;
  titulo: string;
  /** Nula quando a chamada nao tem faixa de valor: o campo aceita qualquer valor. */
  faixaApoio: { min: number; max: number } | null;
}

/** Strings do fluxo, passadas para as funcoes que validam fora do componente. */
type TextosCandidatura = Strings['fluxos']['candidatura'];

interface Dados {
  nome: string;
  documento: string;
  /** Codigo ISO de dois digitos. Ver src/lib/paises.ts. */
  pais: string;
  cidade: string;
  /** UF quando o pais e o Brasil; nome livre da regiao nos demais. */
  uf: string;
  email: string;
  projeto: string;
  descricao: string;
  formato: string;
  valor: string;
  justificativa: string;
  alcance: string;
  distribuicao: string;
}

type NomeCampo = keyof Dados;
type Erros = Partial<Record<NomeCampo, string>>;

const VAZIO: Dados = {
  nome: '',
  documento: '',
  pais: PAIS_PADRAO,
  cidade: '',
  uf: '',
  email: '',
  projeto: '',
  descricao: '',
  formato: '',
  valor: '',
  justificativa: '',
  alcance: '',
  distribuicao: '',
};

const CAMPOS_DO_PASSO: NomeCampo[][] = [
  ['nome', 'documento', 'pais', 'cidade', 'uf', 'email'],
  ['projeto', 'descricao', 'formato', 'valor', 'justificativa', 'alcance', 'distribuicao'],
];

function digitos(valor: string): string {
  return valor.replace(/\D/g, '');
}

function emailValido(valor: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor.trim());
}

function validarProponente(dados: Dados, tc: TextosCandidatura): Erros {
  const erros: Erros = {};
  /*
   * A regra de 11 ou 14 digitos e a do CPF e do CNPJ, e so vale no Brasil.
   * Aplicada a quem propoe de fora, ela recusa um documento valido; por isso
   * fora do Brasil o documento so precisa existir. Pela mesma razao a UF, que e
   * uma lista brasileira, deixa de ser obrigatoria e vira regiao em texto.
   */
  const noBrasil = dados.pais === PAIS_PADRAO;

  if (!dados.nome.trim()) erros.nome = tc.erros.obrigatorio;
  if (!dados.documento.trim()) erros.documento = tc.erros.obrigatorio;
  else if (noBrasil && ![11, 14].includes(digitos(dados.documento).length))
    erros.documento = tc.erros.documento;
  if (!dados.cidade.trim()) erros.cidade = tc.erros.obrigatorio;
  if (noBrasil && !dados.uf) erros.uf = tc.erros.uf;
  if (!dados.email.trim()) erros.email = tc.erros.obrigatorio;
  else if (!emailValido(dados.email)) erros.email = tc.erros.email;
  return erros;
}

function validarProjeto(
  dados: Dados,
  faixa: { min: number; max: number } | null,
  tc: TextosCandidatura,
  /* A mensagem de faixa cita valores, e valor tem formato por idioma. */
  idioma: Idioma,
): Erros {
  const erros: Erros = {};
  if (!dados.projeto.trim()) erros.projeto = tc.erros.obrigatorio;
  if (!dados.descricao.trim()) erros.descricao = tc.erros.obrigatorio;
  if (!dados.formato) erros.formato = tc.erros.formato;

  const valor = Number(dados.valor);
  if (!dados.valor.trim()) erros.valor = tc.erros.obrigatorio;
  else if (!Number.isFinite(valor) || valor <= 0) erros.valor = tc.erros.valorNumero;
  else if (faixa && (valor < faixa.min || valor > faixa.max)) {
    erros.valor = `${tc.erros.valorFaixa} ${textoDaFaixa(idioma, faixa)}.`;
  }

  if (!dados.justificativa.trim()) erros.justificativa = tc.erros.obrigatorio;
  if (!dados.alcance.trim()) erros.alcance = tc.erros.obrigatorio;
  if (!dados.distribuicao.trim()) erros.distribuicao = tc.erros.obrigatorio;
  return erros;
}

function validarPasso(
  passo: number,
  dados: Dados,
  faixa: { min: number; max: number } | null,
  tc: TextosCandidatura,
  idioma: Idioma,
): Erros {
  if (passo === 0) return validarProponente(dados, tc);
  if (passo === 1) return validarProjeto(dados, faixa, tc, idioma);
  return {};
}

/** Linha de registro do manual, usada na revisao e no comprovante de envio. */
function Item({ rotulo, valor }: { rotulo: string; valor: ReactNode }) {
  return (
    <div className="registro">
      <p className="registro__rotulo">{rotulo}</p>
      <div style={{ whiteSpace: 'pre-line' }}>{valor}</div>
    </div>
  );
}

export function FormularioCandidatura({
  idioma,
  edital,
}: {
  idioma: Idioma;
  edital: EditalResumo;
}) {
  const t = textos(idioma);
  const tc = t.fluxos.candidatura;
  const { cadastrado, perfil, candidaturas, enviarCandidatura } = useApp();
  const [passo, setPasso] = useState(0);
  const [dados, setDados] = useState<Dados>(VAZIO);
  const [erros, setErros] = useState<Erros>({});
  const [enviada, setEnviada] = useState<Candidatura | null>(null);
  const topo = useRef<HTMLDivElement>(null);
  const tituloDoPasso = useRef<HTMLHeadingElement>(null);
  const tituloDaConfirmacao = useRef<HTMLHeadingElement>(null);

  /*
   * O cadastro ja disse quem a pessoa e: nome, e-mail, pais, cidade e regiao
   * entram preenchidos e continuam editaveis, para quem assina com razao
   * social ou responde por outro endereco. So o que esta em branco e tocado.
   */
  useEffect(() => {
    if (!perfil) return;
    setDados((atual) => ({
      ...atual,
      nome: atual.nome || perfil.nome,
      email: atual.email || perfil.email,
      pais: atual.pais === PAIS_PADRAO && perfil.pais ? perfil.pais : atual.pais,
      cidade: atual.cidade || perfil.cidade,
      uf: atual.uf || perfil.uf,
    }));
  }, [perfil]);

  /* Cada troca de passo leva o foco ao titulo do passo, e a confirmacao ao seu. */
  const primeiraMontagem = useRef(true);
  useEffect(() => {
    if (primeiraMontagem.current) {
      primeiraMontagem.current = false;
      return;
    }
    tituloDoPasso.current?.focus();
  }, [passo]);
  useEffect(() => {
    if (enviada) tituloDaConfirmacao.current?.focus();
  }, [enviada]);

  /* O comprovante le a candidatura viva: o protocolo da API chega depois do envio. */
  const comprovante = enviada
    ? (candidaturas.find((item) => item.id === enviada.id) ?? enviada)
    : null;

  const faixa = edital.faixaApoio;
  /* Sem faixa nao ha o que lembrar: a ajuda do campo some. */
  const faixaTexto = faixa ? `${tc.projeto.faixaAjuda} ${textoDaFaixa(idioma, faixa)}.` : undefined;

  function irPara(destino: number) {
    setPasso(destino);
    topo.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function atualizar(campo: NomeCampo, valor: string) {
    setDados((atual) => ({ ...atual, [campo]: valor }));
    setErros((atual) => {
      if (!atual[campo]) return atual;
      const proximo = { ...atual };
      delete proximo[campo];
      return proximo;
    });
  }

  const paises = useMemo(() => opcoesDePais(idioma), [idioma]);
  const noBrasil = dados.pais === PAIS_PADRAO;

  /*
   * Trocar de pais limpa a regiao e o erro dela: a UF marcada antes pertence a
   * uma lista que sai da tela junto com o Brasil.
   */
  function trocarPais(codigo: string) {
    setDados((atual) => ({ ...atual, pais: codigo, uf: '' }));
    setErros((atual) => {
      if (!atual.uf && !atual.documento) return atual;
      const proximo = { ...atual };
      delete proximo.uf;
      delete proximo.documento;
      return proximo;
    });
  }

  /* O foco vai ao primeiro campo recusado, na ordem em que os campos aparecem. */
  function focarPrimeiroErro(encontrados: Erros) {
    const campo = CAMPOS_DO_PASSO.flat().find((nome) => encontrados[nome]);
    if (!campo) return;
    const id = campo === 'uf' && !noBrasil ? 'regiao' : campo;
    /* O campo ja esta na tela; o foco vai agora, e a marca de erro chega em seguida. */
    document.getElementById(id)?.focus();
  }

  function avancar() {
    const encontrados = validarPasso(passo, dados, faixa, tc, idioma);
    setErros(encontrados);
    if (Object.keys(encontrados).length === 0) irPara(passo + 1);
    else focarPrimeiroErro(encontrados);
  }

  function enviar() {
    const encontrados = {
      ...validarProponente(dados, tc),
      ...validarProjeto(dados, faixa, tc, idioma),
    };
    if (Object.keys(encontrados).length > 0) {
      setErros(encontrados);
      const passoComErro = CAMPOS_DO_PASSO.findIndex((campos) =>
        campos.some((campo) => encontrados[campo]),
      );
      irPara(passoComErro === -1 ? 0 : passoComErro);
      focarPrimeiroErro(encontrados);
      return;
    }
    const nova = enviarCandidatura({
      editalSlug: edital.slug,
      editalTitulo: edital.titulo,
      projeto: dados.projeto.trim(),
      formato: dados.formato,
      valorSolicitado: Number(dados.valor),
      descricao: dados.descricao.trim(),
      justificativa: dados.justificativa.trim(),
      alcance: dados.alcance.trim(),
      distribuicao: dados.distribuicao.trim(),
      proponente: {
        nome: dados.nome.trim(),
        documento: dados.documento.trim(),
        pais: dados.pais,
        cidade: dados.cidade.trim(),
        uf: dados.uf.trim(),
        email: dados.email.trim().toLowerCase(),
      },
    });
    setEnviada(nova);
    topo.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function aoSubmeter(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (passo < 2) avancar();
    else enviar();
  }

  /** Candidatar-se depende apenas de estar cadastrado. */
  if (!cadastrado && !enviada) {
    return (
      <section className="cartao" style={{ gap: 16 }}>
        <h2 className="cartao__titulo">{tc.cadastro.titulo}</h2>
        <p className="cartao__texto">{tc.cadastro.texto}</p>
        <div className="linha" style={{ marginTop: 4 }}>
          <Botao href={rota(idioma, 'cadastro')}>{tc.cadastro.acao}</Botao>
          <Botao href={rota(idioma, `oportunidades/${edital.slug}`)} variante="secundario">
            {tc.voltarEdital}
          </Botao>
        </div>
      </section>
    );
  }

  if (comprovante) {
    return (
      <div ref={topo} className="pilha--g">
        <section className="cartao" style={{ gap: 'var(--esp-16)' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Ilustracao nome="enviado" largura={180} />
          </div>
          <h2 ref={tituloDaConfirmacao} tabIndex={-1} style={{ textAlign: 'center', margin: 0 }}>
            {tc.confirmacao.titulo}
          </h2>

          <p className="rotulo rotulo--forte" style={{ margin: 'var(--esp-8) 0 0' }}>
            {tc.confirmacao.resumoTitulo}
          </p>
          <div>
            {/* O protocolo e da API, quando ela responde; o id local nao se chama protocolo. */}
            {comprovante.protocolo ? (
              <Item rotulo={tc.confirmacao.protocolo} valor={comprovante.protocolo} />
            ) : null}
            <Item rotulo={tc.confirmacao.enviadaEm} valor={data(comprovante.enviadaEm, idioma)} />
            <Item rotulo={tc.confirmacao.edital} valor={comprovante.editalTitulo} />
            <Item rotulo={tc.confirmacao.projeto} valor={comprovante.projeto} />
            <Item rotulo={tc.confirmacao.valor} valor={moeda(comprovante.valorSolicitado, idioma)} />
            <Item rotulo={tc.confirmacao.situacao} valor={<Selo idioma={idioma} status={comprovante.status} />} />
          </div>

          <p className="nota" style={{ marginTop: 6 }}>
            {tc.confirmacao.proximoPasso}
          </p>
        </section>

        <div className="linha">
          <Botao href={rota(idioma, 'painel')}>{tc.confirmacao.acao}</Botao>
          <Botao href={rota(idioma, 'oportunidades')} variante="secundario">
            {tc.confirmacao.secundaria}
          </Botao>
        </div>
      </div>
    );
  }

  return (
    <div ref={topo}>
      <Passos passos={tc.passos} atual={passo} />

      <form onSubmit={aoSubmeter} noValidate className="pilha--g">
        {passo === 0 ? (
          <section className="pilha">
            <div className="pilha--p">
              <h2 ref={tituloDoPasso} tabIndex={-1} style={{ margin: 0 }}>
                {tc.proponente.titulo}
              </h2>
              <p className="texto-secundario texto-pequeno" style={{ margin: 0 }}>
                {tc.proponente.intro}
              </p>
            </div>

            <CampoTexto idioma={idioma}
              id="nome"
              rotulo={tc.proponente.nome}
              value={dados.nome}
              erro={erros.nome}
              autoComplete="name"
              onChange={(evento) => atualizar('nome', evento.target.value)}
            />

            <div className="grade--2" style={{ gap: 16 }}>
              <CampoTexto idioma={idioma}
                id="documento"
                rotulo={noBrasil ? tc.proponente.documento : tc.proponente.documentoFora}
                placeholder={
                  noBrasil
                    ? tc.proponente.exemplos.documento
                    : tc.proponente.exemplos.documentoFora
                }
                inputMode={noBrasil ? 'numeric' : 'text'}
                value={dados.documento}
                erro={erros.documento}
                onChange={(evento) => atualizar('documento', evento.target.value)}
              />
              <CampoTexto idioma={idioma}
                id="email"
                type="email"
                rotulo={tc.proponente.email}
                placeholder={tc.proponente.exemplos.email}
                value={dados.email}
                erro={erros.email}
                autoComplete="email"
                onChange={(evento) => atualizar('email', evento.target.value)}
              />
            </div>

            <CampoSelecao
              idioma={idioma}
              id="pais"
              rotulo={tc.proponente.pais}
              opcoes={paises}
              autoComplete="country"
              value={dados.pais}
              onChange={(evento) => trocarPais(evento.target.value)}
            />

            <div className="grade--2" style={{ gap: 16 }}>
              <CampoTexto idioma={idioma}
                id="cidade"
                rotulo={tc.proponente.cidade}
                placeholder={tc.proponente.exemplos.cidade}
                value={dados.cidade}
                erro={erros.cidade}
                autoComplete="address-level2"
                onChange={(evento) => atualizar('cidade', evento.target.value)}
              />
              {noBrasil ? (
                <CampoSelecao idioma={idioma}
                  id="uf"
                  rotulo={tc.proponente.uf}
                  vazio={tc.selecioneUf}
                  opcoes={tc.ufs.map((uf) => ({ valor: uf, rotulo: uf }))}
                  value={dados.uf}
                  erro={erros.uf}
                  onChange={(evento) => atualizar('uf', evento.target.value)}
                />
              ) : (
                <CampoTexto
                  idioma={idioma}
                  id="regiao"
                  rotulo={tc.proponente.regiao}
                  value={dados.uf}
                  autoComplete="off"
                  opcional
                  onChange={(evento) => atualizar('uf', evento.target.value)}
                />
              )}
            </div>
          </section>
        ) : null}

        {passo === 1 ? (
          <section className="pilha">
            <h2 ref={tituloDoPasso} tabIndex={-1} style={{ margin: 0 }}>
              {tc.projeto.titulo}
            </h2>

            <CampoTexto idioma={idioma}
              id="projeto"
              rotulo={tc.projeto.nome}
              value={dados.projeto}
              erro={erros.projeto}
              autoComplete="off"
              onChange={(evento) => atualizar('projeto', evento.target.value)}
            />

            <CampoArea idioma={idioma}
              id="descricao"
              rotulo={tc.projeto.descricao}
              ajuda={tc.projeto.descricaoAjuda}
              rows={5}
              value={dados.descricao}
              erro={erros.descricao}
              onChange={(evento) => atualizar('descricao', evento.target.value)}
            />

            <div className="grade--2" style={{ gap: 16 }}>
              <CampoSelecao idioma={idioma}
                id="formato"
                rotulo={tc.projeto.formato}
                vazio={tc.selecioneFormato}
                opcoes={tc.formatos.map((formato) => ({ valor: formato, rotulo: formato }))}
                value={dados.formato}
                erro={erros.formato}
                onChange={(evento) => atualizar('formato', evento.target.value)}
              />
              <CampoTexto idioma={idioma}
                id="valor"
                type="number"
                min={0}
                step={500}
                rotulo={tc.projeto.valor}
                ajuda={faixaTexto}
                placeholder={tc.projeto.exemplos.valor}
                value={dados.valor}
                erro={erros.valor}
                onChange={(evento) => atualizar('valor', evento.target.value)}
              />
            </div>

            <CampoArea idioma={idioma}
              id="justificativa"
              rotulo={tc.projeto.justificativa}
              ajuda={tc.projeto.justificativaAjuda}
              placeholder={tc.projeto.exemplos.justificativa}
              rows={3}
              value={dados.justificativa}
              erro={erros.justificativa}
              onChange={(evento) => atualizar('justificativa', evento.target.value)}
            />

            <CampoTexto idioma={idioma}
              id="alcance"
              rotulo={tc.projeto.alcance}
              ajuda={tc.projeto.alcanceAjuda}
              value={dados.alcance}
              erro={erros.alcance}
              autoComplete="off"
              onChange={(evento) => atualizar('alcance', evento.target.value)}
            />

            <CampoArea idioma={idioma}
              id="distribuicao"
              rotulo={tc.projeto.distribuicao}
              ajuda={tc.projeto.distribuicaoAjuda}
              rows={3}
              value={dados.distribuicao}
              erro={erros.distribuicao}
              onChange={(evento) => atualizar('distribuicao', evento.target.value)}
            />

          </section>
        ) : null}

        {passo === 2 ? (
          <section className="pilha--g">
            <div className="pilha--p">
              <h2 ref={tituloDoPasso} tabIndex={-1} style={{ margin: 0 }}>
                {tc.revisao.titulo}
              </h2>
              <p className="texto-secundario texto-pequeno" style={{ margin: 0 }}>
                {tc.revisao.descricao}
              </p>
            </div>

            <div className="cartao">
              <div className="linha linha--fim">
                <h3 className="cartao__titulo">{tc.proponente.titulo}</h3>
                <Botao variante="discreto" tamanho="pequeno" onClick={() => irPara(0)}>
                  {tc.corrigir}
                </Botao>
              </div>
              <div>
                <Item rotulo={tc.proponente.nome} valor={dados.nome} />
                <Item rotulo={tc.proponente.documento} valor={dados.documento} />
                <Item rotulo={tc.proponente.email} valor={dados.email} />
                <Item rotulo={tc.proponente.pais} valor={nomeDoPais(dados.pais, idioma)} />
                <Item rotulo={tc.proponente.cidade} valor={dados.cidade} />
                {/* Fora do Brasil a regiao e opcional: em branco, nao vira linha. */}
                {dados.uf ? (
                  <Item
                    rotulo={noBrasil ? tc.proponente.uf : tc.proponente.regiao}
                    valor={dados.uf}
                  />
                ) : null}
              </div>
            </div>

            <div className="cartao">
              <div className="linha linha--fim">
                <h3 className="cartao__titulo">{tc.projeto.titulo}</h3>
                <Botao variante="discreto" tamanho="pequeno" onClick={() => irPara(1)}>
                  {tc.corrigir}
                </Botao>
              </div>
              <div>
                <Item rotulo={tc.projeto.nome} valor={dados.projeto} />
                <Item rotulo={tc.projeto.descricao} valor={dados.descricao} />
                <Item rotulo={tc.projeto.formato} valor={dados.formato} />
                <Item rotulo={tc.projeto.valor} valor={moeda(Number(dados.valor), idioma)} />
                <Item rotulo={tc.projeto.justificativa} valor={dados.justificativa} />
                <Item rotulo={tc.projeto.alcance} valor={dados.alcance} />
                <Item rotulo={tc.projeto.distribuicao} valor={dados.distribuicao} />
              </div>
            </div>
          </section>
        ) : null}

        {Object.keys(erros).length > 0 ? (
          <p className="campo__erro" role="alert" style={{ margin: 0 }}>
            {tc.erros.resumo}
          </p>
        ) : null}

        <div className="linha linha--fim">
          <div className="linha">
            {passo > 0 ? (
              <Botao variante="secundario" onClick={() => irPara(passo - 1)}>
                {t.comum.acoes.voltar}
              </Botao>
            ) : (
              <Botao href={rota(idioma, `oportunidades/${edital.slug}`)} variante="secundario">
                {tc.voltarEdital}
              </Botao>
            )}
          </div>
          <div className="linha">
            <Botao type="submit">{passo < 2 ? t.comum.acoes.avancar : t.comum.acoes.enviar}</Botao>
          </div>
        </div>

        {passo < 2 ? (
          <p className="texto-mini" style={{ margin: 0 }}>
            {tc.obrigatorios}
          </p>
        ) : null}
      </form>
    </div>
  );
}
