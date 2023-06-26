# https://github.com/AceLewis/fontcrusher
import fontcrusher
from fontcrusher import find_used_glyphs, get_glyph_name

# Load in fonts
regular_font = fontcrusher.load_the_font('./fa-regular-400.ttf')
solid_font = fontcrusher.load_the_font('./fa-solid-900.ttf')

# Get all glyphs
solid_glyphs = []
regular_glyphs = []
with open('./icons-list.txt', 'r') as f:
  lines = f.readlines()
  for line in lines:
    line = line.rstrip('\n')
    if not line:
      continue
    pack, icon = line.strip().replace('fa-', '').split(' ', 1)
    if pack == 'solid':
      solid_glyphs.append(icon)
    elif pack == 'regular':
      regular_glyphs.append(icon)

# Create a new font object with only the glyphs used
crushed_regular_font = fontcrusher.crush_font(regular_font, regular_glyphs)
crushed_solid_font = fontcrusher.crush_font(solid_font, solid_glyphs)

# Save a woff2 font
crushed_regular_font.flavor = 'woff2'
crushed_regular_font.save('../../src/assets/fonts/fa-regular-400-set.woff2')

crushed_solid_font.flavor = 'woff2'
crushed_solid_font.save('../../src/assets/fonts/fa-solid-900-set.woff2')