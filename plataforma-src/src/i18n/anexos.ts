import type { Idioma } from './idiomas';

const textos = {
  pt: {
    titulo: 'Documentos da inscrição',
    introducao: 'Envie os arquivos nas categorias abaixo antes de revisar a proposta.',
    privacidade: 'Arquivos privados, acessíveis apenas à sua conta e à equipe autorizada da INDICA.',
    links: 'Links atualizados de redes e portfólio',
    linksAjuda: 'Informe até 20 links HTTPS, um por linha, com os perfis e canais ativos e seu portfólio. Não inclua links para documentos pessoais.',
    linksObrigatorios: 'Informe os links atualizados de redes e portfólio.',
    linksInvalidos: 'Use até 20 endereços completos, começando com https://, um por linha.',
    categorias: { identificacao: 'Identificação do proponente', portfolio: 'Apresentação e portfólio', 'midia-kit': 'Mídia kit e métricas', 'proposta-orcamento': 'Proposta técnica e orçamento' },
    ajudas: { portfolio: 'Breve histórico, apresentação e exemplos do seu trabalho.', 'midia-kit': 'Mídia kit atualizado ou relatórios analíticos das plataformas, com as métricas disponíveis para a comissão.', 'proposta-orcamento': 'Proposta técnica, plano de distribuição, cronograma e planilha orçamentária discriminada.' },
    identificacaoPf: 'RG ou CNH da pessoa física proponente.',
    identificacaoPj: 'Comprovante de CNPJ e contrato social ou estatuto vigente da executora.',
    formatos: 'Formatos aceitos', obrigatorio: 'Obrigatório', opcional: 'Opcional', escolher: 'Escolher arquivo', enviar: 'Enviar arquivo', enviando: 'Enviando arquivo…', remover: 'Remover', baixar: 'Baixar', atualizar: 'Atualizar lista',
    carregando: 'Consultando os arquivos da sua conta…', vazio: 'Nenhum arquivo enviado nesta categoria.', recebido: 'Recebido pelo servidor', selecionado: 'Selecionado, ainda não enviado:',
    limites: 'PDF, PNG, JPG, XLSX ou CSV. Até {arquivo} MB por arquivo, {quantidade} arquivos e {total} MB no total.',
    uso: '{quantidade} arquivo(s) recebido(s) · {total} MB',
    revisar: 'Arquivos que serão enviados com esta proposta',
    erros: {
      leitura: 'Não foi possível conferir a lista de arquivos. Atualize a lista antes de continuar.',
      upload: 'O envio não foi confirmado. Confira a lista e tente novamente se o arquivo não aparecer.',
      remover: 'A remoção não foi confirmada. Atualize a lista antes de tentar novamente.',
      baixar: 'Não foi possível baixar o arquivo. Tente novamente.',
      fechado: 'O servidor não está recebendo arquivos para esta chamada.',
      tipo: 'Escolha um arquivo PDF, PNG, JPG, XLSX ou CSV.', tipoIdentificacao: 'Para identificação, escolha um arquivo PDF, PNG ou JPG.', tamanho: 'O arquivo ultrapassa o limite permitido.', quantidade: 'O limite de arquivos desta inscrição foi atingido.', total: 'Os arquivos ultrapassam o tamanho total permitido.',
      pendentes: 'Envie os arquivos selecionados antes de continuar.', obrigatorios: 'Envie ao menos um arquivo em cada categoria obrigatória.', ocupado: 'Aguarde a conclusão da operação com os arquivos.',
    },
  },
  en: {
    titulo: 'Application documents',
    introducao: 'Upload files in the categories below before reviewing your proposal.',
    privacidade: 'Private files, accessible only to your account and the authorized INDICA team.',
    links: 'Current social media and portfolio links',
    linksAjuda: 'Enter up to 20 HTTPS links, one per line, including your active profiles, channels and portfolio. Do not include links to personal identification documents.',
    linksObrigatorios: 'Enter current social media and portfolio links.', linksInvalidos: 'Use up to 20 complete addresses starting with https://, one per line.',
    categorias: { identificacao: 'Applicant identification', portfolio: 'Introduction and portfolio', 'midia-kit': 'Media kit and analytics', 'proposta-orcamento': 'Technical proposal and budget' },
    ajudas: { portfolio: 'A brief background, introduction and examples of your work.', 'midia-kit': 'An up-to-date media kit or platform analytics reports, with metrics available to the committee.', 'proposta-orcamento': 'Technical proposal, distribution plan, schedule and itemized budget spreadsheet.' },
    identificacaoPf: 'The individual applicant’s Brazilian identity card or driver’s license (RG or CNH).',
    identificacaoPj: 'The executing organization’s CNPJ certificate and current articles of association or bylaws.',
    formatos: 'Accepted formats', obrigatorio: 'Required', opcional: 'Optional', escolher: 'Choose file', enviar: 'Upload file', enviando: 'Uploading file…', remover: 'Remove', baixar: 'Download', atualizar: 'Refresh list',
    carregando: 'Checking your account’s files…', vazio: 'No files uploaded in this category.', recebido: 'Received by the server', selecionado: 'Selected, not yet uploaded:',
    limites: 'PDF, PNG, JPG, XLSX or CSV. Up to {arquivo} MB per file, {quantidade} files and {total} MB in total.',
    uso: '{quantidade} file(s) received · {total} MB', revisar: 'Files to be submitted with this proposal',
    erros: {
      leitura: 'The file list could not be checked. Refresh it before continuing.', upload: 'The upload was not confirmed. Check the list and try again if the file is missing.', remover: 'Removal was not confirmed. Refresh the list before trying again.', baixar: 'The file could not be downloaded. Try again.',
      fechado: 'The server is not accepting files for this call.', tipo: 'Choose a PDF, PNG, JPG, XLSX or CSV file.', tipoIdentificacao: 'For identification, choose a PDF, PNG or JPG file.', tamanho: 'The file exceeds the allowed size.', quantidade: 'The application’s file limit has been reached.', total: 'The files exceed the allowed total size.',
      pendentes: 'Upload the selected files before continuing.', obrigatorios: 'Upload at least one file in each required category.', ocupado: 'Wait for the file operation to finish.',
    },
  },
  es: {
    titulo: 'Documentos de la inscripción', introducao: 'Envía los archivos en las categorías siguientes antes de revisar la propuesta.', privacidade: 'Archivos privados, accesibles solo para tu cuenta y el equipo autorizado de INDICA.',
    links: 'Enlaces actualizados de redes y portafolio', linksAjuda: 'Indica hasta 20 enlaces HTTPS, uno por línea, con los perfiles y canales activos y tu portafolio. No incluyas enlaces a documentos personales.', linksObrigatorios: 'Indica los enlaces actualizados de redes y portafolio.', linksInvalidos: 'Utiliza hasta 20 direcciones completas que empiecen por https://, una por línea.',
    categorias: { identificacao: 'Identificación del proponente', portfolio: 'Presentación y portafolio', 'midia-kit': 'Media kit y métricas', 'proposta-orcamento': 'Propuesta técnica y presupuesto' },
    ajudas: { portfolio: 'Breve trayectoria, presentación y ejemplos de tu trabajo.', 'midia-kit': 'Media kit actualizado o informes analíticos de las plataformas, con las métricas disponibles para la comisión.', 'proposta-orcamento': 'Propuesta técnica, plan de distribución, cronograma y presupuesto desglosado.' },
    identificacaoPf: 'RG o CNH de la persona física proponente.', identificacaoPj: 'Comprobante de CNPJ y contrato social o estatuto vigente de la ejecutora.',
    formatos: 'Formatos aceptados', obrigatorio: 'Obligatorio', opcional: 'Opcional', escolher: 'Elegir archivo', enviar: 'Enviar archivo', enviando: 'Enviando archivo…', remover: 'Eliminar', baixar: 'Descargar', atualizar: 'Actualizar lista',
    carregando: 'Consultando los archivos de tu cuenta…', vazio: 'Ningún archivo enviado en esta categoría.', recebido: 'Recibido por el servidor', selecionado: 'Seleccionado, aún no enviado:',
    limites: 'PDF, PNG, JPG, XLSX o CSV. Hasta {arquivo} MB por archivo, {quantidade} archivos y {total} MB en total.', uso: '{quantidade} archivo(s) recibido(s) · {total} MB', revisar: 'Archivos que se enviarán con esta propuesta',
    erros: {
      leitura: 'No se pudo consultar la lista de archivos. Actualízala antes de continuar.', upload: 'El envío no fue confirmado. Revisa la lista e inténtalo de nuevo si el archivo no aparece.', remover: 'La eliminación no fue confirmada. Actualiza la lista antes de intentarlo de nuevo.', baixar: 'No se pudo descargar el archivo. Inténtalo de nuevo.',
      fechado: 'El servidor no está recibiendo archivos para esta convocatoria.', tipo: 'Elige un archivo PDF, PNG, JPG, XLSX o CSV.', tipoIdentificacao: 'Para identificación, elige un archivo PDF, PNG o JPG.', tamanho: 'El archivo supera el tamaño permitido.', quantidade: 'Se alcanzó el límite de archivos de esta inscripción.', total: 'Los archivos superan el tamaño total permitido.',
      pendentes: 'Envía los archivos seleccionados antes de continuar.', obrigatorios: 'Envía al menos un archivo en cada categoría obligatoria.', ocupado: 'Espera a que termine la operación con los archivos.',
    },
  },
} as const;

export function textosAnexos(idioma: Idioma) { return textos[idioma]; }
export type ErroAnexos = keyof typeof textos.pt.erros;

export function linksPortfolioValidos(valor: string): boolean {
  const links = valor.split(/\r?\n/).map(v => v.trim()).filter(Boolean);
  return links.length > 0 && links.length <= 20 && links.every(link => {
    if (/\s/.test(link)) return false;
    try { const url = new URL(link); return url.protocol === 'https:' && Boolean(url.hostname) && !url.username && !url.password; }
    catch { return false; }
  });
}
