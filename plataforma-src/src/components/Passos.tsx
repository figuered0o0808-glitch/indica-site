/**
 * Os passos de um fluxo como pontos: o mesmo ponto do logotipo virando
 * progresso. Cheio, passo concluido ou em curso; vazado, o que falta. O passo
 * em curso se distingue pelo nome em preto e pelo fio embaixo, nao por outra
 * forma de ponto, para a fileira ler como uma coisa so.
 *
 * O numero do passo continua no DOM, so para leitor de tela: a lista ja e
 * ordenada, e aria-current marca o passo atual.
 */
export function Passos({ passos, atual }: { passos: readonly string[]; atual: number }) {
  return (
    <ol className="passos">
      {passos.map((passo, indice) => {
        const estado =
          indice === atual ? ' passo--ativo' : indice < atual ? ' passo--concluido' : '';
        return (
          <li key={passo} className={`passo${estado}`} aria-current={indice === atual ? 'step' : undefined}>
            <span className="passo__ponto" aria-hidden="true" />
            <span className="sr-only">{indice + 1}. </span>
            {passo}
          </li>
        );
      })}
    </ol>
  );
}
