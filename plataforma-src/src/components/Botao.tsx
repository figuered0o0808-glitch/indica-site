import Link from 'next/link';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variante = 'primario' | 'secundario' | 'discreto';
type Tamanho = 'normal' | 'pequeno';

interface Base {
  children: ReactNode;
  variante?: Variante;
  tamanho?: Tamanho;
  largo?: boolean;
  className?: string;
}

interface ComoLink extends Base {
  href: string;
  onClick?: () => void;
}

interface ComoBotao extends Base, Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className'> {
  href?: undefined;
}

function classes({ variante = 'primario', tamanho = 'normal', largo, className }: Base): string {
  return [
    'btn',
    `btn--${variante}`,
    tamanho === 'pequeno' ? 'btn--pequeno' : '',
    largo ? 'btn--largo' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');
}

export function Botao(props: ComoLink | ComoBotao) {
  const { children, variante, tamanho, largo, className } = props;
  const cls = classes({ children, variante, tamanho, largo, className });

  if ('href' in props && props.href) {
    const { href, onClick } = props;
    return (
      <Link href={href} className={cls} onClick={onClick}>
        {children}
      </Link>
    );
  }

  const { children: _c, variante: _v, tamanho: _t, largo: _l, className: _cn, ...resto } =
    props as ComoBotao;
  return (
    <button type="button" className={cls} {...resto}>
      {children}
    </button>
  );
}
