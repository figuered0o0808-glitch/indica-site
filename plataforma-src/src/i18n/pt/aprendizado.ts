/** Strings da Biblioteca: pagina indice, cursos e materiais tecnicos. */
export const aprendizado = {
  indice: {
    olho: 'Biblioteca',
    titulo: 'Artigos, materiais e cursos',
    descricao: 'Para influenciadores e para quem quer entender o mercado de influência.',
    materiaisTitulo: 'Materiais',
    materiaisAcao: 'Ver todos os materiais',
    cursosTitulo: 'Cursos',
    cursosVazio: 'Nenhum curso publicado.',
    /* Sem turma publicada, o que a pagina de cursos tem sao as condicoes. */
    cursosAcaoVazio: 'Condições de inscrição',
    cursosAcao: 'Ver os cursos',
    abertura: [
      {
        rotulo: 'Acesso',
        texto: 'Leitura livre, sem cadastro.',
      },
      {
        rotulo: 'Idiomas',
        texto: 'Textos completos em português e inglês.',
      },
    ],
  },
  cursos: {
    olho: 'Formação',
    titulo: 'Cursos',
    descricao: 'Cursos publicados na plataforma.',
    condicoesTitulo: 'Condições que valem para qualquer turma',
    condicoes: [
      {
        rotulo: 'Inscrição',
        texto: 'Feita na página da turma, por quem tem cadastro na plataforma.',
      },
      {
        rotulo: 'O que a turma publica',
        texto:
          'Programa por módulos, duração, formato, número de vagas e prazo, antes de abrir as inscrições.',
      },
    ],
    modulos: 'Módulos',
    modulosTitulo: 'Programa do curso',
    duracao: 'Duração',
    formato: 'Formato',
    paraQuem: 'Para quem',
    proximaTurma: 'Próxima turma',
    inscricaoTitulo: 'Inscrição',
    inscricaoCadastro: 'A inscrição exige cadastro na plataforma.',
    inscricaoAcaoCadastro: 'Criar cadastro',
    inscricaoNota: 'A inscrição é gratuita.',
    irAoPainel: 'Ver no painel',
    voltarCatalogo: 'Ver os cursos',
    vazioTitulo: 'Nenhum curso publicado',
    vazioAcao: 'Explorar a biblioteca',
  },
  materiais: {
    olho: 'Biblioteca',
    titulo: 'Materiais',
    /* So na etiqueta <meta>. */
    descricao: 'Um acervo para reunir artigos, guias e referências de diferentes autores e organizações.',
    trilha: 'Trilha',
    trilhaCriadores: 'Para criadores',
    trilhaOrganizacoes: 'Para organizações',
    trilhaCriadoresNota:
      'Publicidade de bets, discursos de influenciadores e regulação do mercado de influência.',
    trilhaOrganizacoesNota:
      'Estudos sobre o mercado de influência, a disputa por atenção e a formação de preços.',
    autoria: 'Autoria',
    organizacao: 'Organização',
    tema: 'Tema',
    palavrasChave: 'Palavras-chave',
    formato: 'Formato',
    tempoLeitura: 'Leitura',
    atualizadoEm: 'Atualizado em',
    sumario: 'Nesta publicação',
    arquivosTitulo: 'Texto completo',
    arquivoTipo: 'PDF',
    /* O idioma sai do proprio arquivo publicado, ja escrito no idioma da pagina. */
    arquivoBaixarEm: 'Baixar em {idioma}',
    paginas: 'páginas',
    /* Selo e nota so aparecem quando o material declara licenca. */
    licencaNota: 'Uso e adaptação permitidos com atribuição.',
    voltarTrilha: 'Voltar para a trilha',
    leiaTambem: 'Leia também',
    maisDaOrganizacao: 'Mais de',
    mesmoTema: 'Mesmo tema',
    vazioTitulo: 'Nenhum material publicado',
    vazioAcao: 'Explorar a biblioteca',
    /* Modelos de data: o acervo mostra a data em cada cartão e na ficha. */
    meses: [
      'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
      'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
    ],
    dataModelo: '{dia} de {mes} de {ano}',
    dataCurtaModelo: '{dia}/{mes}/{ano}',
    /* Busca, filtros e ordenação do acervo. */
    acervo: {
      busca: 'Busca',
      buscaDica: 'Título, autoria, organização, tema ou palavra-chave',
      ordem: 'Ver por',
      ordemAtualizacao: 'Atualização',
      ordemTitulo: 'Título',
      ordemAno: 'Ano',
      filtroTrilha: 'Trilha',
      filtroTema: 'Tema',
      filtroOrganizacao: 'Organização',
      filtroFormato: 'Formato',
      tudo: 'Tudo',
      contagemUm: 'material',
      contagemVarios: 'materiais',
      de: 'de',
      limpar: 'Limpar',
    },
  },
} as const;
