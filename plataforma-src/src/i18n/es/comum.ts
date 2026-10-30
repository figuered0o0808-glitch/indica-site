/**
 * Strings comuns da interface, em espanhol. Mesmas chaves do portugues.
 * Nao usar travessao em nenhum texto. Sem emoji e sem exclamacao.
 */
export const comum = {
  navegacao: {
    principal: 'Navegación principal',
    agencia: 'Agencia',
    inicioAgencia: 'Página de inicio de la agencia INDICA',
    plataforma: 'Plataforma',
    editais: 'Oportunidades',
    biblioteca: 'Biblioteca',
    painel: 'Mi panel',
    pularParaConteudo: 'Ir al contenido',
  },
  acoes: {
    candidatarProjeto: 'Postular proyecto',
    verEdital: 'Ver convocatoria',
    verCurso: 'Ver curso',
    inscreverse: 'Inscribirse',
    inscrito: 'Inscripción registrada',
    voltar: 'Volver',
    avancar: 'Avanzar',
    enviar: 'Enviar',
  },
  status: {
    consulta: 'Para consulta',
    aberta: 'Inscripciones abiertas',
    'em-avaliacao': 'En evaluación',
    encerrada: 'Cerrada',
    aprovada: 'Aprobada',
    'nao-selecionada': 'No seleccionada',
    enviada: 'Enviada',
    concluido: 'Concluido',
    inscrito: 'Inscrito',
    'em-andamento': 'En curso',
    aberto: 'Grupo abierto',
    'em-breve': 'Próximamente',
  },
  publicoEdital: {
    criadores: 'Para creadores',
    organizacoes: 'Para organizaciones',
    ambos: 'Para creadores y organizaciones',
  },
  tiposEdital: {
    'tema-amplo': 'Tema amplio',
    macrotema: 'Macrotema de financiador',
    'pauta-especifica': 'Tema específico',
    'edital-organizacao': 'Convocatoria de organización',
  },
  rotulos: {
    idioma: 'Idioma',
    busca: 'Buscar',
    resultado: 'Resultado',
    prazo: 'Plazo',
    valor: 'Monto',
    valorTotal: 'Recursos de la convocatoria',
    apoio: 'Apoyo por proyecto',
    inscricoesAte: 'Inscripciones hasta',
    obrigatorio: 'Campo obligatorio',
    opcional: 'opcional',
    nenhumResultado: 'Sin resultados',
  },
  naoEncontrado: {
    titulo: 'Página no encontrada',
    texto: 'La dirección que abriste no existe en este sitio.',
    acao: 'Volver al inicio',
  },
  rodape: {
    descricao:
      'Plataforma de INDICA. Convocatorias, publicaciones y materiales abiertos para creadores y organizaciones.',
    programa: 'Una iniciativa de',
    navegue: 'Navegación',
    voltarAgencia: 'Volver a la agencia',
  },
} as const;
