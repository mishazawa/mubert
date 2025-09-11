import os
import glob
import json
from PIL import Image
import numpy as np
from sklearn.cluster import KMeans

# --- CONFIG ---
IMAGE_FOLDER = "../src/images2"          # folder with your images
OUTPUT_FILE = "../src/palettes.js"      # output JS file
NUM_COLORS = 5                   # number of colors per image

def get_palette(image_path, num_colors=5):
    """Extract a color palette from an image using KMeans."""
    img = Image.open(image_path).convert("RGB")
    img = img.resize((200, 200))  # downscale for speed
    data = np.array(img).reshape(-1, 3)

    kmeans = KMeans(n_clusters=num_colors, random_state=0).fit(data)
    colors = kmeans.cluster_centers_.astype(int).tolist()

    # convert to hex
    hex_colors = ["#%02x%02x%02x" % tuple(c) for c in colors]
    return hex_colors

def main():
    palettes = {}
    for filepath in glob.glob(os.path.join(IMAGE_FOLDER, "*")):
        try:
            name = os.path.splitext(os.path.basename(filepath))[0]
            palettes[name] = get_palette(filepath, NUM_COLORS)
            print(f"✔ Extracted palette for {name}")
        except Exception as e:
            print(f"✘ Error processing {filepath}: {e}")

    # Save to JS file
    with open(OUTPUT_FILE, "w") as f:
        f.write("const palettes = ")
        json.dump(palettes, f, indent=2)
        f.write(";\n\nexport default palettes;\n")

    print(f"\n✅ Palettes saved to {OUTPUT_FILE}")

if __name__ == "__main__":
    main()