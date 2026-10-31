/**
 * Strings da pagina de cadastro. Publico unico: criadores de conteudo.
 *
 * Dois estados, decididos em `cadastroAberto()`: sem chamada com inscricoes
 * abertas e sem curso com turma aberta vale o bloco `fechado`, que nao pede
 * dado nenhum; com conteudo publicado valem as demais chaves.
 */
export const cadastro = {
  olho: 'Cadastro',

  /** Acao do cabecalho do site quando o cadastro esta aberto. */
  entrar: 'Criar cadastro',

  fechado: {
    titulo: 'Você pode criar sua conta a qualquer momento',
    descricao:
      'A conta é gratuita para pessoas físicas e jurídicas. Participar do banco de influenciadores é opcional. Cada chamada define se exige CNPJ.',
  },

  titulo: 'Criar seu cadastro',
  descricao: 'Conta gratuita para pessoa física ou jurídica. A participação no banco de influenciadores é uma escolha separada.',

  formularioTitulo: 'Seus dados',
  campos: {
    nome: 'Nome',
    email: 'E-mail',
    telefone: 'Telefone',
    pais: 'País',
    cidade: 'Cidade',
    uf: 'UF',
    regiao: 'Estado ou região',
  },
  telefoneAjuda: 'Com DDD. Fora do Brasil, comece pelo código do país.',
  telefoneConfira: 'Confira o número.',

  nichos: {
    titulo: 'Nichos de atuação',
    ajuda: 'Selecione todos em que você publica. O nicho não limita as pautas que você pode propor.',
    lista: [
      'Política',
      'Sociedade & Cultura',
      'Meio Ambiente',
      'Ciência',
      'Humor',
      'Artes',
      'Educação',
      'Bem-Estar',
      'Viagem',
      'Esportes',
      'Religião',
    ],
  },

  redes: {
    titulo: 'Suas redes',
    ajuda: 'Onde você publica e qual o tamanho da audiência em cada uma.',
    plataforma: 'Plataforma',
    escolhaPlataforma: 'Escolha',
    perfil: 'Perfil',
    perfilExemplo: '@seuperfil',
    seguidores: 'Seguidores',
    seguidoresExemplo: 'Somente números',
    /* Numera cada linha: no celular as tres colunas viram tres campos soltos. */
    rede: 'Rede',
    acrescentar: 'Acrescentar rede',
    remover: 'Remover',
    /* Soma dos seguidores digitados, atualizada enquanto a pessoa preenche. */
    soma: 'Audiência somada',
    plataformas: [
      'Instagram',
      'TikTok',
      'YouTube',
      'Twitch',
      'Kwai',
      'X',
      'LinkedIn',
      'Podcast',
      'Newsletter',
      'Outra',
    ],
  },
  acao: 'Criar cadastro',

  confirmacaoTitulo: 'Cadastro criado',
  confirmacaoTexto: 'Suas candidaturas às chamadas passam a aparecer no painel.',

  jaCadastradoSelo: 'Cadastro ativo',
  jaCadastradoTitulo: 'Você já tem cadastro',
  nomeRotulo: 'Nome informado',

  irAoPainel: 'Ir para o painel',
  verOportunidades: 'Ver oportunidades',
  verBiblioteca: 'Ver a biblioteca',
} as const;
