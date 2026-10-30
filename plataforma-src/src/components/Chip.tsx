/** Tons da paleta oficial usados como fundo de chip. */
export type CorChip = 'menta' | 'azul' | 'amarelo' | 'areia' | 'rosa';

const CORES: CorChip[] = ['menta', 'azul', 'amarelo', 'rosa', 'areia'];

/** Cor estavel por termo: o mesmo tema recebe sempre o mesmo fundo. */
export function corDoTema(tema: string): CorChip {
  let soma = 0;
  for (let i = 0; i < tema.length; i += 1) soma += tema.charCodeAt(i);
  return CORES[soma % CORES.length];
}

export function Chip({
  children,
  cor,
  vazado,
}: {
  children: string;
  cor?: CorChip;
  vazado?: boolean;
}) {
  if (vazado) return <span className="chip chip--vazado">{children}</span>;
  return <span className={`chip chip--${cor ?? corDoTema(children)}`}>{children}</span>;
}

export function Chips({ itens, vazado }: { itens: string[]; vazado?: boolean }) {
  if (itens.length === 0) return null;
  return (
    <div className="chips">
      {itens.map((item) => (
        <Chip key={item} vazado={vazado}>
          {item}
        </Chip>
      ))}
    </div>
  );
}
