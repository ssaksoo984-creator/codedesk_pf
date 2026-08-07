import type { Thought } from "./thoughts";

/** Shown when Supabase env vars are absent, so the Thought section has something to render. */
export const MOCK_THOUGHTS: Thought[] = [
  {
    id: "mock-1",
    title: "스크롤은 이야기가 될 수 있을까",
    body: `이 사이트의 Work 섹션은 700vh짜리 트랙 하나를 스크롤로 밀고 당기면서 리스트가 흩어지고, 원이 자라나고, Contact가 드러납니다. 처음엔 "굳이 이렇게까지"라는 생각도 했는데, 막상 완성하고 나니 페이지를 넘기는 게 아니라 한 공간 안에서 카메라가 움직이는 느낌이 들더라고요.

GSAP ScrollTrigger의 scrub 옵션 하나로 스크롤 위치를 애니메이션 진행률에 직접 묶을 수 있다는 게 핵심이었습니다. 스크롤을 올리면 그대로 되감기는 것도 별도 로직 없이 공짜로 따라옵니다.

다음 글에서는 라이트/다크 섹션이 전환될 때 GNB 색이 스크롤 위치에 따라 자동으로 바뀌는 구조를 다뤄볼게요.`,
    thumbnail_url: null,
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
];
