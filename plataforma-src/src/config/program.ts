/**
 * Configuracao do programa.
 *
 * Para renomear a plataforma inteira, troque apenas estas constantes.
 */
export const PROGRAM_NAME = 'INDICA';

/** Descricao da plataforma. */
export const PROGRAM_TAGLINE = 'Plataforma de criadores para o interesse público';

/** Organizacoes executoras. */
export const EXECUTORAS = {
  indica: 'INDICA',
} as const;

/** Marca da INDICA, para os lugares em que ela nao vem dos dados (rodape). */
export const LOGO_INDICA = '/organizacoes/indica.png';

/** Chave de persistência local (opcional: nada quebra sem localStorage). */
export const STORAGE_KEY = 'indica:plataforma:v1';

/** Compatibilidade com dados locais anteriores à mudança de marca. */
export const LEGACY_STORAGE_KEY = 'tilt:v1';
