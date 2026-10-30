/**
 * Strings da aba de oportunidades, em espanhol: lista de chamadas, pagina de
 * cada chamada e bloco de resultado publicado.
 */
export const editais = {
  destaque: { orcamento: 'Presupuesto total', propostas: 'Propuestas previstas' },
  idiomasDocumento: { pt: 'Portugués', en: 'Inglés', es: 'Español' },
  consultaVagas: 'Previsión: de {min} a {max} propuestas.',
  consultaVagasFixas: 'Previsión: {n} propuestas.',

  valorAte: 'Hasta',
  consultaAviso: 'Convocatoria disponible para consulta. Se revisará el cronograma; esta página no recibe postulaciones.',
  consultaPrazoRotulo: 'Calendario',
  consultaPrazoValor: 'Según el documento original',
  consultaTitulo: 'Consultar la convocatoria',
  lerPdf: 'Leer la convocatoria completa (PDF)',
  idiomaDocumento: 'Idioma del documento:',
  paginasDocumento: 'págs.',

  termoEtapaResultado: 'resultado',
  faixaSeparador: 'a',
  listaTitulo: 'Oportunidades',

  resumoTitulo: 'Situación del ciclo',
  resumoRecursos: 'Recursos en las convocatorias abiertas',
  resumoApoiados: 'Proyectos apoyados en convocatorias cerradas',

  /* Estado da aba enquanto nenhuma chamada foi publicada. */
  semChamadaTitulo: 'Todavía no hay convocatoria abierta',
  semChamadaTexto:
    'La primera convocatoria trae el texto íntegro, los criterios de selección, el jurado y el plazo de inscripción.',
  prepararTitulo: 'Lo que puedes adelantar',
  prepararItens: [
    'Título y descripción del proyecto, con el enfoque y la cantidad de piezas',
    'Formato del contenido',
    'Monto solicitado y justificación de los costos',
    'Estimación de alcance y la base del cálculo',
    'Plan de distribución, con canales y periodicidad',
  ] as readonly string[],

  filtrosTitulo: 'Filtros',
  filtroStatus: 'Situación',
  filtroTipo: 'Tipo',
  filtroPublico: 'Público',
  todosPublicos: 'Todos los públicos',
  todasSituacoes: 'Todas',
  todosTipos: 'Todos',
  limparFiltros: 'Limpiar filtros',
  contagemUma: 'convocatoria',
  contagemVarias: 'convocatorias',
  vazioTitulo: 'Ninguna convocatoria con estos filtros',

  proponente: 'Proponente',
  proponenteProprio: 'Recursos propios del programa',
  numerosTitulo: 'Números de la convocatoria',
  nestaPagina: 'En esta página',
  voltarLista: 'Ver todas las convocatorias',
  verResultado: 'Ver el resultado',

  /* Chamada com calendario ainda em aberto: nenhuma data e escrita. */
  prazoADefinir: 'Plazo por definir',
  semPrazo: 'Por definir',
  semValor: 'A definir',

  secoes: {
    apresentacao: 'Presentación',
    escopo: 'Lo que se apoya',
    naoApoiado: 'Lo que no se apoya',
    criterios: 'Criterios de selección',
    banca: 'Jurado',
    distribuicao: 'Distribución de los apoyos',
    cronograma: 'Cronograma',
    resultado: 'Resultado',
  },

  pesoRotulo: 'Peso',
  somaPesos: 'Suma de los pesos',
  distribuicaoColunas: {
    faixa: 'Rango de apoyo',
    quantidade: 'Proyectos previstos',
    observacao: 'Observación',
  },

  publicadoEm: 'Publicado el',
  resultadoFundamentacao: 'Fundamentación de la decisión',
  resultadoTabelaTitulo: 'Proyectos seleccionados',
  resultadoColunas: {
    apoiado: 'Apoyado',
    projeto: 'Proyecto',
    formato: 'Formato',
    uf: 'Estado',
  },
  inscricoesRecebidas: 'Inscripciones recibidas',
  projetosApoiados: 'Proyectos apoyados',
  resultadoPublicadoEm: 'Resultado publicado el',
  inscricoesEncerradasEm: 'Inscripciones cerradas el',
  resultadoPrevistoPara: 'Resultado previsto para',

  /* Compartilhamento: o endereco fica escrito na pagina, sem script de rede. */
  compartilharTitulo: 'Compartir la convocatoria',
  copiarEndereco: 'Copiar dirección',
  enderecoCopiado: 'Dirección copiada.',

  candidaturaTitulo: 'Postulación',
  encerradaAviso: 'Las inscripciones están cerradas.',
  emAvaliacaoAviso:
    'Las inscripciones están cerradas y las propuestas están en evaluación por el jurado.',
} as const;
