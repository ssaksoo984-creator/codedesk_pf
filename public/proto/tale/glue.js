
(function () {
  var F = window.FLOW, V = window.FlowView, P = window.PROTO;
  var byId = V.byId, stageName = V.stageName, esc = V.esc;
  var $ = function (id) { return document.getElementById(id); };
  var cur = null;

  $('updated').textContent = '기준 ' + F.updated;
  $('principles').innerHTML = F.principles.map(function (p) { return '<div class="pr"><b>' + esc(p.title) + '</b><span>' + esc(p.text) + '</span></div>'; }).join('');

  var VS = { keep: '지금과 같음', change: '바뀜', 'new': '새로' };
  var TYPE = { screen: '화면', modal: '팝업 · 확인창', decision: '갈림', ai: 'AI 작업 중 · 전체 잠금', error: '오류 안내', ext: '범위 밖' };

  // 노드 고르기: 설명을 바꾸고, 목업을 그 화면으로 옮기고, 플로우에 빨간 표시
  function select(id, opt) {
    opt = opt || {};
    var n = byId[id]; if (!n) return;
    cur = id;
    var follow = document.getElementById('taleWb').getAttribute('data-tt') !== 'flow' && !$('mainSplit').classList.contains('closed');
    if ((V.stage() || follow) && V.stage() !== n.stage) { V.setStage(n.stage).then(function () { V.mark(cur, true); }); paintStages(); }
    V.mark(id, opt.scroll);
    if (!opt.fromProto && P.current() !== id) P.show(id);
    var scr = P.screenFor(id);
    $('scrId').textContent = scr ? scr + (scr !== id ? ' (' + id + '는 이 화면에서)' : '') : '';
    void 'TaleStudio_프로토타입_전체화면.html#' + id;
    var out = F.edges.filter(function (e) { return e[0] === id; });
    var h = '<div class="info-h"><span class="mono tag">' + n.id + '</span><h3>' + esc(n.label) + '</h3>' +
      '<span class="tag' + (n.type === 'ai' ? ' t-ai' : '') + '">' + TYPE[n.type] + '</span>' +
      (n.vs ? '<span class="tag t-' + n.vs + '">' + VS[n.vs] + '</span>' : '') +
      (n.lock ? '<span class="tag t-lock">🔒 ' + esc(n.lock) + ' 잠김</span>' : '') +
      '<span class="tag">' + esc(stageName[n.stage]) + '</span></div>';
    if (n.desc) h += '<p>' + esc(n.desc) + '</p>';
    if (n.items) h += '<div class="sub">들어가는 것</div><ul>' + n.items.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>';
    if (n.removed) h += '<div class="sub">빠지는 것</div><ul class="removed">' + n.removed.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>';
    if (n.open) h += '<div class="sub">확인 필요</div><ul class="open">' + n.open.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>';
    if (n.fixes) h += '<div class="fix"><b>풀리는 오류</b> ' + n.fixes.map(function (k) { return '#' + k + ' ' + esc(F.errors[k]); }).join(' · ') + '</div>';
    if (out.length) h += '<div class="sub">여기서 갈 수 있는 곳</div><div class="next">' + out.map(function (e) {
      return '<button class="btn k-' + (e[3] || 'go') + '" data-node="' + e[1] + '">' + (e[2] ? esc(e[2]) + ' → ' : '→ ') + '<span class="mono">' + e[1] + '</span> ' + esc(byId[e[1]].label) + '</button>';
    }).join('') + '</div>';
    $('info').innerHTML = h;
    
  }

  // 1안 / 2안
  var plan = 'A';
  try { plan = localStorage.getItem('tale-plan') === 'B' ? 'B' : 'A'; } catch (e) {}
  function paintPlans() {
    $('planSeg').innerHTML = F.plans.map(function (x) { return '<button data-plan="' + x.id + '" aria-pressed="' + (x.id === plan) + '">' + esc(x.name) + '</button>'; }).join('');
    $('plansBody').innerHTML = F.plans.map(function (x) { return '<div class="plan' + (x.id === plan ? ' on' : '') + '"><b>' + esc(x.name) + (x.id === plan ? ' · 지금 보는 안' : '') + '</b><span>' + esc(x.text) + '</span></div>'; }).join('');
    $('planTag').textContent = F.plans.filter(function (x) { return x.id === plan; })[0].name;
  }
  function setPlan(p) {
    plan = p; try { localStorage.setItem('tale-plan', p); } catch (e) {}
    paintPlans(); P.setPlan(p);
    var cn = byId[cur], to = !cn || !cn.plan || cn.plan === p ? cur : (F.twin[cur] || 'W1');
    V.setPlan(p).then(function () { select(to, { scroll: true }); });
  }
  paintPlans(); V.setPlan(plan); P.setPlan(plan);
  $('planSeg').addEventListener('click', function (e) { var b = e.target.closest('[data-plan]'); if (b) setPlan(b.dataset.plan); });


  // 플로우 단계별 보기: 전체 / Producer / Writer / Artist / Storyboard / Director
  function paintStages() {
    var cur0 = V.stage();
    $('stageSeg').innerHTML = '<button data-stage="" aria-pressed="' + !cur0 + '">전체</button>' + F.stages.map(function (s) {
      return '<button data-stage="' + s.id + '" aria-pressed="' + (cur0 === s.id) + '">' + esc(s.name.split(' ')[0]) + '</button>';
    }).join('');
  }
  function showStage(id) { V.setStage(id || null).then(function () { V.mark(cur, true); }); paintStages(); }
  $('stageSeg').addEventListener('click', function (e) { var b = e.target.closest('[data-stage]'); if (b) showStage(b.dataset.stage); });
  paintStages();
  P.mount($('screen'), { onNavigate: function (id) { if (byId[id]) select(id, { scroll: true, fromProto: true }); } });
  V.mount($('flow'), { onSelect: function (id) { select(id, { scroll: true }); } });
  $('zin').onclick = V.zoomIn; $('zout').onclick = V.zoomOut; $('zfit').onclick = V.fit;
  // 플로우 차트 여닫기
  function setFlow(open) { $('mainSplit').classList.toggle('closed', !open); $('flowOpen').hidden = open; try { localStorage.setItem('tale-flow-open', open ? '1' : '0'); } catch (e) {} if (open) setTimeout(function () { V.mark(cur, true); }, 50); }
  $('flowClose').onclick = function () { setFlow(false); }; $('flowOpen').onclick = function () { setFlow(true); };
  try { if (localStorage.getItem('tale-flow-open') === '0') setFlow(false); } catch (e) {}
  $('protoReset').onclick = function () { var s0 = plan === 'B' ? 'EB1' : 'E1'; P.reset(); P.show(s0); select(s0, { scroll: true, fromProto: true }); };

  document.addEventListener('click', function (e) {
    var t = e.target;
    var nb = t.closest('[data-node]');
    if (nb && !nb.closest('svg') && !nb.closest('#screen')) { select(nb.dataset.node, { scroll: true }); return; }
  });
  var start = '';
  if (byId[start] && !V.visible(start)) start = F.twin[start] || '';
  select(byId[start] ? start : (plan === 'B' ? 'EB1' : 'E1'));
})();
