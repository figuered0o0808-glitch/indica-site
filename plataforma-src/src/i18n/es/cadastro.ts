/**
 * Strings da pagina de cadastro, em espanhol. Publico unico: criadores.
 *
 * Dois estados, decididos em `cadastroAberto()`: sem chamada com inscricoes
 * abertas e sem curso com turma aberta vale o bloco `fechado`, que nao pede
 * dado nenhum; com conteudo publicado valem as demais chaves.
 */
export const cadastro = {
  olho: 'Registro',

  /** Acao do cabecalho do site quando o cadastro esta aberto. */
  entrar: 'Crear cuenta',

  fechado: {
    titulo: 'El registro abre cuando las convocatorias aceptan postulaciones',
    descricao:
      'Sirve para postularse a las convocatorias abiertas. Es gratuito y no exige un número mínimo de seguidores. Las publicaciones se pueden leer sin cuenta.',
  },

  titulo: 'Crear tu cuenta',
  descricao: 'Gratuito y sin exigencia de un número mínimo de seguidores.',

  formularioTitulo: 'Tus datos',
  campos: {
    nome: 'Nombre',
    email: 'Correo',
    telefone: 'Teléfono',
    pais: 'País',
    cidade: 'Ciudad',
    uf: 'Estado',
    regiao: 'Estado o región',
  },
  telefoneAjuda: 'Con código de área. Fuera de Brasil, empieza por el código del país.',
  telefoneConfira: 'Revisa el número.',

  nichos: {
    titulo: 'Nichos en los que actúas',
    ajuda: 'Selecciona todos en los que publicas. El nicho no limita los temas que puedes proponer.',
    lista: [
      'Política',
      'Sociedad y Cultura',
      'Medio Ambiente',
      'Ciencia',
      'Humor',
      'Artes',
      'Educación',
      'Bienestar',
      'Viajes',
      'Deportes',
      'Religión',
    ] as readonly string[],
  },

  redes: {
    titulo: 'Tus redes',
    ajuda: 'Dónde publicas y qué tamaño tiene la audiencia en cada una.',
    plataforma: 'Plataforma',
    escolhaPlataforma: 'Elige',
    perfil: 'Perfil',
    perfilExemplo: '@tuperfil',
    seguidores: 'Seguidores',
    seguidoresExemplo: 'Solo números',
    /* Numera cada linha: no celular as tres colunas viram tres campos soltos. */
    rede: 'Red',
    acrescentar: 'Agregar red',
    remover: 'Quitar',
    /* Soma dos seguidores digitados, atualizada enquanto a pessoa preenche. */
    soma: 'Audiencia sumada',
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
      'Otra',
    ] as readonly string[],
  },
  acao: 'Crear cuenta',

  confirmacaoTitulo: 'Cuenta creada',
  confirmacaoTexto: 'Tus postulaciones a las convocatorias pasan a aparecer en el panel.',

  jaCadastradoSelo: 'Cuenta activa',
  jaCadastradoTitulo: 'Ya tienes cuenta',
  nomeRotulo: 'Nombre ingresado',

  irAoPainel: 'Ir al panel',
  verOportunidades: 'Ver oportunidades',
  verBiblioteca: 'Ver la biblioteca',
} as const;
