#!/usr/bin/env python3
"""Gera os sete logos e as cinco capas em SVG.

Texto usa fonte do sistema (Times New Roman / mono), com textLength medido
na Times New Roman do macOS para que nada saia da caixa em outros sistemas.
"""
import base64
import math
import os

from PIL import ImageFont

RAIZ = '/Users/franciscofigueiredo/Documents/prototipo-programa-criadores/public'
DIR_LOGOS = os.path.join(RAIZ, 'organizacoes')
DIR_CAPAS = os.path.join(RAIZ, 'materiais', 'capas')

FONTES = {
    'tnrb': '/System/Library/Fonts/Supplemental/Times New Roman Bold.ttf',
    'tnr': '/System/Library/Fonts/Supplemental/Times New Roman.ttf',
    'tnrbi': '/System/Library/Fonts/Supplemental/Times New Roman Bold Italic.ttf',
    'menlo': ('/System/Library/Fonts/Menlo.ttc', 0),
    'menlob': ('/System/Library/Fonts/Menlo.ttc', 1),
}
SERIF = "'Times New Roman', Times, Georgia, serif"
MONO = "ui-monospace, Menlo, Consolas, 'Courier New', monospace"


def largura(texto, fonte, tamanho):
    f = FONTES[fonte]
    if isinstance(f, tuple):
        font = ImageFont.truetype(f[0], 200, index=f[1])
    else:
        font = ImageFont.truetype(f, 200)
    return font.getlength(texto) * tamanho / 200.0


def fmt(n):
    s = f'{n:.1f}'
    return s[:-2] if s.endswith('.0') else s


def texto(t, x, y, fonte, tamanho, familia, peso='normal', estilo='normal',
          ajuste='spacingAndGlyphs', folga=1.0, extra=''):
    """<text> com textLength medido; folga>1 abre espaco entre letras."""
    L = largura(t, fonte, tamanho) * folga
    adj = ajuste if folga == 1.0 else 'spacing'
    attrs = f'x="{fmt(x)}" y="{fmt(y)}" font-family="{familia}" font-size="{tamanho}"'
    if peso != 'normal':
        attrs += f' font-weight="{peso}"'
    if estilo != 'normal':
        attrs += f' font-style="{estilo}"'
    attrs += f' textLength="{fmt(L)}" lengthAdjust="{adj}"'
    if extra:
        attrs += ' ' + extra
    return f'<text {attrs}>{t}</text>', L


def escreve(caminho, conteudo):
    with open(caminho, 'w', encoding='utf-8') as f:
        f.write(conteudo)
    print('ok', caminho)


# ---------------------------------------------------------------- contornos
def contorno(cx, cy, R, amp=(0.10, 0.06), fase=(0.5, 1.2), n=14):
    """Curva fechada suave, tipo isoterma, como path de cubicas."""
    pts = []
    for i in range(n):
        th = 2 * math.pi * i / n
        r = R * (1 + amp[0] * math.sin(2 * th + fase[0]) + amp[1] * math.sin(3 * th + fase[1]))
        pts.append((cx + r * math.cos(th), cy + r * math.sin(th)))
    # Catmull-Rom fechada -> Bezier cubica
    d = f'M{fmt(pts[0][0])} {fmt(pts[0][1])}'
    for i in range(n):
        p0 = pts[(i - 1) % n]; p1 = pts[i]; p2 = pts[(i + 1) % n]; p3 = pts[(i + 2) % n]
        c1 = (p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)
        d += f' C{fmt(c1[0])} {fmt(c1[1])} {fmt(c2[0])} {fmt(c2[1])} {fmt(p2[0])} {fmt(p2[1])}'
    return d + ' Z'


# ------------------------------------------------------------------- sinais
# Cada sinal ocupa a caixa 0..92 x 0..92.

def sinal_corrente():
    # raio geometrico, solido
    return '<polygon points="46,0 8,54 38,54 28,92 84,34 54,34 68,0"/>'


def sinal_clima(escala=1.0, traco=9):
    s = escala
    amp = (0.15, 0.08)
    partes = [
        f'<path d="{contorno(46*s, 46*s, 36*s, amp=amp)}" fill="none" stroke="#000" stroke-width="{fmt(traco*s)}"/>',
        f'<path d="{contorno(48*s, 47*s, 22*s, amp=amp)}" fill="none" stroke="#000" stroke-width="{fmt(traco*s)}"/>',
        f'<path d="{contorno(50*s, 48*s, 9*s, amp=amp)}" fill="#000"/>',
    ]
    return ''.join(partes)


def sinal_saude():
    return ('<rect x="34" y="0" width="24" height="34"/>'
            '<rect x="34" y="58" width="24" height="34"/>'
            '<rect x="0" y="34" width="34" height="24"/>'
            '<rect x="58" y="34" width="34" height="24"/>')


def sinal_vale():
    return ('<circle cx="46" cy="46" r="41.5" fill="none" stroke="#000" stroke-width="9"/>'
            '<polygon points="16,64 31,28 46,52 61,28 76,64"/>'
            '<rect x="26" y="69" width="40" height="7"/>')


def sinal_labdados():
    celulas = []
    for r in range(3):
        for c in range(3):
            x, y = c * 33, r * 33
            if (r, c) == (2, 2):
                celulas.append(f'<rect x="{x+3}" y="{y+3}" width="20" height="20" fill="none" stroke="#000" stroke-width="6"/>')
            else:
                celulas.append(f'<rect x="{x}" y="{y}" width="26" height="26"/>')
    return ''.join(celulas)


def aneis(cx1, cx2, cy, r, traco, folga, idm):
    """Dois aneis entrelacados: o da direita passa por cima no alto,
    o da esquerda por baixo... e o inverso embaixo. Vao feito com mask."""
    esq, dir_ = cx1, cx2
    arco_topo_dir = f'M{fmt(dir_-r)} {fmt(cy)} A{fmt(r)} {fmt(r)} 0 0 1 {fmt(dir_+r)} {fmt(cy)}'
    arco_base_esq = f'M{fmt(esq-r)} {fmt(cy)} A{fmt(r)} {fmt(r)} 0 0 0 {fmt(esq+r)} {fmt(cy)}'
    W = dir_ + r + traco
    H = cy + r + traco
    defs = (f'<mask id="{idm}a" maskUnits="userSpaceOnUse" x="0" y="0" width="{fmt(W)}" height="{fmt(H)}">'
            f'<rect width="{fmt(W)}" height="{fmt(H)}" fill="#fff"/>'
            f'<path d="{arco_topo_dir}" fill="none" stroke="#000" stroke-width="{fmt(traco+2*folga)}"/></mask>'
            f'<mask id="{idm}b" maskUnits="userSpaceOnUse" x="0" y="0" width="{fmt(W)}" height="{fmt(H)}">'
            f'<rect width="{fmt(W)}" height="{fmt(H)}" fill="#fff"/>'
            f'<path d="{arco_base_esq}" fill="none" stroke="#000" stroke-width="{fmt(traco+2*folga)}"/></mask>')
    corpo = (f'<circle cx="{fmt(esq)}" cy="{fmt(cy)}" r="{fmt(r)}" fill="none" stroke="#000" stroke-width="{fmt(traco)}" mask="url(#{idm}a)"/>'
             f'<circle cx="{fmt(dir_)}" cy="{fmt(cy)}" r="{fmt(r)}" fill="none" stroke="#000" stroke-width="{fmt(traco)}" mask="url(#{idm}b)"/>')
    return defs, corpo


def sinal_alianca():
    return aneis(30.5, 61.5, 46, 25.5, 10, 5, 'al')


# ------------------------------------------------------------------- logos
def svg_logo(W, H, defs, corpo, titulo):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {fmt(W)} {fmt(H)}" '
            f'role="img" aria-label="{titulo}" fill="#000">'
            f'{"<defs>" + defs + "</defs>" if defs else ""}{corpo}</svg>\n')


def logo_linha(slug, nome, sinal, fonte, peso='bold', estilo='normal', tamanho=92, base=80, defs=''):
    ini = 2 + 92 + 20
    t, L = texto(nome, ini, base, fonte, tamanho, SERIF, peso=peso, estilo=estilo)
    W = ini + L + 4
    corpo = f'<g transform="translate(2 4)">{sinal}</g>{t}'
    escreve(os.path.join(DIR_LOGOS, slug + '.svg'), svg_logo(W, 100, defs, corpo, nome))


def logo_dois_niveis(slug, nome, alto, baixo, sinal, defs=''):
    ini = 2 + 92 + 20
    t1, L1 = texto(alto, ini, 40, 'tnr', 38, SERIF)
    t2, L2 = texto(baixo, ini, 92, 'tnrb', 60, SERIF, peso='bold')
    W = ini + max(L1, L2) + 4
    corpo = f'<g transform="translate(2 4)">{sinal}</g>{t1}{t2}'
    escreve(os.path.join(DIR_LOGOS, slug + '.svg'), svg_logo(W, 100, defs, corpo, nome))


def logo_koko():
    # Letras pesadas vazadas num bloco preto. Caixa da letra: 60 de altura, haste 15.
    def K(x, y):
        return (f'<rect x="{x}" y="{y}" width="15" height="60" fill="#000"/>'
                f'<polygon points="{x+15},{y+15} {x+30},{y} {x+51},{y} {x+15},{y+36}" fill="#000"/>'
                f'<polygon points="{x+15},{y+18} {x+57},{y+60} {x+36},{y+60} {x+15},{y+39}" fill="#000"/>')

    def O(x, y):
        return (f'<circle cx="{x+30}" cy="{y+30}" r="30" fill="#000"/>'
                f'<circle cx="{x+30}" cy="{y+30}" r="15" fill="#fff"/>')

    y = 20
    letras = K(22, y) + O(22 + 57 + 8, y) + K(22 + 57 + 8 + 60 + 8, y) + O(22 + 57 + 8 + 60 + 8 + 57 + 8, y)
    W = 22 + 57 + 8 + 60 + 8 + 57 + 8 + 60 + 22
    defs = (f'<mask id="ko" maskUnits="userSpaceOnUse" x="0" y="0" width="{W}" height="100">'
            f'<rect width="{W}" height="100" fill="#fff"/>{letras}</mask>')
    corpo = f'<rect width="{W}" height="100" rx="4" mask="url(#ko)"/>'
    escreve(os.path.join(DIR_LOGOS, 'koko.svg'), svg_logo(W, 100, defs, corpo, 'Koko'))


def logos():
    logo_linha('corrente-limpa', 'Corrente Limpa', sinal_corrente(), 'tnrb')
    logo_dois_niveis('clima-urbano', 'Observatório Clima Urbano', 'Observatório', 'Clima Urbano', sinal_clima())
    logo_linha('saude-em-pauta', 'Saúde em Pauta', sinal_saude(), 'tnrb')
    logo_dois_niveis('vale-do-rio-claro', 'Fundação Vale do Rio Claro', 'Fundação', 'Vale do Rio Claro', sinal_vale())
    ini = 2 + 92 + 20
    t, L = texto('LabDados', ini, 78, 'menlob', 78, MONO, peso='bold')
    escreve(os.path.join(DIR_LOGOS, 'labdados.svg'),
            svg_logo(ini + L + 4, 100, '', f'<g transform="translate(2 4)">{sinal_labdados()}</g>{t}', 'LabDados'))
    defs, corpo = sinal_alianca()
    logo_linha('alianca-democracia', 'Aliança', corpo, 'tnrbi', peso='bold', estilo='italic', defs=defs)
    logo_koko()


# ------------------------------------------------------------------- capas
CW, CH = 1414, 2000
MARGEM = 120
TIT = 112
ENTRE = 118


def titulo_linhas(linhas, y0, x=MARGEM):
    """linhas: lista de (texto, peso). Retorna svg e y da ultima linha."""
    out = []
    y = y0
    for t, peso in linhas:
        fonte = 'tnrb' if peso == 'bold' else 'tnr'
        s, L = texto(t, x, y, fonte, TIT, SERIF, peso=peso)
        assert L <= CW - 2 * MARGEM, (t, L)
        out.append(s)
        y += ENTRE
    return ''.join(out), y - ENTRE


def rotulo_org(nome, x, y, sinal_svg, escala):
    """Sinal pequeno + nome da organizacao em mono, caixa alta, aberto."""
    s = f'<g transform="translate({x} {y}) scale({escala})">{sinal_svg}</g>'
    t, L = texto(nome.upper(), x + 92 * escala + 36, y + 92 * escala / 2 + 12, 'menlo', 34, MONO, folga=1.18)
    return s + t


def svg_capa(fundo, defs, corpo, titulo, xlink=False):
    ns = ' xmlns:xlink="http://www.w3.org/1999/xlink"' if xlink else ''
    return (f'<svg xmlns="http://www.w3.org/2000/svg"{ns} viewBox="0 0 {CW} {CH}" role="img" aria-label="{titulo}">'
            f'{"<defs>" + defs + "</defs>" if defs else ""}'
            f'<rect width="{CW}" height="{CH}" fill="{fundo}"/>{corpo}</svg>\n')


def capa_guia():
    # Alianca: aneis grandes no alto, titulo embaixo, fundo rosa.
    defs_p, sinal_p = sinal_alianca()
    defs_g, aneis_g = aneis(560, 1040, 700, 400, 120, 40, 'ag')
    rot = rotulo_org('Aliança Democracia e Informação', MARGEM, 150, sinal_p, 80 / 92)
    tit, _ = titulo_linhas([('Guia:', 'normal'), ('como declarar apoio', 'bold'),
                            ('e publicidade', 'bold'), ('em conteúdo', 'bold')], 1420)
    corpo = f'<g fill="#000">{rot}{aneis_g}{tit}</g>'
    escreve(os.path.join(DIR_CAPAS, 'guia-declarar-apoio.svg'),
            svg_capa('#ffd9e9', defs_p + defs_g, corpo, 'Guia: como declarar apoio e publicidade em conteúdo'))


def capa_checagem():
    # LabDados: titulo no alto, matriz de celulas no terco de baixo, fundo amarelo.
    rot = rotulo_org('LabDados', MARGEM, 150, sinal_labdados(), 80 / 92)
    tit, _ = titulo_linhas([('Nota técnica:', 'normal'), ('checagem antes', 'bold'), ('de publicar', 'bold')], 460)
    vazias = {(0, 3), (1, 7), (2, 1), (2, 8), (3, 5), (4, 0), (4, 6), (5, 2), (5, 9), (6, 4), (7, 7)}
    cel = []
    for r in range(8):
        for c in range(10):
            x = 119 + c * 120
            y = 1100 + r * 120
            if (r, c) in vazias:
                cel.append(f'<rect x="{x+10}" y="{y+10}" width="76" height="76" fill="none" stroke="#000" stroke-width="20"/>')
            else:
                cel.append(f'<rect x="{x}" y="{y}" width="96" height="96"/>')
    corpo = f'<g fill="#000">{rot}{tit}{"".join(cel)}</g>'
    escreve(os.path.join(DIR_CAPAS, 'checagem-antes-de-publicar.svg'),
            svg_capa('#fffacf', '', corpo, 'Nota técnica: checagem antes de publicar'))


def capa_briefing():
    # INDICA: fundo preto como a capa que ja existe; logo em PNG embutido (branco, reduzido)
    # e o sinal do logotipo ampliado no canto inferior direito.
    from PIL import Image, ImageOps
    import io
    im = Image.open(os.path.join(DIR_LOGOS, 'indica.png')).convert('RGBA')
    im = im.resize((1200, 360), Image.LANCZOS)
    r, g, b, a = im.split()
    branco = Image.merge('RGBA', (ImageOps.invert(r), ImageOps.invert(g), ImageOps.invert(b), a))
    buf = io.BytesIO()
    branco.save(buf, format='PNG', optimize=True)
    b64 = base64.b64encode(buf.getvalue()).decode('ascii')
    logo = (f'<image x="{MARGEM}" y="200" width="300" height="90" '
            f'xlink:href="data:image/png;base64,{b64}"/>')
    tit, _ = titulo_linhas([('Briefing para', 'normal'), ('organizações:', 'normal'),
                            ('contratar criadores', 'bold'), ('sem interferir', 'bold'),
                            ('na edição', 'bold')], 560)
    # sinal do logotipo: retangulo + triangulo, 330x680 no original
    sinal = '<polygon points="0,0 137,0 137,375 330,375 133,680 132,375 0,375"/>'
    esc = 800 / 680
    x = CW - MARGEM - 330 * esc
    motivo = f'<g transform="translate({fmt(x)} 1100) scale({esc:.4f})">{sinal}</g>'
    corpo = f'<g fill="#fff">{logo}{tit}{motivo}</g>'
    escreve(os.path.join(DIR_CAPAS, 'briefing-para-organizacoes.svg'),
            svg_capa('#000000', '', corpo, 'Briefing para organizações: contratar criadores sem interferir na edição', xlink=True))


def capa_clima(slug, fundo, linhas, cx, cy, fase, titulo):
    # Observatorio Clima Urbano: isotermas grandes sangrando no alto, titulo embaixo.
    niveis = []
    R = 1020
    for i in range(9):
        r = R - i * 112
        if r <= 0:
            break
        d = contorno(cx + i * 14, cy + i * 9, r, amp=(0.10, 0.06), fase=fase)
        niveis.append(f'<path d="{d}" fill="none" stroke="#000" stroke-width="16"/>')
    niveis.append(f'<path d="{contorno(cx + 9 * 14, cy + 9 * 9, 60, amp=(0.10, 0.06), fase=fase)}" fill="#000"/>')
    clip = f'<clipPath id="folha"><rect width="{CW}" height="{CH}"/></clipPath>'
    tit, _ = titulo_linhas(linhas, 1420)
    rot = rotulo_org('Observatório Clima Urbano', MARGEM, 1820, sinal_clima(), 80 / 92)
    corpo = f'<g clip-path="url(#folha)">{"".join(niveis)}</g><g fill="#000">{tit}{rot}</g>'
    escreve(os.path.join(DIR_CAPAS, slug + '.svg'), svg_capa(fundo, clip, corpo, titulo))


def capas():
    capa_guia()
    capa_checagem()
    capa_briefing()
    capa_clima('medir-campanhas-de-interesse-publico', '#bee6d7',
               [('Relatório:', 'normal'), ('como medir campanhas', 'bold'), ('de interesse público', 'bold')],
               1010, 380, (0.5, 1.2), 'Relatório: como medir campanhas de interesse público')
    capa_clima('glossario-clima-para-criadores', '#c8e1fa',
               [('Glossário de clima', 'bold'), ('para quem faz', 'bold'), ('conteúdo', 'bold')],
               420, 360, (2.3, 0.4), 'Glossário de clima para quem faz conteúdo')


if __name__ == '__main__':
    os.makedirs(DIR_LOGOS, exist_ok=True)
    os.makedirs(DIR_CAPAS, exist_ok=True)
    logos()
    capas()
