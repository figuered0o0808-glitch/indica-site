"""Atualiza a identidade da plataforma a partir dos arquivos oficiais da INDICA.
As marcas ficam em public/marca/ e as fontes em public/fonts/.
Para trocar a marca, substitua os arquivos oficiais e execute o build.
"""
from pathlib import Path
raiz = Path(__file__).resolve().parent.parent
for nome in ['indica.png', 'icone.svg', 'icone-32.png', 'icone-180.png', 'icone-192.png', 'compartilhar.png']:
    assert (raiz / 'public/marca' / nome).is_file(), nome
print('Arquivos oficiais da INDICA conferidos.')
