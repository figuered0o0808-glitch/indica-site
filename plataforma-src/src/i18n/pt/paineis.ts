/**
 * Strings do painel: a area de trabalho de quem tem cadastro, com as
 * candidaturas enviadas e os cursos.
 *
 * Enquanto o cadastro estiver fechado, a pagina usa o bloco `fechado`.
 *
 * Sem travessao, sem emoji, sem exclamacao. Tratamento por "voce".
 */
export const paineis = {
  olho: 'Painel',
  titulo: 'Meu painel',
  verOportunidades: 'Ver oportunidades',
  verBiblioteca: 'Ver a biblioteca',

  fechado: {
    titulo: 'O painel abre junto com o cadastro',
    descricao: 'Ele reúne suas candidaturas às chamadas. As publicações ficam disponíveis na biblioteca, sem cadastro.',
  },

  resumo: {
    enviadas: 'Candidaturas enviadas',
    emAvaliacao: 'Em avaliação',
    aprovadas: 'Aprovadas',
    cursos: 'Cursos registrados',
  },
  candidaturasTitulo: 'Minhas candidaturas',
  candidaturasVazio: 'Nenhuma candidatura enviada.',
  totalSolicitado: 'Total solicitado',
  colunas: {
    edital: 'Chamada',
    projeto: 'Projeto',
    valor: 'Valor solicitado',
    enviada: 'Enviada em',
    situacao: 'Situação',
  },
  cursosTitulo: 'Meus cursos',
  cursosVazio: 'Nenhum curso registrado.',
  cursoProgresso: 'Andamento',
  cursoModulos: 'módulos',
  cursoInscricaoLocal: 'Inscrição registrada neste navegador.',
  convite: {
    titulo: 'O painel é de quem tem cadastro',
    acao: 'Criar cadastro',
  },
} as const;
