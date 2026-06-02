import base64
from PIL import Image
import io

img = Image.open('public/favicon-source.png').convert('RGBA')
buf = io.BytesIO()
img.save(buf, 'PNG', optimize=True)
b64 = base64.b64encode(buf.getvalue()).decode()

svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">\n'
svg += '  <image href="data:image/png;base64,' + b64 + '" x="0" y="0" width="32" height="32"/>\n'
svg += '</svg>\n'

with open('public/favicon.svg', 'w', encoding='utf-8') as f:
    f.write(svg)

print(f'favicon.svg written ({len(b64)} chars base64)')
