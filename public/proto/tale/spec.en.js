
(function () {
  var ST = { keep: 'Kept', chg: 'Changed', mv: 'Moved', 'new': 'New', del: 'Removed', hold: 'On hold', ren: 'Renamed', split: 'Split' };
  var SPEC = [
    { g: 'Shared', rows: [
      { f: 'Stage names', b: 'Basic setup · Producer · Writer', a: 'Producer · Writer · Artist · Storyboard (working title). Storyboard name TBD', s: 'ren', d: 'Screen copy, side menu, agent names', ids: ['E1', 'W1', 'S1'] },
      { f: 'AI-working lock', b: 'Partial', a: 'Full-screen loader while the AI works, all inputs disabled', s: 'chg', d: 'Prevents duplicate generate requests, no parallel jobs', ids: ['E2', 'E5', 'W2', 'A0', 'A4', 'A8', 'S0', 'S3', 'S6'] },
      { f: 'Edit myself', b: 'Directly on screen', a: 'Popup only. Chat locked while it\'s open', s: 'chg', d: 'Chat and hand edits never touch the same data at once', ids: ['W5', 'A7', 'S2'] },
      { f: 'Genre · tone', b: 'One P2 settings chip (genre · tone)', a: 'Split per stage under names that fit each, controlled separately. Producer · Writer = genre & mood (prose conditions) · Artist = mood & tone (per character/set: personality · feel of a place) + colour & mood when remaking', s: 'split', d: 'Per-stage values, per-object values', ids: ['E3', 'W3', 'A7r'] },
      { f: 'Moving between stages', b: 'Stages mixed together (images & shots inside Writer)', a: 'Producer → Writer → Artist → Storyboard in order. Producer · Writer, once passed, are "done", not locked — their work is finished, so later changes (cast · looks · shots) aren\'t synced back. Artist ⇄ Storyboard go back and forth. Rollback only for cast/sets not in the prose', s: 'chg', d: 'Stage status (done · in progress), no back-sync to earlier stages', ids: ['W6', 'A9', 'S0'] },
      { f: 'Chat language · dialogue language', b: 'P2 settings chips, chosen in Writer', a: 'No picker. Follows the site language', s: 'del', d: 'Language = site language, 14 dialogue generation', ids: ['E1', 'S1'] }
    ] },
    { g: 'Producer', code: 'E', rows: [
      { f: 'Idea · file attach', b: 'P1 material · idea', a: '20+ characters of text or a file. txt · md · docx · pdf · hwp + png · jpg with text, 10MB', s: 'chg', d: 'Upload validation, OCR on images', ids: ['E1', 'EB1', 'EF'] },
      { f: 'Error notice', b: 'None', a: 'File-type error · ask for more · read failure', s: 'new', d: 'Validation-failure copy', ids: ['EFe', 'E1e', 'E2e'] },
      { f: 'AI recommendations', b: 'None', a: 'Reads the text and pre-fills genre & mood · running time · change level, each with a one-line reason', s: 'new', d: 'Recommendation step', ids: ['E2', 'E3'] },
      { f: 'Genre & mood (prose genre · tone)', b: 'P2 settings chip', a: 'Pick from 10. A prose condition; changes only through a Writer rewrite', s: 'split', d: '01–04 input', ids: ['E3', 'EB3'] },
      { f: 'Running time (sizing the prose idea)', b: 'P1 length · screen + P2 running-time chip, hand-off check', a: 'Pick under 15s · 15–60s · 1–5 min · 5–20 min. Only sizes the prose idea. A different feature from Storyboard\'s running-time indicator despite the name', s: 'split', d: '01–04 input, hand-off check removed', ids: ['E3', 'EB4'] },
      { f: 'AI change level', b: 'P1 usage', a: '1 keep as is · 2 polish · 3 grow it new. For script files: film as is · polish a little · make it new', s: 'new', d: '01–04 branch. "Keep as is" → read-only prose (W1r)', ids: ['E3', 'EB2', 'EB5'] },
      { f: 'Aspect ratio', b: 'P1 auto + P2 chip', a: 'Locks at the start check, can\'t change after', s: 'chg', lock: true, d: 'Locked value', ids: ['E4', 'EB6', 'EB7'] },
      { f: 'Format picker · image-rights consent', b: 'P1', a: 'None', s: 'del', d: 'Screen', ids: ['E1'] },
      { f: 'Reading webtoons · character sheets · reference photos', b: 'P1 usage', a: 'Pushed to v2. For now: text files and images with text only', s: 'hold', d: 'Upload type limits', ids: ['EF'] }
    ] },
    { g: 'Writer', code: 'W', rows: [
      { f: 'Prose', b: 'P2 scene story (Writer 01–04)', a: 'Prose-only workspace', s: 'keep', d: '01~04', ids: ['W1'] },
      { f: 'Read-only prose', b: 'None', a: 'With "keep as is", only breakdown — no rewrite or manual edit', s: 'new', d: 'Branch', ids: ['W1r'] },
      { f: 'AI rewrite', b: 'P2 rewrite card', a: 'Conditions (running time · genre & mood · material) change only on rewrite. All / part (pick paragraphs, then chat)', s: 'chg', d: 'Re-run 01–04, paragraph-level rewrite', ids: ['W3', 'WC1', 'WC2', 'WC3'] },
      { f: 'Write myself', b: 'Edit myself', a: 'Popup. Chat locked while it\'s open', s: 'chg', d: '', ids: ['W5'] },
      { f: 'Pick a revision', b: 'Three options', a: 'As is. For a partial rewrite, only the chosen paragraphs differ', s: 'keep', d: '', ids: ['W4'] },
      { f: 'Next-step suggestion', b: 'Yes (the agent suggests the next step)', a: 'After applying, asks whether to move on; otherwise offers next steps as buttons', s: 'keep', d: 'Agent copy', ids: ['WP', 'WN'] },
      { f: 'Lock the prose', b: 'Hand off to Writer + running-time check', a: 'Confirming locks the prose and runs the breakdown immediately. No running-time check', s: 'chg', lock: true, d: 'Hand-off check removed', ids: ['W6'] },
      { f: 'Settings chips under the title', b: 'P2', a: 'None. Conditions only as one line of text above the prose', s: 'del', d: 'Screen', ids: ['W1'] }
    ] },
    { g: 'Artist', code: 'A', rows: [
      { f: 'Breakdown list', b: 'P2 Casting · Background', a: 'Cast · sets · looks (outfit, age) from the locked prose as a text list. Reference per row, AI review note', s: 'mv', d: '07 input. Check: does it run from the locked prose alone, without 02·03?', ids: ['A0', 'A1', 'AR'] },
      { f: 'Re-check', b: 'None', a: 'Add, fix or merge missed/duplicated names in the prose-marking popup; the prose stays locked', s: 'new', d: 'Cast & place marking data, merging', ids: ['A1c', 'WT', 'WTm'] },
      { f: 'Rollback', b: 'None', a: 'Cast/sets not in the prose: back to the prose and break down again', s: 'new', d: 'Check: how much imagery survives a rollback', ids: ['R1', 'R2', 'AX'] },
      { f: 'Style', b: 'P2 settings chip', a: 'Style picker popup. One per project; create after checking style references · count · estimated credits', s: 'mv', d: '05, project style value', ids: ['A2', 'A4'] },
      { f: 'Regenerate · history · load', b: 'None', a: 'Version (v1, v2…) history. Loading also restores that version\'s style. "Back to the old style" points to loading', s: 'new', d: 'Version saving', ids: ['A6', 'AV', 'AY'] },
      { f: 'Mood · tone (per character/set)', b: 'None (one P2 genre · tone chip)', a: 'Pick mood & tone (comedy · horror · romance · noir · warm …) in the personality / feel-of-place suggestions when remaking. Remakes only that object. "Colour · mood" is also a change area', s: 'split', d: 'Per-object values, per-object regeneration', ids: ['A7', 'A7r'] },
      { f: 'Result cards', b: 'Auto-generated after 07', a: '[All · Cast · Sets] tabs, project style & version shown, no [Add cast/set]', s: 'chg', d: '', ids: ['A5'] },
      { f: 'Details · remake', b: 'v18 detail', a: 'Pick what to change (all · face · outfit · expression · colour) and a base image, for one item. Add looks', s: 'chg', d: 'Per-object regeneration', ids: ['A7', 'A7r'] },
      { f: 'Edit by chat', b: 'Yes (agent chat)', a: '"Change Minho" → choose: from the style / small things / the look', s: 'keep', d: 'Agent branching', ids: ['AC1', 'AC2', 'AC3'] },
      { f: 'Finish', b: 'None (runs automatically)', a: 'Can\'t proceed if any main image is missing. Only the list locks; Artist can be revisited anytime', s: 'chg', lock: true, d: 'Storyboard entry condition', ids: ['A9'] }
    ] },
    { g: 'Storyboard (working title)', code: 'S', rows: [
      { f: 'Scene & shot split · roughs', b: 'Writer 08~15', a: 'After Artist. Shows progress · time left; finished shots appear first', s: 'mv', d: '08~15', ids: ['S0', 'S1'] },
      { f: 'Running time (indicator)', b: 'Input · target bar', a: 'Just a "3 scenes · 8 shots · 20s" indicator, updating as shots change. A different feature from Producer\'s running time (sizing the prose idea)', s: 'split', d: 'Sum of shot lengths', ids: ['S1'] },
      { f: 'Edit shot', b: 'v18 shot popup (start · direction · end)', a: 'Two groups (start / direction), end frame removed. Lighting added (position · colour temp · brightness); shot types show code + description', s: 'chg', d: 'Lighting in shot data', ids: ['S2'] },
      { f: 'Review the new rough', b: 'Applied to the card directly', a: 'Compare before → after, then revert / edit again / apply', s: 'new', d: 'Temporary version before apply', ids: ['S3', 'S3c'] },
      { f: 'Add shot · add scene', b: 'Yes', a: '[Add shot] enables only after choosing a spot. Scenes start with 0 shots', s: 'chg', d: '', ids: ['S4', 'S8'] },
      { f: 'Add look', b: 'Add character in Writer', a: 'Opens the Artist detail popup, no rollback', s: 'chg', d: 'Reuses Artist detail', ids: ['S5', 'S6'] },
      { f: 'Review agent changes', b: 'Yes (apply / revert)', a: 'Changed shots highlighted yellow → applying redraws, then the new-rough review. No new requests until reviewed', s: 'chg', d: '', ids: ['SG'] },
      { f: 'Rollback (shots exist)', b: 'None', a: 'Cast/sets not on the list: start again from the prose. Shows affected shots · images · estimated credits', s: 'new', d: 'Check: how many shots survive a rollback', ids: ['R3'] },
      { f: 'Master sheet', b: 'Yes', a: 'As is', s: 'keep', d: '', ids: ['SM'] },
      { f: 'Hand off to Director', b: 'Yes', a: 'Flags shots without roughs as left out, with [Draw remaining cuts]', s: 'chg', d: '', ids: ['S7'] },
      { f: 'END shot · end frame · cast & set drawer · character highlight view · multi-shot select', b: 'Writer', a: 'None', s: 'del', d: 'Screen', ids: ['S1'] }
    ] }
  ];

  var MAP = [
    { name: 'Producer', sub: 'Renamed from Basic setup', items: [['Changed', 'chg', 'Idea · file attach', 'Text 20 chars · file 10MB', 'E1'], ['New', 'new', 'AI recommendations', 'Reads text, fills defaults', 'E3'], ['Split', 'split', 'Genre & mood', 'Prose genre · tone', 'E3'], ['Split', 'split', 'Running time', 'For sizing the prose idea', 'E3'], ['New', 'new', 'AI change level', 'Keep · polish · new', 'E3'], ['Changed · locked', 'chg', 'Aspect ratio', 'Locks from the start', 'E4']] },
    { name: 'Writer', sub: 'Renamed from P2 Producer', items: [['Kept', 'keep', 'Prose', 'Writer 01–04 output', 'W1'], ['Changed', 'chg', 'AI rewrite', 'Conditions change only here', 'W3'], ['Changed', 'chg', 'Manual edit popup', 'Chat locked while open', 'W5'], ['Kept', 'keep', 'Pick a revision', 'Three options', 'W4'], ['Kept', 'keep', 'Next-step suggestion', 'Asks to move on after applying', 'WP'], ['Changed · locked', 'chg', 'Lock the prose', 'Breakdown after lock', 'W6']] },
    { name: 'Artist', sub: 'List → style → images', items: [['Moved', 'mv', 'Breakdown list', 'Was: P2 cast & set cards', 'A1'], ['New', 'new', 'Re-check · rollback', 'Missed or duplicated names', 'A1c'], ['Moved', 'mv', 'Style', 'One per project · was a P2 chip', 'A2'], ['New', 'new', 'Generation history · load', 'v1·v2 · style travels too', 'AV'], ['Changed', 'chg', 'Details · remake', 'Pick what to change, one item', 'A7'], ['Split', 'split', 'Mood · tone', 'Per character/set', 'A7r'], ['Changed · locked', 'chg', 'Finish', 'Cast & set list locked', 'A9']] },
    { name: 'Storyboard (working title)', sub: 'Where Writer 08–15 was', items: [['Moved', 'mv', 'Scenes · shots · roughs', 'Was: Writer 08–15', 'S1'], ['Changed', 'chg', 'Edit shot', 'Two groups · lighting added', 'S2'], ['New', 'new', 'Review the new rough', 'Before → after compare', 'S3c'], ['Split', 'split', 'Running time (indicator)', 'Not a target · sum of shot lengths', 'S1'], ['Changed', 'chg', 'Review agent changes', 'Yellow highlight → apply', 'SG'], ['Kept', 'keep', 'Master sheet · hand-off', 'Same as before', 'SM']] }
  ];
  var GONE = ['Chat & dialogue language pickers (site language instead)', 'Format picker (short film · ad · MV…)', 'Image-rights consent dialog', 'Settings chips under the title', 'Hand-off running-time check', 'END shot · end frame', 'Running-time input · target bar', 'Storyboard\'s cast & set drawer', 'Character highlight view · multi-shot select'];

  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var idBtn = function (id) { return '<button class="dv-id" data-node="' + id + '" data-dev-go="1">' + id + '</button>'; };
  var tag = function (s, lock) { return '<span class="dv-st dv-' + s + '">' + ST[s] + (lock ? ' · locked' : '') + '</span>'; };

  var box = function (n, s, k) { return '<div class="dv-box' + (k ? ' dv-' + k : '') + '"><b>' + n + '</b><span>' + s + '</span></div>'; };
  var arrow = '<i class="dv-arr" aria-hidden="true">→</i>';
  var flow = '<div class="dv-flow">' +
    '<div class="dv-lane"><span class="dv-lab">Before</span><div class="dv-row">' + [box('P1 Basic setup', 'Auto length · screen'), box('P2 Producer', 'Settings chips · cards'), box('Writer 01~04', 'Scene story'), box('Skip', 'Running-time check', 'bad'), box('Writer 05~15', 'Images · shots · roughs'), box('Artist', 'Auto after 07'), box('Director', 'Shot generation')].join(arrow) + '</div></div>' +
    '<div class="dv-lane"><span class="dv-lab">Renewal</span><div class="dv-row">' + [box('Producer', 'Idea · conditions'), box('Writer', 'Prose only'), box('Lock the prose', 'Writer done · no re-sync', 'acc'), box('Artist', 'Cast & set images'), box('Finish', 'List locked · Artist ⇄ Storyboard', 'acc'), box('Storyboard', 'Scenes · shots · roughs'), box('Director', 'Out of scope this round', 'out')].join(arrow) + '</div></div>' +
    '<p class="dv-note">↩ Need a new character or set? Roll back to the prose from Artist · Storyboard (' + idBtn('R1') + idBtn('R2') + idBtn('R3') + ').</p>' +
    '<p class="dv-note"><b>Renamed</b> Basic setup → Producer · P2 Producer → Writer · Writer 08–15 → Storyboard (working title)<br><b>Old Writer</b> 01–04 prose → Writer · 05–07 images → Artist · 08–15 scenes · shots · roughs → Storyboard</p></div>';

  var map = '<div class="dv-map">' + MAP.map(function (c) {
    return '<div class="dv-col"><div class="dv-col-h"><b>' + esc(c.name) + '</b><span>' + esc(c.sub) + '</span></div>' + c.items.map(function (x) {
      return '<button class="dv-chip dv-c-' + x[1] + '" data-node="' + x[4] + '" data-dev-go="1"><em>' + esc(x[0]) + '</em><b>' + esc(x[2]) + '</b><span>' + esc(x[3]) + '</span></button>';
    }).join('') + '</div>';
  }).join('') + '</div><div class="dv-gone"><b>Going away</b><ul>' + GONE.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>';

  var tables = SPEC.map(function (g) {
    return '<h4>' + esc(g.g) + (g.code ? ' <span class="mono">' + g.code + '</span>' : '') + '</h4><div class="dv-tw"><table class="dv-t"><thead><tr><th>Feature</th><th>Before</th><th>Renewal</th><th>Disposition</th><th>Touches in code</th><th>Screens</th></tr></thead><tbody>' +
      g.rows.map(function (r) { return '<tr><td><b>' + esc(r.f) + '</b></td><td>' + esc(r.b) + '</td><td>' + esc(r.a) + '</td><td>' + tag(r.s, r.lock) + '</td><td>' + esc(r.d) + '</td><td class="dv-ids">' + r.ids.map(idBtn).join('') + '</td></tr>'; }).join('') +
      '</tbody></table></div>';
  }).join('');

  var sec = document.getElementById('devSpec');
  sec.innerHTML = '<div class="dv-head"><h2>Dev handoff · what changes from today</h2><p>Click a screen ID to jump to that screen in the Prototype tab. Pick a screen in the Prototype or Flow tab and its changes appear under the screen description.</p></div>' +
    '<h3>Flow comparison</h3>' + flow + '<h3>Where features live</h3><p class="dv-sub">The top of each cell is the disposition. Kept = as today · Changed = same place, behaves differently · Moved = brought over from another stage · New = newly added · Split = same name, role split in two · Removed = gone.</p>' + map +
    '<h3>Change spec</h3>' + tables +
    '<h3>Related files</h3><ul class="dv-files"><li><b>Tale Studio user flow (10/13 notes)</b> What the LLM does when material is uploaded (text 1-1~1-3). Images 2-1~2-3 are v2</li><li><b>tale-studio-1st-error-report.md</b> Known errors in today\'s product</li><li>Writer 01–15 numbering follows the dev architecture map.</li></ul>';

  var TABS = [['flow', 'Flow'], ['proto', 'Prototype'], ['spec', 'Spec']];
  var nav = document.createElement('nav'); nav.className = 'tt-nav'; nav.setAttribute('role', 'tablist'); nav.setAttribute('aria-label', 'View');
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

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-dev-go]'); if (!b) return;
    if (tab !== 'proto') setTab('proto', true);
    var tp = document.getElementById('mainSplit'); if (tp) setTimeout(function () { tp.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 30);
  });
  document.addEventListener('click', function (e) { var a = e.target.closest('a[href="#devSpec"]'); if (!a) return; e.preventDefault(); setTab('spec'); });

  var info = document.getElementById('info');
  var paint = function () {
    if (!info || info.querySelector('.dv-in')) return;
    var t = info.querySelector('.info-h .mono'); if (!t) return;
    var id = t.textContent.trim(), hit = [];
    SPEC.forEach(function (g) { g.rows.forEach(function (r) { if (r.ids.indexOf(id) >= 0) hit.push({ g: g.g, r: r }); }); });
    var div = document.createElement('div'); div.className = 'dv-in';
    div.innerHTML = '<button class="btn dv-toproto" data-node="' + id + '" data-dev-go="1">See this screen in the prototype →</button>' + (hit.length ? '<div class="sub">Spec · what changes from today</div>' + hit.map(function (h) {
      var r = h.r; return '<div class="dv-in-r"><div>' + tag(r.s, r.lock) + ' <b>' + esc(r.f) + '</b> <span class="dv-g">' + esc(h.g) + '</span></div><div class="dv-in-ba"><span>Before</span>' + esc(r.b) + '</div><div class="dv-in-ba"><span>Renewal</span>' + esc(r.a) + '</div>' + (r.d ? '<div class="dv-in-ba"><span>Dev</span>' + esc(r.d) + '</div>' : '') + '</div>';
    }).join('') + '<a class="dv-jump" href="#devSpec">See the full spec →</a>' : '');
    info.appendChild(div);
  };
  if (info) { new MutationObserver(paint).observe(info, { childList: true }); paint(); }
})();
