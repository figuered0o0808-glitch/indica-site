/** Receita Federal, manual-dv-cnpj.pdf: 12 posições ASCII e dois DVs numéricos. */
export function normalizarCnpj(valor: string): string {
  return valor.toUpperCase().replace(/[.\/\-\s]/g, '');
}
export function cnpjValido(valor: string): boolean {
  const c = normalizarCnpj(valor);
  if (!/^[A-Z0-9]{12}[0-9]{2}$/.test(c) || /^(.)\1{13}$/.test(c)) return false;
  function dv(base: string, pesos: number[]) {
    const resto = [...base].reduce((s, letra, i) => s + (letra.charCodeAt(0) - 48) * pesos[i], 0) % 11;
    return String(resto < 2 ? 0 : 11 - resto);
  }
  const primeiro = dv(c.slice(0, 12), [5,4,3,2,9,8,7,6,5,4,3,2]);
  return c[12] === primeiro && c[13] === dv(c.slice(0, 12) + primeiro, [6,5,4,3,2,9,8,7,6,5,4,3,2]);
}
