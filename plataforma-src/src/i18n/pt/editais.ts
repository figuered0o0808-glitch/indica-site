/**
 * Strings da aba de oportunidades: lista de chamadas, pagina de cada chamada
 * e bloco de resultado publicado.
 */
export const editais = {
  destaque: { orcamento: 'Orçamento total', propostas: 'Propostas previstas' },
  idiomasDocumento: { pt: 'Português', en: 'Inglês', es: 'Espanhol' },
  consultaVagas: 'Previsão: {min} a {max} propostas.',
  consultaVagasFixas: 'Previsão: {n} propostas.',

  valorAte: 'Até',
  consultaAviso: 'Edital disponível para consulta. O cronograma será revisado; esta página não recebe candidaturas.',
  consultaPrazoRotulo: 'Calendário',
  consultaPrazoValor: 'Conforme o documento original',
  consultaTitulo: 'Consultar edital',
  lerPdf: 'Ler edital completo (PDF)',
  idiomaDocumento: 'Idioma do documento:',
  paginasDocumento: 'págs.',

  listaTitulo: 'Oportunidades',

  resumoTitulo: 'Situação do ciclo',
  resumoRecursos: 'Recursos nas chamadas abertas',
  resumoApoiados: 'Projetos apoiados em chamadas encerradas',

  /* Estado da aba enquanto nenhuma chamada foi publicada. */
  semChamadaTitulo: 'Ainda não há chamada aberta',
  semChamadaTexto:
    'A primeira chamada traz o texto integral, os critérios de seleção, a banca e o prazo de inscrição.',
  prepararTitulo: 'O que você pode adiantar',
  prepararItens: [
    'Título e descrição do projeto, com a abordagem e a quantidade de peças',
    'Formato do conteúdo',
    'Valor solicitado e justificativa dos custos',
    'Estimativa de alcance e a base do cálculo',
    'Plano de distribuição, com canais e periodicidade',
  ],

  filtrosTitulo: 'Filtros',
  filtroStatus: 'Situação',
  filtroTipo: 'Tipo',
  filtroPublico: 'Público',
  todosPublicos: 'Todos os públicos',
  todasSituacoes: 'Todas',
  todosTipos: 'Todos',
  limparFiltros: 'Limpar filtros',
  contagemUma: 'chamada',
  contagemVarias: 'chamadas',
  vazioTitulo: 'Nenhuma chamada com esses filtros',

  proponente: 'Proponente',
  proponenteProprio: 'Recursos próprios do programa',
  numerosTitulo: 'Números da chamada',
  nestaPagina: 'Nesta página',
  voltarLista: 'Ver todas as chamadas',
  verResultado: 'Ver o resultado',

  /* Chamada com calendario ainda em aberto: nenhuma data e escrita. */
  prazoADefinir: 'Prazo a definir',
  semPrazo: 'A definir',
  semValor: 'A definir',

  /* Liga os dois extremos de uma faixa de valor: 5.000 a 20.000. */
  faixaSeparador: 'a',

  secoes: {
    apresentacao: 'Apresentação',
    escopo: 'O que é apoiado',
    naoApoiado: 'O que não é apoiado',
    criterios: 'Critérios de seleção',
    banca: 'Banca',
    distribuicao: 'Distribuição dos apoios',
    cronograma: 'Cronograma',
    resultado: 'Resultado',
  },

  pesoRotulo: 'Peso',
  somaPesos: 'Soma dos pesos',
  distribuicaoColunas: {
    faixa: 'Faixa de apoio',
    quantidade: 'Projetos previstos',
    observacao: 'Observação',
  },

  publicadoEm: 'Publicado em',
  resultadoFundamentacao: 'Fundamentação da decisão',
  resultadoTabelaTitulo: 'Projetos selecionados',
  resultadoColunas: {
    apoiado: 'Apoiado',
    projeto: 'Projeto',
    formato: 'Formato',
    uf: 'UF',
  },
  inscricoesRecebidas: 'Inscrições recebidas',
  projetosApoiados: 'Projetos apoiados',
  resultadoPublicadoEm: 'Resultado publicado em',
  inscricoesEncerradasEm: 'Inscrições encerradas em',
  resultadoPrevistoPara: 'Resultado previsto para',
  /*
   * Nao aparece na tela: e o termo procurado no nome das etapas do cronograma
   * para achar a divulgacao do resultado. Em minusculas, no idioma dos dados.
   */
  termoEtapaResultado: 'resultado',

  /* Compartilhamento: o endereco fica escrito na pagina, sem script de rede. */
  compartilharTitulo: 'Compartilhar a chamada',
  copiarEndereco: 'Copiar endereço',
  enderecoCopiado: 'Endereço copiado.',

  candidaturaTitulo: 'Candidatura',
  encerradaAviso: 'As inscrições estão encerradas.',
  emAvaliacaoAviso:
    'As inscrições estão encerradas e as propostas estão em avaliação pela banca.',
} as const;
