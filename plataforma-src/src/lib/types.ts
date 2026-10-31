/** Tipos do conteudo publicado em /data. Contrato unico da aplicacao. */


export type StatusEdital = 'aberta' | 'em-avaliacao' | 'encerrada' | 'consulta';

export type TipoEdital =
  | 'tema-amplo'
  | 'macrotema'
  | 'pauta-especifica'
  | 'edital-organizacao';

export interface CriterioSelecao {
  titulo: string;
  /** Ausente quando a chamada ordena os criterios sem atribuir peso numerico. */
  peso?: number;
  descricao: string;
}

export interface MembroBanca {
  nome: string;
  afiliacao: string;
  minibio: string;
}

export interface FaixaDistribuicao {
  faixa: string;
  quantidade: string;
  observacao?: string;
}

export interface EtapaCronograma {
  etapa: string;
  data: string;
  /** Fim do intervalo, quando o documento publica um período. */
  dataFim?: string;
}

export interface Apoiado {
  nome: string;
  projeto: string;
  formato: string;
  uf: string;
  valor: number;
}

export interface ResultadoEdital {
  fundamentacao: string;
  publicadoEm: string;
  inscricoesRecebidas: number;
  apoiados: Apoiado[];
}

export interface Call {
  slug: string;
  /** Identificador da operação; o slug público também pode resolver a chamada. */
  chamadaId?: string;
  simulacao?: boolean;
  titulo: string;
  /** Quem opera a chamada. A marca aparece na pagina. */
  organizacao?: string;
  logoOrganizacao?: string;
  status: StatusEdital;
  tipo: TipoEdital;
  resumo: string;
  proponente: string | null;
  apresentacao: string[];
  escopo: string[];
  naoApoiado: string[];
  criterios: CriterioSelecao[];
  criteriosDescricao?: string;
  banca: MembroBanca[];
  bancaDescricao?: string;
  distribuicao: FaixaDistribuicao[];
  /**
   * Nulo quando a chamada nao tem valor definido: em negociacao com o
   * financiador, ou apoio que nao e dinheiro (residencia, mentoria, estudio).
   * Nesses casos `apoioDescricao` diz o que se oferece.
   */
  valorTotal: number | null;
  /** O valor publicado é um teto, não uma quantia garantida. */
  valorTotalAte?: boolean;
  faixaApoio: { min: number; max: number } | null;
  /** O que a chamada oferece quando nao e (so) dinheiro, ou quando o valor ainda nao esta definido. */
  apoioDescricao?: string;
  /** Como a chamada se apresenta: campanha, edital de projetos, residencia, premio, bolsa. Texto no idioma. */
  modalidade?: string;
  /** A quem a chamada se dirige. */
  publico?: 'criadores' | 'organizacoes' | 'ambos';
  /**
   * Quantos projetos a chamada pretende apoiar. Opcional: chamada antiga nao
   * declarava. Na home vira a fileira de pontos, cheios e vazados.
   */
  vagas?: { min: number; max: number };
  /** Nulo enquanto o calendario da chamada nao esta fechado. */
  inscricoesAte: string | null;
  cronograma: EtapaCronograma[];
  arquivoEdital?: { arquivo: string; idioma: string; paginas?: number };
  secoesComplementares?: { id: string; titulo: string; paragrafos?: string[]; itens?: string[] }[];
  resultado: ResultadoEdital | null;
}

export interface ModuloCurso {
  numero: number;
  titulo: string;
  descricao: string;
}

export interface Course {
  slug: string;
  simulacao?: boolean;
  titulo: string;
  organizacao?: string;
  status: 'aberto' | 'em-breve';
  resumo: string;
  descricao: string[];
  paraQuem: string[];
  modulos: ModuloCurso[];
  duracao: string;
  formato: string;
  proximaTurma: string;
}

export type Trilha = 'criadores' | 'organizacoes';

export interface SecaoArtigo {
  titulo: string;
  paragrafos: string[];
}

export interface ArquivoMaterial {
  idioma: string;
  arquivo: string;
  paginas?: number;
}

export interface Article {
  slug: string;
  titulo: string;
  trilha: Trilha;
  /** Quem assina. Varias organizacoes publicam na mesma biblioteca. */
  autoria: string[];
  organizacao: string;
  /** Marca da organizacao que publica, em /public/organizacoes. */
  logoOrganizacao?: string;
  /** Capa da publicacao, em /public/materiais/capas. Sem ela, entra a capa gerada. */
  capa?: string;
  /** Tematica geral, usada como filtro e como chip. */
  tema: string;
  palavrasChave: string[];
  resumo: string;
  formato: string;
  tempoLeitura?: string;
  atualizadoEm: string;
  secoes: SecaoArtigo[];
  arquivos: ArquivoMaterial[];
  licenca?: string;
}

export type StatusCandidatura =
  | 'recebida'
  | 'selecionada'
  | 'inabilitada'
  | 'em-avaliacao'
  | 'aprovada'
  | 'nao-selecionada'
  | 'enviada';

export interface Candidatura {
  /** Identificador local, deste navegador. Nao e protocolo: quem numera e a API. */
  id: string;
  /** Numero devolvido pela API da INDICA quando o canal esta aberto. */
  protocolo?: string;
  chamadaId?: string;
  /** Segredo restrito ao navegador que recebeu o comprovante. */
  reciboToken?: string;
  organizacaoId?: number;
  organizacao?: OrganizacaoExecutora;
  pagamentoPendente?: boolean;
  pagamentoStatus?: string;
  simulacao?: boolean;
  editalSlug: string;
  editalTitulo: string;
  projeto: string;
  formato: string;
  valorSolicitado: number;
  enviadaEm: string;
  status: StatusCandidatura;
  /** O que a pessoa escreveu, guardado com a candidatura; o painel mostra so o resumo. */
  descricao?: string;
  justificativa?: string;
  alcance?: string;
  distribuicao?: string;
  /** Quem assinou. O documento vai para a API e nao fica no navegador. */
  proponente?: {
    nome: string;
    telefone?: string;
    pais: string;
    cidade: string;
    uf: string;
    email: string;
  };
}

export interface CursoDoCriador {
  cursoSlug: string;
  titulo: string;
  status: 'inscrito' | 'em-andamento' | 'concluido';
  progresso: number;
}

/** Retorno mínimo de uma consulta autorizada pelo segredo do comprovante. */
export interface ReciboPublico {
  tipo: string;
  referencia: string;
  protocolo?: string;
  estado: string;
  titulo: string;
  enviadaEm: string;
  reciboToken: string;
  pagamentoPendente?: boolean;
  simulacao?: boolean;
}

export interface OrganizacaoExecutora {
  id: number;
  cnpj: string;
  razaoSocial: string;
  nomeFantasia?: string;
  email?: string;
  telefone?: string;
  cidade: string;
  uf: string;
}
export type NovaOrganizacao = Omit<OrganizacaoExecutora, 'id'> & { id?: number };
export interface DadosPagamento {
  titular: string;
  cnpj: string;
  tipo: 'pix' | 'bancaria';
  pixTipo?: 'cnpj' | 'email' | 'telefone' | 'aleatoria';
  pixChave?: string;
  banco?: string;
  agencia?: string;
  agenciaDigito?: string;
  conta?: string;
  contaDigito?: string;
  tipoConta?: 'corrente' | 'poupanca';
}


/** Uma rede declarada no cadastro. */
export interface RedeDoCriador {
  plataforma: string;
  perfil: string;
  seguidores: string;
}

/** O que o cadastro coleta. Curto de proposito: o peso esta nas redes. */
export interface PerfilCadastro {
  nome: string;
  email: string;
  /** Como a pessoa digitou, com DDD ou codigo do pais. Normaliza-se so na saida. */
  telefone: string;
  pais: string;
  cidade: string;
  uf: string;
  /** Nichos em que a pessoa atua. Varios, porque quase ninguem faz um so. */
  nichos: string[];
  redes: RedeDoCriador[];
}
