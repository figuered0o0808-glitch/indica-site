/**
 * Strings do painel, em ingles: a area de trabalho de quem tem cadastro, com
 * as candidaturas enviadas e os cursos.
 *
 * Enquanto o cadastro estiver fechado, a pagina usa o bloco `fechado`.
 *
 * Sem travessao, sem emoji, sem exclamacao. Tratamento por "you".
 */
export const paineis = {
  olho: 'Dashboard',
  titulo: 'My dashboard',
  verOportunidades: 'See opportunities',
  verBiblioteca: 'See the library',

  fechado: {
    titulo: 'The dashboard opens together with sign-up',
    descricao: 'It brings together your applications to calls. Publications are available in the library without an account.',
  },

  resumo: {
    enviadas: 'Applications submitted',
    emAvaliacao: 'Under review',
    aprovadas: 'Approved',
    cursos: 'Courses recorded',
  },
  candidaturasTitulo: 'My applications',
  candidaturasVazio: 'No application submitted.',
  totalSolicitado: 'Total requested',
  colunas: {
    edital: 'Call',
    projeto: 'Project',
    valor: 'Amount requested',
    enviada: 'Submitted on',
    situacao: 'Status',
  },
  cursosTitulo: 'My courses',
  cursosVazio: 'No course recorded.',
  cursoProgresso: 'Progress',
  cursoModulos: 'modules',
  cursoInscricaoLocal: 'Enrollment recorded in this browser.',
  convite: {
    titulo: 'The dashboard is for those who have an account',
    acao: 'Create account',
  },
} as const;
