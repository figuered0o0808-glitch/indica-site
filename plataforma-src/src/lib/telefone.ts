/**
 * Telefone do cadastro: o que sai daqui e o que a INDICA recebe.
 *
 * A pessoa escreve como quiser; parentese, espaco e hifen sao formatacao e
 * caem. O que fica e uma sequencia de digitos, com um sinal de mais na frente
 * sempre que ha codigo de pais. Sem o sinal, e numero nacional brasileiro com
 * DDD. As duas formas nunca se confundem, e e isso que o outro lado assume.
 *
 * O site nao tem tabela de codigos de pais. Fora do Brasil, a ajuda do campo
 * pede o codigo, e o site confia que ele veio: e a unica coisa que pode fazer
 * sem manter uma tabela do mundo inteiro.
 */

import { PAIS_PADRAO } from '@/lib/paises';

/**
 * O sinal de mais entra quando a pessoa o digitou, quando escreveu o prefixo
 * internacional 00, quando o pais do cadastro nao e o Brasil ou quando um
 * numero brasileiro veio com o 55 na frente (12 ou 13 digitos: 55 tambem e
 * DDD, e so o tamanho separa "55 99999 0000" de "55 55 99999 0000").
 */
export function normalizarTelefone(valor: string, pais: string): string {
  const cru = valor.trim();
  let digitos = cru.replace(/\D/g, '');
  let internacional = cru.startsWith('+');
  if (!internacional && digitos.startsWith('00')) {
    internacional = true;
    digitos = digitos.slice(2);
  }
  if (!internacional && pais !== PAIS_PADRAO) internacional = true;
  if (!internacional && digitos.length >= 12 && digitos.startsWith('55')) internacional = true;
  return internacional ? `+${digitos}` : digitos;
}

/**
 * Numero nacional brasileiro tem 10 digitos (fixo) ou 11 (celular), sempre com
 * DDD. Com codigo de pais, entre 9 e 15 digitos: o menor numero completo que
 * existe e o teto internacional. Fora disso faltou ou sobrou digito.
 */
export function telefoneCompleto(valor: string, pais: string): boolean {
  const normalizado = normalizarTelefone(valor, pais);
  const digitos = normalizado.replace(/\D/g, '').length;
  if (normalizado.startsWith('+')) return digitos >= 9 && digitos <= 15;
  return digitos === 10 || digitos === 11;
}
