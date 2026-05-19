"""
Crop clean panels out of Restaurant Guru composite photos.
Every composite has a cartoon butler mascot in one panel (RG branding watermark).
This script keeps only the panels without the butler and without the pole stage.
"""
from PIL import Image
from pathlib import Path

SRC = Path("/home/tcscott1231/NFWD/Bar_Guau_Guau/assets")
DEST = SRC / "clean"
DEST.mkdir(exist_ok=True)

def crop(src_name, box, out_name):
    img = Image.open(SRC / src_name)
    w, h = img.size
    left, top, right, bottom = box
    out = img.crop((int(left * w), int(top * h), int(right * w), int(bottom * h)))
    out.save(DEST / out_name, "JPEG", quality=92)
    print(f"{src_name} -> {out_name}: {out.size}")

# exterior_1.jpg (444x645) -- top row has butler, bottom row split into 2 clean panels
crop("exterior_1.jpg", (0.01, 0.57, 0.49, 0.99), "sign_mural.jpg")
crop("exterior_1.jpg", (0.51, 0.57, 0.99, 0.99), "sign_crowd_red.jpg")

# interior_1.jpg (486x645) -- top has butler, bottom-right is pole stage; only bottom-left is usable
crop("interior_1.jpg", (0.01, 0.51, 0.49, 0.99), "bar_counter_red.jpg")

# interior_2.jpg (452x645) -- bottom panel has butler; top split into 2 clean
crop("interior_2.jpg", (0.01, 0.01, 0.49, 0.49), "exterior_day_bike.jpg")
crop("interior_2.jpg", (0.52, 0.01, 0.99, 0.49), "exterior_night_mural.jpg")

# interior_3.jpg (486x645) -- 2x2 grid, top-right has butler; other 3 clean
crop("interior_3.jpg", (0.01, 0.01, 0.49, 0.49), "girls_bikes.jpg")
crop("interior_3.jpg", (0.01, 0.51, 0.49, 0.99), "exterior_crowd_distant.jpg")
crop("interior_3.jpg", (0.56, 0.51, 0.99, 0.99), "mural_closeup.jpg")

# interior_4.jpg (762x645) -- bottom panel has butler; top split into 2 clean (top row ends ~0.45)
crop("interior_4.jpg", (0.01, 0.01, 0.49, 0.34), "motorcycle_street.jpg")
crop("interior_4.jpg", (0.51, 0.01, 0.99, 0.34), "rally_stage.jpg")

# dish_1.jpg (524x645) -- top has butler, bottom-left is flood (skip), bottom-right is gold logo shot
crop("dish_1.jpg", (0.51, 0.51, 0.99, 0.99), "diamond_g_sign_lit.jpg")

print("\nDone. Clean panels saved to", DEST)
