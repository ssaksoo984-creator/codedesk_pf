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

# --- English build: every Korean string literal in the flow / chart / spec
# code swapped via scripts/tale-en.json (prototype screens: see proto_en below).
EN = json.loads((ROOT / "scripts/tale-en.json").read_text(encoding="utf-8"))
LIT = re.compile(r"'((?:[^'\\\n]|\\.)*)'|\"((?:[^\"\\\n]|\\.)*)\"")
HANGUL = re.compile("[\uac00-\ud7a3]")


def to_en(src: str, name: str) -> str:
    # only comments that start a line — "/*" also appears inside strings (accept="image/*")
    src = re.sub(r"(?m)^[ \t]*/\*.*?\*/", "", src, flags=re.S)
    src = re.sub(r"(?m)^\s*//.*$", "", src)
    missing = []

    def rep(m):
        single = m.group(1) is not None
        val = m.group(1) if single else m.group(2)
        if not HANGUL.search(val):
            return m.group(0)
        en = EN["strings"].get(val)
        if en is None:
            missing.append(val)
            return m.group(0)
        q = "'" if single else '"'
        return q + en.replace("\\", "\\\\").replace(q, "\\" + q) + q

    out = LIT.sub(rep, src)
    if missing:
        print(f"  {name}: {len(missing)} untranslated, e.g. {missing[:3]}")
    return out


for n in ["flow-data", "flow-view", "glue", "spec"]:
    (OUT_JS / f"{n}.en.js").write_text(to_en(parts[n], n), encoding="utf-8")

# --- English prototype screens. Same literal swap (own string table), plus:
# the regexes that read what a visitor types in the mock chat get English
# keywords next to the Korean ones, so typing English in the prototype works.
PROTO_RE = {
    "/고장|자판기|웃기|엉뚱/": r"/고장|자판기|웃기|엉뚱|broke|vending|funny|absurd|comedy/i",
    "/귀신|무서|밤 열|CCTV/": r"/귀신|무서|밤 열|CCTV|ghost|scary|horror|haunt/i",
    "/사랑|설레|옥상에서 마주/": r"/사랑|설레|옥상에서 마주|love|crush|romance|rooftop/i",
    "/가족|아버지|엄마|딸|아들/": r"/가족|아버지|엄마|딸|아들|family|father|\bdad\b|mother|\bmom\b|daughter|\bson\b/i",
    "/로봇|우주|미래|시간/": r"/로봇|우주|미래|시간|robot|space|future|another world/i",
    "/범인|단서|사라진/": r"/범인|단서|사라진|culprit|clue|missing|vanish|mystery/i",
    "/(\\d+)\\s*(초|분)/": r"/(\d+)\s*(초|분|sec|seconds?|s\b|min|minutes?|m\b)/i",
    "/숏폼|쇼츠/": r"/숏폼|쇼츠|short-form|shorts|reels?/i",
    "/단편/": r"/단편|short film/i",
    "/그대로/": r"/그대로|keep as is|as is|keep it/i",
    "/다듬/": r"/다듬|polish/i",
    "/새롭게|키워|새로/": r"/새롭게|키워|새로|grow it|make it new|\bnew\b/i",
    "/세로/": r"/세로|vertical|portrait|9:16/i",
    "/가로/": r"/가로|landscape|horizontal|16:9/i",
    "/^(카메라|액션): /": r"/^(카메라|액션|Camera|Action): /",
    "/틸트|크레인/": r"/틸트|크레인|tilt|crane/i",
    "/전체|모든|다/": r"/전체|모든|다|\ball\b|every/i",
    "/추가|넣어/": r"/추가|넣어|\badd\b|insert/i",
    "/S\\d+(\\s*-\\s*\\d+)?\\s*(다음에|뒤에|에)?/": r"/S\d+(\s*-\s*\d+)?\s*(다음에|뒤에|에| after| to)?/",
    "/(샷\\s*)?(하나\\s*)?(추가|넣어)\\s*(해\\s*줘|해주세요|해)?/": r"/(샷\s*)?(하나\s*)?(추가|넣어)\s*(해\s*줘|해주세요|해)?|(please\s*)?(add|insert)\s*(a\s*|one\s*)?(shot\s*)?(of\s*)?/i",
    "/익스트림 클로즈업|ECU/i": r"/익스트림 클로즈업|ECU|extreme close/i",
    "/미디엄 클로즈업|MCU/i": r"/미디엄 클로즈업|MCU|medium close/i",
    "/클로즈업|CU\\b|가까이/i": r"/클로즈업|CU\b|가까이|close-?up|closer/i",
    "/미디엄 풀|MFS/i": r"/미디엄 풀|MFS|medium full/i",
    "/미디엄|MS\\b/i": r"/미디엄|MS\b|medium/i",
    "/풀\\s*샷|전신|FS\\b/i": r"/풀\s*샷|전신|FS\b|full shot|full body/i",
    "/익스트림 와이드|EWS/i": r"/익스트림 와이드|EWS|extreme wide/i",
    "/와이드|넓게|WS\\b/i": r"/와이드|넓게|WS\b|\bwide/i",
    "/어깨|OTS/i": r"/어깨|OTS|shoulder/i",
    "/시점|POV/i": r"/시점|POV|point of view/i",
    "/투\\s*샷|2S/i": r"/투\s*샷|2S|two shot/i",
    "/로우|올려다/": r"/로우|올려다|\blow\b|looking up/i",
    "/하이|내려다/": r"/하이|내려다|\bhigh\b|looking down/i",
    "/버드|위에서 수직/": r"/버드|위에서 수직|bird/i",
    "/웜즈|바닥에서/": r"/웜즈|바닥에서|worm/i",
    "/더치|기울/": r"/더치|기울|dutch|tilted/i",
    "/아이\\s*레벨|눈높이/": r"/아이\s*레벨|눈높이|eye level/i",
    "/핸드헬드|흔들/": r"/핸드헬드|흔들|handheld|shaky/i",
    "/크레인/": r"/크레인|crane/i",
    "/따라|트래킹/": r"/따라|트래킹|track|follow/i",
    "/다가|달리 인|줌 인/": r"/다가|달리 인|줌 인|dolly in|zoom in|push in|move in/i",
    "/멀어|달리 아웃/": r"/멀어|달리 아웃|dolly out|pull out|pull back/i",
    "/팬/": r"/팬|\bpan\b/i",
    "/틸트/": r"/틸트|tilt/i",
    "/고정/": r"/고정|static|locked off/i",
    "/촛불|아주 따뜻/": r"/촛불|아주 따뜻|candle|very warm/i",
    "/따뜻|노을|주황/": r"/따뜻|노을|주황|warm|sunset|orange/i",
    "/차갑|푸른|파랗/": r"/차갑|푸른|파랗|\bcool|\bcold|blue/i",
    "/흐린/": r"/흐린|overcast|cloudy/i",
    "/한낮|햇빛|주광/": r"/한낮|햇빛|주광|daylight|sunlight|midday/i",
    "/역광|실루엣/": r"/역광|실루엣|backlight|silhouette/i",
    "/왼쪽/": r"/왼쪽|\bleft\b/i",
    "/오른쪽/": r"/오른쪽|\bright\b/i",
    "/아래에서|무섭/": r"/아래에서|무섭|from below|scary/i",
    "/위에서 (빛|조명)/": r"/위에서 (빛|조명)|from above|overhead/i",
    "/정면/": r"/정면|\bfront\b/i",
    "/어둡|어둑|밤/": r"/어둡|어둑|밤|dark|\bdim\b|night/i",
    "/밝게|환하/": r"/밝게|환하|bright/i",
    "/(\\d+)\\s*초/": r"/(\d+)\s*(?:초|sec|s\b)/i",
    "/빠르|짧게/": r"/빠르|짧게|fast|\bshort/i",
    "/느리|길게/": r"/느리|길게|slow|\blong/i",
    "/다시\\s*(써|쓰)/": r"/다시\s*(써|쓰)|rewrite|write it again/i",
    "/추가|새 인물|새 배경|넣어/": r"/추가|새 인물|새 배경|넣어|\badd\b|new character|new set/i",
    "/이전|돌아가|돌려|전에 만든/": r"/이전|돌아가|돌려|전에 만든|previous|go back|revert|back to|earlier/i",
    "/예시/": r"/예시|example/i",
    "/사람들|누군가|행인/": r"/사람들|누군가|행인|people|someone|passers?-?by/i",
}
PROTO_PATCH = [
    # minutes vs seconds: the unit literal '분' is now 'min'
    ("m[2] === 'min' ? 60 : 1", "/^(분|m)/i.test(m[2]) ? 60 : 1"),
    # an 18-character cut suits Korean titles; in English cut on words, and
    # keep the sample story's own title when the sample idea is used
    ("st.title = t.split(/[.,\\n]/)[0].slice(0, 18) || st.title;",
     "st.title = t === initial().idea ? st.title : (t.split(/[.,\\n—]/)[0].split(/\\s+/).slice(0, 5).join(' ') || st.title);"),
]


def proto_en(src: str) -> str:
    saved = EN["strings"]
    EN["strings"] = EN["proto"]
    try:
        out = to_en(src, "proto")
    finally:
        EN["strings"] = saved
    for ko, en in PROTO_RE.items():
        assert ko in out, f"regex not found: {ko}"
        out = out.replace(ko, en)
    for a, b in PROTO_PATCH:
        assert a in out, f"patch target not found: {a}"
        out = out.replace(a, b)
    return out


(OUT_JS / "proto.en.js").write_text(proto_en(parts["proto"]), encoding="utf-8")

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
body_en = body
for ko, en in EN["body"]:
    body_en = body_en.replace(ko, en)
ts = (
    "// Generated by scripts/build-tale-workbench.py — do not edit by hand.\n"
    f"export const TALE_BODY = {json.dumps(body.strip(), ensure_ascii=False)};\n"
    f"export const TALE_BODY_EN = {json.dumps(body_en.strip(), ensure_ascii=False)};\n"
)
(ROOT / "src/components/tale").mkdir(parents=True, exist_ok=True)
(ROOT / "src/components/tale/tale-body.ts").write_text(ts, encoding="utf-8")

full = ROOT / "public/proto/tale-studio/index.html"
if SRC.resolve() != full.resolve():
    full.parent.mkdir(parents=True, exist_ok=True)
    full.write_text(html, encoding="utf-8")
print("ok:", ", ".join(f"{n}.js" for n in names[1:]), "+ tale.css + tale-body.ts")
