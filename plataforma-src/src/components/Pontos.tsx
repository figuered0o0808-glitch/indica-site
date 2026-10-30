/**
 * Pontos de medida: uma fileira em que cada vaga e um ponto. Cheio, ja tem
 * quem ocupe; vazado, ainda esta aberta.
 *
 * A fileira sozinha nao fala: quem usa poe ao lado a frase que diz os numeros,
 * ou passa `rotulo` para que o leitor de tela receba a mesma informacao.
 */
export function Pontos({ cheios, total, rotulo }: { cheios: number; total: number; rotulo?: string }) {
  const quantidade = Math.max(0, Math.floor(total));
  const preenchidos = Math.min(quantidade, Math.max(0, Math.floor(cheios)));

  return (
    <span
      className="pontos"
      role={rotulo ? 'img' : undefined}
      aria-label={rotulo}
      aria-hidden={rotulo ? undefined : true}
    >
      {Array.from({ length: quantidade }, (_, indice) => (
        <span
          key={indice}
          className={indice < preenchidos ? 'pontos__ponto' : 'pontos__ponto pontos__ponto--vazado'}
        />
      ))}
    </span>
  );
}
