import os

def rename_svg_files_to_lowercase():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    print(f"Scanning directory: {current_dir}")

    for dirpath, _, filenames in os.walk(current_dir):
        for filename in filenames:
            if filename.lower().endswith(".svg") and any(c.isupper() for c in filename):
                old_path = os.path.join(dirpath, filename)
                new_name = filename.lower()
                new_path = os.path.join(dirpath, new_name)

                if old_path == new_path:
                    continue

                # Force rename on case-insensitive FS by using a temp file
                temp_path = os.path.join(dirpath, f"__tmp__{new_name}")
                os.rename(old_path, temp_path)
                os.rename(temp_path, new_path)
                print(f"Renamed: {filename} → {new_name}")

    print("All uppercase .svg files converted to lowercase.")

if __name__ == "__main__":
    rename_svg_files_to_lowercase()
