/**
 * Strings da home, em espanhol. Duas areas apenas: oportunidades e biblioteca.
 *
 * A home tem dois estados. Antes da primeira publicacao, valem as chaves de
 * "inicio". Quando houver chamada, curso ou material publicado, voltam a
 * valer as chaves de entrada, colunas, numeros, chamadas e biblioteca.
 */
export const home = {
  marca: 'Plataforma de creadores',
  frase: 'Un laboratorio de creadores para el interés público.',
  introducao: 'Convocatorias, conexiones y conocimiento para quienes crean.',
  caminhos: {
    rotulo: 'Explora la plataforma',
    oportunidades: 'Explorar oportunidades',
    oportunidadesTexto: 'Conoce las convocatorias y encuentra tu proyecto.',
    cadastro: 'Crear mi cuenta',
    cadastroTexto: 'Cuenta gratuita para personas físicas y jurídicas.',
    edital: 'Consultar la convocatoria',
    editalTexto: 'Lee los criterios, presupuesto y calendario.',
    painel: 'Acceder a mi panel',
    painelTexto: 'Sigue tu participación en la plataforma.',
    biblioteca: 'Abrir la biblioteca',
    bibliotecaTexto: 'Artículos, guías y referencias para crear.',
  },
  documento: {
    olho: 'Documento original',
    titulo: 'La convocatoria completa, en PDF.',
    texto: 'Consulta las reglas de participación, presupuesto, criterios y briefing en el documento original de INDICA.',
  },
  apresentacao:
    'El programa financia proyectos de creadores de contenido sobre ciencia, clima, medio ambiente, salud pública y democracia. La propuesta es del creador, y la decisión editorial también.',

  /* Caminho de entrada quando já existe conteúdo publicado. */
  entrarPrincipal: 'Crear cuenta',
  entrarPainel: 'Ir al panel',
  entrarSecundario: 'Ver convocatorias abiertas',

  /* Caminho de entrada enquanto nada foi publicado. */
  inicioAcao: 'Ver oportunidades',
  inicioAcaoAreas: 'Ver la biblioteca',
  inicioNota: 'Ninguna convocatoria abierta.',

  /* La home nueva: el enjambre es la puerta, las columnas son la casa. */
  ponte: 'Abierta ahora · Registro · Biblioteca',
  coluna: {
    apoio: 'Apoyo por proyecto',
    proponente: 'Proponente',
    vagas: 'Plazas',
    vagasFaixa: 'De {min} a {max} proyectos apoyados.',
    vagasSelecionados: '{n} seleccionados, {r} plazas abiertas.',
    vagasApoiados: '{n} proyectos apoyados.',
    verChamada: 'Ver la convocatoria',
    semChamada: 'Ninguna convocatoria abierta por ahora.',
    verOportunidades: 'Ver oportunidades',
    cadastroOlho: 'Registro',
    cadastroTitulo: 'Tu cuenta en la plataforma',
    cadastroTexto: 'Registro gratuito para personas físicas y jurídicas. Participar en el banco de creadores es opcional.',
    cadastroCampos: ['Nombre', 'Correo', 'Teléfono', 'País', 'Tipo de registro'],
    cadastroAcao: 'Crear cuenta',
    semMaterial: 'Ningún material publicado todavía.',
    anterior: 'Anterior',
    proximo: 'Siguiente',
    posicao: '{n} de {total}',
    pausar: 'Pausar',
    continuar: 'Continuar',
    carrossel: 'carrusel',
  },

  numeros: {
    recursos: 'En convocatorias abiertas',
    chamadas: 'Convocatorias con inscripción abierta',
    cursos: 'Cursos en el catálogo',
    materiais: 'Materiales publicados',
  },

  chamadasTitulo: 'Convocatorias',

  recursosTitulo: 'Biblioteca',
  recursosAcao: 'Abrir la biblioteca',
  cursoModulos: 'módulos',
  materiaisAcao: 'Ver materiales',
} as const;
