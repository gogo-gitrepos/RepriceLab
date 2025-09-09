from __future__ import annotations
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
GLOBS = ["backend/app/**/*.py"]

def fix_file(p: pathlib.Path) -> None:
    text = p.read_bytes().decode("utf-8", errors="replace")
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    text = text.replace("\t", "    ")
    if not text.endswith("\n"):
        text += "\n"
    p.write_text(text, encoding="utf-8")

if __name__ == "__main__":
    for pattern in GLOBS:
        for f in ROOT.glob(pattern):
            if "__pycache__" in f.parts:
                continue
            fix_file(f)
    print("✅ Whitespace normalize edildi.")
