"""Builds public/media/Soomin_Park_Resume.pdf (EN) and _KO.pdf.

Edit the RESUME data below, then run:  python3 scripts/build-resume.py
The FAQ chatbot (src/lib/resume-faq.ts) is written from the same facts —
update both together.
"""
from pathlib import Path

from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_JUSTIFY
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import HRFlowable, ListFlowable, ListItem, Paragraph, SimpleDocTemplate, Spacer

ROOT = Path(__file__).resolve().parent.parent
PRET = ROOT / "node_modules/pretendard/dist/public/static/alternative"
pdfmetrics.registerFont(TTFont("Pret", str(PRET / "Pretendard-Regular.ttf")))
pdfmetrics.registerFont(TTFont("Pret-Bold", str(PRET / "Pretendard-Bold.ttf")))
pdfmetrics.registerFontFamily("Pret", normal="Pret", bold="Pret-Bold", italic="Pret", boldItalic="Pret-Bold")

GREY = HexColor("#555555")
RULE = HexColor("#999999")

RESUME = {
    "en": {
        "file": "Soomin_Park_Resume.pdf",
        "font": ("Helvetica", "Helvetica-Bold", "Helvetica-Oblique"),
        "name": "SOOMIN PARK",
        "title": "UI/UX Designer",
        "contact": [
            "Burnaby, BC  ·  Permanent Resident  ·  ssssssu984@gmail.com",
            "codedesk-studio.online  ·  linkedin.com/in/soomin-park-codedesk  ·  Korean (native) / English (professional working)",
        ],
        "summary": "UI/UX designer with 7 years of experience across public-sector, commerce, and small-business projects in Korea and Canada. I work on information architecture, user flows, and interface design — how features should be grouped, where they belong on screen, and in what order users meet them. Strongest with dense, complex systems: university admin platforms, government document databases, commerce renewals. Also experienced in branding, proposal and marketing design. Led a four-person team in Seoul; available immediately.",
        "h_exp": "EXPERIENCE",
        "h_skills": "SKILLS",
        "jobs": [
            {
                "role": "Freelance UI/UX &amp; Brand Designer",
                "date": "2023 – Present",
                "org": "Independent clients &amp; Komma Marketing Agency — Vancouver, BC",
                "items": [
                    "<b>Tale Studio (AI video studio) — service renewal:</b> re-architected the end-to-end pipeline (Producer → Writer → Artist → Storyboard), wrote the step-by-step process and flow charts, built a single-file interactive prototype with a developer handoff spec, designed the UI in Figma, and created the Lumi guide character in 17 animated states.",
                    "<b>Websites:</b> planned and designed sites for wellness, hospitality, and commerce clients — including a B2B wholesale site for 1AM VAPE (Canada) — owning IA, user flows, and UI, delivered on WordPress, Shopify, and Next.js.",
                    "<b>Brand, print &amp; content:</b> logo and identity design, brochures, and marketing content — including an AI-produced brand film for 1AM VAPE, from concept to edit.",
                    "Validate interactions with AI-assisted prototypes before handoff, so developers receive working flows rather than static screens.",
                ],
            },
            {
                "role": "UI/UX Design Team Lead (2020–2022) → Freelance Designer (2023–2026)",
                "date": "2020 – 2026",
                "org": "Landsoft — Seoul, Korea",
                "items": [
                    "Led a team of four through <b>4–5+ large public-sector and enterprise web projects per year</b>, from proposal to launch; continued on the same projects as a freelance designer after 2023.",
                    "<b>Korea National University of Arts — academic admin system:</b> redesigned a department-centric system around user intent. Restructured the information architecture for two distinct user groups (students vs. staff), separated read-only fields from editable forms on high-density screens, and established a light/dark design system.",
                    "<b>Ministry of Foreign Affairs — treaty search system:</b> designed the UX for a public records database of 3,000+ treaties. Placed article-level contents directly in search results so users reach a specific clause without leaving the page, and designed a dedicated document viewer with multilingual side-by-side comparison and scan-page controls.",
                    "<b>MU:DS (National Museum Foundation) — commerce renewal:</b> owned UX planning and UI design, relocating features users could not find and reworking main and detail pages to improve discoverability during a period of sharply increased order volume.",
                    "<b>National Museum of Korea — site renewal proposal:</b> benchmarked six leading museum sites, then restructured a fragmented global navigation bar around visitor intent. Surfaced hours, admission, and booking above the fold, with a card-based layout letting exhibition posters carry the visual weight.",
                ],
            },
            {
                "role": "UI/UX &amp; Marketing Designer",
                "date": "2019.05 – 2020.02",
                "org": "Red Rocket (Campus Fund) — Seoul, Korea",
                "items": [
                    "Designed campaign pages and interfaces for a P2P investment startup, translating unfamiliar financial mechanics into language and layouts first-time investors could follow. Reviewed customer-service tickets to identify recurring confusion and fed those findings back into the interface.",
                    "<b>Scooter Holic:</b> planned and designed an installment-based rental commerce site end to end — vendor categories, product detail pages, campaign pages.",
                ],
            },
            {
                "role": "Visual &amp; Marketing Designer",
                "date": "2018.05 – 2018.12",
                "org": "KstarAD — Seoul, Korea",
                "items": [
                    "Produced promotional and event design across in-house and client campaigns — a cryptocurrency launch, K-pop event promotions, booth signage — alongside social content, presentation decks, and the company blog.",
                ],
            },
        ],
        "skills": [
            ("UI/UX", "Information architecture, user flows, wireframing, complex data systems, responsive design, design systems, prototyping"),
            ("Visual", "Brand &amp; logo identity, brochures &amp; print, presentation &amp; proposal design, marketing content, AI video"),
            ("Tools", "Figma, Photoshop, Illustrator, WordPress, Shopify"),
            ("Technical", "AI-assisted prototyping (Claude Code, VS Code, Codex)  ·  HTML/CSS/JS/React structure for developer handoff"),
        ],
    },
    "ko": {
        "file": "Soomin_Park_Resume_KO.pdf",
        "font": ("Pret", "Pret-Bold", "Pret"),
        "name": "박수민 (Soomin Park)",
        "title": "UI/UX 디자이너",
        "contact": [
            "Burnaby, BC  ·  영주권자(PR)  ·  ssssssu984@gmail.com",
            "codedesk-studio.online  ·  linkedin.com/in/soomin-park-codedesk  ·  한국어(모국어) / English(비즈니스 회화 가능)",
        ],
        "summary": "공공기관, 커머스, 스몰비즈니스 등 다양한 산업군에서 7년간 경력을 쌓은 UI/UX 디자이너입니다. 어떤 기능을 어떻게 묶을지, 화면 어디에 배치할지, 사용자가 어떤 순서로 만나게 할지를 설계하는 정보 구조와 화면 설계에 강점이 있습니다. 특히 학사행정시스템이나 공공 데이터베이스처럼 정보 밀도가 높고 복잡한 서비스를 사용자의 이용 목적 중심으로 재편하는 작업을 주로 해왔습니다. 브랜딩·제안서·마케팅 디자인 경험도 함께 보유하고 있습니다. 서울에서 4인 디자인팀을 리드했으며, 즉시 근무 가능합니다.",
        "h_exp": "경력",
        "h_skills": "스킬",
        "jobs": [
            {
                "role": "프리랜서 UI/UX · 브랜드 디자이너",
                "date": "2023 – 현재",
                "org": "개인 클라이언트 및 Komma 마케팅 에이전시 — Vancouver, BC",
                "items": [
                    "<b>테일 스튜디오(AI 영상 제작 서비스) 리뉴얼:</b> 프로듀서 → 작가 → 아티스트 → 스토리보드로 이어지는 서비스 전체 구조를 재설계하고 단계별 프로세스와 플로우 차트를 작성. 단일 파일 인터랙티브 프로토타입과 개발 핸드오프 문서를 제작하고, Figma로 UI를 디자인했으며 가이드 캐릭터 ‘루미’를 17가지 상태로 제작.",
                    "<b>웹사이트 제작:</b> 웰니스·외식·커머스 등 다양한 업종의 웹사이트를 기획·디자인 — 캐나다 B2B 도매 사이트 1AM VAPE 포함. 정보 구조, 사용자 동선, UI 디자인을 담당하고 WordPress, Shopify, Next.js로 구축.",
                    "<b>브랜딩 · 브로슈어 · 콘텐츠:</b> 로고·아이덴티티 디자인, 브로슈어 등 인쇄물, 마케팅 콘텐츠 제작 — 1AM VAPE 브랜드 필름을 기획부터 AI 생성·편집까지 직접 제작.",
                    "AI 기반 프로토타이핑으로 인터랙션을 사전 검증해, 정적 화면이 아닌 실제로 동작하는 흐름으로 개발자에게 전달.",
                ],
            },
            {
                "role": "UI/UX 디자인 팀 리드 (2020–2022) → 프리랜서 디자이너 (2023–2026)",
                "date": "2020 – 2026",
                "org": "랜드소프트 — 서울",
                "items": [
                    "4인 규모 디자인·퍼블리싱 팀을 리드하며 <b>연 4~5건 이상의 대형 공공·기업 웹 프로젝트</b>를 제안 단계부터 오픈까지 총괄. 2023년 이후 프리랜서로 전환해 동일 프로젝트를 이어서 담당.",
                    "<b>한국예술종합학교 학사행정시스템 UI/UX 개편:</b> 부서 중심으로 나뉘어 있던 메뉴를 재학생·교직원의 이용 목적 중심으로 재설계. 정보 밀도가 높은 학적관리 화면에서 조회 영역과 입력 폼을 분리해 인지 부하를 낮추고, 라이트/다크 테마를 포괄하는 디자인 시스템 구축.",
                    "<b>외교부 조약정보 검색시스템 UX 설계:</b> 3,000건 이상의 조약을 다루는 공공 데이터베이스의 탐색 흐름 설계. 검색 결과 목록에서 조문 목차를 바로 펼쳐 화면 이동 없이 원하는 조문에 도달하게 하고, 다국어 대조와 스캔 원문 열람이 가능한 독립 문서 뷰어를 설계.",
                    "<b>국립박물관문화재단 뮷즈(MU:DS) 커머스 리뉴얼:</b> 기능이 없는 것이 아니라 찾지 못하는 것이 문제라는 진단 아래 기능 배치를 재조정하고, 주문량이 급증하던 시기에 메인·상세 페이지 UI를 전면 개편.",
                    "<b>국립중앙박물관 대표 홈페이지 리뉴얼 제안:</b> 국내외 6개 기관을 벤치마킹해 개선 근거를 세우고, 흩어져 있던 정보를 통합하며 GNB를 방문 목적 중심으로 재편. 관람시간·관람료·예약을 메인 최상단에 고정 배치하고, 전시 포스터가 주인공이 되도록 카드형 UI로 구성.",
                ],
            },
            {
                "role": "UI/UX &amp; 마케팅 디자이너",
                "date": "2019.05 – 2020.02",
                "org": "레드로켓(캠퍼스펀드) — 서울",
                "items": [
                    "P2P 투자라는 낯선 금융 상품을 처음 접하는 사용자도 이해할 수 있도록 캠페인 페이지의 정보 구조와 UI를 설계. CS로 접수되는 반복 문의를 유형화해 화면 개선에 직접 반영.",
                    "<b>스쿠터홀릭:</b> 스쿠터 할부 렌탈 커머스를 기획부터 디자인까지 총괄 — 입점 업체 카테고리 체계, 상세페이지, 이벤트 페이지.",
                ],
            },
            {
                "role": "시각 &amp; 마케팅 디자이너",
                "date": "2018.05 – 2018.12",
                "org": "KstarAD — 서울",
                "items": [
                    "사내·클라이언트 캠페인 전반의 프로모션·이벤트 디자인 담당 — 코인 런칭, K-pop 이벤트 프로모션, 행사 부스 사이니지. 소셜 콘텐츠, 제안서 디자인, 회사 블로그 운영 병행.",
                ],
            },
        ],
        "skills": [
            ("UI/UX", "정보 구조 설계(IA), 사용자 동선 기획, 와이어프레이밍, 복잡한 시스템 UX, 반응형 웹, 디자인 시스템, 프로토타이핑"),
            ("비주얼", "브랜드·로고 아이덴티티, 브로슈어·인쇄물, 제안서·PPT 디자인, 마케팅 콘텐츠, AI 영상"),
            ("툴", "Figma, Photoshop, Illustrator, WordPress, Shopify"),
            ("기술 이해도", "AI 기반 프로토타이핑(Claude Code, VS Code, Codex), 개발자 핸드오프를 위한 HTML/CSS/JS/React 구조 이해"),
        ],
    },
}


def build(lang: str) -> None:
    r = RESUME[lang]
    reg, bold, ital = r["font"]
    ko = lang == "ko"
    size = 8.6 if ko else 8.4
    lead = size * 1.55

    def st(name, **kw):
        base = dict(fontName=reg, fontSize=size, leading=lead, textColor=HexColor("#111111"))
        base.update(kw)
        return ParagraphStyle(name, **base)

    s_name = st("name", fontName=bold, fontSize=20, leading=24)
    s_title = st("title", fontSize=10.5, leading=14, textColor=GREY)
    s_contact = st("contact", textColor=GREY, leading=size * 1.45)
    s_body = st("body", alignment=TA_JUSTIFY, wordWrap="CJK" if ko else None)
    s_h = st("h", fontName=bold, fontSize=10, leading=13, spaceBefore=6)
    s_role = st("role", fontName=bold, fontSize=size + 0.6, spaceBefore=5)
    s_org = st("org", fontName=ital, textColor=GREY)
    s_item = st("item", wordWrap="CJK" if ko else None)

    def rule():
        return HRFlowable(width="100%", thickness=0.6, color=RULE, spaceBefore=1, spaceAfter=4)

    flow = [Paragraph(r["name"], s_name), Paragraph(r["title"], s_title), Spacer(1, 4)]
    flow += [Paragraph(c, s_contact) for c in r["contact"]]
    flow += [rule(), Paragraph(r["summary"], s_body), Spacer(1, 4), Paragraph(r["h_exp"], s_h), rule()]
    for j in r["jobs"]:
        flow.append(Paragraph(f'{j["role"]} <font name="{reg}">|</font> {j["date"]}', s_role))
        flow.append(Paragraph(j["org"], s_org))
        flow.append(
            ListFlowable(
                [ListItem(Paragraph(t, s_item), leftIndent=12, value="–") for t in j["items"]],
                bulletType="bullet",
                start="–",
                leftIndent=12,
                bulletFontName=reg,
                bulletFontSize=size,
            )
        )
    flow += [Spacer(1, 2), Paragraph(r["h_skills"], s_h), rule()]
    for k, v in r["skills"]:
        flow.append(Paragraph(f"<b>{k}</b>&nbsp;&nbsp;{v}", s_item))

    out = ROOT / "public/media" / r["file"]
    doc = SimpleDocTemplate(
        str(out), pagesize=letter, leftMargin=44, rightMargin=44, topMargin=30, bottomMargin=26,
        title="Soomin Park — UI/UX Designer", author="Soomin Park", subject="Resume",
    )
    doc.build(flow)
    print("wrote", out)


if __name__ == "__main__":
    for lang in RESUME:
        build(lang)
