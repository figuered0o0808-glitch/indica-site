import type { ReactNode } from 'react';
import { Ilustracao } from '@/components/Ilustracao';

export function EstadoVazio({
  titulo,
  descricao,
  acao,
  desenho = 'busca',
}: {
  titulo: string;
  descricao?: string;
  acao?: ReactNode;
  desenho?: 'busca' | 'lista' | 'pasta';
}) {
  return (
    <div className="vazio">
      <Ilustracao nome={desenho} largura={92} />
      <p className="vazio__titulo">{titulo}</p>
      {descricao ? <p className="texto-pequeno vazio__texto">{descricao}</p> : null}
      {acao}
    </div>
  );
}
