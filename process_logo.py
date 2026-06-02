"""
Logo processor: removes white background, generates all favicon/icon sizes.
Uses flood-fill from corners + feathered edge for clean transparency.
"""
from PIL import Image, ImageFilter, ImageDraw
import numpy as np
import os
import struct
import zlib

SRC = r"C:\Users\Salem\Downloads\logo_v1.1.png"
OUT_DIR = r"D:\Projects\Talha\public"


def remove_white_background(img: Image.Image, threshold: int = 15, feather: int = 2) -> Image.Image:
    """
    Removes near-white background using flood-fill from all four corners,
    then applies a soft feathered edge for clean anti-aliasing.
    threshold: how close to white a pixel must be to count as background
    feather: blur radius for edge softness
    """
    img = img.convert("RGBA")
    data = np.array(img, dtype=np.uint8)

    r, g, b, a = data[:, :, 0], data[:, :, 1], data[:, :, 2], data[:, :, 3]

    # Build mask: near-white pixels
    is_white = (r >= 255 - threshold) & (g >= 255 - threshold) & (b >= 255 - threshold)

    # Flood-fill from each corner to find connected background
    h, w = is_white.shape
    visited = np.zeros((h, w), dtype=bool)

    from collections import deque
    corners = [(0, 0), (0, w - 1), (h - 1, 0), (h - 1, w - 1)]
    queue = deque()
    for cy, cx in corners:
        if is_white[cy, cx] and not visited[cy, cx]:
            queue.append((cy, cx))
            visited[cy, cx] = True

    while queue:
        y, x = queue.popleft()
        for dy, dx in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            ny, nx = y + dy, x + dx
            if 0 <= ny < h and 0 <= nx < w and not visited[ny, nx] and is_white[ny, nx]:
                visited[ny, nx] = True
                queue.append((ny, nx))

    # visited = background; set alpha to 0
    alpha_channel = np.where(visited, 0, 255).astype(np.uint8)

    # Feather edges: blur the alpha mask for smooth anti-aliasing
    if feather > 0:
        alpha_img = Image.fromarray(alpha_channel, mode="L")
        alpha_blurred = alpha_img.filter(ImageFilter.GaussianBlur(radius=feather))
        # Only apply blur near edges (where original alpha transitions)
        alpha_final = np.array(alpha_blurred, dtype=np.uint8)
        # Hard-restore fully opaque interior pixels
        alpha_final[alpha_channel == 255] = 255
        alpha_channel = alpha_final

    data[:, :, 3] = alpha_channel
    return Image.fromarray(data, "RGBA")


def make_png(img: Image.Image, path: str, size: tuple = None):
    if size:
        resized = img.resize(size, Image.LANCZOS)
    else:
        resized = img
    resized.save(path, "PNG", optimize=True)
    print(f"  Saved: {path} ({size or 'original'})")


def make_ico(img: Image.Image, path: str):
    """Save a high-quality .ico with multiple embedded sizes."""
    sizes = [16, 32, 48, 64, 128, 256]
    frames = []
    for s in sizes:
        frame = img.resize((s, s), Image.LANCZOS)
        frames.append(frame)
    # Save ICO — Pillow supports multi-size .ico
    frames[0].save(
        path,
        format="ICO",
        sizes=[(s, s) for s in sizes],
        append_images=frames[1:],
    )
    print(f"  Saved: {path} (multi-size ICO: {sizes})")


def main():
    print("Loading source image...")
    src = Image.open(SRC)
    print(f"  Source: {src.size} mode={src.mode}")

    print("Removing white background...")
    logo = remove_white_background(src, threshold=20, feather=1)

    print("Saving logo assets...")

    # Primary logo — transparent, original resolution
    make_png(logo, os.path.join(OUT_DIR, "logo.png"))

    # High-res copies kept for reference
    make_png(logo, os.path.join(OUT_DIR, "logo-raw.png"))

    # Favicon source (512px square, centered)
    favicon_size = 512
    square = Image.new("RGBA", (favicon_size, favicon_size), (0, 0, 0, 0))
    # Use only the badge (top portion) for favicon — crop the circular emblem
    # The emblem is roughly the top 60% of the logo
    w, h = logo.size
    emblem_crop = logo.crop((0, 0, w, int(h * 0.60)))
    # Fit emblem into square
    ratio = min(favicon_size / emblem_crop.width, favicon_size / emblem_crop.height)
    new_w = int(emblem_crop.width * ratio)
    new_h = int(emblem_crop.height * ratio)
    emblem_resized = emblem_crop.resize((new_w, new_h), Image.LANCZOS)
    offset_x = (favicon_size - new_w) // 2
    offset_y = (favicon_size - new_h) // 2
    square.paste(emblem_resized, (offset_x, offset_y), emblem_resized)

    make_png(square, os.path.join(OUT_DIR, "favicon-source.png"))

    # Standard favicon sizes
    make_png(square, os.path.join(OUT_DIR, "favicon-16x16.png"), (16, 16))
    make_png(square, os.path.join(OUT_DIR, "favicon-32x32.png"), (32, 32))
    make_png(square, os.path.join(OUT_DIR, "favicon-48x48.png"), (48, 48))

    # Apple touch icon (180x180)
    make_png(square, os.path.join(OUT_DIR, "apple-touch-icon.png"), (180, 180))

    # Android Chrome icons
    make_png(square, os.path.join(OUT_DIR, "android-chrome-192x192.png"), (192, 192))
    make_png(square, os.path.join(OUT_DIR, "android-chrome-512x512.png"), (512, 512))

    # .ico — multi-size
    make_ico(square, os.path.join(OUT_DIR, "favicon.ico"))

    print("\nAll logo assets generated successfully.")
    print("Transparent background: YES")


if __name__ == "__main__":
    main()
