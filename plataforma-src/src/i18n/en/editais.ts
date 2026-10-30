/**
 * Strings da aba de oportunidades, em ingles: lista de chamadas, pagina de
 * cada chamada e bloco de resultado publicado.
 */
export const editais = {
  destaque: { orcamento: 'Total budget', propostas: 'Proposals expected' },
  idiomasDocumento: { pt: 'Portuguese', en: 'English', es: 'Spanish' },
  consultaVagas: 'Expected: {min} to {max} proposals.',
  consultaVagasFixas: 'Expected: {n} proposals.',

  valorAte: 'Up to',
  consultaAviso: 'This call is available for reference. Its schedule will be reviewed; this page does not accept applications.',
  consultaPrazoRotulo: 'Schedule',
  consultaPrazoValor: 'As stated in the original document',
  consultaTitulo: 'Read the call',
  lerPdf: 'Read the full call (PDF)',
  idiomaDocumento: 'Document language:',
  paginasDocumento: 'pages',

  termoEtapaResultado: 'result',
  faixaSeparador: 'to',
  listaTitulo: 'Opportunities',

  resumoTitulo: 'Cycle status',
  resumoRecursos: 'Funding in the open calls',
  resumoApoiados: 'Projects supported in closed calls',

  /* Estado da aba enquanto nenhuma chamada foi publicada. */
  semChamadaTitulo: 'No call is open yet',
  semChamadaTexto:
    'The first call brings the full text, the selection criteria, the panel and the application deadline.',
  prepararTitulo: 'What you can prepare ahead',
  prepararItens: [
    'Project title and description, with the approach and the number of pieces',
    'Content format',
    'Amount requested and justification of the costs',
    'Reach estimate and the basis for the calculation',
    'Distribution plan, with channels and frequency',
  ],

  filtrosTitulo: 'Filters',
  filtroStatus: 'Status',
  filtroTipo: 'Type',
  filtroPublico: 'Audience',
  todosPublicos: 'All audiences',
  todasSituacoes: 'All',
  todosTipos: 'All',
  limparFiltros: 'Clear filters',
  contagemUma: 'call',
  contagemVarias: 'calls',
  vazioTitulo: 'No call matches these filters',

  proponente: 'Run by',
  proponenteProprio: 'Run by the program',
  numerosTitulo: 'Call figures',
  nestaPagina: 'On this page',
  voltarLista: 'See all calls',
  verResultado: 'See the result',

  /* Chamada com calendario ainda em aberto: nenhuma data e escrita. */
  prazoADefinir: 'Deadline to be defined',
  semPrazo: 'To be defined',
  semValor: 'To be defined',

  secoes: {
    apresentacao: 'Overview',
    escopo: 'What is supported',
    naoApoiado: 'What is not supported',
    criterios: 'Selection criteria',
    banca: 'Panel',
    distribuicao: 'Distribution of the support',
    cronograma: 'Schedule',
    resultado: 'Result',
  },

  pesoRotulo: 'Weight',
  somaPesos: 'Sum of the weights',
  distribuicaoColunas: {
    faixa: 'Support range',
    quantidade: 'Projects expected',
    observacao: 'Note',
  },

  publicadoEm: 'Published on',
  resultadoFundamentacao: 'Grounds for the decision',
  resultadoTabelaTitulo: 'Selected projects',
  resultadoColunas: {
    apoiado: 'Recipient',
    projeto: 'Project',
    formato: 'Format',
    uf: 'State',
  },
  inscricoesRecebidas: 'Applications received',
  projetosApoiados: 'Projects supported',
  resultadoPublicadoEm: 'Result published on',
  inscricoesEncerradasEm: 'Applications closed on',
  resultadoPrevistoPara: 'Result expected for',

  /* Compartilhamento: o endereco fica escrito na pagina, sem script de rede. */
  compartilharTitulo: 'Share this call',
  copiarEndereco: 'Copy address',
  enderecoCopiado: 'Address copied.',

  candidaturaTitulo: 'Application',
  encerradaAviso: 'Applications are closed.',
  emAvaliacaoAviso:
    'Applications are closed and the proposals are under review by the panel.',
} as const;
