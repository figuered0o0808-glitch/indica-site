/**
 * Estilo do cadastro.
 *
 * Fica aqui, e nao na folha geral, porque sao classes que so o formulario de
 * cadastro usa. Todas com prefixo cad- e escritas com as variaveis do sistema,
 * para herdar paleta, tipografia e o canto reto de 2px.
 */
const CSS = `
/* Cada rede declarada e um bloco numerado, separado do seguinte por um fio. */
.cad-rede {
  display: grid;
  gap: 10px;
  padding: 16px 0;
  border-top: 1px solid var(--linha);
}
.cad-rede:first-of-type { border-top: 0; padding-top: 0; }
.cad-rede__topo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.cad-rede__campos {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.25fr) minmax(0, 0.85fr);
  gap: 12px;
  align-items: start;
}

/* Soma dos seguidores digitados, no pe da lista de redes. */
.cad-soma {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  border-top: 1px solid var(--preto);
  padding-top: 12px;
}
.cad-soma__valor { margin: 0; font-variant-numeric: tabular-nums; }

@media (max-width: 640px) {
  .cad-rede__campos { grid-template-columns: minmax(0, 1fr); }
}
`;

/** Injeta o estilo do cadastro na pagina. Sem dependencia externa. */
export function EstilosCadastro() {
  return <style dangerouslySetInnerHTML={{ __html: CSS }} />;
}
