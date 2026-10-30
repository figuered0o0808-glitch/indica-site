/**
 * Strings comuns da interface. Ponto unico para versao em ingles depois.
 * Nao usar travessao em nenhum texto. Sem emoji e sem exclamacao.
 */
export const comum = {
  navegacao: {
    principal: 'Navegação principal',
    agencia: 'Agência',
    inicioAgencia: 'Página inicial da agência INDICA',
    plataforma: 'Plataforma',
    editais: 'Oportunidades',
    biblioteca: 'Biblioteca',
    painel: 'Meu painel',
    pularParaConteudo: 'Ir para o conteúdo',
  },
  acoes: {
    candidatarProjeto: 'Candidatar projeto',
    verEdital: 'Ver chamada',
    verCurso: 'Ver curso',
    inscreverse: 'Inscrever-se',
    inscrito: 'Inscrição registrada',
    voltar: 'Voltar',
    avancar: 'Avançar',
    enviar: 'Enviar',
  },
  status: {
    consulta: 'Para consulta',
    aberta: 'Inscrições abertas',
    'em-avaliacao': 'Em avaliação',
    encerrada: 'Encerrada',
    aprovada: 'Aprovada',
    'nao-selecionada': 'Não selecionada',
    enviada: 'Enviada',
    concluido: 'Concluído',
    inscrito: 'Inscrito',
    'em-andamento': 'Em andamento',
    aberto: 'Turma aberta',
    'em-breve': 'Em breve',
  },
  publicoEdital: {
    criadores: 'Para criadores',
    organizacoes: 'Para organizações',
    ambos: 'Para criadores e organizações',
  },
  tiposEdital: {
    'tema-amplo': 'Tema amplo',
    macrotema: 'Macrotema de financiador',
    'pauta-especifica': 'Pauta específica',
    'edital-organizacao': 'Chamada de organização',
  },
  rotulos: {
    idioma: 'Idioma',
    busca: 'Buscar',
    resultado: 'Resultado',
    prazo: 'Prazo',
    valor: 'Valor',
    valorTotal: 'Recursos da chamada',
    apoio: 'Apoio por projeto',
    inscricoesAte: 'Inscrições até',
    obrigatorio: 'Campo obrigatório',
    opcional: 'opcional',
    nenhumResultado: 'Nenhum resultado',
  },
  naoEncontrado: {
    titulo: 'Página não encontrada',
    texto: 'O endereço que você abriu não existe neste site.',
    acao: 'Voltar ao início',
  },
  rodape: {
    descricao:
      'Plataforma da INDICA. Editais, publicações e materiais abertos para criadores e organizações.',
    programa: 'Uma iniciativa da',
    navegue: 'Navegue',
    voltarAgencia: 'Voltar à agência',
  },
} as const;
