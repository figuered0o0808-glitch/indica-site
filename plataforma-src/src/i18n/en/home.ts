/**
 * Strings da home, em ingles. Duas areas apenas: oportunidades e biblioteca.
 *
 * A home tem dois estados. Antes da primeira publicacao, valem as chaves de
 * "inicio". Quando houver chamada, curso ou material publicado, voltam a
 * valer as chaves de entrada, colunas, numeros, chamadas e biblioteca.
 */
export const home = {
  marca: 'Creator platform',
  frase: 'A creator lab for the public interest.',
  introducao: 'Calls, connections and knowledge for people who create.',
  caminhos: {
    rotulo: 'Explore the platform',
    oportunidades: 'Explore opportunities',
    oportunidadesTexto: 'Browse open calls and find your project.',
    cadastro: 'Create my account',
    cadastroTexto: 'A free account for individuals and organizations.',
    edital: 'Read the call',
    editalTexto: 'See the criteria, budget and schedule.',
    painel: 'Open my dashboard',
    painelTexto: 'Follow your participation on the platform.',
    biblioteca: 'Open the library',
    bibliotecaTexto: 'Articles, guides and references for creators.',
  },
  documento: {
    olho: 'Original document',
    titulo: 'The full call, as a PDF.',
    texto: 'Read the participation rules, budget, criteria and campaign brief in the original INDICA document.',
  },
  apresentacao:
    'The program funds content creator projects on science, climate, environment, public health and democracy. The proposal belongs to the creator, and so does the editorial decision.',

  /* Caminho de entrada quando ja existe conteudo publicado. */
  entrarPrincipal: 'Create account',
  entrarPainel: 'Go to the dashboard',
  entrarSecundario: 'See open calls',

  /* Caminho de entrada enquanto nada foi publicado. */
  inicioAcao: 'See opportunities',
  inicioAcaoAreas: 'See the library',
  inicioNota: 'No open calls.',

  /* The new home: the swarm is the door, the columns are the house. */
  ponte: 'Open now · Sign up · Library',
  coluna: {
    apoio: 'Support per project',
    proponente: 'Run by',
    vagas: 'Places',
    vagasFaixa: '{min} to {max} projects supported.',
    vagasSelecionados: '{n} selected, {r} places open.',
    vagasApoiados: '{n} projects supported.',
    verChamada: 'See the call',
    semChamada: 'No call open at the moment.',
    verOportunidades: 'See opportunities',
    cadastroOlho: 'Sign up',
    cadastroTitulo: 'Your platform account',
    cadastroTexto: 'Free accounts for individuals and organizations. Joining the creator database is optional.',
    cadastroCampos: ['Name', 'Email', 'Phone', 'Country', 'Account type'],
    cadastroAcao: 'Create account',
    semMaterial: 'No material published yet.',
    anterior: 'Previous',
    proximo: 'Next',
    posicao: '{n} of {total}',
    pausar: 'Pause',
    continuar: 'Resume',
    carrossel: 'carousel',
  },

  numeros: {
    recursos: 'In open calls',
    chamadas: 'Calls open for applications',
    cursos: 'Courses in the catalog',
    materiais: 'Materials published',
  },

  chamadasTitulo: 'Calls',

  recursosTitulo: 'Library',
  recursosAcao: 'Open the library',
  cursoModulos: 'modules',
  materiaisAcao: 'See materials',
} as const;
