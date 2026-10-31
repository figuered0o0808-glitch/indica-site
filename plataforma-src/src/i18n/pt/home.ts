/**
 * Strings da home. Duas areas apenas: oportunidades e biblioteca.
 *
 * A home tem dois estados. Antes da primeira publicacao, valem as chaves de
 * "inicio". Quando houver chamada, curso ou material publicado, voltam a
 * valer as chaves de entrada, colunas, numeros, chamadas e biblioteca.
 */
export const home = {
  marca: 'Plataforma de criadores',
  frase: 'Um laboratório de criadores para o interesse público.',
  introducao: 'Chamadas, conexões e conhecimento para quem cria.',
  caminhos: {
    rotulo: 'Caminhos da plataforma',
    oportunidades: 'Explorar oportunidades',
    oportunidadesTexto: 'Conheça as chamadas e encontre seu projeto.',
    cadastro: 'Criar minha conta',
    cadastroTexto: 'Conta gratuita para pessoas físicas e jurídicas.',
    edital: 'Consultar o edital',
    editalTexto: 'Leia os critérios, valores e cronograma.',
    painel: 'Acessar meu painel',
    painelTexto: 'Acompanhe sua participação na plataforma.',
    biblioteca: 'Abrir a biblioteca',
    bibliotecaTexto: 'Artigos, guias e referências para criar.',
  },
  documento: {
    olho: 'Documento original',
    titulo: 'O edital completo, em PDF.',
    texto: 'Consulte as regras de participação, o orçamento, os critérios e o briefing no documento original da INDICA.',
  },
  apresentacao:
    'O programa financia projetos de criadores de conteúdo sobre ciência, clima, meio ambiente, saúde pública e democracia. A proposta é do criador, e a decisão editorial também.',

  /* Caminho de entrada quando já existe conteúdo publicado. */
  entrarPrincipal: 'Criar cadastro',
  entrarPainel: 'Ir para o painel',
  entrarSecundario: 'Ver chamadas abertas',

  /* Caminho de entrada enquanto nada foi publicado. */
  inicioAcao: 'Ver oportunidades',
  inicioAcaoAreas: 'Ver a biblioteca',
  inicioNota: 'Nenhuma chamada aberta.',

  /* A home nova: o enxame e a porta, as colunas sao a casa. */
  ponte: 'Aberto agora · Cadastro · Biblioteca',
  coluna: {
    apoio: 'Apoio por projeto',
    proponente: 'Proponente',
    vagas: 'Vagas',
    vagasFaixa: 'De {min} a {max} projetos apoiados.',
    vagasSelecionados: '{n} selecionados, {r} vagas abertas.',
    vagasApoiados: '{n} projetos apoiados.',
    verChamada: 'Ver a chamada',
    semChamada: 'Nenhuma chamada aberta no momento.',
    verOportunidades: 'Ver oportunidades',
    cadastroOlho: 'Cadastro',
    cadastroTitulo: 'Sua conta na plataforma',
    cadastroTexto: 'Cadastro gratuito para pessoa física ou jurídica. Participar do banco de influenciadores é opcional.',
    cadastroCampos: ['Nome', 'E-mail', 'Telefone', 'País', 'Tipo de cadastro'],
    cadastroAcao: 'Criar cadastro',
    semMaterial: 'Nenhum material publicado ainda.',
    anterior: 'Anterior',
    proximo: 'Próxima',
    posicao: '{n} de {total}',
    pausar: 'Pausar',
    continuar: 'Continuar',
    carrossel: 'carrossel',
  },

  numeros: {
    recursos: 'Em chamadas abertas',
    chamadas: 'Chamadas com inscrição aberta',
    cursos: 'Cursos no catálogo',
    materiais: 'Materiais publicados',
  },

  chamadasTitulo: 'Editais',

  recursosTitulo: 'Biblioteca',
  recursosAcao: 'Abrir a biblioteca',
  cursoModulos: 'módulos',
  materiaisAcao: 'Ver materiais',
} as const;
