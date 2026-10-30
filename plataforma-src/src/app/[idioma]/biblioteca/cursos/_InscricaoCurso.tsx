'use client';

import { useRef, useState } from 'react';
import { Botao } from '@/components/Botao';
import type { Idioma } from '@/i18n/idiomas';
import { textos } from '@/i18n/strings';
import { motivoDoErro, novoEnvioId, type MotivoEnvio } from '@/lib/envio';
import { rota } from '@/lib/rotas';
import { useApp } from '@/state/AppState';

export function InscricaoCurso({ idioma, slug }: { idioma: Idioma; slug: string }) {
  const { cadastrado, hidratado, estaInscrito, inscreverCurso, recibos } = useApp();
  const t = textos(idioma);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<MotivoEnvio>();
  const envioId = useRef<string | null>(null);
  const emVoo = useRef(false);
  async function inscrever() {
    if (emVoo.current) return;
    emVoo.current = true; setEnviando(true); setErro(undefined);
    try {
      envioId.current ??= novoEnvioId();
      await inscreverCurso(slug, envioId.current);
      envioId.current = null;
    } catch (e) { setErro(motivoDoErro(e)); }
    finally { emVoo.current = false; setEnviando(false); }
  }
  if (!hidratado) return <Botao disabled>{t.comum.acoes.inscreverse}</Botao>;
  if (!cadastrado) return <Botao href={rota(idioma, 'cadastro')}>{t.aprendizado.cursos.inscricaoAcaoCadastro}</Botao>;
  if (estaInscrito(slug)) {
    const recibo = recibos.find((r) => r.tipo.includes('curso') && r.referencia === slug);
    return <div className="pilha--p" role="status">
      <p>{t.comum.acoes.inscrito}</p>
      {recibo ? <Botao href={rota(idioma, `painel/?recibo=${encodeURIComponent(recibo.reciboToken)}`)} tamanho="pequeno">{t.comum.envio.linkComprovante}</Botao> : null}
    </div>;
  }
  return <div className="pilha--p" aria-busy={enviando}>
    {erro ? <p className="campo__erro" role="alert">{t.comum.envio[erro]}</p> : null}
    <Botao onClick={() => void inscrever()} disabled={enviando}>{enviando ? t.comum.envio.enviando : erro ? t.comum.envio.tentar : t.comum.acoes.inscreverse}</Botao>
  </div>;
}
