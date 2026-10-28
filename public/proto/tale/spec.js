/* 개발 전달 — 기존 → 리뉴얼 변경 명세. 화면 ID(data-node)를 누르면 위 프로토타입이 그 화면으로 바뀐다. */
(function () {
  var ST = { keep: '보존', chg: '바뀜', mv: '이동', 'new': '신규', del: '삭제', hold: '보류', ren: '이름 변경', split: '기능 분리' };
  var SPEC = [
    { g: '공통', rows: [
      { f: '단계 이름', b: '기초 세팅 · Producer · Writer', a: 'Producer · Writer · Artist · Storyboard(가칭). Storyboard는 이름 미정', s: 'ren', d: '화면 문구, 사이드 메뉴, 에이전트 이름', ids: ['E1', 'W1', 'S1'] },
      { f: 'AI 작업 중 잠금', b: '일부만', a: 'AI가 일하는 동안 화면 전체 로딩, 모든 입력 비활성', s: 'chg', d: '생성 요청 중복 방지, 동시 작업 없음', ids: ['E2', 'E5', 'W2', 'A0', 'A4', 'A8', 'S0', 'S3', 'S6'] },
      { f: '직접 고치기', b: '화면에서 바로', a: '팝업에서만. 열려 있는 동안 채팅 잠금', s: 'chg', d: '채팅과 손 편집이 같은 데이터를 동시에 안 건드림', ids: ['W5', 'A7', 'S2'] },
      { f: '장르·톤', b: 'P2 설정 칩 하나 (장르 · 톤)', a: '단계마다 성격에 맞는 이름으로 나눠 따로 조절. Producer·Writer = 장르·분위기(산문 조건) · Artist = 분위기·톤(인물·배경마다, 캐릭터성 · 공간의 성격) + 다시 만들 때 색감·분위기', s: 'split', d: '단계별 저장값, 객체별 저장값', ids: ['E3', 'W3', 'A7r'] },
      { f: '단계 이동', b: '단계가 섞여 있음 (Writer 안에 그림 · 샷)', a: 'Producer → Writer → Artist → Storyboard 순서로 넘어감. 넘어간 Producer · Writer는 잠금이 아니라 "완료" — 그 단계의 일을 끝낸 것이라 뒤 단계의 변화(인물 · 모습 · 샷)를 앞 단계로 다시 맞추지 않음. Artist ⇄ Storyboard는 오가며 고침. 산문에 없는 인물·배경만 롤백', s: 'chg', d: '단계 상태값(완료 · 진행 중), 앞 단계로 역동기화 없음', ids: ['W6', 'A9', 'S0'] },
      { f: '채팅 언어 · 대사 언어', b: 'P2 설정 칩, Writer 선택', a: '고르는 칸 없음. 사이트 언어를 따름', s: 'del', d: '언어 = 사이트 언어, 14 대사 생성', ids: ['E1', 'S1'] }
    ] },
    { g: 'Producer', code: 'E', rows: [
      { f: '아이디어 · 파일 첨부', b: 'P1 자료·아이디어', a: '글 20자 이상 또는 파일. txt · md · docx · pdf · hwp + 글이 담긴 png · jpg, 10MB', s: 'chg', d: '업로드 검사, 이미지 글자 읽기', ids: ['E1', 'EB1', 'EF'] },
      { f: '오류 안내', b: '없음', a: '확장자 오류 · 더 써 달라는 안내 · 읽기 실패', s: 'new', d: '검사 실패 문구', ids: ['EFe', 'E1e', 'E2e'] },
      { f: 'AI 추천', b: '없음', a: '글을 읽고 장르·분위기 · 러닝타임 · 바꿈 정도를 기본값으로, 이유 한 줄', s: 'new', d: '추천 생성 단계', ids: ['E2', 'E3'] },
      { f: '장르·분위기 (산문용 장르·톤)', b: 'P2 설정 칩', a: '10개 중 고름. 산문 조건. Writer 다시 쓰기에서만 바뀜', s: 'split', d: '01~04 입력', ids: ['E3', 'EB3'] },
      { f: '러닝타임 (산문 아이디어 길이용)', b: 'P1 길이·화면 + P2 러닝타임 칩, 넘기기 검사', a: '15초 이하 · 15~60초 · 1~5분 · 5~20분 중 고름. 산문 아이디어 길이를 정하는 데만 씀. Storyboard의 러닝타임 지표와는 이름만 같은 다른 기능', s: 'split', d: '01~04 입력, 넘기기 검사 삭제', ids: ['E3', 'EB4'] },
      { f: 'AI 바꿈 정도', b: 'P1 쓰임새', a: '1 그대로 · 2 다듬기 · 3 새롭게 키우기. 대본 파일이면 바로 영상화 · 조금 다듬어서 · 완전 새롭게', s: 'new', d: '01~04 분기. "그대로"면 읽기 전용 산문(W1r)', ids: ['E3', 'EB2', 'EB5'] },
      { f: '화면 비율', b: 'P1 자동 + P2 칩', a: '시작 확인에서 잠기고 끝까지 못 바꿈', s: 'chg', lock: true, d: '저장값 잠금', ids: ['E4', 'EB6', 'EB7'] },
      { f: '형식 고르기 · 이미지 권리 동의', b: 'P1', a: '없음', s: 'del', d: '화면', ids: ['E1'] },
      { f: '웹툰 · 캐릭터 시트 · 참조 사진 읽기', b: 'P1 쓰임새', a: 'v2로 미룸. 지금은 글 파일과 글이 담긴 이미지만', s: 'hold', d: '업로드 종류 제한', ids: ['EF'] }
    ] },
    { g: 'Writer', code: 'W', rows: [
      { f: '산문', b: 'P2 씬 스토리 (Writer 01~04)', a: '산문만 다루는 작업공간', s: 'keep', d: '01~04', ids: ['W1'] },
      { f: '읽기 전용 산문', b: '없음', a: '바꿈 정도 "그대로"면 다시 쓰기·직접 작성 없이 브레이크다운만', s: 'new', d: '분기', ids: ['W1r'] },
      { f: 'AI 다시 쓰기', b: 'P2 다시 쓰기 카드', a: '조건(러닝타임 · 장르·분위기 · 소재)은 다시 쓸 때만 바뀜. 전부 / 일부분(문단 골라 채팅)', s: 'chg', d: '01~04 재실행, 문단 단위 다시 쓰기', ids: ['W3', 'WC1', 'WC2', 'WC3'] },
      { f: '직접 작성', b: '직접 고치기', a: '팝업. 열려 있는 동안 채팅 잠금', s: 'chg', d: '', ids: ['W5'] },
      { f: '수정안 고르기', b: '세 가지 안', a: '그대로. 일부분이면 고른 문단만 바뀐 안', s: 'keep', d: '', ids: ['W4'] },
      { f: '다음 단계 제안', b: '있음 (에이전트가 다음 단계를 제안)', a: '적용하면 넘어갈지 묻고, 아니면 할 일을 버튼으로', s: 'keep', d: '에이전트 문구', ids: ['WP', 'WN'] },
      { f: '산문 확정', b: 'Writer로 넘기기 + 러닝타임 검사', a: '확정하면 산문 잠금 + 바로 브레이크다운. 러닝타임 검사 없음', s: 'chg', lock: true, d: '넘기기 검사 삭제', ids: ['W6'] },
      { f: '제목 아래 설정 칩', b: 'P2', a: '없음. 조건은 산문 위 한 줄 글로만', s: 'del', d: '화면', ids: ['W1'] }
    ] },
    { g: 'Artist', code: 'A', rows: [
      { f: '브레이크다운 목록', b: 'P2 Casting · Background', a: '확정 산문에서 인물 · 배경 · 상태(옷·나이)를 글 목록으로. 줄마다 레퍼런스, AI 진단 메모', s: 'mv', d: '07 입력. 확인: 02·03 없이 확정 산문만으로 도는지', ids: ['A0', 'A1', 'AR'] },
      { f: '재점검', b: '없음', a: '빠지거나 겹친 이름을 산문 표시 팝업에서 추가·수정·합치기, 산문은 잠긴 채', s: 'new', d: '인물·장소 표시 데이터, 합치기', ids: ['A1c', 'WT', 'WTm'] },
      { f: '롤백', b: '없음', a: '산문에 없는 인물·배경은 산문으로 돌아가 다시 브레이크다운', s: 'new', d: '확인: 롤백 뒤 그림 유지 범위', ids: ['R1', 'R2', 'AX'] },
      { f: '스타일', b: 'P2 설정 칩', a: '스타일 고르기 팝업. 작품에 하나, 스타일 레퍼런스 · 장수 · 예상 크레딧 확인 뒤 만들기', s: 'mv', d: '05, 작품 스타일 저장값', ids: ['A2', 'A4'] },
      { f: '재생성 · 생성 기록 · 불러오기', b: '없음', a: '버전(v1, v2…) 기록. 불러오면 스타일도 그 버전으로. "이전 스타일로"는 불러오기 안내', s: 'new', d: '버전 저장', ids: ['A6', 'AV', 'AY'] },
      { f: '분위기·톤 (인물·배경마다)', b: '없음 (P2 장르·톤 칩 하나)', a: '다시 만들기의 캐릭터성 / 공간의 성격 추천에서 분위기·톤(코미디 · 호러 · 로맨스 · 누아르 · 따뜻한 …)을 고름. 그 객체만 다시 만듦. 바꿀 곳 "색감 · 분위기"도 있음', s: 'split', d: '객체별 저장값, 객체 단위 재생성', ids: ['A7', 'A7r'] },
      { f: '결과 카드', b: '07 뒤 자동 생성', a: '[모두 · 인물 · 배경] 탭, 작품 스타일·버전 표시, [인물·배경 추가] 없음', s: 'chg', d: '', ids: ['A5'] },
      { f: '상세 · 다시 만들기', b: 'v18 상세', a: '바꿀 곳(전체 · 얼굴 · 의상 · 표정 · 색감)과 기준 이미지를 골라 하나만. 모습 추가', s: 'chg', d: '객체 단위 재생성', ids: ['A7', 'A7r'] },
      { f: '채팅으로 고치기', b: '있음 (에이전트 채팅)', a: '"민호 바꿔줘" → 스타일부터 / 작은 것 / 생김새 중 고름', s: 'keep', d: '에이전트 분기', ids: ['AC1', 'AC2', 'AC3'] },
      { f: '완료하기', b: '없음 (자동 진행)', a: '대표 그림이 하나라도 없으면 못 넘어감. 목록만 잠기고 Artist는 언제든 다시 고침', s: 'chg', lock: true, d: 'Storyboard 진입 조건', ids: ['A9'] }
    ] },
    { g: 'Storyboard (가칭)', code: 'S', rows: [
      { f: '씬·샷 나누기 · 러프', b: 'Writer 08~15', a: 'Artist 다음. 진행률 · 남은 시간 표시, 다 그린 샷부터 보임', s: 'mv', d: '08~15', ids: ['S0', 'S1'] },
      { f: '러닝타임 (지표)', b: '입력칸 · 목표 막대', a: '"씬 3 · 샷 8 · 20초" 지표만. 샷을 고치면 같이 바뀜. Producer의 러닝타임(산문 아이디어 길이용)과 다른 기능', s: 'split', d: '샷 길이 합 계산', ids: ['S1'] },
      { f: '샷 고치기', b: 'v18 샷 팝업 (시작 · 연출 · 끝)', a: '두 묶음(시작 / 연출), 끝 그림 뺌. 조명(위치 · 색온도 · 밝기) 추가, 샷 타입은 코드 + 설명', s: 'chg', d: '샷 데이터에 조명', ids: ['S2'] },
      { f: '새 러프 확인', b: '카드에 바로 반영', a: '이전 → 새로 비교 후 되돌리기 / 다시 고치기 / 적용', s: 'new', d: '적용 전 임시 버전', ids: ['S3', 'S3c'] },
      { f: '샷 추가 · 씬 추가', b: '있음', a: '넣을 자리를 골라야 [샷 추가]가 켜짐. 씬은 샷 0개로 시작', s: 'chg', d: '', ids: ['S4', 'S8'] },
      { f: '모습 추가', b: 'Writer 인물 추가', a: 'Artist 상세 팝업이 열림, 롤백 없음', s: 'chg', d: 'Artist 상세 재사용', ids: ['S5', 'S6'] },
      { f: '에이전트 변경 확인', b: '있음 (적용 / 되돌리기)', a: '바뀐 샷 노랑 표시 → 적용하면 다시 그린 뒤 새 러프 확인. 확인 전엔 새 요청 안 받음', s: 'chg', d: '', ids: ['SG'] },
      { f: '롤백 (샷 있음)', b: '없음', a: '목록에 없는 인물·배경이 필요하면 산문부터 다시. 영향 샷·그림·예상 크레딧 표시', s: 'new', d: '확인: 롤백 뒤 샷 유지 범위', ids: ['R3'] },
      { f: '마스터 시트', b: '있음', a: '그대로', s: 'keep', d: '', ids: ['SM'] },
      { f: 'Director로 넘기기', b: '있음', a: '러프 없는 샷은 빠진다고 알리고 [남은 컷 그리기]', s: 'chg', d: '', ids: ['S7'] },
      { f: 'END 샷 · 끝 그림 · 인물·배경 서랍 · 인물 강조 보기 · 여러 샷 선택', b: 'Writer', a: '없음', s: 'del', d: '화면', ids: ['S1'] }
    ] }
  ];

  var MAP = [
    { name: 'Producer', sub: '기초 세팅에서 이름 변경', items: [['바뀜', 'chg', '아이디어 · 파일 첨부', '글 20자 · 파일 10MB', 'E1'], ['신규', 'new', 'AI 추천', '글 읽고 기본값 채움', 'E3'], ['기능 분리', 'split', '장르·분위기', '산문용 장르·톤', 'E3'], ['기능 분리', 'split', '러닝타임', '산문 아이디어 길이용', 'E3'], ['신규', 'new', 'AI 바꿈 정도', '그대로 · 다듬기 · 새롭게', 'E3'], ['바뀜 · 잠금', 'chg', '화면 비율', '시작하면 끝까지 잠금', 'E4']] },
    { name: 'Writer', sub: 'P2 Producer에서 이름 변경', items: [['보존', 'keep', '산문', 'Writer 01~04 결과', 'W1'], ['바뀜', 'chg', 'AI 다시 쓰기', '조건은 여기서만 바뀜', 'W3'], ['바뀜', 'chg', '직접 작성 팝업', '열린 동안 채팅 잠김', 'W5'], ['보존', 'keep', '수정안 고르기', '세 가지 안', 'W4'], ['보존', 'keep', '다음 단계 제안', '적용 뒤 넘어갈지 물음', 'WP'], ['바뀜 · 잠금', 'chg', '산문 확정', '잠금 후 브레이크다운', 'W6']] },
    { name: 'Artist', sub: '목록 → 스타일 → 그림', items: [['이동', 'mv', '브레이크다운 목록', '기존: P2 인물·배경 카드', 'A1'], ['신규', 'new', '재점검 · 롤백', '빠지거나 겹친 이름', 'A1c'], ['이동', 'mv', '스타일', '작품에 하나 · 기존 P2 칩', 'A2'], ['신규', 'new', '생성 기록 · 불러오기', 'v1·v2 · 스타일도 같이', 'AV'], ['바뀜', 'chg', '상세 · 다시 만들기', '바꿀 곳 골라 하나만', 'A7'], ['기능 분리', 'split', '분위기·톤', '인물·배경마다 따로', 'A7r'], ['바뀜 · 잠금', 'chg', '완료하기', '인물·배경 목록 잠금', 'A9']] },
    { name: 'Storyboard (가칭)', sub: '기존 Writer 08~15 자리', items: [['이동', 'mv', '씬·샷·러프', '기존: Writer 08~15', 'S1'], ['바뀜', 'chg', '샷 고치기', '두 묶음 · 조명 추가', 'S2'], ['신규', 'new', '새 러프 확인', '이전 → 새로 비교', 'S3c'], ['기능 분리', 'split', '러닝타임 (지표)', '목표 아님 · 샷 길이 합', 'S1'], ['바뀜', 'chg', '에이전트 변경 확인', '노랗게 표시 → 적용', 'SG'], ['보존', 'keep', '마스터 시트 · 넘기기', '기존과 같음', 'SM']] }
  ];
  var GONE = ['채팅 언어 · 대사 언어 고르기 (사이트 언어로)', '형식 고르기 (단편 · 광고 · MV…)', '이미지 권리 동의 창', '제목 아래 설정 칩', '넘기기 러닝타임 검사', 'END 샷 · 끝 그림', '러닝타임 입력칸 · 목표 막대', 'Storyboard의 인물·배경 서랍', '인물 강조 보기 · 여러 샷 선택'];

  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var idBtn = function (id) { return '<button class="dv-id" data-node="' + id + '" data-dev-go="1">' + id + '</button>'; };
  var tag = function (s, lock) { return '<span class="dv-st dv-' + s + '">' + ST[s] + (lock ? ' · 잠금' : '') + '</span>'; };

  var box = function (n, s, k) { return '<div class="dv-box' + (k ? ' dv-' + k : '') + '"><b>' + n + '</b><span>' + s + '</span></div>'; };
  var arrow = '<i class="dv-arr" aria-hidden="true">→</i>';
  var flow = '<div class="dv-flow">' +
    '<div class="dv-lane"><span class="dv-lab">기존</span><div class="dv-row">' + [box('P1 기초 세팅', '길이·화면 자동'), box('P2 Producer', '설정 칩·카드'), box('Writer 01~04', '씬 스토리'), box('넘기기', '러닝타임 검사', 'bad'), box('Writer 05~15', '그림·샷·러프'), box('Artist', '07 뒤 자동'), box('Director', '샷 생성')].join(arrow) + '</div></div>' +
    '<div class="dv-lane"><span class="dv-lab">리뉴얼</span><div class="dv-row">' + [box('Producer', '아이디어·조건'), box('Writer', '산문만 다룸'), box('산문 확정', 'Writer 완료 · 다시 맞추지 않음', 'acc'), box('Artist', '인물·배경 그림'), box('완료하기', '목록 확정 · Artist ⇄ Storyboard', 'acc'), box('Storyboard', '씬·샷·러프'), box('Director', '이번 범위 밖', 'out')].join(arrow) + '</div></div>' +
    '<p class="dv-note">↩ 새 인물·배경이 필요하면 Artist · Storyboard에서 산문으로 롤백해요 (' + idBtn('R1') + idBtn('R2') + idBtn('R3') + ').</p>' +
    '<p class="dv-note"><b>이름 변경</b> 기초 세팅 → Producer · P2 Producer → Writer · Writer 08~15 → Storyboard(가칭)<br><b>기존 Writer</b> 01~04 산문 → Writer · 05~07 그림 → Artist · 08~15 씬·샷·러프 → Storyboard</p></div>';

  var map = '<div class="dv-map">' + MAP.map(function (c) {
    return '<div class="dv-col"><div class="dv-col-h"><b>' + esc(c.name) + '</b><span>' + esc(c.sub) + '</span></div>' + c.items.map(function (x) {
      return '<button class="dv-chip dv-c-' + x[1] + '" data-node="' + x[4] + '" data-dev-go="1"><em>' + esc(x[0]) + '</em><b>' + esc(x[2]) + '</b><span>' + esc(x[3]) + '</span></button>';
    }).join('') + '</div>';
  }).join('') + '</div><div class="dv-gone"><b>없어지는 것</b><ul>' + GONE.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>';

  var tables = SPEC.map(function (g) {
    return '<h4>' + esc(g.g) + (g.code ? ' <span class="mono">' + g.code + '</span>' : '') + '</h4><div class="dv-tw"><table class="dv-t"><thead><tr><th>기능</th><th>기존</th><th>리뉴얼</th><th>처리</th><th>개발에 닿는 곳</th><th>화면</th></tr></thead><tbody>' +
      g.rows.map(function (r) { return '<tr><td><b>' + esc(r.f) + '</b></td><td>' + esc(r.b) + '</td><td>' + esc(r.a) + '</td><td>' + tag(r.s, r.lock) + '</td><td>' + esc(r.d) + '</td><td class="dv-ids">' + r.ids.map(idBtn).join('') + '</td></tr>'; }).join('') +
      '</tbody></table></div>';
  }).join('');

  var sec = document.getElementById('devSpec');
  sec.innerHTML = '<div class="dv-head"><h2>개발 전달 · 기존에서 무엇이 바뀌나</h2><p>화면 ID를 누르면 프로토타입 탭으로 넘어가 그 화면이 열려요. 프로토타입·플로우 탭에서 화면을 고르면 화면 설명 아래에 그 화면의 변경 내용이 붙어요.</p></div>' +
    '<h3>흐름 비교</h3>' + flow + '<h3>기능 위치</h3><p class="dv-sub">칸 맨 위가 처리예요. 보존 = 지금처럼 · 바뀜 = 같은 자리에서 동작이 달라짐 · 이동 = 다른 단계에서 옮겨 옴 · 신규 = 새로 생김 · 기능 분리 = 이름은 같고 역할이 둘로 나뉨 · 삭제 = 없어짐.</p>' + map +
    '<h3>변경 명세</h3>' + tables +
    '<h3>같이 보는 파일</h3><ul class="dv-files"><li><b>Tale Studio 유저 플로우 (10/13 정리본)</b> 자료를 올렸을 때 LLM이 하는 일 (글 1-1~1-3). 이미지 2-1~2-3은 v2</li><li><b>tale-studio-1차-오류-리포트.md</b> 지금 제품의 알려진 오류</li><li>Writer 01~15 번호는 개발 아키텍처 지도 기준이에요.</li></ul>';

  // 위쪽 탭: 플로우 / 프로토타입 / 내용 정리
  var TABS = [['flow', '플로우'], ['proto', '프로토타입'], ['spec', '내용 정리']];
  var nav = document.createElement('nav'); nav.className = 'tt-nav'; nav.setAttribute('role', 'tablist'); nav.setAttribute('aria-label', '보기');
  nav.innerHTML = TABS.map(function (t) { return '<button role="tab" id="tt-' + t[0] + '" data-tt="' + t[0] + '">' + t[1] + '</button>'; }).join('');
  var top = document.querySelector('.tw-wrap > .top'); if (top) top.insertAdjacentElement('afterend', nav);
  var tab = 'proto';
  try { var saved = localStorage.getItem('tale-tab'); if (saved && /^(flow|proto|spec)$/.test(saved)) tab = saved; } catch (e) {}
  window.TaleSetTab = function (t) { setTab(t); };
  try { var qt = window.TALE_START_TAB; if (qt && /^(flow|proto|spec)$/.test(qt)) tab = qt; } catch (e) {}
  function setTab(t, keepScroll) {
    tab = t; document.getElementById('taleWb').setAttribute('data-tt', t);
    nav.querySelectorAll('[data-tt]').forEach(function (b) { b.setAttribute('aria-selected', String(b.dataset.tt === t)); b.tabIndex = b.dataset.tt === t ? 0 : -1; });
    try { localStorage.setItem('tale-tab', t); } catch (e) {}
    var ms = document.getElementById('mainSplit'); if (ms && t === 'flow') ms.classList.remove('closed');
    if (t === 'flow' && window.FlowView && window.FlowView.fit) setTimeout(function () { try { window.FlowView.fit(); } catch (e) {} }, 60);
    if (!keepScroll) document.getElementById('taleWb').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  nav.addEventListener('click', function (e) { var b = e.target.closest('[data-tt]'); if (b) setTab(b.dataset.tt); });
  nav.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    var i = TABS.map(function (t) { return t[0]; }).indexOf(tab), n = (i + (e.key === 'ArrowRight' ? 1 : TABS.length - 1)) % TABS.length;
    setTab(TABS[n][0]); var nb = document.getElementById('tt-' + TABS[n][0]); if (nb) nb.focus();
  });
  setTab(tab, true);

  // 내용 정리의 화면 ID · 화면 설명의 [프로토타입에서 보기] → 프로토타입 탭으로
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-dev-go]'); if (!b) return;
    if (tab !== 'proto') setTab('proto', true);
    var tp = document.getElementById('mainSplit'); if (tp) setTimeout(function () { tp.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 30);
  });
  document.addEventListener('click', function (e) { var a = e.target.closest('a[href="#devSpec"]'); if (!a) return; e.preventDefault(); setTab('spec'); });

  // 화면 설명에 그 화면의 변경 내용 붙이기
  var info = document.getElementById('info');
  var paint = function () {
    if (!info || info.querySelector('.dv-in')) return;
    var t = info.querySelector('.info-h .mono'); if (!t) return;
    var id = t.textContent.trim(), hit = [];
    SPEC.forEach(function (g) { g.rows.forEach(function (r) { if (r.ids.indexOf(id) >= 0) hit.push({ g: g.g, r: r }); }); });
    var div = document.createElement('div'); div.className = 'dv-in';
    div.innerHTML = '<button class="btn dv-toproto" data-node="' + id + '" data-dev-go="1">이 화면 프로토타입에서 보기 →</button>' + (hit.length ? '<div class="sub">내용 정리 · 기존에서 바뀌는 것</div>' + hit.map(function (h) {
      var r = h.r; return '<div class="dv-in-r"><div>' + tag(r.s, r.lock) + ' <b>' + esc(r.f) + '</b> <span class="dv-g">' + esc(h.g) + '</span></div><div class="dv-in-ba"><span>기존</span>' + esc(r.b) + '</div><div class="dv-in-ba"><span>리뉴얼</span>' + esc(r.a) + '</div>' + (r.d ? '<div class="dv-in-ba"><span>개발</span>' + esc(r.d) + '</div>' : '') + '</div>';
    }).join('') + '<a class="dv-jump" href="#devSpec">내용 정리 전체 보기 →</a>' : '');
    info.appendChild(div);
  };
  if (info) { new MutationObserver(paint).observe(info, { childList: true }); paint(); }
})();
