"""Splits Soomin's single-file Tale Studio prototype into pieces the site can
mount natively (no iframe):

  public/proto/tale-studio/index.html   the original file, for "open full screen"
  public/proto/tale/*.js                 mermaid + her flow / prototype / spec code
  public/proto/tale/tale.css             her CSS, scoped under .tale-wb, dark tokens
  src/components/tale/tale-body.ts       the page skeleton those scripts fill in

Re-run after replacing the source:  python3 scripts/build-tale-workbench.py <TaleStudio.html>
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "public/proto/tale-studio/index.html"
OUT_JS = ROOT / "public/proto/tale"
SCOPE = ".tale-wb"

html = SRC.read_text(encoding="utf-8")
scripts = [m.group(1) for m in re.finditer(r"<script[^>]*>(.*?)</script>", html, re.S)]
css = "\n".join(re.findall(r"<style[^>]*>(.*?)</style>", html, re.S))
body = re.search(r"<body[^>]*>(.*?)<script", html, re.S).group(1)

# Script order in the source: embed-shim, mermaid, flow data, flow view, prototype, glue, spec.
names = ["embed", "mermaid", "flow-data", "flow-view", "proto", "glue", "spec"]
parts = dict(zip(names, scripts))
assert len(scripts) == len(names), f"expected {len(names)} scripts, got {len(scripts)}"


def sub(src: str, old: str, new: str) -> str:
    assert old in src, f"patch target not found: {old[:60]}"
    return src.replace(old, new)


WB = "document.getElementById('taleWb')"

# --- flow view: read tokens from the workbench, not <html>
parts["flow-view"] = sub(
    parts["flow-view"],
    "getComputedStyle(document.documentElement)",
    f"getComputedStyle({WB} || document.documentElement)",
)

# --- glue: tab state lives on the workbench; don't touch the site's URL
parts["glue"] = sub(parts["glue"], "document.body.getAttribute('data-tt')", f"{WB}.getAttribute('data-tt')")
parts["glue"] = sub(parts["glue"], "if (history.replaceState) history.replaceState(null, '', '#' + id);", "")
parts["glue"] = sub(parts["glue"], "var start = location.hash.slice(1);", "var start = '';")

# --- spec / tabs
parts["spec"] = sub(parts["spec"], "document.querySelector('.wrap > .top')", "document.querySelector('.tw-wrap > .top')")
parts["spec"] = sub(parts["spec"], "document.body.setAttribute('data-tt', t);", f"{WB}.setAttribute('data-tt', t);")
parts["spec"] = sub(
    parts["spec"],
    "if (!keepScroll) window.scrollTo({ top: 0, behavior: 'smooth' });",
    f"if (!keepScroll) {WB}.scrollIntoView({{ behavior: 'smooth', block: 'start' }});",
)
parts["spec"] = sub(
    parts["spec"],
    "try { var qt = new URLSearchParams(location.search).get('tab');",
    "window.TaleSetTab = function (t) { setTab(t); };\n  try { var qt = window.TALE_START_TAB;",
)

OUT_JS.mkdir(parents=True, exist_ok=True)
for n in names[1:]:
    (OUT_JS / f"{n}.js").write_text(parts[n], encoding="utf-8")

# --- CSS scoping -------------------------------------------------------------

def scope_selector(sel: str) -> str:
    out = []
    for s in sel.split(","):
        s = s.strip()
        if not s:
            continue
        s = s.replace(".wrap", ".tw-wrap")
        if s.startswith(":root"):
            s = SCOPE + s[len(":root"):]
            # light/dark switches: the site is always dark
            s = s.replace(':not([data-theme="light"])', "").replace('[data-theme="dark"]', "")
        elif s.startswith("html.embed"):
            s = SCOPE + s[len("html.embed"):]
        elif s.startswith("html"):
            s = SCOPE + s[len("html"):]
        elif s.startswith("body"):
            s = SCOPE + s[len("body"):]
        elif s == "*" or s.startswith("*"):
            s = f"{SCOPE} {s}"
        else:
            s = f"{SCOPE} {s}"
        out.append(s)
    return ", ".join(out)


def scope_css(text: str) -> str:
    text = re.sub(r"/\*.*?\*/", "", text, flags=re.S)
    res, i, n = [], 0, len(text)
    while i < n:
        j = text.find("{", i)
        if j < 0:
            break
        head = text[i:j].strip()
        # find matching brace
        depth, k = 1, j + 1
        while depth and k < n:
            if text[k] == "{":
                depth += 1
            elif text[k] == "}":
                depth -= 1
            k += 1
        inner = text[j + 1 : k - 1]
        if head.startswith("@media"):
            # the dark-mode media query becomes unconditional
            if "prefers-color-scheme: dark" in head:
                res.append(scope_css(inner))
            elif "prefers-color-scheme: light" in head:
                pass
            else:
                res.append(f"{head}{{{scope_css(inner)}}}")
        elif head.startswith("@"):
            res.append(f"{head}{{{inner}}}")
        else:
            res.append(f"{scope_selector(head)}{{{inner}}}")
        i = k
    return "\n".join(res)


scoped = scope_css(css)
# Site look: neon accent on the near-black panels, site fonts.
scoped += f"""
{SCOPE}{{--font:var(--font-pretendard),"Pretendard",system-ui,sans-serif;--mono:"JetBrains Mono",ui-monospace,monospace;
--bg:#070b14;--surface:#0c1220;--line:#1f2a3a;--accent:#00f0ff;--accent-soft:#0b2a33;
background:var(--bg);color:var(--ink);font:14px/1.55 var(--font);border:1px solid rgba(0,240,255,.25)}}
{SCOPE} .tw-wrap{{max-width:none;margin:0;padding:12px}}
{SCOPE} #pageTop{{display:none}}
{SCOPE} .tt-nav{{position:sticky;top:64px;z-index:5}}
"""
(OUT_JS / "tale.css").write_text(scoped, encoding="utf-8")

body = body.replace('class="wrap"', 'class="tw-wrap"')
ts = (
    "// Generated by scripts/build-tale-workbench.py — do not edit by hand.\n"
    f"export const TALE_BODY = {json.dumps(body.strip(), ensure_ascii=False)};\n"
)
(ROOT / "src/components/tale").mkdir(parents=True, exist_ok=True)
(ROOT / "src/components/tale/tale-body.ts").write_text(ts, encoding="utf-8")

full = ROOT / "public/proto/tale-studio/index.html"
if SRC.resolve() != full.resolve():
    full.parent.mkdir(parents=True, exist_ok=True)
    full.write_text(html, encoding="utf-8")
print("ok:", ", ".join(f"{n}.js" for n in names[1:]), "+ tale.css + tale-body.ts")
