import type { Idioma } from './idiomas';

const textos = {
  pt: {
    titulo: 'Arquivos de apoio',
    introducao: 'Os arquivos são opcionais. Escolha quantos precisar em cada categoria; todos serão enviados automaticamente quando você clicar em Continuar.',
    continuar: 'Continuar', formatosTitulo: 'Formatos da proposta', formatosAjuda: 'Você pode selecionar mais de um formato e descrever outros formatos abaixo.', formatosObrigatorios: 'Selecione ao menos um formato ou descreva outros formatos.', formatosLimite: 'Selecione até 20 formatos, com até 120 caracteres em cada um.', formatoOutro: 'Outros formatos', divulgacaoSite: 'Como você divulgará o site Eletrificação Já?', divulgacaoAjuda: 'Explique em que momento da proposta você apresentará ou divulgará o site da campanha. O site não precisa ser o tema central da proposta.', divulgacaoObrigatoria: 'Explique como sua proposta divulgará o site Eletrificação Já em algum momento.', conhecerSite: 'Conhecer o site da campanha', falhou: 'Envio não concluído', progresso: 'Enviando {atual} de {total}: {nome}',
    privacidade: 'Arquivos privados, acessíveis apenas à sua conta e à equipe autorizada da INDICA.',
    links: 'Links atualizados de redes e portfólio',
    linksAjuda: 'Informe até 20 links HTTPS, um por linha, com os perfis e canais ativos e seu portfólio. Não inclua links para documentos pessoais.',
    linksObrigatorios: 'Informe os links atualizados de redes e portfólio.',
    linksInvalidos: 'Use até 20 endereços completos, começando com https://, um por linha.',
    categorias: { identificacao: 'Identificação do proponente', portfolio: 'Apresentação e portfólio', 'midia-kit': 'Mídia kit e métricas', 'proposta-orcamento': 'Proposta técnica e orçamento' },
    ajudas: { portfolio: 'Breve histórico, apresentação e exemplos do seu trabalho.', 'midia-kit': 'Mídia kit atualizado ou relatórios analíticos das plataformas, com as métricas disponíveis para a comissão.', 'proposta-orcamento': 'Proposta técnica, plano de distribuição, cronograma e planilha orçamentária discriminada.' },
    identificacaoPf: 'RG ou CNH da pessoa física proponente.',
    identificacaoPj: 'Comprovante de CNPJ e contrato social ou estatuto vigente da executora.',
    formatos: 'Formatos aceitos', obrigatorio: 'Obrigatório', opcional: 'Opcional', escolher: 'Escolher arquivos', enviar: 'Enviar arquivo', enviando: 'Enviando arquivo…', remover: 'Remover', baixar: 'Baixar', atualizar: 'Atualizar lista',
    carregando: 'Consultando os arquivos da sua conta…', vazio: 'Nenhum arquivo enviado nesta categoria.', recebido: 'Recebido pelo servidor', selecionado: 'Aguardando envio ao continuar',
    limites: 'PDF, PNG, JPG, XLSX ou CSV. Até {arquivo} MB por arquivo, {quantidade} arquivos e {total} MB no total.',
    uso: '{quantidade} arquivo(s) recebido(s) · {total} MB',
    revisar: 'Arquivos que serão enviados com esta proposta',
    erros: {
      leitura: 'Não foi possível consultar a lista de arquivos. Tente atualizar a lista.',
      upload: 'Não foi possível concluir o envio de alguns arquivos. Clique em Continuar para tentar novamente ou remova os arquivos que não deseja anexar.',
      remover: 'A remoção não foi confirmada. Atualize a lista antes de tentar novamente.',
      baixar: 'Não foi possível baixar o arquivo. Tente novamente.',
      fechado: 'O servidor não está recebendo arquivos para esta chamada.',
      tipo: 'Escolha um arquivo PDF, PNG, JPG, XLSX ou CSV.', tipoIdentificacao: 'Para identificação, escolha um arquivo PDF, PNG ou JPG.', tamanho: 'O arquivo ultrapassa o limite permitido.', quantidade: 'O limite de arquivos desta inscrição foi atingido.', total: 'Os arquivos ultrapassam o tamanho total permitido.',
      pendentes: 'Clique em Continuar para enviar os arquivos selecionados.', obrigatorios: 'Envie ao menos um arquivo em cada categoria obrigatória.', ocupado: 'Aguarde a conclusão da operação com os arquivos.',
    },
  },
  en: {
    titulo: 'Supporting files',
    introducao: 'Files are optional. Choose as many as needed in each category; all selected files upload automatically when you click Continue.',
    continuar: 'Continue', formatosTitulo: 'Proposal formats', formatosAjuda: 'You can select more than one format and describe other formats below.', formatosObrigatorios: 'Select at least one format or describe other formats.', formatosLimite: 'Select up to 20 formats, with up to 120 characters each.', formatoOutro: 'Other formats', divulgacaoSite: 'How will you promote the Eletrificação Já website?', divulgacaoAjuda: 'Explain when your proposal will present or promote the campaign website. The website does not need to be the proposal’s central theme.', divulgacaoObrigatoria: 'Explain how your proposal will promote the Eletrificação Já website at some point.', conhecerSite: 'Visit the campaign website', falhou: 'Upload not completed', progresso: 'Uploading {atual} of {total}: {nome}',
    privacidade: 'Private files, accessible only to your account and the authorized INDICA team.',
    links: 'Current social media and portfolio links',
    linksAjuda: 'Enter up to 20 HTTPS links, one per line, including your active profiles, channels and portfolio. Do not include links to personal identification documents.',
    linksObrigatorios: 'Enter current social media and portfolio links.', linksInvalidos: 'Use up to 20 complete addresses starting with https://, one per line.',
    categorias: { identificacao: 'Applicant identification', portfolio: 'Introduction and portfolio', 'midia-kit': 'Media kit and analytics', 'proposta-orcamento': 'Technical proposal and budget' },
    ajudas: { portfolio: 'A brief background, introduction and examples of your work.', 'midia-kit': 'An up-to-date media kit or platform analytics reports, with metrics available to the committee.', 'proposta-orcamento': 'Technical proposal, distribution plan, schedule and itemized budget spreadsheet.' },
    identificacaoPf: 'The individual applicant’s Brazilian identity card or driver’s license (RG or CNH).',
    identificacaoPj: 'The executing organization’s CNPJ certificate and current articles of association or bylaws.',
    formatos: 'Accepted formats', obrigatorio: 'Required', opcional: 'Optional', escolher: 'Choose files', enviar: 'Upload file', enviando: 'Uploading file…', remover: 'Remove', baixar: 'Download', atualizar: 'Refresh list',
    carregando: 'Checking your account’s files…', vazio: 'No files uploaded in this category.', recebido: 'Received by the server', selecionado: 'Waiting to upload when you continue',
    limites: 'PDF, PNG, JPG, XLSX or CSV. Up to {arquivo} MB per file, {quantidade} files and {total} MB in total.',
    uso: '{quantidade} file(s) received · {total} MB', revisar: 'Files to be submitted with this proposal',
    erros: {
      leitura: 'The file list could not be loaded. Try refreshing it.', upload: 'Some file uploads could not be completed. Click Continue to retry or remove files you do not want to attach.', remover: 'Removal was not confirmed. Refresh the list before trying again.', baixar: 'The file could not be downloaded. Try again.',
      fechado: 'The server is not accepting files for this call.', tipo: 'Choose a PDF, PNG, JPG, XLSX or CSV file.', tipoIdentificacao: 'For identification, choose a PDF, PNG or JPG file.', tamanho: 'The file exceeds the allowed size.', quantidade: 'The application’s file limit has been reached.', total: 'The files exceed the allowed total size.',
      pendentes: 'Click Continue to upload the selected files.', obrigatorios: 'Upload at least one file in each required category.', ocupado: 'Wait for the file operation to finish.',
    },
  },
  es: {
    titulo: 'Archivos de apoyo', introducao: 'Los archivos son opcionales. Elige los que necesites en cada categoría; se enviarán automáticamente cuando hagas clic en Continuar.',
    continuar: 'Continuar', formatosTitulo: 'Formatos de la propuesta', formatosAjuda: 'Puedes seleccionar más de un formato y describir otros formatos abajo.', formatosObrigatorios: 'Selecciona al menos un formato o describe otros formatos.', formatosLimite: 'Selecciona hasta 20 formatos, con hasta 120 caracteres cada uno.', formatoOutro: 'Otros formatos', divulgacaoSite: '¿Cómo divulgarás el sitio Eletrificação Já?', divulgacaoAjuda: 'Explica en qué momento de la propuesta presentarás o divulgarás el sitio de la campaña. El sitio no tiene que ser el tema central de la propuesta.', divulgacaoObrigatoria: 'Explica cómo tu propuesta divulgará el sitio Eletrificação Já en algún momento.', conhecerSite: 'Conocer el sitio de la campaña', falhou: 'Envío no completado', progresso: 'Enviando {atual} de {total}: {nome}', privacidade: 'Archivos privados, accesibles solo para tu cuenta y el equipo autorizado de INDICA.',
    links: 'Enlaces actualizados de redes y portafolio', linksAjuda: 'Indica hasta 20 enlaces HTTPS, uno por línea, con los perfiles y canales activos y tu portafolio. No incluyas enlaces a documentos personales.', linksObrigatorios: 'Indica los enlaces actualizados de redes y portafolio.', linksInvalidos: 'Utiliza hasta 20 direcciones completas que empiecen por https://, una por línea.',
    categorias: { identificacao: 'Identificación del proponente', portfolio: 'Presentación y portafolio', 'midia-kit': 'Media kit y métricas', 'proposta-orcamento': 'Propuesta técnica y presupuesto' },
    ajudas: { portfolio: 'Breve trayectoria, presentación y ejemplos de tu trabajo.', 'midia-kit': 'Media kit actualizado o informes analíticos de las plataformas, con las métricas disponibles para la comisión.', 'proposta-orcamento': 'Propuesta técnica, plan de distribución, cronograma y presupuesto desglosado.' },
    identificacaoPf: 'RG o CNH de la persona física proponente.', identificacaoPj: 'Comprobante de CNPJ y contrato social o estatuto vigente de la ejecutora.',
    formatos: 'Formatos aceptados', obrigatorio: 'Obligatorio', opcional: 'Opcional', escolher: 'Elegir archivos', enviar: 'Enviar archivo', enviando: 'Enviando archivo…', remover: 'Eliminar', baixar: 'Descargar', atualizar: 'Actualizar lista',
    carregando: 'Consultando los archivos de tu cuenta…', vazio: 'Ningún archivo enviado en esta categoría.', recebido: 'Recibido por el servidor', selecionado: 'Pendiente de envío al continuar',
    limites: 'PDF, PNG, JPG, XLSX o CSV. Hasta {arquivo} MB por archivo, {quantidade} archivos y {total} MB en total.', uso: '{quantidade} archivo(s) recibido(s) · {total} MB', revisar: 'Archivos que se enviarán con esta propuesta',
    erros: {
      leitura: 'No se pudo consultar la lista de archivos. Intenta actualizarla.', upload: 'No se pudo completar el envío de algunos archivos. Haz clic en Continuar para reintentarlo o elimina los que no quieras adjuntar.', remover: 'La eliminación no fue confirmada. Actualiza la lista antes de intentarlo de nuevo.', baixar: 'No se pudo descargar el archivo. Inténtalo de nuevo.',
      fechado: 'El servidor no está recibiendo archivos para esta convocatoria.', tipo: 'Elige un archivo PDF, PNG, JPG, XLSX o CSV.', tipoIdentificacao: 'Para identificación, elige un archivo PDF, PNG o JPG.', tamanho: 'El archivo supera el tamaño permitido.', quantidade: 'Se alcanzó el límite de archivos de esta inscripción.', total: 'Los archivos superan el tamaño total permitido.',
      pendentes: 'Haz clic en Continuar para enviar los archivos seleccionados.', obrigatorios: 'Envía al menos un archivo en cada categoría obligatoria.', ocupado: 'Espera a que termine la operación con los archivos.',
    },
  },
} as const;

export function textosAnexos(idioma: Idioma) { return textos[idioma]; }
export type ErroAnexos = keyof typeof textos.pt.erros;

export function linksPortfolioValidos(valor: string): boolean {
  if (valor.length > 8000) return false;
  const links = valor.split(/\r?\n/).map(v => v.trim()).filter(Boolean);
  return links.length <= 20 && links.every(link => {
    if (/\s/.test(link)) return false;
    try { const url = new URL(link); return url.protocol === 'https:' && Boolean(url.hostname) && !url.username && !url.password; }
    catch { return false; }
  });
}
