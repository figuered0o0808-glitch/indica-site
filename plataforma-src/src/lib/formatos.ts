/** Texto descritivo mantido para a leitura administrativa e os registros legados. */
export function descreverFormatos(formatos: readonly string[] = [], outro = ''): string {
  return [...formatos.map(v => v.trim()).filter(Boolean), outro.trim()].filter(Boolean).join('; ');
}

export function formatosValidos(formatos: readonly string[], outro: string): boolean {
  return formatos.length <= 20 && formatos.every(v => v.trim().length > 0 && v.length <= 120)
    && outro.length <= 1000 && (formatos.length > 0 || outro.trim().length > 0);
}

/** Não divide textos antigos por pontuação: um formato legado pode ser uma descrição livre. */
export function migrarFormatoLegado(formato: string): { formatos: string[]; formatoOutro: string } {
  const anterior = formato.trim();
  if (!anterior) return { formatos: [], formatoOutro: '' };
  if (anterior.length <= 120) return { formatos: [anterior], formatoOutro: '' };
  return { formatos: [], formatoOutro: anterior.length <= 1000 ? anterior : '' };
}
