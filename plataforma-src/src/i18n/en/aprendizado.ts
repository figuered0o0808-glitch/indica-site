/** Strings da Biblioteca, em ingles: pagina indice, cursos e materiais tecnicos. */
export const aprendizado = {
  indice: {
    olho: 'Library',
    titulo: 'INDICA publications',
    /* So na etiqueta <meta>: a pagina nao repete o titulo em subtitulo. */
    descricao: 'INDICA articles and analyses on the influence market, with full texts in PDF.',
    materiaisTitulo: 'Publications',
    materiaisAcao: 'See all publications',
    cursosTitulo: 'Courses',
    cursosVazio: 'No course published.',
    /* Sem turma publicada, o que a pagina de cursos tem sao as condicoes. */
    cursosAcaoVazio: 'Enrollment terms',
    cursosAcao: 'See the courses',
    abertura: [
      {
        rotulo: 'Access',
        texto: 'Open reading, no account required.',
      },
      {
        rotulo: 'Languages',
        texto: 'Full texts in Portuguese and English.',
      },
    ],
  },
  cursos: {
    olho: 'Training',
    titulo: 'Courses',
    descricao: 'Courses published on the platform.',
    condicoesTitulo: 'Terms that apply to any class',
    condicoes: [
      {
        rotulo: 'Enrollment',
        texto: 'Done on the class page, by those who have an account on the platform.',
      },
      {
        rotulo: 'What the class publishes',
        texto:
          'Program by modules, duration, format, number of places and deadline, before enrollment opens.',
      },
    ],
    modulos: 'Modules',
    modulosTitulo: 'Course program',
    duracao: 'Duration',
    formato: 'Format',
    paraQuem: 'Who it is for',
    proximaTurma: 'Next class',
    inscricaoTitulo: 'Enrollment',
    inscricaoCadastro: 'Enrollment requires an account on the platform.',
    inscricaoAcaoCadastro: 'Create account',
    inscricaoNota: 'Enrollment is free.',
    irAoPainel: 'See in the dashboard',
    voltarCatalogo: 'See the courses',
    vazioTitulo: 'No course published',
    vazioAcao: 'See the publications',
  },
  materiais: {
    olho: 'Library',
    titulo: 'Publications',
    /* So na etiqueta <meta>. */
    descricao: 'INDICA articles and analyses on the influence market.',
    trilha: 'Track',
    trilhaCriadores: 'For creators',
    trilhaOrganizacoes: 'For organizations',
    trilhaCriadoresNota:
      'Betting advertising, influencer discourse and regulation of the influence market.',
    trilhaOrganizacoesNota:
      'Studies on the influence market, competition for attention and price formation.',
    autoria: 'Author',
    organizacao: 'Organization',
    tema: 'Topic',
    palavrasChave: 'Keywords',
    formato: 'Format',
    tempoLeitura: 'Read time',
    atualizadoEm: 'Updated on',
    sumario: 'In this publication',
    arquivosTitulo: 'Full text',
    arquivoTipo: 'PDF',
    /* O idioma sai do proprio arquivo publicado, ja escrito no idioma da pagina. */
    arquivoBaixarEm: 'Download in {idioma}',
    paginas: 'pages',
    /* Selo e nota so aparecem quando o material declara licenca. */
    licencaNota: 'Use and adaptation allowed with attribution.',
    voltarTrilha: 'Back to the track',
    leiaTambem: 'See also',
    maisDaOrganizacao: 'More from',
    mesmoTema: 'Same topic',
    vazioTitulo: 'No material published',
    vazioAcao: 'See the publications',
    /* Modelos de data: o acervo mostra a data em cada cartão e na ficha. */
    meses: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ],
    dataModelo: '{mes} {dia}, {ano}',
    dataCurtaModelo: '{mes}/{dia}/{ano}',
    /* Busca, filtros e ordenação do acervo. */
    acervo: {
      busca: 'Search',
      buscaDica: 'Title, author, organization, topic or keyword',
      ordem: 'View by',
      ordemAtualizacao: 'Updated',
      ordemTitulo: 'Title',
      ordemAno: 'Year',
      filtroTrilha: 'Track',
      filtroTema: 'Topic',
      filtroOrganizacao: 'Organization',
      filtroFormato: 'Format',
      tudo: 'All',
      contagemUm: 'material',
      contagemVarios: 'materials',
      de: 'of',
      limpar: 'Clear',
    },
  },
} as const;
