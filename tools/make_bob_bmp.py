"""Dessine Bob (le chef robot) en BMP pour l'installeur Windows : tools/make_bob_bmp.py
Ecrit src-tauri/installer/bob.bmp (150x215) et bob-side.bmp (164x314, pour la page de bienvenue)."""
import os
from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(os.path.dirname(HERE), 'src-tauri', 'installer')
BG = (255, 246, 236)
S = 4  # on dessine 4 fois plus grand, puis on reduit : bords lisses


def bob(w, h, bg=BG):
    img = Image.new('RGB', (w * S, h * S), bg)
    d = ImageDraw.Draw(img)
    cx = w * S // 2
    u = w * S / 160.0   # une unite = 1/160 de la largeur

    def rr(x0, y0, x1, y1, r, fill, outline=None, width=0):
        d.rounded_rectangle([cx + x0 * u, y0 * u, cx + x1 * u, y1 * u], radius=r * u, fill=fill, outline=outline, width=int(width * u))

    def el(x0, y0, x1, y1, fill, outline=None, width=0):
        d.ellipse([cx + x0 * u, y0 * u, cx + x1 * u, y1 * u], fill=fill, outline=outline, width=int(width * u))

    off = 0  # decalage vertical : la toque commence en haut
    # ombre
    el(-38, 190, 38, 200, (225, 212, 196))
    # corps violet et tablier
    rr(-32, 112, 32, 168, 14, (111, 69, 217))
    rr(-24, 118, 24, 166, 12, (255, 255, 255), (230, 224, 216), 1)
    d.polygon([(cx - 6 * u, 134 * u), (cx + 6 * u, 134 * u), (cx, 148 * u)], fill=(233, 30, 99))
    # bras et fouet
    d.line([(cx - 32 * u, 122 * u), (cx - 52 * u, 148 * u)], fill=(155, 109, 255), width=int(9 * u))
    d.line([(cx + 32 * u, 122 * u), (cx + 52 * u, 148 * u)], fill=(155, 109, 255), width=int(9 * u))
    el(-62, 144, -44, 162, (52, 48, 62)); el(44, 144, 62, 162, (52, 48, 62))
    d.line([(cx + 53 * u, 150 * u), (cx + 66 * u, 104 * u)], fill=(180, 180, 190), width=int(3 * u))
    el(58, 76, 78, 108, None, (170, 170, 180), 2)
    # tete : coque sombre, contour violet, visiere
    rr(-62, 34, 62, 124, 30, (155, 109, 255))
    rr(-58, 38, 58, 120, 28, (52, 48, 62))
    rr(-48, 48, 48, 112, 22, (10, 8, 16))
    rr(-6 - 56, 62, -6 - 56 + 0, 62, 0, None)
    # oreilles
    rr(-70, 62, -62, 94, 4, (155, 109, 255)); rr(62, 62, 70, 94, 4, (155, 109, 255))
    # yeux
    for ex in (-24, 24):
        el(ex - 11, 62, ex + 11, 92, (255, 214, 10))
        el(ex + 1, 66, ex + 7, 72, (255, 255, 255))
    # joues et bouche
    el(-40, 92, -28, 102, (233, 100, 130)); el(28, 92, 40, 102, (233, 100, 130))
    d.arc([cx - 16 * u, 88 * u, cx + 16 * u, 108 * u], 20, 160, fill=(255, 214, 10), width=int(3 * u))
    # toque
    for (x0, y0, x1, y1) in [(-58, 12, -14, 44), (-24, -2, 24, 40), (14, 12, 58, 44), (-40, 2, 4, 34), (-4, 2, 40, 34)]:
        el(x0, y0 + 6, x1, y1 + 6, (255, 255, 255), (226, 220, 210), 1)
    rr(-52, 32, 52, 50, 8, (255, 255, 255), (226, 220, 210), 1)
    rr(-52, 38, 52, 50, 6, (245, 240, 232))
    return img.resize((w, h), Image.LANCZOS)


os.makedirs(OUT, exist_ok=True)
bob(150, 215).save(os.path.join(OUT, 'bob.bmp'), 'BMP')
side = Image.new('RGB', (164, 314), BG)
side.paste(bob(150, 215), (7, 60))
side.save(os.path.join(OUT, 'bob-side.bmp'), 'BMP')
# L'en-tete (150x57) : le nom du jeu sur fond beige
head = Image.new('RGB', (150, 57), (212, 149, 107))
dd = ImageDraw.Draw(head)
dd.text((12, 18), 'P2DS', fill=(255, 255, 255))
head.save(os.path.join(OUT, 'header.bmp'), 'BMP')
print('ok')
