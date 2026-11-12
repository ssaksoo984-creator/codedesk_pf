import { VISIBLE_WORK_PROJECTS, type WorkProject } from "./work-content";

export const STUDIO = {
  name: "CodeDesk Studio",
  email: "ssssssu984@gmail.com",
  linkedin: "https://www.linkedin.com/in/soomin-park-codedesk",
  city: "Vancouver",
};

export interface Shot {
  src: string;
  alt: string;
  w: number;
  h: number;
  caption?: string;
  /** Background behind artwork that is shown contained rather than cropped. */
  bg?: string;
  contain?: boolean;
}

export interface CaseStudy {
  id: string;
  title: string;
  field: string;
  year?: string;
  client?: string;
  status?: string;
  role: string[];
  links: { label: string; href: string }[];
  hero: Shot;
  problem: string;
  decision?: { title: string; text: string; shot: Shot };
  screens: Shot[];
}

const S = "/media/studio/";
const W = "/media/home_work/";

/** Hand-written cases for the featured projects. Everything here restates the
 * existing case-study material in shorter English — no new claims. */
const CURATED: Record<string, Omit<CaseStudy, "id">> = {
  "11": {
    title: "1AM VAPE",
    field: "Brand website · B2B ordering",
    year: "2025",
    client: "1AM (Vanskai Trading Ltd.)",
    role: ["Website design and build", "Retailer sign-up and ordering flow", "Brand film — concept, AI generation and edit"],
    links: [{ label: "Visit 1amvape.com", href: "https://1amvape.com/" }],
    hero: { src: S + "1am-hero.webp", alt: "1AM VAPE home page with all fifteen flavours in a row over pink clouds", w: 1440, h: 900 },
    problem:
      "1AM sells only to licensed retailers in Canada, in a category with strict rules: under-19s have to be kept out, a health warning has to stay on every screen, and consumers can’t order at all. Inside those limits, the site still had to make store owners want to carry the brand.",
    decision: {
      title: "Let the product’s own colours be the brand.",
      text: "Each flavour is a clear body with its own gradient core. Rather than invent a separate palette, the hero lines up all fifteen and every lineup section switches to that product’s gradient. The required pieces — the age gate, the fixed warning bar, “licensed retailers only” — sit quietly around it.",
      shot: { src: W + "1am/lineup.webp", alt: "Lineup section for the 20ml Max in its orange-to-pink gradient", w: 1440, h: 900, caption: "Lineup 02 — the section takes the product’s gradient" },
    },
    screens: [
      { src: W + "1am/about.webp", alt: "About section stating the brand sells to licensed retailers", w: 1440, h: 900, caption: "About — B2B stated up front" },
      { src: W + "1am/page_retailer.webp", alt: "Become a Retailer application form", w: 1440, h: 900, caption: "Become a Retailer — application" },
      { src: W + "1am/page_order.webp", alt: "How to Order page", w: 1440, h: 900, caption: "How to Order — the steps in sequence" },
      { src: W + "1am/features.webp", alt: "Feature callouts around the Slim Hybrid device", w: 1440, h: 900, caption: "Slim Hybrid — feature callouts" },
    ],
  },
  "06": {
    title: "National Museum of Korea",
    field: "Website renewal · Design proposal",
    year: "2025",
    client: "National Museum of Korea (proposal)",
    status: "Proposal",
    role: ["Benchmarking", "Navigation and home screen design", "Working demo build", "Information architecture by the planning team"],
    links: [{ label: "Open the demo", href: "https://nmk-next.vercel.app/" }],
    hero: { src: S + "nmk-main.webp", alt: "Proposed museum home page with a faceted white porcelain exhibition", w: 1600, h: 892 },
    problem:
      "People come to the museum’s site for two things: visiting details like hours and admission, and what’s on now. Both were scattered across menus that mirrored the museum’s org chart. The site also had to carry the beauty of the collection without turning into either a bulletin board or a poster wall.",
    decision: {
      title: "Group the menu by what visitors came to do.",
      text: "The main navigation went down to six items — Visit, Exhibitions & Culture, Education & Events, Collection, Research & Publications, Museum Stories. Each opens a two-column panel: a category on the left, its pages on the right. Links that leave the site are set apart so nobody is surprised by where a click lands.",
      shot: { src: S + "nmk-gnb.webp", alt: "Visit menu open as a two-column dropdown", w: 1600, h: 892, caption: "Visit menu — category on the left, pages on the right" },
    },
    screens: [
      { src: S + "nmk-hover.webp", alt: "Home page with a calligraphy exhibition; the info bar darkens with the image", w: 1600, h: 892, caption: "The info bar takes on the colour of each exhibition" },
      { src: S + "nmk-menu.webp", alt: "Full-screen site map menu", w: 1600, h: 892, caption: "Full menu with external sites set apart" },
      { src: S + "nmk-full.webp", alt: "Full home page: exhibitions, education and events, news", w: 1200, h: 2711, caption: "Home — hours, admission and booking above the fold" },
    ],
  },
  "10": {
    title: "NAIL",
    field: "Logo design · AI search chatbot",
    year: "2025",
    client: "National Assembly AI Library (proposal)",
    status: "Proposal",
    role: ["Logo — two directions", "Chatbot interface and working prototype"],
    links: [{ label: "Try the chatbot prototype", href: "/proto/nail-search/en/" }],
    hero: { src: W + "nail/chatbot/n_home.webp", alt: "NAIL AI search home with suggested questions", w: 1800, h: 1125 },
    problem:
      "An AI library for the National Assembly needed a mark with the weight of a library and the trust of a public institution — and it still had to feel like something anyone could simply ask a question.",
    decision: {
      title: "A star rising from an open book.",
      text: "In the first direction, the A is the shadow of a book as it opens, with a star rising out of it for what AI adds; the I is a bookmark, for what a library keeps. Thick, straight strokes hold the institutional weight. The mark then went onto the search chatbot in small doses, so questions and answers stay the focus.",
      shot: { src: S + "sel-nail.svg", alt: "NAIL symbol: an A formed by an opening book with a star, and an I drawn as a bookmark", w: 1320, h: 920, bg: "#F1F4FB", contain: true, caption: "TYPE-1 — book, star and bookmark" },
    },
    screens: [
      { src: W + "nail/chatbot/n_answer.webp", alt: "Answer screen with a summary and numbered sources", w: 1800, h: 1125, caption: "Answers carry numbered sources" },
      { src: W + "nail/svg/type2-logo.svg", alt: "Second logo direction with rounded letterforms and a gradient", w: 1400, h: 615, bg: "#FFFFFF", contain: true, caption: "TYPE-2 — the softer direction" },
      { src: W + "nail/chatbot/n_guide.webp", alt: "Guide panel explaining sources and how to ask", w: 1800, h: 1125, caption: "Guide — what you can search, and how" },
      { src: W + "nail/chatbot/n_mobile.webp", alt: "Chatbot on a phone", w: 780, h: 1688, bg: "#EEF3FC", contain: true, caption: "Mobile" },
    ],
  },
  "09": {
    title: "Tale Studio",
    field: "AI video product · UX and interface",
    year: "2026",
    client: "Tale Studio",
    status: "In progress",
    role: ["Stage architecture and flow charts", "Design system and screens in Figma", "Clickable prototype and developer handoff", "Agent character, Lumi"],
    links: [{ label: "Open the prototype", href: "/proto/tale-studio/" }],
    hero: { src: W + "talestudio/figma/w_w1.webp", alt: "Writer workspace in Tale Studio", w: 1440, h: 900 },
    problem:
      "Tale Studio turns a one-line idea into a video. Its stages had grown tangled — Writer handled prose, drawings and shots, with checks at every hand-off — and parts of the screen stayed live while the AI worked, so requests collided.",
    decision: {
      title: "Lock the screen while the AI works, and let Lumi show the work.",
      text: "Every input pauses during generation, so two requests can never touch the same data. To keep a locked screen from feeling frozen, each stage shows Lumi doing that stage’s job — reading, writing, drawing — next to real progress and a short checklist, with a way to skip ahead.",
      shot: { src: W + "talestudio/figma/l_e2.webp", alt: "Loading dialog: Lumi reading the story, with progress and a checklist", w: 1440, h: 900, caption: "Producer — Lumi reads the idea while settings are prepared" },
    },
    screens: [
      { src: W + "talestudio/figma/p_e1.webp", alt: "Producer stage: entering story material", w: 1440, h: 900, caption: "Producer — start from an idea" },
      { src: W + "talestudio/figma/a_a5.webp", alt: "Artist stage: cast and sets with versions", w: 1440, h: 1180, caption: "Artist — cast and sets, with versions" },
      { src: W + "talestudio/figma/s_s2.webp", alt: "Storyboard stage: editing a shot with lighting controls", w: 1440, h: 1100, caption: "Storyboard — shot editing" },
    ],
  },
  "02": {
    title: "MOFA Treaty Search",
    field: "Public search system · UI/UX",
    client: "Ministry of Foreign Affairs, Korea",
    role: ["Search results", "Document viewer", "Interface design", "Responsive layouts"],
    links: [],
    hero: { src: S + "mofa-search.webp", alt: "Advanced search dialog with treaty and country conditions in two columns", w: 1600, h: 900 },
    problem:
      "More than 3,000 treaties, in many shapes: bilateral and multilateral, agreements, conventions, protocols, exchanges of notes — some to be read side by side in three languages, some hundreds of pages of scanned originals. Most visitors are after one specific article.",
    decision: {
      title: "Open the articles right inside the results.",
      text: "Filters, counts, the result list and each treaty’s table of contents share one screen. Selecting a result expands its articles in place, each with the page range in the original document and a direct link into the viewer — no detour through a detail page and back.",
      shot: { src: S + "mofa-results.webp", alt: "Search results with one treaty’s article list expanded in place", w: 1600, h: 1250, caption: "Results — articles expanded in place" },
    },
    screens: [
      { src: S + "mofa-lang.webp", alt: "Korean, Mongolian and English texts side by side", w: 1600, h: 900, caption: "One treaty in three languages" },
      { src: S + "mofa-compare.webp", alt: "Two treaties compared side by side", w: 1600, h: 900, caption: "Two treaties, compared" },
      { src: S + "mofa-viewer.webp", alt: "Scanned original document in the viewer", w: 1600, h: 900, caption: "Viewer for scanned originals" },
      { src: S + "mofa-mobile.webp", alt: "Home screen on a phone", w: 600, h: 3987, bg: "#E9EDF5", contain: true, caption: "Mobile" },
    ],
  },
};

/** The project on the paper in the first screen. */
export const LEAD_ID = "11";

/** Selected work, in the order they are laid out (wide, tall, tall, wide). */
export const SELECTED = [
  { id: "06", shape: "wide" as const, image: { src: S + "sel-nmk.webp", alt: "Close crop of the museum home page: vertical Korean type beside white porcelain", w: 1420, h: 755 } },
  { id: "10", shape: "tall" as const, image: { src: S + "sel-nail.svg", alt: "NAIL symbol: an open book with a rising star, and a bookmark", w: 1320, h: 920, bg: "#F1F4FB", contain: true } },
  { id: "09", shape: "tall" as const, image: { src: S + "sel-tale.webp", alt: "Lumi reading a story while the screen waits for the AI", w: 490, h: 620 } },
  { id: "02", shape: "wide" as const, image: { src: S + "sel-mofa.webp", alt: "Advanced treaty search dialog", w: 1340, h: 840 } },
];

// ---------------------------------------------------------------------------
// Everything else is derived from the existing case-study data.

type Img = { src: string; caption?: { en: string } };

function collectImages(p: WorkProject): Img[] {
  const out: Img[] = [];
  const push = (src?: string, caption?: { en: string }) => {
    if (src && !out.some((o) => o.src === src)) out.push({ src, caption });
  };
  for (const panel of p.designGuide?.panels ?? []) {
    for (const im of panel.images ?? []) if (!im.video) push(im.src, im.caption);
    if (panel.responsive) push(panel.responsive.desktop.src, panel.responsive.desktop.caption);
    if (panel.compare) {
      push(panel.compare.left.src, panel.compare.left.caption);
      push(panel.compare.right.src, panel.compare.right.caption);
    }
  }
  for (const b of p.story ?? []) for (const im of b.images ?? []) push(im.src, im.caption);
  const main = p.imageShowcase?.main.desktop?.light;
  if (main) push(main, p.imageShowcase?.main.title);
  return out;
}

function shot(src: string, alt: string, caption?: string): Shot {
  // Generic screenshots: sizes aren't recorded, so a 16:10 box is reserved
  // and the image is contained inside it.
  return { src, alt, w: 1600, h: 1000, caption, contain: true, bg: "#E9E8E2" };
}

function derive(p: WorkProject): Omit<CaseStudy, "id"> {
  const imgs = collectImages(p);
  const firstPanel = p.designGuide?.panels.find((x) => (x.images?.length || x.responsive || x.compare) && (x.resolution || x.intro));
  const decisionImg = firstPanel
    ? (firstPanel.images?.[0]?.src ?? firstPanel.responsive?.desktop.src ?? firstPanel.compare?.left.src)
    : undefined;
  const heroSrc = imgs.find((i) => i.src !== decisionImg)?.src ?? p.image ?? p.cover ?? "";
  return {
    title: p.title.en,
    field: p.category.en,
    year: p.year,
    client: p.client?.en,
    status: p.stage?.en,
    role: (p.roles ?? []).map((r) => `${r.label.en} — ${r.value.en}`),
    links: [
      ...(p.url ? [{ label: "Visit the site", href: p.url }] : []),
      ...(p.links ?? []).map((l) => ({ label: l.label.en, href: l.urlEn ?? l.url })),
    ],
    hero: { ...shot(heroSrc, p.title.en), contain: false },
    problem: p.situation?.en ?? p.description?.en ?? "",
    decision:
      firstPanel && decisionImg
        ? {
            title: firstPanel.label.en,
            text: firstPanel.resolution?.en ?? firstPanel.intro?.en ?? "",
            shot: shot(decisionImg, firstPanel.label.en, firstPanel.images?.[0]?.caption.en),
          }
        : undefined,
    screens: imgs
      .filter((i) => i.src !== heroSrc && i.src !== decisionImg)
      .slice(0, 4)
      .map((i) => shot(i.src, i.caption?.en ?? p.title.en, i.caption?.en)),
  };
}

/** Public order: lead, selected work, then the rest as listed in the data. */
const ORDER = [LEAD_ID, ...SELECTED.map((s) => s.id)];
const ORDERED = [
  ...ORDER.map((id) => VISIBLE_WORK_PROJECTS.find((p) => p.index === id)!),
  ...VISIBLE_WORK_PROJECTS.filter((p) => !ORDER.includes(p.index)),
];

export const CASES: CaseStudy[] = ORDERED.map((p) => ({ id: p.index, ...(CURATED[p.index] ?? derive(p)) }));

export function getCase(id: string) {
  return CASES.find((c) => c.id === id);
}
