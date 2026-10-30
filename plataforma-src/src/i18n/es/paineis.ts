/**
 * Strings do painel, em espanhol: a area de trabalho de quem tem cadastro,
 * com as candidaturas enviadas e os cursos.
 *
 * Enquanto o cadastro estiver fechado, a pagina usa o bloco `fechado`.
 *
 * Sem travessao, sem emoji, sem exclamacao. Tratamento por "tu".
 */
export const paineis = {
  olho: 'Panel',
  titulo: 'Mi panel',
  verOportunidades: 'Ver oportunidades',
  verBiblioteca: 'Ver la biblioteca',

  fechado: {
    titulo: 'El panel abre junto con el registro',
    descricao: 'Reúne tus postulaciones a las convocatorias. Las publicaciones están disponibles en la biblioteca, sin cuenta.',
  },

  resumo: {
    enviadas: 'Postulaciones enviadas',
    emAvaliacao: 'En evaluación',
    aprovadas: 'Aprobadas',
    cursos: 'Cursos registrados',
  },
  candidaturasTitulo: 'Mis postulaciones',
  candidaturasVazio: 'Ninguna postulación enviada.',
  totalSolicitado: 'Total solicitado',
  colunas: {
    edital: 'Convocatoria',
    projeto: 'Proyecto',
    valor: 'Monto solicitado',
    enviada: 'Enviada el',
    situacao: 'Situación',
  },
  cursosTitulo: 'Mis cursos',
  cursosVazio: 'Ningún curso registrado.',
  cursoProgresso: 'Avance',
  cursoModulos: 'módulos',
  cursoInscricaoLocal: 'Inscripción registrada en este navegador.',
  convite: {
    titulo: 'El panel es de quien tiene cuenta',
    acao: 'Crear cuenta',
  },
} as const;
