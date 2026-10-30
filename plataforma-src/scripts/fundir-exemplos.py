"""Funde os arquivos de exemplo escritos em partes e valida o resultado.

Uso: python3 scripts/fundir-exemplos.py [--gravar]

Sem --gravar, so valida e relata. Com --gravar, escreve calls.json e
articles.json fundidos (o item real que ja existia fica em primeiro) e apaga
as partes.

O que se confere, porque o TypeScript nao confere (o JSON entra convertido as
cegas em src/lib/data.ts):
- todo item tem as chaves obrigatorias do tipo;
- os tres idiomas tem os mesmos slugs, na mesma ordem, e as listas de cada item
  tem o mesmo tamanho;
- todo caminho de logo e de capa aponta para um arquivo que existe em /public;
- status e datas sao coerentes com a data de referencia do site;
- nao ha travessao nem en dash em texto nenhum.
"""

from __future__ import annotations

import glob
import json
import os
import re
import sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IDIOMAS = ("pt", "en", "es")
HOJE = "2026-10-14"

CHAVES_CHAMADA = [
    "slug", "titulo", "status", "tipo", "resumo", "proponente", "apresentacao", "escopo",
    "naoApoiado", "criterios", "banca", "distribuicao", "valorTotal", "faixaApoio",
    "inscricoesAte", "cronograma", "resultado",
]
CHAVES_MATERIAL = [
    "slug", "titulo", "trilha", "autoria", "organizacao", "tema", "palavrasChave", "resumo",
    "formato", "atualizadoEm", "secoes", "arquivos",
]
CHAVES_CURSO = [
    "slug", "titulo", "status", "resumo", "descricao", "paraQuem", "modulos", "duracao",
    "formato", "proximaTurma",
]

PROIBIDOS = re.compile("[—–]")  # travessao e en dash

erros: list[str] = []


def ler(caminho: str):
    with open(caminho, encoding="utf-8") as arquivo:
        return json.load(arquivo)


def varrer_texto(valor, onde: str) -> None:
    if isinstance(valor, str):
        if PROIBIDOS.search(valor):
            erros.append(f"{onde}: travessao ou en dash no texto: {valor[:60]!r}")
        if "!" in valor:
            erros.append(f"{onde}: exclamacao no texto: {valor[:60]!r}")
    elif isinstance(valor, list):
        for i, item in enumerate(valor):
            varrer_texto(item, f"{onde}[{i}]")
    elif isinstance(valor, dict):
        for chave, item in valor.items():
            varrer_texto(item, f"{onde}.{chave}")


def existe_publico(caminho: str | None) -> bool:
    if not caminho:
        return True
    return os.path.exists(os.path.join(RAIZ, "public", caminho.lstrip("/")))


def validar_lista(nome: str, por_idioma: dict[str, list], chaves: list[str]) -> None:
    slugs = {l: [item.get("slug") for item in itens] for l, itens in por_idioma.items()}
    if len({tuple(v) for v in slugs.values()}) != 1:
        erros.append(f"{nome}: slugs diferem entre idiomas: {slugs}")
        return
    for l, itens in por_idioma.items():
        for item in itens:
            onde = f"{nome}/{l}/{item.get('slug')}"
            for chave in chaves:
                if chave not in item:
                    erros.append(f"{onde}: falta a chave {chave}")
            varrer_texto(item, onde)
            for campo in ("logoOrganizacao", "capa"):
                if campo in item and not existe_publico(item[campo]):
                    erros.append(f"{onde}: {campo} aponta para arquivo inexistente: {item[campo]}")
            if nome == "chamadas":
                status, ate = item.get("status"), item.get("inscricoesAte")
                if status == "aberta" and ate and ate < HOJE:
                    erros.append(f"{onde}: aberta com inscricoes ate {ate}, antes de {HOJE}")
                if status == "encerrada" and ate and ate > HOJE:
                    erros.append(f"{onde}: encerrada com inscricoes ate {ate}, depois de {HOJE}")
                if item.get("valorTotal") is None and not item.get("apoioDescricao"):
                    erros.append(f"{onde}: sem valor e sem apoioDescricao")
                res = item.get("resultado")
                if res:
                    soma = sum(a.get("valor", 0) for a in res.get("apoiados", []))
                    if item.get("valorTotal") and soma > item["valorTotal"]:
                        erros.append(f"{onde}: apoiados somam {soma}, acima do total {item['valorTotal']}")
    # paridade de tamanhos de lista entre idiomas
    base = por_idioma["pt"]
    for l in ("en", "es"):
        for a, b in zip(base, por_idioma[l]):
            for chave, valor in a.items():
                if isinstance(valor, list) and isinstance(b.get(chave), list) and len(valor) != len(b[chave]):
                    erros.append(f"{nome}/{l}/{a.get('slug')}: lista {chave} tem {len(b[chave])} itens, pt tem {len(valor)}")


def fundir(nome: str, base: str, padrao: str) -> dict[str, list]:
    por_idioma: dict[str, list] = {}
    for l in IDIOMAS:
        pasta = os.path.join(RAIZ, "data", l)
        itens = list(ler(os.path.join(pasta, base)))
        partes = sorted(glob.glob(os.path.join(pasta, padrao)))
        for parte in partes:
            itens.extend(ler(parte))
        por_idioma[l] = itens
        print(f"  {nome}/{l}: {len(itens)} itens ({len(partes)} partes)")
    return por_idioma


def main() -> int:
    gravar = "--gravar" in sys.argv
    print("chamadas")
    chamadas = fundir("chamadas", "calls.json", "calls.parte-*.json")
    print("materiais")
    materiais = fundir("materiais", "articles.json", "articles.parte*.json")
    print("cursos")
    cursos = {l: ler(os.path.join(RAIZ, "data", l, "courses.json")) for l in IDIOMAS}
    for l, itens in cursos.items():
        print(f"  cursos/{l}: {len(itens)} itens")

    validar_lista("chamadas", chamadas, CHAVES_CHAMADA)
    validar_lista("materiais", materiais, CHAVES_MATERIAL)
    validar_lista("cursos", cursos, CHAVES_CURSO)

    if erros:
        print(f"\n{len(erros)} problema(s):")
        for erro in erros:
            print("  -", erro)
        return 1

    print("\nvalido nos tres idiomas")
    if gravar:
        for l in IDIOMAS:
            pasta = os.path.join(RAIZ, "data", l)
            for base, itens, padrao in (
                ("calls.json", chamadas[l], "calls.parte-*.json"),
                ("articles.json", materiais[l], "articles.parte*.json"),
            ):
                with open(os.path.join(pasta, base), "w", encoding="utf-8") as arquivo:
                    json.dump(itens, arquivo, ensure_ascii=False, indent=2)
                    arquivo.write("\n")
                for parte in glob.glob(os.path.join(pasta, padrao)):
                    os.remove(parte)
        print("gravado e partes removidas")
    return 0


if __name__ == "__main__":
    sys.exit(main())
