/**
 * Strings da pagina de cadastro, em ingles. Publico unico: criadores de
 * conteudo.
 *
 * Dois estados, decididos em `cadastroAberto()`: sem chamada com inscricoes
 * abertas e sem curso com turma aberta vale o bloco `fechado`, que nao pede
 * dado nenhum; com conteudo publicado valem as demais chaves.
 */
export const cadastro = {
  olho: 'Account',

  /** Acao do cabecalho do site quando o cadastro esta aberto. */
  entrar: 'Create account',

  fechado: {
    titulo: 'Sign-up opens when calls accept applications',
    descricao:
      'Use it to apply to open calls. It is free and requires no minimum follower count. Publications can be read without an account.',
  },

  titulo: 'Create your account',
  descricao: 'Free and with no minimum follower count required.',

  formularioTitulo: 'Your details',
  campos: {
    nome: 'Name',
    email: 'Email',
    telefone: 'Phone',
    pais: 'Country',
    cidade: 'City',
    uf: 'State',
    regiao: 'State or region',
  },
  telefoneAjuda: 'With area code. Outside Brazil, start with the country code.',
  telefoneConfira: 'Check the number.',

  nichos: {
    titulo: 'Your niches',
    ajuda: 'Select every one you publish in. Your niche does not limit the topics you can propose.',
    lista: [
      'Politics',
      'Society and Culture',
      'Environment',
      'Science',
      'Comedy',
      'Arts',
      'Education',
      'Wellbeing',
      'Travel',
      'Sports',
      'Religion',
    ] as readonly string[],
  },

  redes: {
    titulo: 'Your channels',
    ajuda: 'Where you publish and how large the audience is on each one.',
    plataforma: 'Platform',
    escolhaPlataforma: 'Select',
    perfil: 'Handle',
    perfilExemplo: '@yourhandle',
    seguidores: 'Followers',
    seguidoresExemplo: 'Numbers only',
    /* Numera cada linha: no celular as tres colunas viram tres campos soltos. */
    rede: 'Channel',
    acrescentar: 'Add channel',
    remover: 'Remove',
    /* Soma dos seguidores digitados, atualizada enquanto a pessoa preenche. */
    soma: 'Total audience',
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
      'Other',
    ] as readonly string[],
  },
  acao: 'Create account',

  confirmacaoTitulo: 'Account created',
  confirmacaoTexto: 'Your applications to calls now appear in the dashboard.',

  jaCadastradoSelo: 'Account active',
  jaCadastradoTitulo: 'You already have an account',
  nomeRotulo: 'Name provided',

  irAoPainel: 'Go to the dashboard',
  verOportunidades: 'See opportunities',
  verBiblioteca: 'See the library',
} as const;
