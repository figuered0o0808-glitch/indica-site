import type { Idioma } from '@/i18n/idiomas';

const conteudo = {
  pt: {
    titulo: 'Fale com a Índica', olho: 'Contato',
    descricao: 'Dúvidas sobre a plataforma, propostas de parceria e ideias para novos projetos chegam à nossa equipe por aqui.',
    nome: 'Seu nome', email: 'Seu e-mail', organizacao: 'Empresa ou organização', assunto: 'Assunto', mensagem: 'Mensagem',
    assuntos: ['Dúvida sobre a plataforma', 'Uma inscrição já enviada', 'Cursos e biblioteca', 'Parceria ou novo projeto', 'Outro assunto'],
    ajuda: 'Se já enviou uma proposta, inclua o protocolo para facilitar o atendimento.',
    privacidade: 'A equipe da Índica recebe estes dados para acompanhar seu contato. Este formulário não envia propostas para editais.',
    enviar: 'Enviar mensagem', enviando: 'Enviando…', tentar: 'Tentar enviar novamente', editar: 'Revisar os dados',
    falha: 'Não foi possível confirmar o recebimento. Sua mensagem continua aqui. Tente novamente com os mesmos dados para evitar um envio duplicado.',
    invalido: 'Confira os campos e tente novamente.', limite: 'Muitas tentativas. Aguarde um pouco e tente novamente.',
    revisar: 'A tentativa anterior pode ter chegado ao sistema. Antes de iniciar outro envio, confira se você já recebeu um protocolo nesta página.',
    sucesso: 'Mensagem registrada', recebido: 'Sua mensagem chegou à equipe da Índica. Guarde o protocolo para mencionar este contato.', protocolo: 'Protocolo', data: 'Recebida em',
    nova: 'Enviar outra mensagem', emailAlternativo: 'Você também pode escrever para', voltar: 'Como funciona a plataforma', copiar: 'Copiar protocolo', copiado: 'Protocolo copiado',
  },
  en: {
    titulo: 'Contact INDICA', olho: 'Contact',
    descricao: 'Send platform questions, partnership proposals and ideas for new projects directly to our team.',
    nome: 'Your name', email: 'Your email', organizacao: 'Company or organization', assunto: 'Subject', mensagem: 'Message',
    assuntos: ['Platform question', 'A proposal already submitted', 'Courses and library', 'Partnership or new project', 'Other subject'],
    ajuda: 'If you have submitted a proposal, include its reference number so the team can help you.',
    privacidade: 'The INDICA team receives these details to follow up on your message. This form does not submit proposals to calls.',
    enviar: 'Send message', enviando: 'Sending…', tentar: 'Try sending again', editar: 'Review the details',
    falha: 'We could not confirm receipt. Your message is still here. Retry with the same details to avoid a duplicate submission.',
    invalido: 'Check the fields and try again.', limite: 'Too many attempts. Please wait a little and try again.',
    revisar: 'The previous attempt may have reached the system. Before starting another submission, check whether this page has already shown a reference number.',
    sucesso: 'Message registered', recebido: 'Your message has reached the INDICA team. Keep the reference number when following up.', protocolo: 'Reference number', data: 'Received on',
    nova: 'Send another message', emailAlternativo: 'You can also write to', voltar: 'How the platform works', copiar: 'Copy reference number', copiado: 'Reference number copied',
  },
  es: {
    titulo: 'Habla con Índica', olho: 'Contacto',
    descricao: 'Envía al equipo tus dudas sobre la plataforma, propuestas de colaboración e ideas para nuevos proyectos.',
    nome: 'Tu nombre', email: 'Tu correo', organizacao: 'Empresa u organización', assunto: 'Asunto', mensagem: 'Mensaje',
    assuntos: ['Duda sobre la plataforma', 'Una propuesta ya enviada', 'Cursos y biblioteca', 'Colaboración o nuevo proyecto', 'Otro asunto'],
    ajuda: 'Si ya enviaste una propuesta, incluye su número de protocolo para facilitar la atención.',
    privacidade: 'El equipo de Índica recibe estos datos para atender tu mensaje. Este formulario no presenta propuestas a convocatorias.',
    enviar: 'Enviar mensaje', enviando: 'Enviando…', tentar: 'Intentar enviar de nuevo', editar: 'Revisar los datos',
    falha: 'No pudimos confirmar la recepción. Tu mensaje sigue aquí. Intenta de nuevo con los mismos datos para evitar un envío duplicado.',
    invalido: 'Revisa los campos e intenta de nuevo.', limite: 'Demasiados intentos. Espera un poco e intenta de nuevo.',
    revisar: 'El intento anterior puede haber llegado al sistema. Antes de iniciar otro envío, comprueba si esta página ya mostró un número de protocolo.',
    sucesso: 'Mensaje registrado', recebido: 'Tu mensaje llegó al equipo de Índica. Guarda el protocolo para mencionar este contacto.', protocolo: 'Protocolo', data: 'Recibido el',
    nova: 'Enviar otro mensaje', emailAlternativo: 'También puedes escribir a', voltar: 'Cómo funciona la plataforma', copiar: 'Copiar protocolo', copiado: 'Protocolo copiado',
  },
} as const;

export function contato(idioma: Idioma) { return conteudo[idioma]; }
