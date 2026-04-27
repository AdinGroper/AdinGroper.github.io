import os
from PIL import Image, ImageOps

media_dir = os.path.join(os.path.dirname(__file__), "Media")
extensions = {".jpg", ".jpeg"}
max_width = 1920
quality = 82

total_before = 0
total_after = 0
count = 0

for root, dirs, files in os.walk(media_dir):
    for filename in files:
        if os.path.splitext(filename)[1].lower() not in extensions:
            continue
        if filename.lower() == "airplane-logo.jpg":
            continue

        path = os.path.join(root, filename)
        size_before = os.path.getsize(path)
        total_before += size_before

        try:
            with Image.open(path) as img:
                img = ImageOps.exif_transpose(img)
                if img.mode in ("RGBA", "P"):
                    img = img.convert("RGB")
                if img.width > max_width:
                    ratio = max_width / img.width
                    new_size = (max_width, int(img.height * ratio))
                    img = img.resize(new_size, Image.LANCZOS)
                img.save(path, "JPEG", quality=quality, optimize=True)

            size_after = os.path.getsize(path)
            total_after += size_after
            count += 1
            print(f"[{count}] {filename}: {size_before//1024}KB -> {size_after//1024}KB")
        except Exception as e:
            print(f"SKIPPED {filename}: {e}")

print(f"\nDone: {count} images")
print(f"Before: {total_before/1024/1024:.1f} MB")
print(f"After:  {total_after/1024/1024:.1f} MB")
print(f"Saved:  {(total_before - total_after)/1024/1024:.1f} MB ({100*(total_before-total_after)//total_before}%)")
