/** Strings da Biblioteca, em espanhol: pagina indice, cursos e materiais. */
export const aprendizado = {
  indice: {
    olho: 'Biblioteca',
    titulo: 'Publicaciones de INDICA',
    /* So na etiqueta <meta>: a pagina nao repete o titulo em subtitulo. */
    descricao: 'Artículos y análisis de INDICA sobre el mercado de influencia, con textos completos en PDF.',
    materiaisTitulo: 'Publicaciones',
    materiaisAcao: 'Ver todas las publicaciones',
    cursosTitulo: 'Cursos',
    cursosVazio: 'Ningún curso publicado.',
    /* Sem turma publicada, o que a pagina de cursos tem sao as condicoes. */
    cursosAcaoVazio: 'Condiciones de inscripción',
    cursosAcao: 'Ver los cursos',
    abertura: [
      {
        rotulo: 'Acceso',
        texto: 'Lectura libre, sin cuenta.',
      },
      {
        rotulo: 'Idiomas',
        texto: 'Textos completos en portugués e inglés.',
      },
    ],
  },
  cursos: {
    olho: 'Formación',
    titulo: 'Cursos',
    descricao: 'Cursos publicados en la plataforma.',
    condicoesTitulo: 'Condiciones que valen para cualquier grupo',
    condicoes: [
      {
        rotulo: 'Inscripción',
        texto: 'Se hace en la página del grupo, por quien tiene cuenta en la plataforma.',
      },
      {
        rotulo: 'Lo que el grupo publica',
        texto:
          'Programa por módulos, duración, formato, número de cupos y plazo, antes de abrir las inscripciones.',
      },
    ],
    modulos: 'Módulos',
    modulosTitulo: 'Programa del curso',
    duracao: 'Duración',
    formato: 'Formato',
    paraQuem: 'Para quién',
    proximaTurma: 'Próximo grupo',
    inscricaoTitulo: 'Inscripción',
    inscricaoCadastro: 'La inscripción exige cuenta en la plataforma.',
    inscricaoAcaoCadastro: 'Crear cuenta',
    inscricaoNota: 'La inscripción es gratuita.',
    irAoPainel: 'Ver en el panel',
    voltarCatalogo: 'Ver los cursos',
    vazioTitulo: 'Ningún curso publicado',
    vazioAcao: 'Ver las publicaciones',
  },
  materiais: {
    olho: 'Biblioteca',
    titulo: 'Publicaciones',
    /* So na etiqueta <meta>. */
    descricao: 'Artículos y análisis de INDICA sobre el mercado de influencia.',
    trilha: 'Ruta',
    trilhaCriadores: 'Para creadores',
    trilhaOrganizacoes: 'Para organizaciones',
    trilhaCriadoresNota:
      'Publicidad de apuestas, discursos de influenciadores y regulación del mercado de influencia.',
    trilhaOrganizacoesNota:
      'Estudios sobre el mercado de influencia, la disputa por la atención y la formación de precios.',
    autoria: 'Autoría',
    organizacao: 'Organización',
    tema: 'Tema',
    palavrasChave: 'Palabras clave',
    formato: 'Formato',
    tempoLeitura: 'Lectura',
    atualizadoEm: 'Actualizado el',
    sumario: 'En esta publicación',
    arquivosTitulo: 'Texto completo',
    arquivoTipo: 'PDF',
    /* O idioma sai do proprio arquivo publicado, ja escrito no idioma da pagina. */
    arquivoBaixarEm: 'Descargar en {idioma}',
    paginas: 'páginas',
    /* Selo e nota so aparecem quando o material declara licenca. */
    licencaNota: 'Uso y adaptación permitidos con atribución.',
    voltarTrilha: 'Volver a la ruta',
    leiaTambem: 'Lee también',
    maisDaOrganizacao: 'Más de',
    mesmoTema: 'Mismo tema',
    vazioTitulo: 'Ningún material publicado',
    vazioAcao: 'Ver las publicaciones',
    /* Modelos de data: o acervo mostra a data em cada cartão e na ficha. */
    meses: [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
    ],
    dataModelo: '{dia} de {mes} de {ano}',
    dataCurtaModelo: '{dia}/{mes}/{ano}',
    /* Busca, filtros e ordenação do acervo. */
    acervo: {
      busca: 'Búsqueda',
      buscaDica: 'Título, autoría, organización, tema o palabra clave',
      ordem: 'Ver por',
      ordemAtualizacao: 'Actualización',
      ordemTitulo: 'Título',
      ordemAno: 'Año',
      filtroTrilha: 'Ruta',
      filtroTema: 'Tema',
      filtroOrganizacao: 'Organización',
      filtroFormato: 'Formato',
      tudo: 'Todo',
      contagemUm: 'material',
      contagemVarios: 'materiales',
      de: 'de',
      limpar: 'Limpiar',
    },
  },
} as const;
