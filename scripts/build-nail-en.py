"""English build of the NAIL chatbot prototype.

public/proto/nail-search/index.html (Korean, the original) →
public/proto/nail-search/en/index.html. Every Korean text segment is swapped
via the NAIL_EN table in scripts/nail-en.py (same order as SEG below finds
them); the keyword stopword regex gets English stopwords.

Run after editing the Korean file:  python3 scripts/build-nail-en.py
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "public/proto/nail-search/index.html"
OUT = ROOT / "public/proto/nail-search/en/index.html"
exec((ROOT / "scripts/nail-en.py").read_text(encoding="utf-8"))  # defines NAIL_EN

SEG = re.compile(r"[^<>\"'`{}$\n]*[가-힣][^<>\"'`{}$\n]*")


def segments(html: str) -> list[str]:
    s = re.sub(r"<style[^>]*>.*?</style>", "", html, flags=re.S)
    s = re.sub(r"(?m)^\s*//.*$", "", s)
    s = re.sub(r"<!--.*?-->", "", s, flags=re.S)
    s = re.sub(r"/\*.*?\*/", "", s, flags=re.S)
    return list(dict.fromkeys(x.strip() for x in SEG.findall(s) if x.strip()))


html = SRC.read_text(encoding="utf-8")
ko = segments(html)
assert len(ko) == len(NAIL_EN), f"{len(ko)} Korean segments vs {len(NAIL_EN)} translations — update scripts/nail-en.py"
# Typographic apostrophe: a plain ' would end the single-quoted JS strings
# many of these segments live in.
table = {k: e.replace("'", "\u2019") for k, e in zip(ko, NAIL_EN) if e is not None}
assert not any('"' in e for e in table.values()), "use “ ” instead of straight double quotes"

# Split off <style> blocks so CSS is never touched.
parts = re.split(r"(<style[^>]*>.*?</style>)", html, flags=re.S)


def swap(m: re.Match) -> str:
    raw = m.group(0)
    core = raw.strip()
    if core not in table:
        return raw
    lead = raw[: len(raw) - len(raw.lstrip())]
    trail = raw[len(raw.rstrip()):]
    return lead + table[core] + trail


out = "".join(p if p.startswith("<style") else SEG.sub(swap, p) for p in parts)

# Keyword extraction: add English stopwords next to the Korean ones.
out = out.replace(
    "const stop=/^(어떤|",
    "const stop=/^(what|which|how|why|who|is|are|was|were|the|a|an|of|to|in|on|for|about|me|my|i|show|find|tell|explain|any|there|do|does|did|want|this|that|and|or|with|related|material|some|can|could|would|please|어떤|",
)
assert "const stop=/^(what|" in out
# Doc-type colours are CSS keyed on the (now translated) type label.
for k in re.findall(r'data-k="([^"]*[\uac00-\ud7a3][^"]*)"', out):
    out = out.replace(f'data-k="{k}"', f'data-k="{table[k]}"')
out = out.replace('<html lang="ko">', '<html lang="en">')
OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(out, encoding="utf-8")
left = [l.strip()[:120] for l in out.splitlines() if re.search("[가-힣]", l)]
print(f"wrote {OUT.relative_to(ROOT)} — lines still containing Korean: {len(left)}")
for l in left:
    print("  ", l)
