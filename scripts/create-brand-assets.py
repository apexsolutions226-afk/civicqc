"""Rebuild the social image and illustrative sample PDF. Requires pillow, fonttools, brotli and reportlab."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
from fontTools.ttLib import TTFont as FontToolsFont
from fontTools.varLib.instancer import instantiateVariableFont
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph, Table, TableStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.utils import ImageReader
from reportlab.lib.enums import TA_LEFT

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / 'design-assets'
ASSETS.mkdir(exist_ok=True)
INK = '#0c1923'
TEAL = '#17695e'
AQUA = '#7ce0d1'
MUTED = '#586963'
LINE = '#dce5df'
PAPER = '#f3f6f2'

for family, file in [('Space', 'space-grotesk-latin'), ('Inter', 'inter-latin')]:
    for weight, suffix in [(400, 'Regular'), (600, 'SemiBold')]:
        font = FontToolsFont(ROOT / 'public' / 'fonts' / f'{file}.woff2')
        font.flavor = None
        instance = instantiateVariableFont(font, {'wght': weight}, inplace=True)
        dest = ASSETS / f'{family}-{suffix}.ttf'
        instance.save(dest)
        pdfmetrics.registerFont(TTFont(f'{family}-{suffix}', str(dest)))

# One restrained 1200 x 630 social-sharing card.
im = Image.new('RGB', (1200, 630), INK)
draw = ImageDraw.Draw(im)
for x in range(0, 1200, 60): draw.line([(x, 0), (x, 630)], fill='#152630')
for y in range(0, 630, 60): draw.line([(0, y), (1200, y)], fill='#152630')
photo = Image.open(ROOT / 'public/images/inspection-hero.webp').convert('RGB')
# Crop for a tall portrait keeping the moisture tool visible.
ratio = 410 / 470
crop_w = int(photo.height * ratio)
x = int((photo.width - crop_w) * .8)
photo = photo.crop((x, 0, x + crop_w, photo.height)).resize((410, 470), Image.Resampling.LANCZOS)
im.paste(photo, (745, 80))
draw = ImageDraw.Draw(im)
draw.rounded_rectangle((744, 79, 1156, 551), radius=5, outline='#6b8e83', width=1)
space = lambda size: ImageFont.truetype(str(ASSETS / 'Space-SemiBold.ttf'), size)
inter = lambda size: ImageFont.truetype(str(ASSETS / 'Inter-Regular.ttf'), size)
def mark_pil(x, y, scale=1):
    pts = [(22,2),(40,9),(40,25),(37,32),(30,39),(22,46),(14,41),(7,33),(4,25),(4,9),(22,2)]
    draw.line([(x+a*scale,y+b*scale) for a,b in pts], fill=AQUA, width=2)
    draw.line([(x+12*scale,y+27*scale),(x+12*scale,y+15*scale),(x+20*scale,y+15*scale),(x+20*scale,y+22*scale)],fill=AQUA,width=2)
    draw.line([(x+24*scale,y+14*scale),(x+24*scale,y+10*scale),(x+32*scale,y+10*scale),(x+32*scale,y+22*scale)],fill=AQUA,width=2)
    draw.line([(x+13*scale,y+29*scale),(x+20*scale,y+36*scale),(x+34*scale,y+21*scale)],fill=AQUA,width=3)
mark_pil(54, 56, 1.1)
draw.text((119, 57), 'CivicQC', font=space(37), fill='#f7faf7')
draw.text((121, 101), 'C O N S U L T A N T S', font=inter(10), fill='#b1c8be')
draw.text((59, 181), 'A CLOSER LOOK. A CLEARER DECISION.', font=inter(12), fill=AQUA)
draw.text((55, 219), 'Is your new home', font=space(55), fill='#f7faf7')
draw.text((55, 285), 'truly 100% safe', font=space(55), fill=AQUA)
draw.text((55, 351), '& perfect?', font=space(55), fill=AQUA)
draw.text((59, 449), 'Professional property inspection in Nagpur.', font=inter(17), fill='#b2c8bf')
draw.line((59, 496, 650, 496), fill='#2e4746', width=1)
draw.text((59, 524), '100+ point inspection  |  Photo-based reports', font=inter(14), fill='#c8dcd3')
draw.text((59, 563), '+91 8275363060', font=inter(17), fill=AQUA)
im.save(ROOT / 'public/images/civicqc-social.jpg', quality=92, optimize=True)

# The current sample report shares the website's JSON severity/score data.
import subprocess
import sys
subprocess.run([sys.executable, str(ROOT / 'scripts/create-sample-report.py')], check=True)
