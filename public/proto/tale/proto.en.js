

(function () {
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var clone = function (o) { return JSON.parse(JSON.stringify(o)); };


  var RATIOS = [['16:9', 'Landscape'], ['9:16', 'Vertical · short-form'], ['1:1', 'Square'], ['2.39:1', 'Cinema']];
  var RUNTIMES = [['Under 15s', 'Short-form', 15], ['15–60s', 'Ad · teaser', 60], ['1–5 min', 'MV · web drama', 300], ['5–20 min', 'Short film', 1200]];
  var MOODS = ['Comedy', 'Drama', 'Romance', 'Thriller', 'Horror', 'Action', 'Sci-fi·Fantasy', 'Mystery', 'Human·Family', 'Slice of life·Calm'];
  var TONES = ['Project default', 'Comedy', 'Horror', 'Romance', 'Warmer'];

  var SHOT_TYPES = [['ECU', 'Extreme close-up: just a sliver — eyes, hands'], ['CU', 'Close-up: mostly the face'], ['MCU', 'Medium close-up: chest up'], ['MS', 'Medium shot: waist up'], ['MFS', 'Medium full shot: knees up'], ['FS', 'Full shot: whole body'], ['WS', 'Wide shot: character and surroundings'], ['EWS', 'Extreme wide shot: vast background, tiny figure'], ['OTS', 'Over-the-shoulder: the other person past a shoulder'], ['POV', 'Point of view: through the character\'s eyes'], ['TRACK', 'Tracking shot: moves with the subject'], ['2S', 'Two shot: two characters in one frame']];
  var ANGLES = [['Eye level', 'Eye level: the most natural view'], ['High angle', 'Looking down: subject feels small, weak'], ['Low angle', 'Looking up: subject feels big, strong'], ['Bird\'s-eye', 'Straight down: the whole situation like a map'], ['Worm\'s-eye', 'From the floor: overwhelming'], ['Dutch', 'Tilted frame: unease · tension']];
  var MOVES = [['Static', 'Camera doesn\'t move'], ['Pan', 'Turns left/right in place'], ['Tilt', 'Turns up/down in place'], ['Dolly in', 'Moves toward the subject'], ['Dolly out', 'Moves away from the subject'], ['Tracking', 'Follows the subject'], ['Crane', 'Rises and falls in a big arc'], ['Handheld', 'Shakes like it\'s held in hand'], ['Zoom in', 'Pulls in with the lens']];

  var LIGHT_POS = [['Front', 'Whole face evenly lit'], ['Left side', 'Only the left lit, the other side in shadow'], ['Right side', 'Only the right lit, the other side in shadow'], ['Backlight', 'Lit from behind, only the outline glows'], ['From above', 'Overhead: shadows under the eyes'], ['From below', 'From below: eerie, unfamiliar']];
  var LIGHT_TEMP = [['2700K', 'Candle · bulb: very warm orange', '#ffb066'], ['3200K', 'Tungsten · indoor: warm yellow', '#ffc98f'], ['4300K', 'Fluorescent: slightly warm white', '#ffe6cc'], ['5600K', 'Daylight (default): midday sun', '#fff8ef'], ['6500K', 'Overcast: slightly blue white', '#e9efff'], ['8000K', 'Shade · night: cool blue', '#c6d6ff']];
  var LENS = []; for (var _l = 1; _l <= 30; _l++) LENS.push(_l);
  var TIMES = ['Day', 'Afternoon', 'Dusk', 'Night', 'Dawn'];
  var STYLES = [['Live action', '#5b6470,#22262c'], ['Animation', '#ffb4a2,#8aa6ff'], ['Webtoon', '#fff3c4,#ffd0e0'], ['3D', '#9be1d4,#5f7fd9'], ['Watercolour', '#d9ecf5,#f4d9c6'], ['Sample image', '#c9c2b8,#8f8a83']];

  var LEVELS = [
    { n: 'Keep as is', s: 'Use my text as written', keep: 'Sentences · dialogue · plot · ending', change: 'Only scene splits and missing direction', need: true },
    { n: 'Polish', s: 'Keep the material, refine the wording', keep: 'Subject · characters · plot · ending', change: 'Sentences · dialogue · scene order' },
    { n: 'Grow it new', s: 'Start from the material and add ideas', keep: 'Subject · genre & mood · length', change: 'New ideas for plot · characters · ending' },
  ];

  var KINDS = {
    '1-1': { name: 'Script already written for film', rec: 0, rt: 2 },
    '1-2': { name: 'Regular script (stage · classic script)', rec: 0, rt: 2 },
    '1-3': { name: 'Idea note', rec: 2, rt: 1 },
    'img': { name: 'Image with text (photographed script · memo)', rec: 1, rt: 1 },
  };

  var SCRIPT_LEVELS = {
    '1-1': [{ n: 'Film it as is', s: 'Split the script straight into shots', keep: 'The whole script', change: 'Shot splitting only', need: true },
      { n: 'Polish a little', s: 'Rewrite only what changed', keep: 'Untouched scenes · dialogue', change: 'Only the edited parts' },
      { n: 'Make it new', s: 'Make a new film based on the script', keep: 'Subject · character setup', change: 'Plot · scenes · dialogue' }],
    '1-2': [{ n: 'Film it as is', s: 'Original stays; only fills what film needs', keep: 'The whole script', change: 'Only missing direction · cast · sets', need: true },
      { n: 'Polish a little', s: 'Rewrite only what changed', keep: 'Untouched scenes · dialogue', change: 'Only the edited parts' },
      { n: 'Make it new', s: 'Make a new film based on the script', keep: 'Subject · character setup', change: 'Plot · scenes · dialogue' }],
  };
  var isScript = function () { return !!(st.file && !st.file.noText && SCRIPT_LEVELS[st.kind]); };
  var LV = function () { return isScript() ? SCRIPT_LEVELS[st.kind] : LEVELS; };
  var LV_Q = function () { return isScript() ? 'How should we use your script?' : 'How much may the AI change your text?'; };
  var MIN_LEN = 20;
  var TEXT_EXT = ['txt', 'md', 'docx', 'pdf', 'hwp'], IMG_EXT = ['png', 'jpg', 'jpeg'];
  var OCR_LINE = 'Minho: "…nothing again?" / Team Lead: "Thanks." (first line read from the photo)';
  var ideaLen = function () { return st.idea.trim().length; };
  var hasText = function () { return (st.file && !st.file.noText) || ideaLen() >= 60; };
  var levelOk = function (i) { return !LV()[i].need || hasText(); };
  var recLevel = function () { if (st.file && !st.file.noText) return KINDS[st.kind].rec; return ideaLen() >= 60 ? 1 : 2; };

  function recommend() {
    var t = st.idea, mood = -1, why = '';
    MOODS.forEach(function (m, i) { if (mood < 0 && t.indexOf(m.split('·')[0]) >= 0) { mood = i; why = 'Your text says "' + m.split('·')[0] + '"'; } });
    var H = [[/고장|자판기|웃기|엉뚱|broke|vending|funny|absurd|comedy/i, 0, 'An absurd incident, so I read it as comedy'], [/귀신|무서|밤 열|CCTV|ghost|scary|horror|haunt/i, 4, 'There\'s a scary scene, so I read it as horror'], [/사랑|설레|옥상에서 마주|love|crush|romance|rooftop/i, 2, 'It centres on two people\'s feelings, so I read it as romance'], [/가족|아버지|엄마|딸|아들|family|father|\bdad\b|mother|\bmom\b|daughter|\bson\b/i, 8, 'A family story, so I read it as human/family'], [/로봇|우주|미래|시간|robot|space|future|another world/i, 6, 'An imagined world, so I read it as sci-fi/fantasy'], [/범인|단서|사라진|culprit|clue|missing|vanish|mystery/i, 7, 'A hunt for a hidden secret, so I read it as mystery']];
    if (mood < 0) H.some(function (h) { if (h[0].test(t)) { mood = h[1]; why = h[2]; return true; } });
    if (mood < 0 && st.file && !st.file.noText) { mood = 0; why = 'The script\'s dialogue is light, so I read it as comedy'; }
    if (mood < 0) { mood = 1; why = 'No clear genre, so I picked drama'; }
    var rt, rwhy, m = t.match(/(\d+)\s*(초|분|sec|seconds?|s\b|min|minutes?|m\b)/i);
    if (m) { var sec = +m[1] * (/^(분|m)/i.test(m[2]) ? 60 : 1); rt = sec <= 15 ? 0 : sec <= 60 ? 1 : sec <= 300 ? 2 : 3; rwhy = 'Your text says "' + m[0] + '"'; }
    else if (st.file && !st.file.noText) { rt = KINDS[st.kind].rt; rwhy = 'Estimated from the script length'; }
    else { rt = ideaLen() < 60 ? 1 : 2; rwhy = ideaLen() < 60 ? 'A short idea, so I kept it short' : 'Estimated from the plot length'; }
    var lv = recLevel();
    st.rec = { mood: mood, moodWhy: why, runtime: rt, runtimeWhy: rwhy, level: lv };
    st.mood = mood; st.runtime = rt; st.level = lv;
  }

  var SAMPLE_FILES = [['1-1', 'VendingMachine_shooting_script.docx'], ['1-2', 'VendingMachine_stage_script.hwp'], ['1-3', 'idea_memo.txt'], ['img', 'script_photo.jpg'], ['notext', 'hallway_scene.png'], ['bad', 'trailer.mp4'], ['bad', 'materials.zip']];
  var EXTRA_PEOPLE = [['Security guard', '50s. Navy guard uniform, walkie-talkie.'], ['Cleaner', '60s. Sky-blue work clothes, a mop.'], ['New hire', 'Early 20s. A new employee with an ID badge on a lanyard.'], ['Cat', 'Grey stray cat. Short tail.']];
  var EXTRA_PLACES = [['Rooftop', 'Office rooftop at dusk, railing and water tank.'], ['Convenience store', 'In front of the ground-floor convenience-store counter.'], ['Meeting room', 'Glass-walled meeting room, whiteboard.']];

  function initial() {
    return {
      idea: 'A comedy where the office hallway vending machine breaks and cans pour out — and Minho, the hero, doesn\'t get a single one.',
      file: null, kind: '1-3', level: 2, ratio: '9:16', ratioLocked: false, lenErr: false, fileErr: '', rec: null,
      title: 'Revolt of the Vending Machine',
      prose: [
        'Office hallway, 3 p.m. Minho presses the vending machine button but nothing comes out. He pulls the coin-return lever — silence. Minho gives the machine a tap.',
        'The machine rattles and cans come pouring out. The Team Lead, passing by, picks one up, says "Thanks" and walks off. Taem Lead doesn\'t even look back. At the end of the hall the security guard clicks his tongue. Among the cans rolling on the floor, Minho just stands there, dazed.',
      ],
      plan: 'A', pop: null, ents: null, pick: null, adding: false, editEnt: -1, entName: '', mergeInto: -1, showEx: false, exPage: 0, rw: null, bAns: {}, bPre: {}, bHint: '', bSent: false, draft: [], runtime: 0, mood: 0, seed: 0, request: '', variants: [], vpick: 0, vnote: '', parts: [], partNote: '', partMode: false,
      proseLocked: false, back: '', descEdit: -1,
      chars: [
        { n: 'Minho', d: 'Late-20s office worker. White shirt, loose tie, tired eyes.', states: ['White shirt', 'Cola-stained shirt (S2)'], tone: 0, note: '' },
        { n: 'Team Lead', d: '40s. Grey suit, neat hair, blank face.', states: ['Grey suit'], tone: 0, note: '' },
        { n: 'Taem Lead', d: 'Someone who never looks back. (AI pulled this out separately)', states: ['First look'], tone: 0, note: '' },
      ],
      bgs: [{ n: 'Office hallway, by the vending machine', d: 'Day, fluorescent light, linoleum floor, one red vending machine.', tone: 0 }],
      newItems: [],
      style: 1, styleLocked: false, generated: false, versions: [], ver: 0, regenStyle: null, styleRefs: [], renaming: false, acMode: null, afilter: 'all', editMode: null,
      target: 0, toneDraft: 0, tweak: '',

      scenes: [{ place: 0, time: 0, sum: 'Minho wrestles with the vending machine' }, { place: 0, time: 0, sum: 'Cans pour out and the Team Lead takes one' }],
      shots: [
        { sc: 1, len: 3, size: 3, ang: 0, move: 0, light: { pos: 0, temp: 3, bri: 50 }, dir: '', desc: '@Minho presses the vending machine button', who: [0], ws: {}, lines: [], drawn: true },
        { sc: 1, len: 2, size: 0, ang: 0, move: 0, light: { pos: 0, temp: 3, bri: 50 }, dir: 'Pulls the lever', desc: '@Minho\'s hand pulling the coin-return lever', who: [0], ws: {}, lines: [], drawn: true },
        { sc: 1, len: 2, size: 3, ang: 2, move: 3, light: { pos: 0, temp: 3, bri: 50 }, dir: 'Slowly moves in', marks: [{ t: 'arrow', x1: 4, y1: 45, x2: 60, y2: 45, c: 'r' }], desc: '@Minho gives the vending machine a tap', who: [0], ws: {}, lines: [{ w: 0, t: '…nothing again?', lang: 'EN' }], drawn: true },
        { sc: 2, len: 4, size: 6, ang: 1, move: 2, light: { pos: 0, temp: 3, bri: 50 }, dir: 'Tilt down', desc: 'Cans come pouring out', who: [0], ws: { 0: 1 }, lines: [], drawn: true },
        { sc: 2, len: 3, size: 11, ang: 0, move: 1, light: { pos: 0, temp: 3, bri: 50 }, dir: '', desc: '@Team Lead picks up a can', who: [1, 0], ws: { 0: 1 }, lines: [{ w: 1, t: 'Thanks.', lang: 'EN' }], drawn: true },
        { sc: 2, len: 2, size: 1, ang: 0, move: 0, light: { pos: 0, temp: 3, bri: 50 }, dir: '', desc: '@Minho standing there, dazed', who: [0], ws: { 0: 1 }, lines: [], drawn: true },
      ],
      shotSel: 4, shotDraft: null, shotTab: 'start', shotNew: false, dirMode: 'opt', addAt: null, ddOpen: '', sbView: 'rough', sbMenu: -1, sbChange: null, stateFrom: '',
      scAdd: { place: 0, time: 0, sum: '', pos: 2 }, sheet: { range: 0, pic: 0, per: 0 },
      stateAdd: { who: 0, text: 'Minho ten years later, greying hair' },
      chatDraft: '',
      chat: {
        Writer: [['Writer', 'I wrote the prose as two scenes. Not happy? Say "rewrite it" or change the conditions and have it rewritten.']],
        Artist: [['Artist', 'Two characters, one set. Minho has one more look in S2: the stained shirt.']],
        Storyboard: [],
      },
      pending: null, busyStep: 0,
    };
  }
  var st = initial();


  var STAGES = ['Producer', 'Writer', 'Artist', 'Storyboard', 'Director', 'Editor'];

  function canBoard() { return st.versions.length > 0 && objs().every(function (o) { return o.cur >= 0; }); }
  function rail(on) {
    var i = STAGES.indexOf(on);
    return '<nav class="w-rail" aria-label="Stages">' + STAGES.map(function (s, k) {


      var open = k < i && (s === 'Artist' || s === 'Storyboard'), block = false;
      return '<button class="' + (k === i ? 'on' : open ? 'done open' : k < i ? 'done' : '') + '" data-act="jumpStage" data-arg="' + s + '"' + (k === i ? ' aria-current="step"' : '') + (open ? ' title="You can go back and edit"' : k < i ? ' title="Done stage · later changes aren\'t synced back"' : '') + (block ? ' disabled title="Make every cast and set image in Artist before moving on"' : '') + '>' + (block ? '🔒 ' : '') + s + '</button>';
    }).join('') + '</nav>';
  }
  function bar(on) {
    return '<header class="w-bar"><b class="w-logo">Tale Studio</b>' + (on ? rail(on) : '<span style="flex:1"></span>') +
      '<span class="w-meta">' + (st.ratioLocked ? '<span class="w-lock">🔒 ' + esc(st.ratio) + '</span>' : '') + '<span>English · site language</span></span></header>';
  }
  function studio(on, main, o) {
    o = o || {};
    var msgs = st.chat[on] || [];
    var chat = '<aside class="w-chat' + (o.chatLocked ? ' is-locked' : '') + '"><div class="w-chat-h">Agent chat</div><div class="w-chat-b">' +
      msgs.map(function (m) { return '<div class="w-msg' + (m[0] === 'Me' ? ' me' : '') + '"><b>' + esc(m[0]) + '</b>' + esc(m[1]) + '</div>'; }).join('') + (o.card || '') +
      '</div>' + (o.suggest ? '<div class="w-sugg">' + o.suggest.map(function (t) { return '<button class="w-tab" data-act="send" data-arg="' + esc(t) + '">' + esc(t) + '</button>'; }).join('') + '</div>' : '') + (o.pick ? chatInput(o) : '<div class="w-chat-in">' + (o.chatLocked || o.noChat
        ? '<span class="w-mut">' + (o.chatLocked ? 'Close the popup to type again' : 'You can\'t edit by chat here') + '</span>'
        : '<input id="chat-in" data-bind="chatDraft" data-enter="send" value="' + esc(st.chatDraft) + '" placeholder="' + esc(o.ph || 'Tell me…') + '" aria-label="Chat input">' +
          '<button class="w-btn pri" data-act="send" data-need="chatDraft">Send</button>') + '</div>') + '</aside>';
    return bar(on) + '<div class="w-studio"><main class="w-main">' + main + '</main>' + chat + '</div>';
  }
  function chatInput(o) {
    if (o.pick) {
      var chips = st.parts.length ? st.parts.map(function (i) { return '<button class="w-chip pick" data-act="togglePart" data-arg="' + i + '" aria-label="S' + (i + 1) + ' remove">S' + (i + 1) + ' ×</button>'; }).join('') : '<span class="w-mut">Tap a paragraph in the prose above</span>';
      return '<div class="w-cin pick"><div class="w-cin-chips">' + chips + '</div><div class="w-cin-main"><input id="chat-in" data-bind="chatDraft" data-enter="sendPart" value="' + esc(st.chatDraft) + '" placeholder="How should I change it? e.g. make the dialogue funnier" aria-label="How to change it">' +
        '<button class="w-btn pri" data-act="sendPart"' + (st.parts.length ? '' : ' disabled') + '>Send</button></div></div>';
    }
    return null;
  }
  function modal(title, body, acts, wide) {
    return '<div class="w-back"><div class="w-modal' + (wide ? ' wide' + (wide === 'xl' || wide === 'xxl' ? ' ' + wide : '') : '') + '" role="dialog" aria-modal="true" aria-label="' + esc(title) + '"><h4>' + esc(title) + '</h4>' + body + '<div class="w-acts">' + acts + '</div></div></div>';
  }
  function list(rows) { return '<dl class="w-list">' + rows.map(function (r) { return '<div><dt>' + r[0] + '</dt><dd>' + r[1] + '</dd></div>'; }).join('') + '</dl>'; }

  function opts(bind, arr, cur, rec) {
    return '<div class="w-opts" role="radiogroup">' + arr.map(function (o, i) {
      var t = Array.isArray(o) ? o : [o, ''];
      return '<button class="w-opt' + (i === cur ? ' on' : '') + '" role="radio" aria-checked="' + (i === cur) + '" data-bind="' + bind + '" data-val="' + i + '">' + (i === rec ? '<em>Recommended</em>' : '') + esc(t[0]) + (t[1] ? '<small>' + esc(t[1]) + '</small>' : '') + '</button>';
    }).join('') + '</div>';
  }
  function B(label, go, cls, extra) { return '<button class="w-btn ' + (cls || '') + '"' + (go ? ' data-go="' + go + '"' : '') + (extra || '') + '>' + label + '</button>'; }
  function A(label, act, cls, extra) { return '<button class="w-btn ' + (cls || '') + '" data-act="' + act + '"' + (extra || '') + '>' + label + '</button>'; }
  function busy(title, steps) {
    var cur = st.busyStep;
    return '<div class="w-busy" role="status" aria-live="polite"><div class="w-busy-card"><span class="w-spin" aria-hidden="true"></span><h4>' + esc(title) + '</h4>' +
      '<p>The whole screen locks while the AI works. You can edit once it\'s done.</p>' +
      (steps ? '<ol class="w-steps">' + steps.map(function (s, i) { return '<li class="' + (i < cur ? 'done' : i === cur ? 'cur' : '') + '">' + esc(s) + '</li>'; }).join('') + '</ol>' : '<div class="w-prog"><i style="width:' + Math.min(100, cur * 34) + '%"></i></div>') +
      '<button class="w-btn ghost" data-act="skip">Skip the wait →</button></div></div>';
  }
  var styleBg = function (i) { return 'linear-gradient(135deg,' + STYLES[i][1] + ')'; };
  var target = function () { return objs()[st.target] || objs()[0]; };
  var shotLabel = function (i) { var s = st.shots[i], k = 0; for (var j = 0; j <= i; j++) if (st.shots[j].sc === s.sc) k++; return 'S' + s.sc + '-' + k; };
  var total = function () { return st.shots.reduce(function (a, s) { return a + s.len; }, 0); };
  function say(stage, who, text) { st.chat[stage].push([who, text]); }


  var isB = function () { return st.plan === 'B'; };
  var entryId = function () { return isB() ? 'EB1' : 'E1'; };
  var entryBase = function () { return isB() ? EB1() : E1(); };
  function counter() { return '<span class="w-count" data-count aria-live="polite"></span>'; }
  function lenErrHtml() {
    return st.lenErr && !st.file && ideaLen() < MIN_LEN ? '<p class="w-err" data-lenerr role="alert">Tell me a little more. With ' + MIN_LEN + '+ characters the AI can find the story. (<b data-lennow>' + ideaLen() + '</b> now)</p>' : '';
  }
  function fileRow() {
    return '<div class="w-file">' + (st.file ? '<span class="w-chip">📎 ' + esc(st.file.name) + '<button class="w-x" data-act="clearFile" aria-label="Remove file">×</button></span>'
      : '<span class="w-mut">You can upload a script or memo file, or an image with text. Optional.</span>') + B('Attach file', 'EF') + '</div>';
  }
  function stepper(n) {
    return '<ol class="w-stepper"><li class="' + (n === 1 ? 'on' : 'done') + '">① Story material</li><li class="' + (n === 2 ? 'on' : '') + '">② Settings</li></ol>';
  }
  function E1() {
    return bar('Producer') + '<div class="w-entry wide">' + stepper(1) + '<h3>What shall we make?</h3>' +
      '<div class="w-q"><div class="w-q-t">Idea or synopsis ' + counter() + '</div>' +
      '<textarea class="w-ta" id="idea" data-bind="idea" aria-label="Idea" placeholder="Who, where, and what happens to them">' + esc(st.idea) + '</textarea>' + lenErrHtml() + '</div>' +
      fileRow() +
      '<div class="w-foot"><span class="w-mut">On the next screen the AI recommends genre & mood and length.</span>' + A('Next →', 'next1', 'pri') + '</div></div>';
  }
  function E1e() { st.lenErr = true; return entryBase(); }
  var ACCEPT = TEXT_EXT.concat(IMG_EXT).map(function (x) { return '.' + x; }).join(',');
  function EF() {
    return entryBase() + modal('Attach file',
      '<label class="w-drop"><input type="file" id="file-in" accept="' + ACCEPT + '" hidden><b>Click here to choose a file</b><span class="w-mut">One file · up to 10MB</span></label>' +
      '<dl class="w-list"><div><dt>Text files</dt><dd>txt · md · docx · pdf · hwp</dd></div><div><dt>Images with text</dt><dd>png · jpg — a photographed script, a memo screenshot</dd></div></dl>' +
      (st.fileErr ? '<p class="w-err" role="alert">' + esc(st.fileErr) + '</p>' : '') +
      '<p class="w-note">Webtoons · character sheets · reference photos will be read in the next version.</p>' +
      '<div class="w-samples"><span class="w-mut">Mockup: pick a sample file</span>' + SAMPLE_FILES.map(function (x, i) { return '<button class="w-tab' + (x[0] === 'bad' ? ' bad' : '') + '" data-act="pickSample" data-arg="' + i + '">' + esc(x[1]) + '</button>'; }).join('') + '</div>',
      A('Close', 'closeFile'));
  }
  function EFe() { if (!st.fileErr) st.fileErr = badExtMsg('trailer.mp4'); return EF(); }
  function E2() {
    var img = st.file && st.file.image;
    return entryBase() + busy(img ? 'Reading the text in the image' : 'Reading the text', img ? ['Opening the file', 'Reading text from the image', 'Building recommended settings'] : ['Reading the text', 'Working out the kind of story', 'Building recommended settings']);
  }
  function E2e() {
    return entryBase() + modal('Couldn\'t find text in the image', '<p>' + esc(st.file ? st.file.name : 'The image') + ' has no readable text. Upload an image with visible text, or a text file.</p>' +
      '<p class="w-note">Reading pictures as cast and sets opens in the next version.</p>',
      A('Continue without the file', 'dropFileGo') + A('Upload another file', 'retryFile', 'pri'));
  }
  function levelPicker() {
    var rec = recLevel(), L = LV()[st.level];
    return '<div class="w-q"><div class="w-q-t">' + LV_Q() + '</div>' + (st.file && !st.file.noText ? '<p class="w-why" style="margin:0">📎 ' + esc(st.file.name) + ': ' + esc(KINDS[st.kind].name) + ' (detected)</p>' : '') +
      '<div class="w-levels" role="radiogroup">' + LV().map(function (l, i) {
        return '<button class="w-lv' + (i === st.level ? ' on' : '') + '" role="radio" aria-checked="' + (i === st.level) + '" data-bind="level" data-val="' + i + '"' + (levelOk(i) ? '' : ' disabled') + '>' +
          '<span class="w-lv-n">' + (i + 1) + '</span><b>' + esc(l.n) + (i === rec ? ' <em>Recommended</em>' : '') + '</b><small>' + esc(l.s) + '</small></button>';
      }).join('') + '</div>' +
      '<div class="w-lv-d"><span><i>Keeps</i>' + esc(L.keep) + '</span><span><i>Changes</i>' + esc(L.change) + '</span></div>' +
      (hasText() ? '' : '<p class="w-note">"Keep as is" needs original text to keep. Upload a script file or write a synopsis over 60 characters to unlock it.</p>') + '</div>';
  }
  function why(t) { return t ? '<p class="w-why">✦ ' + esc(t) + '</p>' : ''; }
  function E3() {
    if (!st.rec) recommend();
    var r = st.rec;
    return bar('Producer') + '<div class="w-entry wide">' + stepper(2) + '<h3>Shall we make it like this?</h3>' +
      '<p class="w-mut" style="margin:0">The AI read your story material and picked these. If they fit, carry on.</p>' +
      '<section class="w-grp"><div class="w-q"><div class="w-q-t">Genre & mood</div>' + opts('mood', MOODS, st.mood, r.mood) + why(r.moodWhy) + '</div>' +
      '<div class="w-q"><div class="w-q-t">Length</div>' + opts('runtime', RUNTIMES, st.runtime, r.runtime) + why(r.runtimeWhy) + '</div>' +
      levelPicker() + '</section>' +
      '<section class="w-grp lock"><div class="w-grp-h">🔒 Aspect ratio <small>Can\'t be changed once you start</small></div>' + opts('ratio', RATIOS, RATIOS.map(function (x) { return x[0]; }).indexOf(st.ratio), 1) + '</section>' +
      '<div class="w-foot">' + B('← Story material', 'E1') + B('Continue with AI', 'E4', 'acc') + '</div></div>';
  }
  function E4() {
    var L = LV()[st.level];
    return E3() + modal('Start like this?', list([
      ['🔒 Aspect ratio', esc(st.ratio) + ' · can\'t be changed once you start'],
      ['Genre & mood', esc(MOODS[st.mood])], ['Length', esc(RUNTIMES[st.runtime][0])],
      ['Change level', (st.level + 1) + ' ' + esc(L.n) + ' — ' + esc(L.s)],
      ['Material', st.file ? esc(st.file.name) : 'Idea text only'], ['Chat language', 'English (site language)']]) + '<p class="w-note">Genre & mood and length can be changed again in Writer.</p>',
      B('No, let me edit', 'E3') + A('Yes, start', 'confirmStart', 'pri'));
  }


  var BQ = ['mood', 'runtime', 'level', 'ratio'];
  var BQ_SCREEN = { file: 'EB2', mood: 'EB3', runtime: 'EB4', level: 'EB5', ratio: 'EB6', confirm: 'EB7' };
  var BQ_NAME = { mood: 'Genre & mood', runtime: 'Length', level: 'Change level', ratio: 'Aspect ratio' };
  var BQ_Q = { mood: 'What genre and mood?', runtime: 'About how long?', level: 'How much may the AI change your text?', ratio: 'Pick an aspect ratio.' };
  var EXAMPLES = [['Office comedy', 'The office hallway vending machine breaks and cans pour out — but Minho, the hero, doesn\'t get a single one'], ['Family drama', 'A daughter home for the first time in ten years finds a half-shot roll of film in her father\'s old camera'], ['Short horror', 'A late-shift worker\'s monitor shows the office CCTV feed — and someone is standing behind them on screen'], ['Romance', 'Two people who meet on the rooftop at the same time every day spend a year without knowing each other\'s names'], ['SF', 'A broken delivery robot gets lost and spends a day following a child home alone'], ['Mystery', 'Every Friday, an unsigned letter appears on Minho\'s desk']];
  var GUIDES = ['Who: ', 'Where: ', 'What happens: ', 'How it ends: '];

  var bOrder = function () { return st.file ? ['file', 'mood', 'runtime', 'ratio'] : ['mood', 'runtime', 'level', 'ratio']; };
  function nextQ() { var o = bOrder(); for (var i = 0; i < o.length; i++) if (!st.bAns[o[i]]) return BQ_SCREEN[o[i]]; return 'EB7'; }
  function ansText(k) {
    if (k === 'mood') return MOODS[st.mood];
    if (k === 'runtime') return RUNTIMES[st.runtime][0];
    if (k === 'level') return (st.level + 1) + ' ' + LV()[st.level].n;
    if (k === 'ratio') return st.ratio;
    if (k === 'file') return KINDS[st.kind].name + ' · ' + LV()[st.level].n;
    return '';
  }

  function parseInto(t) {
    var got = [];
    MOODS.forEach(function (m, i) { if (t.indexOf(m.split('·')[0]) >= 0) { st.mood = i; got.push('mood'); } });
    var m = t.match(/(\d+)\s*(초|분|sec|seconds?|s\b|min|minutes?|m\b)/i);
    if (m) { var sec = +m[1] * (/^(분|m)/i.test(m[2]) ? 60 : 1); st.runtime = sec <= 15 ? 0 : sec <= 60 ? 1 : sec <= 300 ? 2 : 3; got.push('runtime'); }
    else if (/숏폼|쇼츠|short-form|shorts|reels?/i.test(t)) { st.runtime = 0; got.push('runtime'); } else if (/단편|short film/i.test(t)) { st.runtime = 3; got.push('runtime'); }
    if (/그대로|keep as is|as is|keep it/i.test(t) && levelOk(0)) { st.level = 0; got.push('level'); } else if (/다듬|polish/i.test(t)) { st.level = 1; got.push('level'); } else if (/새롭게|키워|새로|grow it|make it new|\bnew\b/i.test(t)) { st.level = 2; got.push('level'); }
    var r = t.match(/16:9|9:16|1:1|2\.39:1/); if (r) { st.ratio = r[0]; got.push('ratio'); } else if (/세로|vertical|portrait|9:16/i.test(t)) { st.ratio = '9:16'; got.push('ratio'); } else if (/가로|landscape|horizontal|16:9/i.test(t)) { st.ratio = '16:9'; got.push('ratio'); }
    got = got.filter(function (k, i) { return got.indexOf(k) === i; });
    got.forEach(function (k) { st.bAns[k] = true; });
    return got;
  }
  function bubble(who, html, me) { return '<div class="w-b' + (me ? ' me' : '') + '">' + (me ? '' : '<b>' + who + '</b>') + '<div>' + html + '</div></div>'; }
  function qr(key, arr, cur, rec) {
    return '<div class="w-qr">' + arr.map(function (o, i) {
      var t = Array.isArray(o) ? o : [o, ''];
      return '<button class="w-opt' + (i === cur ? ' on' : '') + '" data-act="bAnswer" data-arg="' + key + ':' + i + '">' + (i === rec ? '<em>Recommended</em>' : '') + esc(t[0]) + (t[1] ? '<small>' + esc(t[1]) + '</small>' : '') + '</button>';
    }).join('') + '</div>';
  }
  function levelButtons(key, rec) {
    return '<div class="w-qr col">' + LV().map(function (l, i) {
      return '<button class="w-opt lv" data-act="bAnswer" data-arg="' + key + ':' + i + '"' + (levelOk(i) ? '' : ' disabled') + '><b>' + (i + 1) + ' ' + esc(l.n) + (i === rec ? ' <em>Recommended</em>' : '') + '</b><small>Keeps ' + esc(l.keep) + ' · Changes ' + esc(l.change) + '</small></button>';
    }).join('') + '</div>';
  }
  function bCard(key) {
    var r = st.rec || {};
    if (key === 'file') {
      var k = KINDS[st.kind];
      return bubble('Producer', '📎 <b>' + esc(st.file ? st.file.name : '') + '</b> — read as <b>' + esc(k.name) + '</b>.' +
        (st.file && st.file.image ? '<p class="w-quote">' + esc(OCR_LINE) + '</p>' : '') +
        '<div class="w-q-t" style="margin-top:8px">' + LV_Q() + '</div>' + levelButtons('file', r.level));
    }
    if (key === 'mood') return bubble('Producer', BQ_Q.mood + qr('mood', MOODS, -1, r.mood) + why(r.moodWhy));
    if (key === 'runtime') return bubble('Producer', BQ_Q.runtime + qr('runtime', RUNTIMES, -1, r.runtime) + why(r.runtimeWhy));
    if (key === 'level') return bubble('Producer', BQ_Q.level + levelButtons('level', r.level) + (hasText() ? '' : '<p class="w-note">"Keep as is" needs original text to keep. For now, pick Polish or Grow it new.</p>'));
    if (key === 'ratio') return bubble('Producer', 'Pick an aspect ratio. <b class="w-lock">🔒 Once picked, it can\'t be changed.</b>' + qr('ratio', RATIOS, -1, 1));
    if (key === 'confirm') {
      return bubble('Producer', 'Here\'s how we\'ll start.' + list([['Genre & mood', esc(ansText('mood'))], ['Length', esc(ansText('runtime'))], ['Change level', esc(ansText('level')) + ' — ' + esc(LV()[st.level].s)], ['🔒 Aspect ratio', esc(st.ratio) + ' · can\'t be changed later'], ['Material', st.file ? esc(st.file.name) : 'Idea text only']]) +
        '<div class="w-qr">' + A('✎ Ask Writer to write it', 'confirmStart', 'pri') + '</div><p class="w-note">🔒 Pressing it locks the aspect ratio. To change something, tap an item above or say something like "make it 1 minute".</p>');
    }
    return '';
  }
  function chatStage(curKey) {
    var order = bOrder().concat(['confirm']);
    var h = bubble('Producer', 'What shall we make? Upload material or type it in. No idea yet? I\'ll give you a few examples.' +
      (curKey || st.showEx ? '' : '<div class="w-qr">' + B('💡 Show me examples', 'EBX') + '</div>'));
    if (!curKey) {
      if (st.showEx) {
        var ex = EXAMPLES.slice(st.exPage * 3, st.exPage * 3 + 3);
        if (!ex.length) { st.exPage = 0; ex = EXAMPLES.slice(0, 3); }
        h += bubble('', 'Show me examples', true) + bubble('Producer', 'How about these? Tap one you like and I\'ll put it in the input — edit before sending if you want.' +
          '<div class="w-ex">' + ex.map(function (x) { var i = EXAMPLES.indexOf(x);
            return '<button class="w-ex-c" data-act="example" data-arg="' + i + '"><b>' + esc(x[0]) + '</b><span>' + esc(x[1]) + '</span></button>';
          }).join('') + '</div><div class="w-qr">' + A('Other examples', 'moreEx', 'sm') + '</div>');
      }
      if (st.lenErr && !st.file && ideaLen() < MIN_LEN) h += '<div data-lenerr>' + bubble('Producer', '<span class="w-err-t">Tell me a little more. With ' + MIN_LEN + '+ characters I can find the story. (<b data-lennow>' + ideaLen() + '</b> now)</span> One or two lines on who, where, what happens and how it ends is enough.') + '</div>';
    } else {
      h += bubble('', esc(st.idea) + (st.file ? '<br><span class="w-chip">📎 ' + esc(st.file.name) + '</span>' : ''), true);
      var pre = BQ.filter(function (k) { return st.bPre[k] && order.indexOf(k) >= 0; });
      if (pre.length) h += bubble('Producer', 'From what you said I got ' + pre.map(function (k) { return BQ_NAME[k] + ' <b>' + esc(ansText(k)) + '</b>'; }).join(', ') + '. I\'ll only ask about the rest.');
      for (var i = 0; i < order.length; i++) {
        var k = order[i];
        if (k === curKey) { if (st.bHint) h += bubble('Producer', esc(st.bHint)); h += bCard(k); break; }
        if (st.bPre[k]) continue;
        h += bubble('Producer', k === 'file' ? '📎 ' + esc(KINDS[st.kind].name) + ' — got it. ' + LV_Q() : BQ_Q[k]) + bubble('', esc(k === 'file' ? LV()[st.level].n : ansText(k)), true);
      }
    }
    var sum = '<div class="w-sum" aria-label="Decided so far">' + BQ.map(function (k) {
      var on = st.bAns[k];
      return '<button class="w-sum-c' + (on ? ' on' : '') + (k === curKey ? ' cur' : '') + '" data-act="bReask" data-arg="' + k + '"' + (on ? '' : ' disabled') + '><i>' + (k === 'ratio' ? '🔒 ' : '') + BQ_NAME[k] + '</i>' + (on ? esc(ansText(k)) : '—') + '</button>';
    }).join('') + '</div>';
    var input = curKey
      ? '<div class="w-cin"><input id="chat-in" data-bind="chatDraft" data-enter="bSend" value="' + esc(st.chatDraft) + '" placeholder="Pick one, or just say it. e.g. make it 1 minute" aria-label="Chat input"><button class="w-btn pri" data-act="bSend" data-need="chatDraft">Send</button></div>'
      : '<div class="w-cin first">' +
        '<div class="w-cin-main"><textarea id="idea" data-bind="idea" data-enter="bStart" rows="2" aria-label="Idea" placeholder="Who, where, what happens, and how it ends">' + esc(st.idea) + '</textarea>' + A('Send', 'bStart', 'pri') + '</div>' +
        '<div class="w-cin-row">' + (st.file ? '<span class="w-chip">📎 ' + esc(st.file.name) + '<button class="w-x" data-act="clearFile" aria-label="Remove file">×</button></span>'
          : B('📎', 'EF', 'w-icon', ' aria-label="Attach file" title="Attach file"') + '<span class="w-mut">Attach a file if you have one</span>') +
        '<span style="flex:1"></span>' + counter() + '</div></div>';
    return bar('Producer') + '<div class="w-chatstage">' + (curKey ? sum : '') + '<div class="w-thread">' + h + '</div>' + input + '</div>';
  }
  function EB1() { st.showEx = false; return chatStage(null); }
  function EBX() { st.showEx = true; return chatStage(null); }
  function EB2() { return chatStage('file'); }
  function EB3() { return chatStage('mood'); }
  function EB4() { return chatStage('runtime'); }
  function EB5() { return chatStage('level'); }
  function EB6() { return chatStage('ratio'); }
  function EB7() { return chatStage('confirm'); }
  function E5() { return W1() + busy('Writing the prose draft', ['Sorting the material', 'Story skeleton', 'Writing the scene story']); }


  var SEEDS = [['Keep as is', 'Keep the current idea material'], ['New', 'New material from scratch']];
  function condFields() {
    return '<div class="w-q"><div class="w-q-t">Running time</div>' + opts('runtime', RUNTIMES, st.runtime) + '</div>' +
      '<div class="w-q"><div class="w-q-t">Genre & mood of the text</div>' + opts('mood', MOODS, st.mood) + '</div>' +
      '<div class="w-q"><div class="w-q-t">Idea material</div>' + opts('seed', SEEDS, st.seed) + '</div>';
  }
  function proseHtml(pick) {
    return st.prose.map(function (p, i) {
      var on = st.parts.indexOf(i) >= 0;
      return pick ? '<p class="w-para' + (on ? ' sel' : '') + '"><button data-act="togglePart" data-arg="' + i + '" aria-pressed="' + on + '"><span>S' + (i + 1) + '</span>' + esc(p) + '</button></p>'
        : '<p><span>S' + (i + 1) + '</span>' + esc(p) + '</p>';
    }).join('');
  }


  var RW = { runtime: ['Running time', function () { return RUNTIMES; }], mood: ['Genre & mood', function () { return MOODS; }], seed: ['Idea material', function () { return SEEDS; }] };
  function rwPanel() {
    var d = st.rw;
    return '<div class="w-rwp" role="dialog" aria-label="Rewrite options">' + Object.keys(RW).map(function (k) {
      return '<div class="w-q"><div class="w-q-t">' + RW[k][0] + '</div><div class="w-opts">' + RW[k][1]().map(function (o, i) {
        var t = Array.isArray(o) ? o : [o, ''];
        return '<button class="w-opt' + (i === d[k] ? ' on' : '') + '" data-act="rwPick" data-arg="' + k + ':' + i + '">' + esc(t[0]) + (i === st[k] ? '<em>Current prose</em>' : '') + '</button>';
      }).join('') + '</div></div>';
    }).join('') +
      '<div class="w-acts">' + A('Cancel', 'rwClose') + A('Rewrite with these', 'rwApply', 'acc') + '</div></div>';
  }
  function condBar() {
    return '<div class="w-tbar" role="toolbar" aria-label="Prose tools"><span class="w-cond"><i>Current prose</i>' + esc(RUNTIMES[st.runtime][0]) + ' · ' + esc(MOODS[st.mood]) + ' · material ' + esc(SEEDS[st.seed][0]) + '</span>' +
      '<span class="w-tbar-sp"></span>' + A('Write myself', 'openDirect') +
      '<div class="w-popwrap right">' + A('✦ AI rewrite ▾', 'rwOpen', 'acc', ' aria-expanded="' + !!st.rw + '"') + (st.rw ? rwPanel() : '') + '</div></div>';
  }
  function proseMain(ro, pick) {
    var A_ = st.plan === 'A';
    return '<div class="w-title"><h3>' + esc(st.title) + '</h3>' + B('Break it down →', 'W6', 'pri') + '</div>' +
      (st.back ? '<div class="w-banner warn">' + esc(st.back) + ' sent you back. Add the new cast or sets to the prose and break it down again. <span class="w-mut">(Mockup: try adding words like "Security guard" or "Rooftop")</span></div>' : '') +
      (ro ? '<div class="w-banner">This project uses the script as is. The prose can\'t be edited — review it, then break it down.</div>' : '') +
      (A_ && !ro ? condBar() :
      '<div class="w-prose-tools">' + B('✦ AI rewrite', 'WC1', 'acc', ro ? ' disabled' : '') + A('Write myself', 'openDirect', '', ro ? ' disabled' : '') +
      '<span class="w-mut">' + esc(RUNTIMES[st.runtime][0]) + ' · ' + esc(MOODS[st.mood]) + ' — prose written to these</span></div>') +
      (pick ? '<p class="w-note pick">Tap the paragraphs to change. Only those get rewritten.</p>' : '') +
      '<article class="w-prose' + (pick ? ' picking' : '') + '">' + proseHtml(pick) + '</article>';
  }
  var SUGGEST = ['Rewrite it', 'Shorter', 'Make the Team Lead more annoying'];

  function writerB(o) {
    o = o || {};
    var ro = st.proseLocked && !o.pick;
    var head = '<div class="w-sys">Decided with Producer · ' + esc(RUNTIMES[st.runtime][0]) + ' · ' + esc(MOODS[st.mood]) + ' · ' + esc(LV()[st.level].n) + ' · 🔒 ' + esc(st.ratio) + '</div>';
    var proseCard = '<div class="w-b doc"><b>Writer</b><div>' + (ro ? 'I carried the script over as is. Review it, then break it down.' : 'I wrote the prose. Not happy? Say "rewrite it" or tell me what to change.') +
      '<article class="w-doc' + (o.pick ? ' picking' : '') + '"><h4>' + esc(st.title) + '</h4>' + (o.pick ? '<p class="w-note pick">Tap the paragraphs to change.</p>' : '') + proseHtml(o.pick) + '</article>' +
      '<div class="w-qr">' + (ro ? '' : B('✦ Rewrite it', 'WC1') + A('✎ Edit myself', 'openDirect')) + B('Break it down →', 'W6', 'pri') + '</div></div></div>';
    var msgs = (st.chat.Writer || []).slice(1).map(function (m) { return bubble(m[0] === 'Me' ? '' : m[0], esc(m[1]), m[0] === 'Me'); }).join('');
    var card = o.card ? o.card.replace('class="w-msg card"', 'class="w-b card"') : '';
    var locked = o.chatLocked;
    var input = o.pick ? chatInput(o) : '<div class="w-cin' + (locked ? ' is-locked' : '') + '">' + (locked ? '<span class="w-mut">Close the popup to type again</span>'
      : '<input id="chat-in" data-bind="chatDraft" data-enter="send" value="' + esc(st.chatDraft) + '" placeholder="Tell Writer. e.g. rewrite it / make the Team Lead more annoying" aria-label="Chat input"><button class="w-btn pri" data-act="send" data-need="chatDraft">Send</button>') + '</div>';
    var sugg = !locked && !o.card && !o.pick && !ro ? '<div class="w-qr sugg">' + SUGGEST.map(function (t) { return '<button class="w-tab" data-act="send" data-arg="' + esc(t) + '">' + esc(t) + '</button>'; }).join('') + '</div>' : '';
    return bar('Writer') + '<div class="w-chatstage">' + '<div class="w-thread">' + head + proseCard + msgs + card + '</div>' + sugg + input + '</div>';
  }
  function writer(o) {
    o = o || {};
    if (st.plan === 'B') return writerB(o);
    return studio('Writer', proseMain(false, o.pick), { pick: o.pick, ph: st.plan === 'A' ? 'e.g. make the Team Lead more annoying' : 'e.g. rewrite it / make the Team Lead more annoying', card: o.card, suggest: st.plan === 'B' && !o.card ? SUGGEST : null });
  }
  function W1() { return writer(); }
  function W1r() { return st.plan === 'B' ? writerB() : studio('Writer', proseMain(true), { noChat: true }); }
  function chatCard(title, body, who) { return '<div class="w-msg card"><b>' + (who || 'Writer') + '</b><div class="w-card-t">' + esc(title) + '</div>' + body + '</div>'; }
  function WC1() {
    return writer({ card: chatCard('What don\'t you like?', '<div class="w-card-acts">' + B('Rewrite all of it', 'WC2', 'pri sm') + B('Just part of it', 'WC3', 'sm') + '</div>') });
  }
  function WC2() {
    return writer({ card: chatCard('I\'ll rewrite all of it. Pick the conditions.', condFields() + (st.plan === 'A' ? '' : '') +
      '<div class="w-card-acts">' + B('Back', 'WC1', 'sm') + A('Rewrite', 'rewrite', 'acc sm') + '</div>') });
  }
  function WC3() {
    var n = st.parts.length;
    return writer({ pick: true, card: chatCard('Which part should I change?', '<p style="margin:0">' + (st.plan === 'B' ? 'Tap a paragraph in the prose above' : 'Tap a paragraph in the prose on the left') + ' and it attaches to the chat below. Tell me how to change it and send.' +
      (n ? ' Selected now: <b>' + st.parts.map(function (i) { return 'S' + (i + 1); }).join(', ') + '</b>.' : '') + '</p><div class="w-card-acts">' + A('Never mind', 'cancelPart', 'sm') + '</div>') });
  }
  function W2() { return W1() + busy(st.parts.length && st.partMode ? 'Rewriting the chosen paragraphs' : 'Revising the prose', ['Reading the request', 'Writing three options']); }
  function variantsHtml() {
    return '<div class="w-variants" role="radiogroup">' + st.variants.map(function (v, i) {
      return '<button class="w-var' + (i === st.vpick ? ' on' : '') + '" role="radio" aria-checked="' + (i === st.vpick) + '" data-bind="vpick" data-val="' + i + '"><b>Option ' + (i + 1) + '</b>' +
        v.changed.map(function (k) { return '<span class="w-var-p"><i>S' + (k + 1) + '</i>' + esc(v.prose[k]) + '</span>'; }).join('') + '</button>';
    }).join('') + '</div>';
  }
  function W4() {
    if (!st.variants.length) makeVariants('');
    if (st.plan === 'B') return writerB({ card: chatCard('Here are three options. Pick one.', '<p class="w-mut">' + esc(st.vnote) + '</p>' + variantsHtml() + '<div class="w-card-acts">' + A('Discard', 'dropVariant', 'sm') + A('Apply this one', 'applyVariant', 'pri sm') + '</div>') });
    return W1() + modal('Three options', '<p class="w-mut">' + esc(st.vnote) + '</p>' +
      '<div class="w-variants" role="radiogroup">' + st.variants.map(function (v, i) {
        return '<button class="w-var' + (i === st.vpick ? ' on' : '') + '" role="radio" aria-checked="' + (i === st.vpick) + '" data-bind="vpick" data-val="' + i + '"><b>Option ' + (i + 1) + '</b>' +
          v.changed.map(function (k) { return '<span class="w-var-p"><i>S' + (k + 1) + '</i>' + esc(v.prose[k]) + '</span>'; }).join('') + '</button>';
      }).join('') + '</div>',
      A('Discard', 'dropVariant') + A('Apply this one', 'applyVariant', 'pri'), true);
  }
  function W5() {
    return (st.plan === 'B' ? writerB({ chatLocked: true }) : studio('Writer', proseMain(false), { chatLocked: true })) +
      modal('Write myself', '<p class="w-mut">The agent chat is locked while the popup is open.</p>' +
        '<div class="w-q"><div class="w-q-t">Title</div><input class="w-in" data-bind="titleDraft" value="' + esc(st.titleDraft || st.title) + '" aria-label="Title"></div>' +
        st.draft.map(function (p, i) { return '<div class="w-q"><div class="w-q-t">S' + (i + 1) + '</div><textarea class="w-ta sm" rows="3" data-bind="draft.' + i + '" aria-label="Scene ' + (i + 1) + '">' + esc(p) + '</textarea></div>'; }).join('') +
        A('＋ Add scene', 'addScene', 'sm'),
        B('Cancel', 'W1') + A('Save', 'saveDirect', 'pri'), true);
  }

  function WP() {
    return writer({ card: chatCard('Applied. Move on to the next stage?', '<p style="margin:0">Moving on locks the prose, and Artist pulls the cast and sets out of it.</p>' +
      '<div class="w-card-acts">' + A('Yes, next stage', 'breakdown', 'pri sm') + B('No, keep editing', 'WN', 'sm') + '</div>') });
  }
  function WN() {
    return writer({ card: chatCard('What would you like to do?', '<div class="w-qr col">' +
      B('✦ Ask for a rewrite <small>all or part</small>', 'WC1', 'sm') +
      (st.plan === 'A' ? A('Change running time / genre and rewrite', 'rwOpenGo', 'sm') : B('Change running time / genre and rewrite', 'WC2', 'sm')) +
      A('✎ Edit myself', 'openDirect', 'sm') +
      A('I\'ll say it in chat', 'chatFree', 'sm') + '</div><p class="w-note">I\'ll ask again once you apply an edit. You can also go to [Break it down] anytime.</p>') });
  }
  function W3() { if (!st.rw) st.rw = { runtime: st.runtime, mood: st.mood, seed: st.seed }; return W1(); }


  var PLACE_ALIAS = { 'Office hallway, by the vending machine': ['Office hallway', 'Hallway', 'By the vending machine'] };
  function initEnts() {
    st.ents = st.chars.map(function (c) { return { name: c.n, type: 'char', aliases: (c.aliases || [c.n]).slice() }; })
      .concat(st.bgs.map(function (b) { return { name: b.n, type: 'place', aliases: (b.aliases || PLACE_ALIAS[b.n] || [b.n]).slice() }; }));
    st.pick = null; st.adding = false; st.editEnt = -1; st.mergeInto = -1;
  }
  function tagProse() {
    var ali = []; st.ents.forEach(function (e, i) { e.aliases.forEach(function (a) { ali.push([a, i]); }); });
    if (!ali.length) return st.prose.map(function (p, k) { return '<p><span>S' + (k + 1) + '</span>' + esc(p) + '</p>'; }).join('');
    var words = ali.map(function (x) { return x[0]; }).sort(function (a, b) { return b.length - a.length; });
    var re = new RegExp(words.map(function (w) { return w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }).join('|'), 'g');
    return st.prose.map(function (p, k) {
      var out = '', last = 0;
      p.replace(re, function (m, idx) {
        out += esc(p.slice(last, idx)); last = idx + m.length;
        var i = ali.filter(function (x) { return x[0] === m; })[0][1], e = st.ents[i];
        out += '<button class="w-tg ' + e.type + (st.editEnt === i ? ' sel' : '') + '" data-act="entEdit" data-arg="' + i + '" title="' + esc(e.name) + ' · tap to edit">' + esc(m) + '</button>';
        return m;
      });
      return '<p><span>S' + (k + 1) + '</span>' + out + esc(p.slice(last)) + '</p>';
    }).join('');
  }
  var entKind = function (e) { return e.type === 'char' ? 'Cast' : 'Place'; };
  function WT() {
    if (!st.ents) initEnts();

    var pickBar = '<div class="w-pickbar">' + (st.pick
      ? '<span>Selected <b class="w-tg">' + esc(st.pick) + '</b></span>' + (st.adding
        ? '<span class="w-qr">' + A('Add as cast', 'addAs', 'pri sm', ' data-arg="char"') + A('Add as place', 'addAs', 'sm', ' data-arg="place"') + A('Cancel', 'pickClear', 'sm w-link') + '</span>'
        : A('＋ Add', 'addStart', 'pri sm') + A('Pick again', 'pickClear', 'sm w-link'))
      : '<span class="w-mut">If a character or place is missing, drag-select the word in the prose, then press [Add].</span>' + A('＋ Add', 'addStart', 'sm', ' disabled title="Select a word in the prose first"')) + '</div>';
    var listH = '<ul class="w-ents">' + st.ents.map(function (e, i) {
      var others = e.aliases.filter(function (a) { return a !== e.name; });
      if (st.editEnt === i) {
        return '<li class="on edit"><div class="w-ent-ed"><input class="w-in" id="ent-name" data-bind="entName" data-enter="entSave" value="' + esc(st.entName) + '" list="ent-names" aria-label="Edit name">' +
          '<datalist id="ent-names">' + st.ents.filter(function (x, k) { return k !== i && x.type === e.type; }).map(function (x) { return '<option value="' + esc(x.name) + '">'; }).join('') + '</datalist>' +
          A('OK', 'entSave', 'pri sm') + A('Cancel', 'entCancel', 'sm') + '</div>' +
          '<span class="w-alias">Renaming to an existing ' + entKind(e) + ' name merges them into one · ' + A('Remove from list', 'entDrop', 'sm w-link', ' data-arg="' + i + '"') + '</span></li>';
      }
      return '<li><span class="w-ent-n"><span class="w-tg ' + e.type + '">' + esc(e.name) + '</span><small>' + entKind(e) + '</small></span>' +
        A('Edit', 'entEdit', 'sm', ' data-arg="' + i + '"') +
        (others.length ? '<span class="w-alias">aka ' + esc(others.join(' · ')) + '</span>' : '') + '</li>';
    }).join('') + '</ul>';
    var body = '<p class="w-mut">🔒 The prose stays locked; only the marks change. [Apply to list] refills the Artist list from these marks.</p>' +
      '<div class="w-wt"><div class="w-wt-p"><article class="w-prose w-tgprose">' + tagProse() + '</article>' +
        '<p class="w-note"><span class="w-tg char">Cast</span> <span class="w-tg place">Place</span> Only what the AI extracted is marked · tap a marked word to edit it</p>' + pickBar + '</div>' +
      '<aside class="w-wt-l"><div class="w-q-t">Extracted list <small>' + st.ents.length + '</small></div>' + listH + '</aside></div>' +
      '<p class="w-note">Cast or sets that aren\'t in the prose need a prose rewrite.</p>';
    return listScreen() + modal('Re-check prose', body,
      A('Cancel', 'recheckCancel') + A('Rewrite prose', 'recheckRewrite') + A('Apply to list', 'extract', 'pri', st.editEnt >= 0 ? ' disabled title="Confirm the name you\'re editing first"' : ''), 'xl');
  }


  function picOwner(ent) {
    if (ent.pic) return ent.pic;
    var has = function (n) { return objs().some(function (o) { return o.n === n && o.cur >= 0; }); };
    return has(ent.name) ? ent.name : ent.aliases.filter(has)[0] || null;
  }
  function WTm() {

    if (!st.ents) initEnts();
    var fi = function (n, d) { var k = st.ents.map(function (x) { return x.name; }).indexOf(n); return k >= 0 ? k : d; };
    if (!st.ents[st.editEnt]) st.editEnt = fi('Taem Lead', 0);
    if (!st.ents[st.mergeInto] || st.mergeInto === st.editEnt) st.mergeInto = fi('Team Lead', st.editEnt === 0 ? 1 : 0);
    if (!st.ents[st.editEnt] || !st.ents[st.mergeInto]) return WT();
    var e = st.ents[st.editEnt], t = st.ents[st.mergeInto];
    var pe = drawn() ? picOwner(e) : null, pt = drawn() ? picOwner(t) : null;
    if (pe && pt && [pe, pt].indexOf(st.mergePic) < 0) st.mergePic = pt;
    var picPick = pe && pt ? '<div class="w-q"><div class="w-q-t">Which image should we keep? <small>The other image stays in ' + esc(t.name) + '\'s history</small></div><div class="w-opts w-picpick" role="radiogroup">' +
      [pt, pe].map(function (n) { var o = objs().filter(function (x) { return x.n === n; })[0];
        return '<button class="w-opt' + (st.mergePic === n ? ' on' : '') + '" role="radio" aria-checked="' + (st.mergePic === n) + '" data-act="mergePic" data-arg="' + esc(n) + '">' + thumb(o, o.hist[o.cur]) + '<b>' + esc(n) + ' image</b></button>'; }).join('') + '</div></div>' : '';
    return WT() + modal(e.name + ' → ' + t.name + ' — merge into one?', '<p>' + esc(t.name) + ' is already on the list. Merged, they become one ' + entKind(t) + ', and "' + esc(e.aliases.join('", "')) + '" in the prose stays as another name (aka) of ' + esc(t.name) + '.</p>' +
      picPick +
      '<p class="w-note">If it\'s a typo, dev to confirm whether the prose spelling should also change to ' + esc(t.name) + '.</p>',
      A('Cancel', 'mergeCancel') + A('Merge', 'mergeDo', 'acc'));
  }
  function W6() {
    return W1() + modal('Lock the prose?', list([['Next', 'Artist pulls cast & sets from the prose'], ['🔒 Prose', 'Locks on breakdown'], ['To add cast or sets later', 'you\'ll need to come back to this prose']]),
      B('No', st.proseLocked ? 'W1r' : 'W1') + A('Yes, lock it', 'breakdown', 'pri'));
  }


  function objs() {
    var a = st.chars.concat(st.bgs);
    a.forEach(function (o, i) {
      if (!o.hist) { o.hist = []; o.cur = -1; }
      if (!o.refs) { o.refs = []; o.traits = []; o.model = 0; o.prompt = o.d; o.sTab = 0; }
      o.isBg = i >= st.chars.length;
    });
    return a;
  }
  var objPath = function (i) { return i < st.chars.length ? 'chars.' + i : 'bgs.' + (i - st.chars.length); };
  var MODELS = ['GPT Image 2', 'Nano Banana 2', 'Seedream 4', 'Flux Kontext'];

  var TRAITS = {
    char: [['Personality', ['Cool-headed', 'Kind', 'Quirky', 'Timid', 'Confident']], ['Mood · tone', ['Comedy', 'Horror', 'Romance', 'Noir', 'Warm']], ['Build · look', ['Slim', 'Sturdy', 'Baby-faced', 'Sharp eyes', 'Smiley']], ['Era · fashion', ['Modern office wear', '90s', 'Casual', 'Suit', 'Vintage']]],
    bg: [['Time · weather', ['Day', 'Night', 'Rain', 'Sunset']], ['Mood · tone', ['Comedy', 'Horror', 'Warm', 'Cold']], ['Space', ['Cramped', 'Open', 'Cluttered', 'Tidy']]],
  };
  function refStrip(key, refs) {
    return '<div class="w-refs">' + refs.map(function (r, k) { return '<span class="w-ref" title="' + esc(r) + '">' + esc(r.slice(0, 6)) + '<button class="w-x" data-act="delRef" data-arg="' + key + ':' + k + '" aria-label="Remove reference">×</button></span>'; }).join('') +
      '<label class="w-ref add" title="Upload reference image">＋<input type="file" accept="image/*" class="ref-in" data-ref="' + key + '" hidden></label></div>';
  }
  var refsOf = function (key) { return key === 'style' ? st.styleRefs : objs()[+key].refs; };
  function newVersion(style) {
    var n = st.versions.length + 1;
    objs().forEach(function (o) { o.hist.push({ style: style, tone: o.tone || 0, note: '', v: n }); o.cur = o.hist.length - 1; });
    st.versions.push({ n: n, style: style, snap: objs().map(function (o) { return o.cur; }) });
    st.ver = st.versions.length - 1;
  }
  function thumb(o, h, big) {
    if (!h) return '<span class="w-th empty' + (o.isBg ? ' bg' : '') + '">No image</span>';
    var bg = h.tone === 2 ? 'linear-gradient(135deg,#3a2b4a,#8a1f2e)' : styleBg(h.style);
    return '<span class="w-th' + (o.isBg ? ' bg' : '') + (big ? ' big' : '') + '" style="background:' + bg + ';filter:hue-rotate(' + ((h.v * 23 + (h.r || 0) * 41) % 90) + 'deg)">' + esc(o.n.slice(0, 2)) + '<i>v' + h.v + (h.r ? '·' + h.r : '') + '</i></span>';
  }
  function row(o, i, mode) {
    var h = o.cur >= 0 ? o.hist[o.cur] : null;
    var isNew = st.newItems.indexOf(o.n) >= 0;
    var desc = mode === 'text' && st.descEdit === i
      ? '<textarea class="w-ta sm" rows="2" data-bind="' + (o.isBg ? 'bgs.' + (i - st.chars.length) : 'chars.' + i) + '.d" aria-label="Description">' + esc(o.d) + '</textarea>'
      : '<p>' + esc(o.d) + '</p>';
    var acts = mode === 'text'
      ? (st.descEdit === i ? A('Done', 'descDone', 'sm pri') : A('Edit description', 'descEdit', 'sm', ' data-arg="' + i + '"'))
      : A(h ? 'Remake' : 'Make', 'openTone', 'sm', ' data-arg="' + i + '"');
    return '<li class="w-row' + (isNew ? ' is-new' : '') + '">' + (mode === 'img' ? thumb(o, h) : '') +
      '<div class="w-row-b"><b>' + esc(o.n) + ' <small>' + (o.isBg ? 'Set' : 'Cast') + (isNew ? ' · new' : '') + (o.aliases && o.aliases.length > 1 ? ' · aka ' + esc(o.aliases.filter(function (a) { return a !== o.n; }).join(' · ')) : '') + '</small></b>' + desc +
      (o.isBg ? '' : '<div class="w-row-st">' + o.states.map(function (x) { return '<span>' + esc(x) + '</span>'; }).join('') + '</div>') +
      '<div class="w-row-ref"><i>Reference</i>' + refStrip(String(i), o.refs) + '</div></div>' +
      '<div class="w-row-a">' + acts + '</div></li>';
  }
  var showObj = function (o) { return st.afilter === 'all' || (st.afilter === 'bg') === o.isBg; };
  function filterBar() {
    var n = { all: st.chars.length + st.bgs.length, char: st.chars.length, bg: st.bgs.length };
    return '<div class="w-fbar"><span class="w-tabs">' + [['all', 'All'], ['char', 'Cast'], ['bg', 'Set']].map(function (f) {
      return '<button class="' + (st.afilter === f[0] ? 'on' : '') + '" data-act="afilter" data-arg="' + f[0] + '" aria-pressed="' + (st.afilter === f[0]) + '">' + f[1] + ' ' + n[f[0]] + '</button>';
    }).join('') + '</span></div>';
  }

  function stIdx(o, k) { return k <= 0 ? o.cur : o.stImg && o.stImg[o.states[k]] != null ? o.stImg[o.states[k]] : -1; }
  function stateH(o, k) {
    var i = stIdx(o, k), main = o.cur >= 0 ? o.hist[o.cur] : null;
    if (k > 0 && o.noImg && o.noImg[o.states[k]] && i < 0) return null;
    if (i >= 0 && o.hist[i] && o.hist[i].style === st.style) return o.hist[i];
    return k > 0 && main ? Object.assign({}, main, { r: (main.r || 0) + k * 2 }) : main;
  }

  function gcell(o, i, k) {
    var h = stateH(o, k), main = k === 0, name = o.isBg ? 'Set' : o.states[k];
    var dsc = h && h.traits && h.traits.length ? h.traits.join(' · ') : main ? o.d : '';
    return '<button class="w-gcell' + (main ? ' main' : '') + '" data-act="openState" data-arg="' + i + ':' + k + '" aria-label="' + esc(o.n + ' · ' + name) + ' open">' +
      '<span class="w-gimg">' + thumb(o, h, true) + '</span><span class="w-gname"><b>' + esc(name) + '</b></span>' + (dsc ? '<span class="w-gdesc">' + esc(dsc) + '</span>' : '') + '</button>';
  }
  function imgCards() {
    return '<div class="w-agrps">' + objs().map(function (o, i) {
      if (!showObj(o)) return '';
      var isNew = st.newItems.indexOf(o.n) >= 0, nv = o.isBg ? 0 : o.states.length - 1;
      var vars = o.isBg ? '' : nv
        ? '<div class="w-gvars"><div class="w-gvl">└ ' + esc(o.n) + '\'s looks ' + nv + '</div><div class="w-gvrow">' + o.states.slice(1).map(function (x, k) { return gcell(o, i, k + 1); }).join('') +
          '<button class="w-gadd" data-act="openState" data-arg="' + i + ':-1">＋ Add look</button></div></div>'
        : '<button class="w-gadd solo" data-act="openState" data-arg="' + i + ':-1">＋<span>Look</span></button>';
      return '<div class="w-agrp' + (o.isBg ? ' bg' : '') + (nv ? ' wide' : '') + (isNew ? ' is-new' : '') + '">' +
        '<div class="w-agh"><b>' + esc(o.n) + '</b><span class="w-role">' + (o.isBg ? 'Set' : 'Cast') + '</span>' + (isNew ? '<span class="w-tag-new">New</span>' : '') +
        (o.aliases && o.aliases.length > 1 ? '<span class="w-mut" style="font-size:11px">aka ' + esc(o.aliases.filter(function (a) { return a !== o.n; }).join(' · ')) + '</span>' : '') +
        '<span class="w-tbar-sp"></span>' + (o.refs.length ? '<span class="w-refcnt" title="References: ' + o.refs.length + ' · managed in details">🖼 ' + o.refs.length + '</span>' : '') + '</div>' +
        '<div class="w-agcells">' + gcell(o, i, 0) + vars + '</div></div>';
    }).join('') + '</div>';
  }
  function rows(mode) { return '<ul class="w-rows">' + objs().map(function (o, i) { return showObj(o) ? row(o, i, mode) : ''; }).join('') + '</ul>'; }
  function styleRow(bind, cur) {
    return '<div class="w-styles" role="radiogroup">' + STYLES.map(function (s, i) {
      return '<button class="w-sty' + (i === cur ? ' on' : '') + '" role="radio" aria-checked="' + (i === cur) + '" data-bind="' + bind + '" data-val="' + i + '"><i style="background:' + styleBg(i) + '"></i>' + esc(s[0]) + (bind === 'regenStyle' && i === st.style ? '<small>Now</small>' : '') + '</button>';
    }).join('') + '</div>';
  }
  function A1() {
    var unnamed = /사람들|누군가|행인|people|someone|passers?-?by/i.test(st.prose.join(' '));
    var main = '<div class="w-title"><h3>Artist · Breakdown</h3><span class="w-mut">From the locked prose: cast ' + st.chars.length + ' · sets ' + st.bgs.length + '</span></div>' +
      '<div class="w-diag"><b>AI review</b>' + (st.newItems.length ? 'Newly added: ' + esc(st.newItems.join(', ')) + '. ' : 'Found every character and place in the prose. ') +
      (unnamed ? 'Unnamed people like "passers-by" aren\'t pulled out separately. Give them a name in the prose if you need them.' : '') + '</div>' +
      filterBar() + rows('text') + '<p class="w-note">Looks (different outfits · ages per scene) can be added after the images are made, via [＋ Look] in card details or in Storyboard.</p>' +
      '<div class="w-foot">' + B('Cast or sets are missing or duplicated', 'A1c') + B('The list is right · make images →', 'A2', 'pri') + '</div>';
    return studio('Artist', main, { noChat: true });
  }

  var drawn = function () { return st.versions.length > 0; };
  var listScreen = function () { return drawn() ? A5() : A1(); };
  function A1c() {
    return listScreen() + modal('Rewrite the prose, or re-check?', '<p class="w-mut">If the list looks different from the prose, choose first.</p>' + list(drawn()
      ? [['Re-check prose', 'If the word is already in the prose, this is enough. Style and current images stay. Only newly added cast/sets have no image yet, so they\'re made in the same style; the merged-away image moves to the kept one\'s history'], ['Rewrite prose', 'For adding cast or sets that aren\'t in the prose. The prose reopens (keeping the style and unchanged images: dev to confirm)']]
      : [['Re-check prose', 'When it\'s in the prose but missing from the list, or one person got split in two. The prose stays locked; only the marks change'], ['Rewrite prose', 'For adding cast or sets that aren\'t in the prose. The prose reopens (no images yet, so nothing is lost)']]),
      B('Cancel', drawn() ? 'A5' : 'A1') + B('Rewrite prose', drawn() ? 'R2' : 'R1') + A('Re-check prose', 'recheck', 'pri'));
  }
  function A0() { return A1() + busy('Pulling out cast & sets', ['Reading the prose', 'Finding cast · sets', 'Detailing each character\'s looks']); }
  function rollbackModal(from, lose, no) {
    return modal('Go back to the prose?', '<p>Cast and sets come from the prose. Put them in the prose and they appear on the list.</p>' + list(lose), B('No', no) + A('Yes, to the prose', 'rollback', 'warn', ' data-arg="' + from + '"'));
  }
  function R1() { return A1() + rollbackModal('Artist', [['You lose', 'Nothing (no images yet)'], ['Next', 'The Writer prose reopens → edit and break it down again']], 'A1'); }

  function A2() {
    var n = st.chars.reduce(function (x, c) { return x + c.states.length; }, 0);
    return A1() + modal('What style should we make it in?', '<p>This project has one style. You can pick another later with [Regenerate], and previous versions stay in history.</p>' +
      styleRow('style', st.style) + '<div class="w-q"><div class="w-q-t">Style reference <small>Optional · follows this art style</small></div>' + refStrip('style', st.styleRefs) + '</div>' + list([['To make', 'Character sheets ' + st.chars.length + ' (looks ' + n + ') · sets ' + st.bgs.length], ['Style', esc(STYLES[st.style][0])], ['Estimated credits', 'Shown here']]),
      B('Cancel', 'A1') + A(esc(STYLES[st.style][0]) + ' — create', 'generate', 'acc'), true);
  }
  function A4() { return (st.versions.length ? A5() : A1()) + busy(st.busyNames ? 'Making the new items in the same style' : 'Making the image', st.busyNames || objs().map(function (o) { return o.n; })); }
  function A5(o) {
    o = o || {};
    if (!st.versions.length) newVersion(st.style);
    var v = st.versions[st.ver];
    var main = '<div class="w-title"><h3>Artist</h3><span class="w-mut">Cast ' + st.chars.length + ' · sets ' + st.bgs.length + '</span></div>' +
      '<div class="w-stybar"><i style="background:' + styleBg(st.style) + '"></i><b>' + esc(STYLES[st.style][0]) + '</b><span class="w-mut">Project style · v' + v.n + '</span>' +
      '<span class="w-tbar-sp"></span>' + B('Load · history ' + st.versions.length, 'AV', 'sm', st.versions.length > 1 ? '' : ' disabled title="After a regenerate, previous versions show up here"') + B('Regenerate', 'A6', 'sm') + '</div>' +
      filterBar() + imgCards() +
      '<div class="w-foot">' + B('Cast or sets are missing or duplicated', 'A1c') + B('Finish →', 'A9', 'pri', objs().some(function (x) { return x.cur < 0; }) ? ' disabled title="Make images for the cast/sets that have none first"' : '') + '</div>';
    return studio('Artist', main, { card: o.card, ph: o.ph || 'e.g. change Minho' });
  }

  function AC1() {
    var t = target();
    return A5({ card: chatCard(t.n + ' — how should I change it?', '<div class="w-qr col">' +
      B('Change the art style first <small>One style per project, so everything gets remade</small>', 'A6', 'sm') +
      A('Just small things like clothes · props <small>Edits from the current image</small>', 'acPick', 'sm', ' data-arg="edit"') +
      A('The style\'s fine but the look is off <small>Remakes in the same style</small>', 'acPick', 'sm', ' data-arg="new"') + '</div>', 'Artist') });
  }
  function AX() {
    return A5({ card: chatCard('New cast & sets go in through the prose', '<p style="margin:0">The cast & set list comes from the prose. Add them to the Writer prose and break it down again, and they\'ll show up. Current images that didn\'t change stay as they are.</p><div class="w-card-acts">' + B('Back to prose', 'R2', 'sm pri') + B('Never mind', 'A5', 'sm') + '</div>', 'Artist') });
  }
  function AY() {
    var old = st.versions.filter(function (v, k) { return k !== st.ver; });
    return A5({ card: chatCard('Go back to an earlier style?', old.length
      ? '<p style="margin:0">You can load an earlier version instead of remaking. Loading switches the project style to that version too.</p><div class="w-qr col">' + old.reverse().map(function (v) { return A('v' + v.n + ' · ' + esc(STYLES[v.style][0]) + ' — load', 'loadVer', 'sm', ' data-arg="' + (v.n - 1) + '"'); }).join('') + '</div>'
      : '<p style="margin:0">No earlier versions yet. To use another style, regenerate.</p><div class="w-card-acts">' + B('Regenerate', 'A6', 'sm') + '</div>', 'Artist') });
  }
  function AC2() {
    var t = target();
    return A5({ ph: 'e.g. loosen the tie and roll up the shirt sleeves', card: chatCard('How should I change it?', '<p style="margin:0">I\'ll edit from the current image (' + esc(MODELS[t.model || 0]) + '). OK? Type what to change in the chat below.</p><div class="w-card-acts">' + B('Another way', 'AC1', 'sm') + '</div>', 'Artist') });
  }
  function AC3() {
    var t = target();
    return A5({ ph: 'e.g. younger face, short hair', card: chatCard('I\'ll remake the look', '<p style="margin:0">Keeping the style (' + esc(STYLES[st.style][0]) + ') and remaking only ' + esc(t.n) + '\'s look. Describe it in the chat below, or pick an appearance prompt and traits in the details.</p><div class="w-card-acts">' + A('Pick in the details', 'openTone', 'sm', ' data-arg="' + st.target + '"') + B('Another way', 'AC1', 'sm') + '</div>', 'Artist') });
  }
  function A6() {
    if (st.regenStyle == null) st.regenStyle = st.style;
    return A5() + modal('What style should we remake it in?', '<p>Same style or a different one — either works. The current version (v' + st.versions[st.ver].n + ' · ' + esc(STYLES[st.style][0]) + ') stays in history and can be loaded anytime.</p>' +
      styleRow('regenStyle', st.regenStyle) + (function () {
        var old = st.versions.filter(function (v, k) { return v.style === st.regenStyle && k !== st.ver; }).pop();
        return old ? '<p class="w-why">✦ v' + old.n + ': ' + esc(STYLES[old.style][0]) + ' exists already. You can load it instead of remaking ' + A('v' + old.n + ' — load', 'loadVer', 'sm', ' data-arg="' + (old.n - 1) + '"') + '</p>' : '';
      })() + '<div class="w-q"><div class="w-q-t">Style reference <small>Optional · follows this art style</small></div>' + refStrip('style', st.styleRefs) + '</div>' + list([['Remaking', 'Cast ' + st.chars.length + ' · sets ' + st.bgs.length + ' (all)'], ['Style', esc(STYLES[st.regenStyle][0]) + (st.regenStyle === st.style ? ' (unchanged)' : ' — the project style switches to this')], ['Estimated credits', 'Shown here']]),
      A('Cancel', 'regenCancel') + A('Remake', 'regenAll', 'acc'), true);
  }
  function AV() {
    var all = objs();
    return A5() + modal('Generation history', '<p>Load a version you liked. With one style per project, loading also switches the style to that version.</p>' +
      '<ul class="w-vers">' + st.versions.slice().reverse().map(function (v) {
        var i = v.n - 1, on = i === st.ver;
        return '<li class="' + (on ? 'on' : '') + '"><div class="w-vers-h"><b>v' + v.n + '</b><span>' + esc(STYLES[v.style][0]) + '</span>' + (on ? '<em>Now</em>' : '') + '</div>' +
          '<div class="w-vers-t">' + all.map(function (o, k) { return thumb(o, o.hist[v.snap[k]]); }).join('') + '</div>' +
          (on ? '' : A('Load', 'loadVer', 'sm', ' data-arg="' + i + '"')) + '</li>';
      }).join('') + '</ul>', B('Close', 'A5'), true);
  }

  var ROLES = ['Lead', 'Supporting', 'Extra'];
  var descOf = function (o, k) { return k <= 0 ? o.d : (o.sd && o.sd[o.states[k]]) || ''; };
  var isStale = function (o, k) { return k <= 0 ? !!o.dirty : !!(o.stale && o.stale[o.states[k]]); };
  function usedShots(o, i) { return o.isBg ? st.shots.map(function (x, j) { return (x.bg || 0) === i - st.chars.length ? j : -1; }).filter(function (j) { return j >= 0; }) : st.shots.map(function (x, j) { return x.who.indexOf(i) >= 0 ? j : -1; }).filter(function (j) { return j >= 0; }); }
  function detailModal(from) {
    var o = target(), i = st.target, k = o.isBg ? 0 : Math.max(0, Math.min(o.sTab, o.states.length - 1)), noun = o.isBg ? 'variant' : 'look';
    var h = stateH(o, k), curK = stIdx(o, k), vname = function (j) { return o.isBg ? 'Set' : o.states[j]; };
    var needRe = h && isStale(o, k);

    var hist = o.hist.map(function (x, j) {
      var same = x.style === st.style, on = j === curK;
      return '<li class="' + (on ? 'on' : '') + (same ? '' : ' off') + '">' + thumb(o, x) + '<span>' + (on ? 'Now' + (x.from ? ' · ' + esc(x.from) + ' image' : '') : same ? (x.from ? esc(x.from) + ' image' : x.state ? esc(x.state) : '') : esc(STYLES[x.style][0]) + ' · other style') + '</span>' +
        (on ? '' : same ? A('Load', 'objLoad', 'sm', ' data-arg="' + j + '"') : A('Load', 'objLoad', 'sm', ' disabled title="Different style, can\'t be loaded"')) + '</li>';
    }).reverse().join('');
    var histBtn = '<button class="w-histbtn" data-act="histToggle" aria-expanded="' + !!st.histOpen + '" aria-label="History · load an earlier image" title="History · load an earlier image"' + (o.hist.length > 1 ? '' : ' disabled') + '>' +
      '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M3 4v4h4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 7v5l3 2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' +
      (o.hist.length > 1 ? '<i>' + o.hist.length + '</i>' : '') + '</button>';
    var histPop = st.histOpen && o.hist.length > 1 ? '<div class="w-histpop" role="dialog" aria-label="History"><div class="w-q-t">History <small>Only the same style (' + esc(STYLES[st.style][0]) + ') can be loaded</small></div><ul class="w-ohist">' + hist + '</ul></div>' : '';
    var genBtn = h ? A('↻ Remake', 'rgOpen', 'sm' + (needRe ? ' acc' : '')) : A('Generate image', 'rgOpen', 'pri sm');
    var view = '<div class="w-adview"><div class="w-advh"><b>' + esc(vname(k)) + '</b>' + (k === 0 && !o.isBg ? '<span class="w-vtag">Base</span>' : '') + (needRe ? '<span class="w-wst warn">Changed · remake to apply</span>' : '') + '<span class="w-tbar-sp"></span>' + histBtn + genBtn + '</div>' +
      '<div class="w-adv16">' + thumb(o, h, true) + histPop + '</div>' +
      '<div class="w-advf">' + (k > 0 ? A('← Back to base ' + noun + '', 'avar', 'sm', ' data-arg="0"') + (h ? A('Make this ' + noun + ' the base', 'vbase', 'sm w-link') : '') : '<span class="w-mut">' + esc(st.ratio) + ' · expression and pose come out in this aspect ratio · style ' + esc(STYLES[st.style][0]) + '</span>') + '</div></div>';

    function dbox(kk, cls, title, ph) {
      var editing = st.dEdit === kk, off = cls === 'base' && k > 0;
      return '<div class="w-dbox ' + cls + (off ? ' off' : '') + '"><div class="w-dk">' + title + (off ? '<span class="w-dlock">View only</span>' : '') + (isStale(o, kk) ? '<span class="w-wst warn">Changed · remake to apply it</span>' : '') + '<span class="w-tbar-sp"></span>' + (off || editing ? '' : A('✎', 'dEdit', 'sm w-pen', ' data-arg="' + kk + '" aria-label="Edit description"')) + '</div>' +
        (editing ? '<textarea class="w-ta sm" rows="3" data-bind="dDraft" placeholder="' + ph + '" aria-label="Description">' + esc(st.dDraft) + '</textarea><div class="w-edrow"><span class="w-mut">' + (stateH(o, kk) ? 'After applying, remake it on the left' : 'Applying makes it to this description') + '</span>' + A('Cancel', 'dCancel', 'sm') + A('Apply', 'dSave', 'pri sm') + '</div>'
          : '<div class="w-dv">' + esc(descOf(o, kk) || 'No description') + '</div>') + '</div>';
    }
    var used = usedShots(o, i);
    var uc = st.useSel != null && used.indexOf(st.useSel) >= 0 ? st.shots[st.useSel] : null;
    var panel = '<div class="w-adr">' +
      (o.isBg ? '' : '<div class="w-rglab">Role</div><div class="w-tabs">' + ROLES.map(function (r, j) { return '<button class="' + ((o.role || (i === 0 ? 0 : 1)) === j ? 'on' : '') + '" data-act="roleSet" data-arg="' + j + '">' + r + '</button>'; }).join('') + '</div>') +
      '<div class="w-rglab">Description</div>' + dbox(0, 'base', 'Base ' + noun + ' · ' + esc(vname(0)), o.isBg ? 'e.g. dirt floor · midday sun' : 'e.g. late 20s · white shirt · tired eyes') +
      (k > 0 ? dbox(k, 'var', 'Changed ' + noun + ' · ' + esc(vname(k)), 'e.g. rainy day · wet shirt') : '') +
      '<div class="w-rglab">Reference images <small class="w-mut">Uploaded and removed only here</small></div>' + refStrip(String(i), o.refs) +
      (o.isBg ? '' : '<div class="w-rglab">' + noun + ' list <small class="w-mut">' + o.states.length + ' · tap View to see it large on the left</small></div><div class="w-vlist">' + o.states.map(function (x, j) {
        var on = j === k, hh = stateH(o, j);
        return '<div class="w-vrow' + (on ? ' on' : '') + '">' + thumb(o, hh) + '<div class="w-vrm"><div class="w-vrn"><b>' + esc(x) + '</b>' + (j === 0 ? '<span class="w-vtag">Base</span>' : '') + (hh ? '' : '<span class="w-wst">No image</span>') + (j && isStale(o, j) ? '<span class="w-wst warn">Description changed</span>' : '') + '</div><div class="w-vrd">' + esc(descOf(o, j) || 'No description') + '</div></div>' +
          '<div class="w-vra">' + (on ? '<span class="w-vview">Viewing</span>' : A('View', 'avar', 'sm', ' data-arg="' + j + '"')) + (j ? A('Delete', 'vdel', 'sm', ' data-arg="' + j + '"') : '') + '</div></div>';
      }).join('') + '</div>' +
      (st.vadd ? '<div class="w-vaddf"><div class="w-q"><div class="w-q-t">Name</div><input class="w-in" data-bind="vaName" value="' + esc(st.vaName) + '" placeholder="e.g. rain-soaked shirt · 10 years later" aria-label="Look name"></div>' +
        '<div class="w-q"><div class="w-q-t">Description</div><input class="w-in" data-bind="vaDesc" value="' + esc(st.vaDesc) + '" placeholder="e.g. white shirt soaked through, wet hair" aria-label="Look description"></div>' +
        '<p class="w-note">Made in the current style, based on the base look (' + esc(o.states[0]) + ').</p><div class="w-edrow"><span></span>' + A('Cancel', 'vaddClose', 'sm') + (from ? '' : A('Add only', 'vaddDo', 'sm', ' data-arg="0" data-need="vaName"')) + A('Add and generate', 'vaddDo', 'pri sm', ' data-arg="1" data-need="vaName"') + '</div></div>'
        : A('＋ ' + noun + ' — add', 'vaddOpen', 'sm w-refadd'))) +
      '<div class="w-rglab">Shots used <small class="w-mut">' + (st.boarded ? 'Tap to see the shot info' : 'Shows once Storyboard splits the shots') + '</small></div>' +
      (st.boarded ? (used.length ? '<div class="w-usechips">' + used.map(function (j) { return '<button class="w-chipbtn' + (st.useSel === j ? ' on' : '') + '" data-act="useSel" data-arg="' + j + '">' + shotLabel(j) + '</button>'; }).join('') + '</div>' +
        (uc ? '<div class="w-usecard"><div class="w-fr drawn"><i style="background:' + styleBg(st.style) + '"><em>Start</em></i></div><div><b>' + shotLabel(st.useSel) + '</b> <span class="w-mut">' + uc.len + 's · ' + esc(st.bgs[uc.bg || 0].n) + '</span><p style="margin:2px 0">' + atText(uc.desc) + '</p><small class="w-mut">' + SHOT_TYPES[uc.size][0] + ' · ' + ANGLES[uc.ang][0] + ' · ' + MOVES[uc.move][0] + '</small><div>' + A('Go edit the shot →', 'goShot', 'pri sm', ' data-arg="' + st.useSel + '"') + '</div></div></div>' : '')
        : '<p class="w-mut" style="margin:0;font-size:12px">Not used in any shot yet</p>') : '') +
      '</div>';
    var stale = (o.dirty ? [vname(0)] : []).concat(o.isBg ? [] : o.states.filter(function (x, j) { return j && isStale(o, j); }));
    var note = from ? '<p class="w-wrnote">Opened from Storyboard. Editing works exactly as in Artist; comparing looks side by side is easier in Artist ' + A('See all in Artist →', 'toArtist', 'sm w-link') + '</p>' : '';
    return modal(o.n + (o.isBg ? ' · Set' : ' · Cast'), note + '<div class="w-adet">' + view + panel + '</div>',
      (stale.length ? '<span class="w-afnote">Changed description · <b>' + esc(stale.join(', ')) + '</b> — remake to apply it to the image</span>' : '') +
      A('Close', 'detailClose') + (stale.length ? A('Remake', 'regenStale', 'pri') : ''), 'xxl');
  }
  function A7() { return A5() + detailModal(false); }

  var PARTS = ['All new', 'Face · hair', 'Outfit', 'Expression · pose', 'Colour · mood'];
  function A7r() {
    var o = target(), i = st.target, path = objPath(i), k = o.isBg ? 0 : Math.max(0, o.sTab), h = stateH(o, k), rg = st.rg || (st.rg = { parts: [0], useCur: true, refOff: [] });
    var groups = TRAITS[o.isBg ? 'bg' : 'char'];
    var traits = '<div class="w-traits">' + groups.map(function (g) {
      return '<div class="w-trait-g"><i>' + g[0] + '</i>' + g[1].map(function (t) {
        var on = o.traits.indexOf(t) >= 0;
        return '<button class="w-chipbtn' + (on ? ' on' : '') + '" data-act="toggleTrait" data-arg="' + esc(t) + '" aria-pressed="' + on + '">' + (on ? '✓ @' : '＋ ') + esc(t) + '</button>';
      }).join('') + '</div>';
    }).join('') + '</div>';
    var all = rg.parts.indexOf(0) >= 0;
    var body = '<p class="w-mut">Not just a reroll — choose what to base it on and what to change. The style (' + esc(STYLES[st.style][0]) + ') stays the same.</p>' +
      '<div class="w-q"><div class="w-q-t">Description <small>Made to this description · suggestion chips insert with @</small></div><textarea class="w-ta sm" rows="3" data-bind="' + path + '.prompt" aria-label="Description">' + esc(o.prompt) + '</textarea></div>' +
      '<div class="w-q w-fold"><button class="w-fold-h" data-act="traitsFold" aria-expanded="' + !!st.traitsOpen + '">' + (st.traitsOpen ? '▾' : '▸') + ' ' + (o.isBg ? 'Feel of the place' : 'Character traits') + ' suggestions <small>Tap to insert into the description with @</small></button>' + (st.traitsOpen ? traits : '') + '</div>' +
      (h ? '<div class="w-q"><div class="w-q-t">What to change</div><div class="w-opts">' + PARTS.map(function (p, j) { var on = rg.parts.indexOf(j) >= 0; return '<button class="w-opt' + (on ? ' on' : '') + '" data-act="rgPart" data-arg="' + j + '" aria-pressed="' + on + '">' + p + '</button>'; }).join('') + '</div>' +
        '<p class="w-note">' + (all ? 'Made from scratch. The look may change too.' : 'Changes only what you pick; the rest follows the current image.') + '</p></div>' : '') +
      '<div class="w-q"><div class="w-q-t">Base image</div><div class="w-rgrefs">' +
        (h ? '<label class="w-rgref"><input type="checkbox" data-act="rgCur"' + (rg.useCur ? ' checked' : '') + '>' + thumb(o, h) + '<span>Current image<em>keeps face · mood</em></span></label>' : '') +
        o.refs.map(function (r, j) { var on = rg.refOff.indexOf(j) < 0; return '<label class="w-rgref"><input type="checkbox" data-act="rgRef" data-arg="' + j + '"' + (on ? ' checked' : '') + '><span class="w-ref">' + esc(r.slice(0, 6)) + '</span><span>' + esc(r) + '<em>Reference image</em></span></label>'; }).join('') +
        '<label class="w-ref add" title="Upload reference image">＋ Add reference<input type="file" accept="image/*" class="ref-in" data-ref="' + i + '" hidden></label></div></div>' +
      '<div class="w-q"><div class="w-q-t">Image-generation tool</div><select data-bind="' + path + '.model" aria-label="Image-generation tool">' + MODELS.map(function (m, j) { return '<option value="' + j + '"' + (j == o.model ? ' selected' : '') + '>' + esc(m) + '</option>'; }).join('') + '</select></div>' +
      (st.boarded && usedShots(o, i).length ? '<p class="w-note">The new image will update the ' + usedShots(o, i).length + ' shots that use it (' + usedShots(o, i).map(shotLabel).join(' · ') + '). Roughs stay as they are.</p>' : '') +
      '<p class="w-note">The previous image stays in history (clock icon).</p>';
    return (st.stateFrom ? (st.stateFrom === 'S4' ? S4() : S2()) + detailModal(true) : A7()) + modal(o.n + ' · ' + esc(o.isBg ? 'Set' : o.states[k]) + (h ? ' — remake?' : ' — make?'), body,
      A('Cancel', 'rgClose') + A(h ? 'Remake' : 'Make', 'rgGo', 'acc'), true);
  }
  function A8() { return A5() + busy(target().n + ': ' + (st.regenMode === 'edit' ? 'editing' : 'remaking') + ''); }
  function R2() { return A5() + rollbackModal('Artist', [['Unchanged', 'Unchanged cast & set images (proposal · dev to confirm)'], ['Redone', 'Lock prose → breakdown → images for new objects'], ['Style', esc(STYLES[st.style][0]) + ' kept']], 'A5'); }
  function A9() {
    return A5() + modal('Finish and hand off to Storyboard?', list([['Carried over', 'Locked prose · cast ' + st.chars.length + ' · sets ' + st.bgs.length + ' · style ' + esc(STYLES[st.style][0]) + ' (v' + st.versions[st.ver].n + ')'], ['Next', 'The AI splits scenes & shots and draws roughs'], ['Later', 'To grow the cast & set list, roll back to the prose. Looks and images can still be edited in Storyboard or back in Artist']]),
      B('No', 'A5') + A('Yes, finish', 'toBoard', 'pri'));
  }


  var scShots = function (n) { return st.shots.map(function (x, i) { return [x, i]; }).filter(function (p) { return p[0].sc === n; }); };
  var scLen = function (n) { return scShots(n).reduce(function (a, p) { return a + p[0].len; }, 0); };
  var sceneName = function (n) { var c = st.scenes[n - 1]; return 'S' + n + ' ' + st.bgs[c.place].n + ' · ' + TIMES[c.time]; };

  function atText(t) {
    var names = st.chars.map(function (c) { return c.n; }).concat(st.bgs.map(function (b) { return b.n; })).sort(function (a, b) { return b.length - a.length; });
    var out = esc(t); names.forEach(function (n) { out = out.split('@' + esc(n)).join('<span class="w-at">@' + esc(n) + '</span>'); }); return out;
  }
  function whoLabel(s) { return s.who.map(function (c) { var ch = st.chars[c]; if (!ch) return ''; var k = s.ws[c] || 0; return ch.n + (k ? '(' + ch.states[k] + ')' : ''); }).join(' · '); }

  function dd(path, items, cur, label) {
    var open = st.ddOpen === path, it = items[cur] || items[0];
    return '<div class="w-dd' + (open ? ' open' : '') + '"><button class="w-dd-b" data-act="ddOpen" data-arg="' + path + '" aria-haspopup="listbox" aria-expanded="' + open + '" aria-label="' + esc(label || '') + '">' +
      (it[2] ? '<i class="w-sw" style="background:' + it[2] + '"></i>' : '') + '<b>' + esc(it[0]) + '</b><span class="w-tbar-sp"></span><span aria-hidden="true">▾</span></button>' +
      (open ? '<div class="w-dd-l" role="listbox">' + items.map(function (x, j) {
        return '<button role="option" aria-selected="' + (j === cur) + '" class="' + (j === cur ? 'on' : '') + '" data-act="ddPick" data-arg="' + path + '~' + j + '">' + (x[2] ? '<i class="w-sw" style="background:' + x[2] + '"></i>' : '') + '<b>' + esc(x[0]) + '</b><small>· ' + esc(x[1]) + '</small>' + (j === cur ? '<em>✓</em>' : '') + '</button>';
      }).join('') + '</div>' : '') + '</div><small class="w-dd-d">' + esc(it[1]) + '</small>';
  }

  function lightPreview(l, small) {
    var c = LIGHT_TEMP[l.temp][2], b = l.bri / 100, id = 'lp' + (small ? 's' : '') + l.pos + l.temp + l.bri;
    var cx = [50, 18, 82, 50, 50, 50][l.pos], cy = [45, 45, 45, 50, 12, 90][l.pos], back = l.pos === 3;
    var bg = 'rgb(' + Math.round(30 + 60 * b) + ',' + Math.round(32 + 58 * b) + ',' + Math.round(40 + 60 * b) + ')';
    return '<svg class="w-lp' + (small ? ' sm' : '') + '" viewBox="0 0 100 100" aria-label="Lighting preview: ' + esc(LIGHT_POS[l.pos][0] + ' · ' + LIGHT_TEMP[l.temp][0]) + '" role="img"><defs><radialGradient id="' + id + '" cx="' + cx + '%" cy="' + cy + '%" r="' + (back ? 75 : 70) + '%"><stop offset="0" stop-color="' + c + '" stop-opacity="' + (back ? 0.15 : 0.35 + 0.65 * b) + '"/><stop offset="1" stop-color="#1b1d24" stop-opacity="' + (0.95 - 0.35 * b) + '"/></radialGradient></defs>' +
      '<rect width="100" height="100" fill="' + bg + '"/><ellipse cx="50" cy="52" rx="26" ry="32" fill="#8a8f9c"/>' + (back ? '<ellipse cx="50" cy="52" rx="28" ry="34" fill="none" stroke="' + c + '" stroke-width="3" opacity="' + (0.5 + 0.5 * b) + '"/>' : '') +
      '<ellipse cx="50" cy="52" rx="26" ry="32" fill="url(#' + id + ')"/><circle cx="41" cy="47" r="2.5" fill="#222"/><circle cx="59" cy="47" r="2.5" fill="#222"/><path d="M42 66 q8 5 16 0" stroke="#222" stroke-width="2" fill="none"/></svg>';
  }
  function lightBox(path, l) {
    return '<div class="w-light"><div class="w-light-pv">' + lightPreview(l) + '<small>' + esc(LIGHT_TEMP[l.temp][1].split(':')[0]) + '</small></div><div class="w-light-f">' +
      '<div class="w-q"><div class="w-q-t">Light position</div>' + dd(path + '.pos', LIGHT_POS, l.pos, 'Light position') + '</div>' +
      '<div class="w-q"><div class="w-q-t">Colour temperature <small>Lower is warmer orange, higher is cooler blue</small></div>' + dd(path + '.temp', LIGHT_TEMP, l.temp, 'Colour temperature') + '<div class="w-tempbar" aria-hidden="true">' + LIGHT_TEMP.map(function (x, j) { return '<i class="' + (j === l.temp ? 'on' : '') + '" style="background:' + x[2] + '"></i>'; }).join('') + '</div></div>' +
      '<div class="w-q"><div class="w-q-t">Brightness <small>' + l.bri + '</small></div><input type="range" min="0" max="100" step="5" value="' + l.bri + '" data-bind="' + path + '.bri" data-num="1" aria-label="Brightness"></div></div></div>';
  }


  function frameImg(s, i, k, big) {
    var who = s.who.length && st.chars[s.who[0]] ? st.chars[s.who[0]].n : st.bgs[s.bg || 0].n;
    return '<i class="w-frm' + (big ? ' big' : '') + (k ? ' dir' : '') + '"><span class="w-frm-bg" style="background:' + styleBg(st.style) + ';filter:hue-rotate(' + ((i * 37 + (s.rv || 0) * 29) % 140) + 'deg)' + (k ? ' saturate(.75)' : '') + '"></span><b>' + esc(big ? who : who.slice(0, 2)) + '</b>' +
      (k ? marksSvg(s.marks || [], false) : '') + '<em>' + (k ? 'Direction' : 'Start') + (big && s.rv ? ' · v' + (s.rv + 1) : '') + '</em></i>';
  }

  var MCOL = { k: '#16181d', r: '#e5212d' };
  function marksSvg(ms, live) {
    return '<svg class="w-marks' + (live ? ' live' : '') + '" viewBox="0 0 160 90" preserveAspectRatio="none"' + (live ? ' data-draw="1"' : ' aria-hidden="true"') + '><defs>' + ['k', 'r'].map(function (c) { return '<marker id="ah' + c + (live ? 'L' : '') + '" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="' + MCOL[c] + '"/></marker>'; }).join('') + '</defs>' +
      ms.map(function (m, j) {
        var del = live && st.drawTool === 'erase' ? ' data-mark="' + j + '" class="w-mk-del"' : '';
        if (m.t === 'arrow') return '<g' + del + '><line x1="' + m.x1 + '" y1="' + m.y1 + '" x2="' + m.x2 + '" y2="' + m.y2 + '" stroke="' + MCOL[m.c] + '" stroke-width="1.6" stroke-linecap="round" marker-end="url(#ah' + m.c + (live ? 'L' : '') + ')"' + (isEdge(m.x1, m.y1) ? ' stroke-dasharray="4 2"' : '') + '/>' + (live ? '<line x1="' + m.x1 + '" y1="' + m.y1 + '" x2="' + m.x2 + '" y2="' + m.y2 + '" stroke="transparent" stroke-width="8"/>' : '') + '</g>';
        var cam = m.kind === 'cam', tg = cam ? 'Camera' : 'Action', txt = m.text.length > 16 ? m.text.slice(0, 15) + '…' : m.text, w = 6 + tg.length * 4 + txt.length * 4.6;
        return '<g' + del + '><rect x="' + m.x + '" y="' + (m.y - 5) + '" width="' + w + '" height="9" rx="1.4" fill="' + (cam ? '#dfe8ff' : '#fff2b8') + '" stroke="' + (cam ? '#3f6fe8' : '#c99a2e') + '" stroke-width=".5"/><text x="' + (m.x + 2) + '" y="' + (m.y + 1.6) + '" font-size="4" font-weight="700" fill="' + (cam ? '#3f6fe8' : '#c99a2e') + '">' + tg + '</text><text x="' + (m.x + 4 + tg.length * 4) + '" y="' + (m.y + 1.6) + '" font-size="4.6" fill="#26272c">' + esc(txt) + '</text></g>';
      }).join('') + (live ? '<line class="w-mk-tmp" x1="0" y1="0" x2="0" y2="0" stroke="' + MCOL[st.drawColor || 'r'] + '" stroke-width="1.6" stroke-linecap="round" visibility="hidden"/>' : '') + '</svg>';
  }
  var isEdge = function (x, y) { return x < 14 || x > 146 || y < 10 || y > 80; };

  function readMarks(ms) {
    var out = [];
    ms.forEach(function (m) {
      if (m.t === 'arrow') {
        var dx = m.x2 - m.x1, dy = m.y2 - m.y1, h = Math.abs(dx) >= Math.abs(dy), dir = h ? (dx > 0 ? 'to the right' : 'to the left') : (dy > 0 ? 'down' : 'up');

        var diag = Math.min(Math.abs(dx), Math.abs(dy)) > Math.max(Math.abs(dx), Math.abs(dy)) * 0.45, toC = diag && Math.hypot(80 - m.x2, 45 - m.y2) < Math.hypot(80 - m.x1, 45 - m.y1) - 15;
        if (isEdge(m.x1, m.y1)) out.push({ cam: true, move: toC ? 3 : h ? 1 : 2, text: toC ? 'The camera moves in (dolly in)' : 'The camera moves ' + dir + ' (' + (h ? 'Pan' : 'Tilt') + ')' });
        else out.push({ cam: false, text: 'Characters · objects in frame move ' + dir + '' });
      } else out.push({ cam: m.kind === 'cam', text: (m.kind === 'cam' ? 'Camera: ' : 'Action: ') + m.text });
    });
    return out;
  }
  function syncMarks() {
    var d = st.shotDraft; if (!d) return; var r = readMarks(d.marks || []);
    var cam = r.filter(function (x) { return x.cam && x.move != null; })[0]; if (cam) d.move = cam.move;

    if (!st.dirEdited) { var add = readMarks((d.marks || []).slice(st.markBase || 0)).map(function (x) { return x.text.replace(/^(카메라|액션|Camera|Action): /, ''); }); d.dir = [st.dirBase || ''].concat(add).filter(Boolean).join(', '); }
  }

  function dirLayer(d) {
    var ink = '#26272c', F = 'font-family="Gaegu, IBM Plex Sans KR, sans-serif" font-weight="700"', stl = 'fill="none" stroke="' + ink + '" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"';
    var mv = MOVES[+d.move || 0][0];
    var G = { 'Pan': 'M6 27h28M6 27l4-3M6 27l4 3M34 27l-4-3M34 27l-4 3', 'Tilt': 'M19 20v18M19 20l-3 4M19 20l3 4M19 38l-3-4M19 38l3-4', 'Dolly in': 'M6 24l22 8M28 32l-5.5.6M28 32l-3.5-4', 'Dolly out': 'M35 27H9M8 27l5-3.5M8 27l5 3.5', 'Tracking': 'M6 27h27M35 27l-5-3.5M35 27l-5 3.5', 'Crane': 'M8 37q2-14 21-14M29 23l-5-2.5M29 23l-3 4', 'Handheld': 'M6 27l3-3 3 6 3-6 3 6 3-6 3 6 3-3', 'Zoom in': 'M20 31l6 6M13 27h4M15 25v4' };
    var cam = '<g transform="translate(0 7)"><text x="6" y="10" font-size="5.6" fill="' + ink + '" ' + F + '>Camera</text><text x="6" y="17" font-size="6.6" fill="' + ink + '" ' + F + '>' + esc(mv) + '</text>' +
      (G[mv] ? '<path d="' + G[mv] + '" ' + stl + '/>' + (mv === 'Zoom in' ? '<circle cx="15" cy="27" r="5" ' + stl + '/>' : '') : '<rect x="8" y="23" width="6" height="6" ' + stl + '/>') + '<text x="6" y="' + (/틸트|크레인|tilt|crane/i.test(mv) ? 46 : 38) + '" font-size="4.4" fill="' + ink + '" ' + F + '>' + esc(ANGLES[+d.ang || 0][0]) + '</text></g>';
    var act = (d.act || '').replace(/[.。]$/, ''), obj = '';
    if (act) { var t = act.length > 16 ? act.slice(0, 15) + '…' : act, a = t.slice(0, 8), b = t.slice(8); obj = '<path d="M96 72V58M96 58l-2.6 3.5M96 58l2.6 3.5" ' + stl + '/><text x="101" y="64" font-size="5.4" fill="' + ink + '" ' + F + '>' + esc(a) + '</text>' + (b ? '<text x="101" y="70.5" font-size="5.4" fill="' + ink + '" ' + F + '>' + esc(b) + '</text>' : ''); }
    var desc = (d.desc || '').replace(/@/g, ''); desc = desc.length > 30 ? desc.slice(0, 29) + '…' : desc;
    var strip = '<rect x="1" y="76" width="158" height="13" fill="#f4f1ea" stroke="' + ink + '" stroke-width=".4"/><text x="4" y="81.5" font-size="4" fill="' + ink + '" ' + F + '>' + esc(SHOT_TYPES[+d.size || 0][0] + ' · ' + ANGLES[+d.ang || 0][0] + ' · ' + mv) + '</text><text x="156" y="81.5" font-size="4" fill="' + ink + '" text-anchor="end" ' + F + '>' + (d.len || 0) + 's</text><text x="4" y="87" font-size="4" fill="' + ink + '" ' + F + '>FOCUS: ' + esc(desc) + '</text>';
    return '<svg class="w-dirlayer" viewBox="0 0 160 90" preserveAspectRatio="none" aria-hidden="true">' + cam + obj + strip + '</svg>';
  }
  function drawTools() {
    var t = st.drawTool || 'arrow', c = st.drawColor || 'r', d = st.shotDraft;
    return '<div class="w-drawbar" role="toolbar" aria-label="Drawing tools">' +
      [['arrow', '↗ Arrow'], ['memo', '✎ Note'], ['erase', '⌫ Eraser']].map(function (x) { return '<button class="w-btn sm' + (t === x[0] ? ' on' : '') + '" data-act="drawTool" data-arg="' + x[0] + '" aria-pressed="' + (t === x[0]) + '">' + x[1] + '</button>'; }).join('') +
      '<span class="w-drawc">' + ['k', 'r'].map(function (x) { return '<button class="' + (c === x ? 'on' : '') + '" data-act="drawColor" data-arg="' + x + '" aria-label="' + (x === 'k' ? 'Black' : 'Red') + '" style="background:' + MCOL[x] + '"></button>'; }).join('') + '</span><span class="w-tbar-sp"></span>' +
      A('↶ Undo', 'drawUndo', 'sm', (d.marks || []).length ? '' : ' disabled') + A('Clear all marks', 'drawClear', 'sm w-link', (d.marks || []).length ? '' : ' disabled') + '</div>' +
      '';
  }
  function sbShot(s, i) {
    var badge = !s.drawn ? '<span class="w-tag-no">Newly added · not sketched</span>' : '';
    if (st.boot != null && i >= st.boot) return '<div class="w-shot boot"><div class="w-shot-c"><b>' + (st.boot < 0 ? '…' : shotLabel(i)) + '</b><span>' + (st.boot < 0 ? '' : s.len + 's') + '</span></div><div class="w-fr none"><span><span class="w-spin sm" aria-hidden="true"></span> ' + (st.boot < 0 ? 'Splitting shots' : i === st.boot ? 'Drawing' : 'Waiting') + '</span></div><small class="w-mut">' + (st.boot < 0 ? '' : atText(s.desc)) + '</small></div>';
    var fr = s.drawn ? '<div class="w-fr drawn">' + frameImg(s, i, 0) + frameImg(s, i, 1) + '</div>' : '<div class="w-fr none"><span>Not sketched</span></div>';
    var menu = st.sbMenu === i ? '<div class="w-sbmenu" role="menu">' + A('← Earlier', 'shotMove', 'sm', ' data-arg="' + i + ':-1"') + A('Later →', 'shotMove', 'sm', ' data-arg="' + i + ':1"') + A('Duplicate', 'shotDup', 'sm', ' data-arg="' + i + '"') + A('Delete', 'shotDel', 'sm warn', ' data-arg="' + i + '"') + '</div>' : '';
    var L = s.light || { pos: 0, temp: 3, bri: 50 };
    return '<div class="w-shot' + (s.fresh ? ' is-new' : '') + (s.chg ? ' chg' : '') + '" data-act="editShot" data-arg="' + i + '" role="button" tabindex="0" aria-label="' + shotLabel(i) + ' edit"><div class="w-shot-c"><b>' + shotLabel(i) + '</b><span>' + s.len + 's</span>' + badge + '</div>' + fr +
      '<small class="w-dl">' + atText(s.desc) + '</small>' +
      (s.lines.length ? '<small class="w-dl">' + esc(st.chars[s.lines[0].w] ? st.chars[s.lines[0].w].n : '') + ' "' + esc(s.lines[0].t) + '"' + (s.lines.length > 1 ? ' …' : '') + '</small>' : '') +
      '<div class="w-chips"><span title="' + esc(SHOT_TYPES[s.size][1]) + '">' + SHOT_TYPES[s.size][0] + '</span><span>' + ANGLES[s.ang][0] + '</span><span>' + MOVES[s.move][0] + '</span><span title="Lighting · ' + esc(LIGHT_POS[L.pos][0] + ' · ' + LIGHT_TEMP[L.temp][1]) + '"><i class="w-sw" style="background:' + LIGHT_TEMP[L.temp][2] + '"></i>' + LIGHT_TEMP[L.temp][0] + '</span>' + (s.dir ? '<span>Direction · ' + esc(s.dir) + '</span>' : '') + '</div>' +
      (      '<div class="w-card-acts">' + (s.drawn ? '' : A('Draw sketch', 'redraw', 'pri sm', ' data-arg="' + i + '"')) + '<span class="w-tbar-sp"></span>' + A('⋯', 'shotMenu', 'sm', ' data-arg="' + i + '" aria-label="More"') + '</div>') + menu + '</div>';
  }
  function S1(o) {
    o = o || {};
    var undrawn = st.shots.filter(function (x) { return !x.drawn; }).length;

    var main = '<div class="w-title"><h3>Storyboard <small class="w-tbd">Name TBD</small></h3><span class="w-rtmini" title="Running time · sum of shot lengths">Scenes ' + st.scenes.length + ' · shots ' + st.shots.length + ' · <b>' + total() + 's</b></span><span class="w-tbar-sp"></span>' + B('Next: to Director →', 'S7', 'pri') + '</div>' +
      '<div class="w-tools"><span class="w-tabs">' + [['rough', 'Rough'], ['script', 'Script']].map(function (v) { return '<button class="' + (st.sbView === v[0] ? 'on' : '') + '" data-act="sbView" data-arg="' + v[0] + '" aria-pressed="' + (st.sbView === v[0]) + '">' + v[1] + '</button>'; }).join('') + '</span>' +
        B('＋ Add scene', 'S8', 'sm') + A('＋ Add shot', 'newShot', 'sm') + (undrawn ? A('' + undrawn + ' cuts to draw', 'drawAll', 'sm pri') : '') + '<span class="w-tbar-sp"></span>' +
        '<button class="w-btn sm w-dl-ic" data-go="SM" title="Download master sheet" aria-label="Download master sheet"' + (st.shots.some(function (x) { return x.drawn; }) ? '' : ' disabled') + '><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M12 4v11m0 0l-4.5-4.5M12 15l4.5-4.5M5 19h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
        '</div>' +
      st.scenes.map(function (c, k) {
        var n = k + 1, list = scShots(n);
        var body = !list.length ? '<p class="w-mut w-sc-empty">No shots yet. ' + A('＋ Shot', 'newShot', 'sm', ' data-arg="' + n + ':0"') + '</p>' : st.sbView === 'rough'
          ? '<div class="w-shots">' + list.map(function (p) { return sbShot(p[0], p[1]); }).join('') + '</div>'
          : '<ol class="w-script">' + list.map(function (p) { var x = p[0], i = p[1]; return '<li><b>' + shotLabel(i) + '</b><span class="w-mut">' + x.len + 's · ' + SHOT_TYPES[x.size][0] + ' · ' + ANGLES[x.ang][0] + ' · ' + MOVES[x.move][0] + ' · ' + LIGHT_TEMP[(x.light || { temp: 3 }).temp][0] + '</span><p>' + atText(x.desc) + (x.dir ? ' <i class="w-mut">— ' + esc(x.dir) + '</i>' : '') + '</p>' +
              x.lines.map(function (l) { return '<p class="w-dl">' + esc(st.chars[l.w] ? st.chars[l.w].n : '') + ': "' + esc(l.t) + '"</p>'; }).join('') + A('✎', 'editShot', 'sm', ' data-arg="' + i + '" aria-label="Edit"') + '</li>'; }).join('') + '</ol>';
        return '<section class="w-sc"><div class="w-sc-h"><b>' + esc(sceneName(n)) + '</b><span class="w-mut">' + esc(c.sum) + ' · ' + list.length + ' cuts · ' + scLen(n) + 's</span><span class="w-tbar-sp"></span>' + A('＋ Shot', 'newShot', 'sm', ' data-arg="' + n + ':' + list.length + '"') + '</div>' + body + '</section>';
      }).join('');
    var guide = chatCard('You can just say it', '<p style="margin:0">Tap a card to edit it yourself, or just tell me. I\'ll highlight changes in yellow, and nothing changes until you [Apply].</p><div class="w-qr col">' +
      ['Make S1-2 a close-up', 'Warmer lighting on S2', 'Add a shot after S1-1 of Minho sighing', 'S2-1 low angle, 5s'].map(function (x) { return A('“' + x + '”', 'send', 'sm', ' data-arg="' + esc(x) + '"'); }).join('') + '</div>', 'Storyboard');
    return studio('Storyboard', main, { card: o.card || (st.sbChange ? '' : guide), ph: 'e.g. make S1-2 a close-up, warmer lighting' });
  }


  function S0() {
    var n = st.shots.length, pre = [
      'Reading ' + st.prose.length + ' paragraphs of prose slowly',
      'Splitting into ' + st.scenes.length + ' scenes — ' + st.scenes.map(function (c, k) { return 'S' + (k + 1) + ' ' + st.bgs[c.place].n; }).join(' · '),
      st.scenes.map(function (c, k) { var w = []; scShots(k + 1).forEach(function (p) { p[0].who.forEach(function (h) { var nm = st.chars[h] && st.chars[h].n; if (nm && w.indexOf(nm) < 0) w.push(nm); }); }); return 'S' + (k + 1) + ': ' + (w.join(', ') || 'set only') + ' placed'; }).join(' · '),
      'Placing cameras · shots ' + n + '',
      'Choosing shot size · angle · movement'];
    var cur = st.busyStep || 0, drawn = Math.max(0, Math.min(n, cur - pre.length)), all = pre.length + n, pct = Math.round(Math.min(cur, all) / all * 100);
    var left = Math.max(0, all - cur) * 20, mm = Math.floor(left / 60), ss = left % 60;
    st.boot = cur < 3 ? -1 : drawn;
    var board = S1();
    st.boot = null;
    return board + '<div class="w-busy soft" role="status" aria-live="polite"><div class="w-busy-card wide"><div class="w-boot-h"><span class="w-spin" aria-hidden="true"></span><div><h4>Moving to Storyboard</h4><p>Splitting scenes · shots and drawing roughs. This can take a few minutes.</p></div></div>' +
      '<div class="w-boot-bar"><div class="w-prog"><i style="width:' + pct + '%"></i></div><span><b>' + pct + '%</b> · ' + (cur < pre.length ? (cur + 1) + '/' + pre.length + ' steps' : 'Roughs ' + drawn + '/' + n) + ' · about ' + (mm ? mm + 'm ' : '') + ss + 's left (mockup)</span></div>' +
      '<ol class="w-steps">' + pre.map(function (t, k) { return '<li class="' + (k < cur ? 'done' : k === cur ? 'cur' : '') + '">' + esc(t) + '</li>'; }).join('') +
        '<li class="w-boot-shots ' + (cur >= pre.length ? (drawn >= n ? 'done' : 'cur') : '') + '">Drawing roughs · ' + drawn + '/' + n + '<span>' + st.shots.map(function (x, k) { return '<i class="' + (k < drawn ? 'on' : '') + '" title="' + shotLabel(k) + '"></i>'; }).join('') + '</span></li>' +
        st.shots.map(function () { return '<li hidden></li>'; }).slice(1).join('') + '</ol>' +
      '<p class="w-note">Finished shots appear on the board behind one by one. The agent and screen stay locked until all roughs are drawn.</p>' +
      '<button class="w-btn ghost" data-act="skip">Skip the wait (prototype) →</button></div></div>';
  }

  function sbAgent(t) {
    var before = clone(st.shots), notes = [], m2 = t.match(/S(\d+)\s*-\s*(\d+)/), m1 = !m2 && t.match(/S(\d+)/);
    var idxs = m2 ? scShots(+m2[1]).filter(function (p, j) { return j === +m2[2] - 1; }).map(function (p) { return p[1]; })
      : m1 ? scShots(+m1[1]).map(function (p) { return p[1]; }) : /전체|모든|다|\ball\b|every/i.test(t) ? st.shots.map(function (x, i) { return i; }) : [st.shotSel || 0];
    var where = m2 ? 'S' + m2[1] + '-' + m2[2] : m1 ? 'S' + m1[1] + ' (all)' : idxs.length > 1 ? 'All shots' : shotLabel(idxs[0]);
    if (/추가|넣어|\badd\b|insert/i.test(t)) {
      var sc = m2 ? +m2[1] : m1 ? +m1[1] : st.shots[st.shots.length - 1].sc, after = m2 ? +m2[2] : scShots(sc).length;
      var desc = t.replace(/S\d+(\s*-\s*\d+)?\s*(다음에|뒤에|에| after| to)?/, '').replace(/(샷\s*)?(하나\s*)?(추가|넣어)\s*(해\s*줘|해주세요|해)?|(please\s*)?(add|insert)\s*(a\s*|one\s*)?(shot\s*)?(of\s*)?/i, '').trim() || 'New shot';
      var who = []; st.chars.forEach(function (c, k) { if (desc.indexOf(c.n) >= 0) { who.push(k); desc = desc.replace(c.n, '@' + c.n); } });
      var ns = { sc: sc, len: 2, size: 3, ang: 0, move: 0, dir: '', desc: desc, who: who, ws: {}, bg: st.scenes[sc - 1].place, lines: [], drawn: true, fresh: true, chg: true, light: { pos: 0, temp: 3, bri: 50 } };
      var list = scShots(sc), idx = after < list.length ? list[after][1] : list.length ? list[list.length - 1][1] + 1 : st.shots.length;
      st.shots.splice(idx, 0, ns); st.sbChange = { before: before, note: (after ? 'S' + sc + '-' + after + ' (after)' : 'S' + sc + ' (at the start)') + ': added a shot and drew its rough: "' + desc.replace(/@/g, '') + '" (MS · 2s).' };
      return 'SG';
    }
    var kw = function (map) { var hit = null; map.forEach(function (p) { if (hit == null && p[0].test(t)) hit = p[1]; }); return hit; };
    var size = kw([[/익스트림 클로즈업|ECU|extreme close/i, 0], [/미디엄 클로즈업|MCU|medium close/i, 2], [/클로즈업|CU\b|가까이|close-?up|closer/i, 1], [/미디엄 풀|MFS|medium full/i, 4], [/미디엄|MS\b|medium/i, 3], [/풀\s*샷|전신|FS\b|full shot|full body/i, 5], [/익스트림 와이드|EWS|extreme wide/i, 7], [/와이드|넓게|WS\b|\bwide/i, 6], [/어깨|OTS|shoulder/i, 8], [/시점|POV|point of view/i, 9], [/투\s*샷|2S|two shot/i, 11]]);
    var ang = kw([[/로우|올려다|\blow\b|looking up/i, 2], [/하이|내려다|\bhigh\b|looking down/i, 1], [/버드|위에서 수직|bird/i, 3], [/웜즈|바닥에서|worm/i, 4], [/더치|기울|dutch|tilted/i, 5], [/아이\s*레벨|눈높이|eye level/i, 0]]);
    var move = kw([[/핸드헬드|흔들|handheld|shaky/i, 7], [/크레인|crane/i, 6], [/따라|트래킹|track|follow/i, 5], [/다가|달리 인|줌 인|dolly in|zoom in|push in|move in/i, 3], [/멀어|달리 아웃|dolly out|pull out|pull back/i, 4], [/팬|\bpan\b/i, 1], [/틸트|tilt/i, 2], [/고정|static|locked off/i, 0]]);
    var temp = kw([[/촛불|아주 따뜻|candle|very warm/i, 0], [/따뜻|노을|주황|warm|sunset|orange/i, 1], [/차갑|푸른|파랗|\bcool|\bcold|blue/i, 5], [/흐린|overcast|cloudy/i, 4], [/한낮|햇빛|주광|daylight|sunlight|midday/i, 3]]);
    var pos = kw([[/역광|실루엣|backlight|silhouette/i, 3], [/왼쪽|\bleft\b/i, 1], [/오른쪽|\bright\b/i, 2], [/아래에서|무섭|from below|scary/i, 5], [/위에서 (빛|조명)|from above|overhead/i, 4], [/정면|\bfront\b/i, 0]]);
    var bri = kw([[/어둡|어둑|밤|dark|\bdim\b|night/i, 25], [/밝게|환하|bright/i, 80]]);
    var secM = t.match(/(\d+)\s*(?:초|sec|s\b)/i), sec = secM ? Math.max(1, Math.min(30, +secM[1])) : /빠르|짧게|fast|\bshort/i.test(t) ? -1 : /느리|길게|slow|\blong/i.test(t) ? 1 : null;
    idxs.forEach(function (i) {
      var x = st.shots[i]; if (!x) return; x.light = x.light || { pos: 0, temp: 3, bri: 50 };
      if (size != null) x.size = size; if (ang != null) x.ang = ang; if (move != null) x.move = move;
      if (temp != null) x.light.temp = temp; if (pos != null) x.light.pos = pos; if (bri != null) x.light.bri = bri;
      if (sec != null) x.len = Math.abs(sec) === 1 && !secM ? Math.max(1, x.len + sec) : sec;
      x.chg = true;
    });
    if (size != null) notes.push('Shot type ' + SHOT_TYPES[size][0]); if (ang != null) notes.push('Angle ' + ANGLES[ang][0]); if (move != null) notes.push('Movement ' + MOVES[move][0]);
    if (temp != null) notes.push('Colour temp ' + LIGHT_TEMP[temp][0] + '(' + LIGHT_TEMP[temp][1].split(':')[0] + ')'); if (pos != null) notes.push('Lighting ' + LIGHT_POS[pos][0]); if (bri != null) notes.push('Brightness ' + bri);
    if (sec != null) notes.push(secM ? 'Length ' + sec + 's' : sec < 0 ? 'Length −1s each' : 'Length +1s each');
    if (!notes.length) { idxs.forEach(function (i) { st.shots[i].dir = t; }); notes.push('Direction "' + t + '"'); }
    st.sbChange = { before: before, note: where + ': ' + notes.join(' · ') + '. Applying redraws the roughs. (now ' + total() + 's)' };
    return 'SG';
  }

  function SG() {
    var c = st.sbChange || { note: '' };
    return S1({ card: chatCard('Here\'s what I changed. Apply it?', '<p style="margin:0">' + esc(c.note) + '</p><p class="w-note">Shots highlighted in yellow are what changed.</p><div class="w-card-acts">' + A('Revert', 'sbUndo', 'sm') + A('Apply', 'sbApply', 'pri sm') + '</div>', 'Storyboard') });
  }

  function castFields(d) {
    return '<div class="w-q"><div class="w-q-t">Characters <small>From the Artist list only · pick a look</small></div><div class="w-whos">' + st.chars.map(function (c, k) {
        var on = d.who.indexOf(k) >= 0;
        return '<span class="w-who' + (on ? ' on' : '') + '"><button class="w-chipbtn' + (on ? ' on' : '') + '" data-act="shotWho" data-arg="' + k + '" aria-pressed="' + on + '">' + (on ? '✓ ' : '＋ ') + esc(c.n) + '</button>' +
          (on ? '<select data-act-change="shotWs" data-arg="' + k + '" aria-label="' + esc(c.n) + ' look">' + c.states.map(function (x, j) { var no = !stateH(objs()[k], j); return '<option value="' + j + '"' + ((d.ws[k] || 0) === j ? ' selected' : '') + (no ? ' disabled' : '') + '>' + esc(x) + (no ? ' (no image · make it in Artist)' : '') + '</option>'; }).join('') + '<option value="new">＋ New look…</option></select>' : '') + '</span>';
      }).join('') + '</div></div>' +
      '<div class="w-q"><div class="w-q-t">Set</div>' + opts('shotDraft.bg', st.bgs.map(function (b) { return b.n; }), d.bg || 0) + '</div>';
  }
  function linesField(d) {
    return '<div class="w-q"><div class="w-q-t">Dialogue <small>Lines you write are kept as is · language follows the site</small></div>' + d.lines.map(function (l, i) {
      return '<div class="w-line"><select data-bind="shotDraft.lines.' + i + '.w" aria-label="Who">' + st.chars.map(function (c, k) { return '<option value="' + k + '"' + (k == l.w ? ' selected' : '') + '>' + esc(c.n) + '</option>'; }).join('') + '</select>' +
        '<input class="w-in" data-bind="shotDraft.lines.' + i + '.t" value="' + esc(l.t) + '" aria-label="Line">' +
        '<button class="w-x" data-act="delLine" data-arg="' + i + '" aria-label="Delete line">×</button></div>';
    }).join('') + A('＋ Line', 'addLine', 'sm') + '</div>';
  }
  var lenItems = function () { return LENS.map(function (x) { return [x + 's', x <= 2 ? 'Very short: insert · reaction' : x <= 5 ? 'Normal length' : x <= 10 ? 'Long: when dialogue · action carries on' : 'Very long: long take']; }); };
  var agentHint = '<p class="w-agent-hint">✦ You can just say it: tell the agent “' + 'Make this shot a close-up, warmer lighting' + '” and it\'ll change it.</p>';
  function shotEditor() {
    var d = st.shotDraft, tab = st.shotTab; if (!d.light) d.light = { pos: 0, temp: 3, bri: 50 };
    var strip = '<div class="w-2grp"><button class="' + (tab === 'start' ? 'on' : '') + '" data-act="shotTab" data-arg="start"><b>Edit start</b><small>Story · cast · set · dialogue · shot type · angle · lighting</small></button><i>→ follows</i>' +
      '<button class="' + (tab === 'dir' ? 'on' : '') + '" data-act="shotTab" data-arg="dir"><b>Edit direction</b><small>Camera movement · direction · action · length</small></button></div>';
    if (tab === 'start') return strip +
      '<div class="w-q"><div class="w-q-t">Story (action) <small>@ to mention cast · sets</small></div><textarea class="w-ta sm" rows="2" data-bind="shotDraft.desc" placeholder="What happens in this shot" aria-label="Story">' + esc(d.desc) + '</textarea></div>' +
      castFields(d) + linesField(d) +
      '<div class="w-grid2"><div class="w-q"><div class="w-q-t">Shot type (camera framing)</div>' + dd('shotDraft.size', SHOT_TYPES, d.size, 'Shot type') + '</div><div class="w-q"><div class="w-q-t">Camera angle</div>' + dd('shotDraft.ang', ANGLES, d.ang, 'Camera angle') + '</div></div>' +
      '<div class="w-q"><div class="w-q-t">Lighting</div>' + lightBox('shotDraft.light', d.light) + '</div>' +
      '<p class="w-note">Applying changes the start, then redraws the direction too.</p>' + agentHint;

    var dm = st.dmode || 'opt', durRow = '<div class="w-fixrow"><div class="w-fk">Length</div><div class="w-step"><button data-act="edDur" data-arg="-1" aria-label="1 second shorter">−</button><b>' + d.len + 's</b><button data-act="edDur" data-arg="1" aria-label="1 second longer">+</button></div></div>';
    var inner = dm === 'opt'
      ? '<div class="w-fixrow"><div class="w-fk">Camera movement</div><div class="w-seg wrap">' + MOVES.map(function (o, j) { return '<button data-act="edMove" data-arg="' + j + '" aria-pressed="' + (+d.move === j) + '" title="' + esc(o[1]) + '">' + o[0] + '</button>'; }).join('') + '</div></div>' +
        '<div class="w-fixrow"><div class="w-fk">Direction · detail<em>from where to where, how much</em></div><textarea class="w-ta sm" rows="2" data-bind="shotDraft.dirMv" placeholder="e.g. slowly moves in from beside the vending machine and stops at Minho\'s face" aria-label="Direction · detail">' + esc(d.dirMv || '') + '</textarea></div>' +
        '<div class="w-fixrow"><div class="w-fk">Object · character action<em>who/what moves, and how</em></div><textarea class="w-ta sm" rows="2" data-bind="shotDraft.act" placeholder="e.g. Minho walks right and hits the vending machine" aria-label="Object · character action">' + esc(d.act || '') + '</textarea></div>' + durRow
      : drawTools() +
        '<div class="w-memol"><div class="w-rglab">Notes <span class="w-mut">Pick a type and write — it becomes the camera · action description</span></div>' + ((d.marks || []).map(function (m, j) { return m.t === 'memo' ? '<div class="w-mrow"><button class="w-mk2 ' + (m.kind === 'cam' ? 'cam' : 'obj') + '" data-act="mkKind" data-arg="' + j + '" title="Change type">' + (m.kind === 'cam' ? 'Camera move' : 'Object · character action') + '</button><span>' + esc(m.text) + '</span><button class="w-x" data-act="mkDel" data-arg="' + j + '" aria-label="Delete note">✕</button></div>' : ''; }).join('') || '<div class="w-mut" style="font-size:12px">No notes yet · pick ✎ Note above, then tap the image on the left to write</div>') + '</div>' + durRow;
    return strip + '<div class="w-fixbox"><div class="w-dmode"><div class="w-seg"><button data-act="dmode" data-arg="opt" aria-pressed="' + (dm === 'opt') + '">Options + text</button><button data-act="dmode" data-arg="draw" aria-pressed="' + (dm === 'draw') + '">Draw + text</button></div><span class="w-mut">The angle is set in the start · if it changes during the shot, describe it as a tilt · crane move and its direction</span></div>' +
      inner + '<div class="w-fixrow"><div class="w-fk">Other notes<em>anything more specific · optional</em></div><textarea class="w-ta sm" rows="2" data-bind="shotDraft.note" placeholder="e.g. hold still for the first 2s, then follow Minho when he moves" aria-label="Other notes">' + esc(d.note || '') + '</textarea></div></div>' +
      '<div class="w-edfoot">' + A('↻ Redo direction only', 'edRegen', 'sm') + '<span class="w-edhint" id="eddHint">' + (dDirty() ? 'Applying keeps the start and redraws the direction.' : 'Change something to enable Apply.') + '</span></div>' + agentHint;
  }

  function dDirty() {
    var d = st.shotDraft, x = st.shots[st.shotSel]; if (!d || !x) return false;
    return (d.dirMv || '') !== (x.dirMv || '') || (d.act || '') !== (x.act || '') || (d.note || '') !== (x.note || '') || +d.move !== +x.move || d.len !== x.len || JSON.stringify(d.marks || []) !== JSON.stringify(x.marks || []);
  }
  function S2() {
    if (!st.shotDraft) st.shotDraft = clone(st.shots[st.shotSel]);
    var tab = st.shotTab;
    var x = st.shots[st.shotSel], f = st.sbFrame || 0; if (!st.shotDraft.marks) st.shotDraft.marks = [];

    var view = '<div class="w-adview"><div class="w-advh"><b>' + shotLabel(st.shotSel) + '</b><span class="w-mut">' + x.len + 's · ' + SHOT_TYPES[x.size][0] + ' · ' + ANGLES[x.ang][0] + '</span><span class="w-tbar-sp"></span><span class="w-tabs">' +
        (tab === 'dir' ? '<button class="on">Direction</button>' : ['Start', 'Direction'].map(function (n, k) { return '<button class="' + (f === k ? 'on' : '') + '" data-act="sbFrame" data-arg="' + k + '" aria-pressed="' + (f === k) + '">' + n + '</button>'; }).join('')) + '</span></div>' +
      (tab === 'dir' ? ((st.dmode || 'opt') === 'draw'
          ? '<div class="w-adv16 w-sbv w-canvas tool-' + (st.drawTool || 'arrow') + '">' + frameImg(Object.assign({}, st.shotDraft, { marks: [] }), st.shotSel, 1, true) + dirLayer(st.shotDraft) + marksSvg(st.shotDraft.marks || [], true) +
            (st.memoAt ? '<div class="w-memo-in" style="left:' + Math.min(st.memoAt.x / 1.6, 48) + '%;top:' + (st.memoAt.y / 0.9) + '%"><select data-bind="memoKind" aria-label="Note type"><option value="cam"' + (st.memoKind === 'cam' ? ' selected' : '') + '>Camera move</option><option value="obj"' + (st.memoKind !== 'cam' ? ' selected' : '') + '>Object · character action</option></select><input class="w-in" data-bind="memoText" data-enter="memoPut" value="' + esc(st.memoText || '') + '" placeholder="Write a note, Enter" aria-label="Note text"></div>' : '') + '</div>' +
            '<p class="w-mut" style="margin:0;font-size:12px">' + (st.drawTool === 'memo' ? 'Tap the image to open a note field · pick a type (camera move / object · character action) and write' : 'Arrow starting at the edge = camera · starting on a character/object = that movement') + '</p>'
          : '<div class="w-adv16 w-sbv w-ro">' + frameImg(Object.assign({}, st.shotDraft, { marks: [] }), st.shotSel, 1, true) + dirLayer(st.shotDraft) + marksSvg(st.shotDraft.marks || [], false) + '</div>' +
            '<p class="w-mut" style="margin:0;font-size:12px">Direction marks update as you choose · applying redraws the direction</p>')
        : '<div class="w-adv16 w-sbv">' + (x.drawn ? frameImg(x, st.shotSel, f, true) : '<span class="w-mut">Not sketched</span>') + '</div>' +
          '<div class="w-sbthumbs">' + [0, 1].map(function (k) { return '<button class="' + (f === k ? 'on' : '') + '" data-act="sbFrame" data-arg="' + k + '" aria-label="' + (k ? 'Direction' : 'Start') + ' enlarge">' + (x.drawn ? frameImg(x, st.shotSel, k) : '') + '</button>'; }).join('') + '</div>') +
      '<p class="w-mut" style="margin:0;font-size:12px">' + atText(x.desc) + '</p></div>';
    return S1() + modal(shotLabel(st.shotSel) + ' — edit', '<p class="w-mut">Edit in two groups · changing the start also updates the direction; changing the direction changes only the direction. After applying, you\'ll see the redrawn image first.</p><div class="w-adet">' + view + '<div class="w-adr">' + shotEditor() + '</div></div>',
      A('Cancel', 'cancelShot') + A(tab === 'start' ? 'Apply start · redo direction' : 'Apply direction · redraw', 'applyShot', 'acc', tab === 'dir' && !dDirty() ? ' disabled' : ''), 'xxl');
  }
  function S3() { return S1() + busy('Drawing the rough'); }

  function S3c() {
    var cs = st.cands || [];
    var body = '<p class="w-mut">Review the new rough before applying. Reverting restores the previous image and values.</p>' + cs.map(function (c) {
      var x = st.shots[c.i];
      return '<div class="w-cmp"><div class="w-cmp-h"><b>' + shotLabel(c.i) + '</b><span class="w-mut">' + esc(c.what) + '</span></div><div class="w-cmp-row">' +
        '<div><small>Before</small><div class="w-cmp-f">' + frameImg(c.prev, c.i, 0, true) + frameImg(c.prev, c.i, 1, true) + '</div></div><span class="w-cmp-ar" aria-hidden="true">→</span>' +
        '<div><small class="w-new-t">New</small><div class="w-cmp-f">' + frameImg(x, c.i, 0, true) + frameImg(x, c.i, 1, true) + '</div></div></div></div>';
    }).join('');
    return S1() + modal(cs.length > 1 ? 'Review the new roughs: ' + cs.length + ' cuts' : 'Review the new rough', body,
      A('Revert', 'candUndo') + (cs.length === 1 ? A('Edit again', 'candEdit') : '') + A('Apply', 'candOk', 'acc'), 'xxl');
  }

  function S4() {
    if (!st.shotDraft) ACTS.newShot('');
    var d = st.shotDraft, at = st.addAt;
    var left = st.scenes.map(function (c, k) {
      var n = k + 1, list = scShots(n);
      var slot = function (pos) { var on = at && at.sc === n && at.k === pos; return '<button class="w-slot' + (on ? ' on' : '') + '" data-act="addAt" data-arg="' + n + ':' + pos + '">' + (on ? '✓ Adds here' : '＋ Add here') + '</button>'; };
      return '<div class="w-apos-sc"><b>Scene ' + n + '</b><span>' + esc(c.sum) + '</span></div>' + slot(0) + list.map(function (p, j) { return '<div class="w-apos-sh"><b>Shot ' + (j + 1) + '</b><span>' + esc(p[0].desc.replace(/@/g, '')) + '</span></div>' + slot(j + 1); }).join('');
    }).join('');
    var where = at ? (at.k === 0 ? 'S' + at.sc + ' (start)' : 'S' + at.sc + '-' + at.k + ' (after)') : '';
    var right = '<div class="w-rglab">Content</div>' +
      '<div class="w-grid2"><div class="w-q"><div class="w-q-t">Shot type (camera framing)</div>' + dd('shotDraft.size', SHOT_TYPES, d.size, 'Shot type') + '</div><div class="w-q"><div class="w-q-t">Length</div>' + dd('shotDraft.lenI', lenItems(), d.lenI != null ? +d.lenI : d.len - 1, 'Length') + '</div></div>' +
      '<div class="w-q"><div class="w-q-t">Story (action)</div><textarea class="w-ta sm" rows="3" data-bind="shotDraft.desc" placeholder="What happens in this shot · @ for cast · sets" aria-label="Story">' + esc(d.desc) + '</textarea><small class="w-mut">This sentence is the basis for the rough and the video.</small></div>' +
      castFields(d) +
      '<div class="w-box"><div class="w-rglab">Direction</div><div class="w-grid2"><div class="w-q"><div class="w-q-t">Camera angle</div>' + dd('shotDraft.ang', ANGLES, d.ang, 'Camera angle') + '</div><div class="w-q"><div class="w-q-t">Camera movement</div>' + dd('shotDraft.move', MOVES, d.move, 'Camera movement') + '</div></div>' +
        '<div class="w-q"><div class="w-q-t">Lighting</div>' + lightBox('shotDraft.light', d.light) + '</div></div>' +
      B('A character or set not on the list is needed', 'R3', 'w-link') + agentHint.replace('Make this shot a close-up, warmer lighting', 'Add a shot after S1-1 of Minho sighing');
    return S1() + modal('＋ Add shot', '<p class="w-mut">Pick where to add on the left (green mark), then set the content on the right.</p><div class="w-addshot"><div class="w-apos"><div class="w-rglab">Where to add</div>' + left + '</div><div class="w-acont">' + right + '</div></div>',
      '<span class="w-afnote">' + (where ? where + ' — adds here.' : 'Pick where to add on the left.') + '</span>' + A('Cancel', 'cancelShot') + A('＋ Add shot', 'addShot', 'acc', at ? ' data-need="shotDraft.desc"' : ' disabled'), 'xxl');
  }
  function R3() { return S1() + rollbackModal('Storyboard', [['Affected', 'Shots ' + st.shots.length + ' · roughs (dev check: can unchanged shots be kept?)'], ['Unchanged', '🔒 Aspect ratio · 🔒 style · cast & set images'], ['Estimated credits', 'Shown here']], 'S4'); }

  function S5() { return (st.stateFrom === 'S4' ? S4() : S2()) + detailModal(true); }
  function S6() { return (st.stateFrom === 'S4' ? S4() : st.stateFrom === 'S2' ? S2() : S1()) + busy('Making the image'); }
  function S8() {
    var a = st.scAdd, where = st.scenes.map(function (c, k) { return k === 0 ? 'First · before S1' : 'S' + k + ' and S' + (k + 1) + ' (between)'; }).concat(['S' + st.scenes.length + ' after · last']);
    return S1() + modal('Add scene', '<div class="w-q"><div class="w-q-t">Place <small>From the Artist set list only</small></div>' + opts('scAdd.place', st.bgs.map(function (b) { return b.n; }), a.place) + '</div>' +
      '<div class="w-q"><div class="w-q-t">Time of day</div>' + opts('scAdd.time', TIMES, a.time) + '</div>' +
      '<div class="w-q"><div class="w-q-t">One-line summary</div><input class="w-in" data-bind="scAdd.sum" value="' + esc(a.sum) + '" placeholder="e.g. next morning, the vending machine is fixed" aria-label="One-line summary"></div>' +
      '<div class="w-q"><div class="w-q-t">Where to insert</div>' + opts('scAdd.pos', where, a.pos) + '</div>' +
      '<p class="w-note">A new scene starts with 0 shots. Later scene numbers move up by one. Places not on the list need a prose edit.</p>',
      B('Cancel', 'S1') + A('S' + (a.pos + 1) + ' — add', 'addScene', 'acc'), true);
  }
  function SM() {
    var undrawn = st.shots.filter(function (x) { return !x.drawn; }).length;
    return S1() + modal('Export master sheet', '<p class="w-mut">Turns the rough storyboard into a shooting sheet. Each cut gets image · camera · action · dialogue · time.</p>' +
      '<div class="w-q"><div class="w-q-t">Range</div>' + opts('sheet.range', ['All', 'Pick scenes'], st.sheet.range) + '</div>' +
      '<div class="w-q"><div class="w-q-t">Images</div>' + opts('sheet.pic', ['Start → end', 'Start only'], st.sheet.pic) + '</div>' +
      '<div class="w-q"><div class="w-q-t">Per page</div>' + opts('sheet.per', ['4 cuts', '6 cuts'], st.sheet.per) + '</div>' +
      (undrawn ? '<p class="w-warn-t">Cuts without roughs: ' + undrawn + ' — they\'ll be left blank.</p>' : ''),
      B('Close', 'S1') + (undrawn ? A('Draw remaining cuts', 'drawAll', '') : '') + A('Download PDF', 'printSheet', 'acc'), true);
  }
  function S7() {
    var undrawn = st.shots.filter(function (x) { return !x.drawn; }), ok = st.shots.length - undrawn.length;
    return S1() + modal('Hand off to Director?', list([['Carried over', 'Shots ' + ok + ' · roughs · cast · set images'], ['Running time', total() + 's'], ['Next', 'Director builds the cuts from the roughs and Artist images']]) +
      (undrawn.length ? '<p class="w-warn-t">No rough for ' + undrawn.map(function (x) { return shotLabel(st.shots.indexOf(x)); }).join(', ') + ' — left out this time.</p>' : ''),
      B('No', 'S1') + (undrawn.length ? A('Draw remaining cuts', 'drawAll', '') : '') + B('Yes, hand off', 'D1', 'pri'));
  }
  function D1() {
    return bar('Director') + '<div class="w-entry"><h3>Director → Editor</h3><p class="w-mut">Outside this scoped-down round. The existing screens stay as they are.</p>' +
      '<p class="w-note">Check together: does Director reference the Artist character sheet (error 13), and do rough mannequins stop carrying over as characters (error 12)?</p>' + A('Start over', 'reset') + '</div>';
  }

  var SCREENS = { A1c: A1c, WT: WT, WTm: WTm, EB1: EB1, EBX: EBX, EB2: EB2, EB3: EB3, EB4: EB4, EB5: EB5, EB6: EB6, EB7: EB7, E1: E1, E1e: E1e, EF: EF, EFe: EFe, E2: E2, E2e: E2e, E3: E3, E4: E4, E5: E5, W1: W1, W1r: W1r, WC1: WC1, WC2: WC2, WC3: WC3, W2: W2, W4: W4, W5: W5, W6: W6, WP: WP, WN: WN, W3: W3,
    A0: A0, A1: A1, R1: R1, A2: A2, A4: A4, A5: A5, A6: A6, A7: A7, A8: A8, R2: R2, A9: A9, AV: AV, AC1: AC1, AC2: AC2, AC3: AC3, AX: AX, AY: AY,
    A7r: A7r, S3c: S3c, S0: S0, S1: S1, SG: SG, S2: S2, S3: S3, S4: S4, R3: R3, S5: S5, S6: S6, S7: S7, S8: S8, SM: SM, D1: D1 };

  var DECISION_SCREEN = { E1n: function () { return entryId(); }, EFq: 'EF', E2q: function () { return isB() ? 'EB3' : 'E3'; }, E5q: function () { return isB() ? 'EB7' : 'E4'; }, W1q: 'W1', WPq: 'WP', A5q: 'A5', S1q: 'S1' };

  var BUSY_NEXT = {
    E2: function () { if (st.file && st.file.noText) return 'E2e'; if (isB()) return st.file ? 'EB2' : nextQ(); return 'E3'; },
    E5: 'W1', W2: 'W4', A0: 'A1', A4: 'A5', A8: 'A5', S0: 'S1', S3: function () { return st.cands ? 'S3c' : 'S1'; }, S6: function () { var f = st.stateFrom; st.stateFrom = ''; return f || 'S1'; },
  };
  var preserve = function () { return st.level === 0 && hasText(); };

  var KEEP_SEED = {
    'Comedy': ['Minho kicks the vending machine, cans pour out, and the Team Lead says "Thanks" and takes one.', 'Minho puts in his last coin. Nothing — until the Team Lead walks up and the cans pour out.', 'The vending machine ignores only Minho. For the Team Lead it offers a can like a gift.'],
    'Drama': ['Minho working late. Even the vending machine won\'t answer. The Team Lead silently hands him a can.', 'Minho\'s last coin. The machine stops, and only the hum of fluorescent lights fills the hallway.', 'Minho and the Team Lead picking up the spilled cans. For the first time, they both laugh.'],
    'Romance': ['Minho and the new hire meet at the vending machine and pick up the spilled cans together.', 'Minho\'s button drops two cans. He hands one to the person beside him.', 'Two people at a broken vending machine, choosing the same drink.'],
    'Thriller': ['The hallway lights flicker. Instead of a can, a strange key drops out of the machine.', 'Minho hits the vending machine — and someone knocks back from inside.', 'The CCTV cuts out the moment the cans pour out.'],
    'Action': ['The vending machine topples and blocks the hallway. Minho dodges cans and runs for the emergency exit.', 'A chase over a single can begins between Minho and the Team Lead.', 'Minho slides through the falling cans and snatches the last one.'],
    'Sci-fi·Fantasy': ['The vending machine speaks: "Choose today\'s luck."', 'Pressing the button drops a can dated tomorrow.', 'The machine pours out exactly as many cans as Minho wishes for.'],
    'Mystery': ['Every can from the machine has the same name written on it.', 'Inside the broken vending machine, someone has hidden a note.', 'Every day at 3 p.m., the machine gives a can to just one person.'],
    'Human·Family': ['With his last coin, Minho picks the drink his father used to love.', 'Sharing the spilled cans with coworkers, he laughs for the first time.', 'Minho hands a can to the Team Lead on their last day.'],
    'Slice of life·Calm': ['The hallway at 3 p.m. By the vending machine, Minho takes a breath.', 'The same people gather at the broken vending machine again today.', 'A quiet hallway with only the sound of one rolling can.'],
    'Horror': ['11 p.m. In a hallway lit only by the vending machine, a can rolls out on its own.', 'When Minho presses the button, another face is reflected in the machine\'s glass.', 'Every spilled can is stamped with the same date. Tonight.'],
  };
  var NEW_SEED = {
    'Comedy': ['The office lift won\'t take Minho. Each time the doors close, the Team Lead waves.', 'Minho alone wins the office lottery. The prize: free vending machine drinks for life.', 'Minho\'s pot plant starts talking. Only to nag.'],
    'Drama': ['On his last day, Minho finds his first-day ID badge in a drawer.', 'Minho and the Team Lead get stuck in a lift during a power cut.', 'Minho\'s office now stands where his father\'s factory used to be.'],
    'Romance': ['Two people who run into each other on the rooftop at the same time every day.', 'A misdelivered parcel has a letter inside.', 'The person whose paper always jams at the copier.'],
    'Thriller': ['Minho\'s inbox has an email sent tomorrow.', 'After hours, the office lights switch back on one by one.', 'The meeting-room whiteboard has writing only Minho can read.'],
    'Action': ['The morning subway stops, and Minho chases a pickpocket in the last car.', 'Three people race across the city over one parcel.', 'In a blacked-out building, Minho gets people out of a stuck lift.'],
    'Sci-fi·Fantasy': ['A broken delivery robot gets lost and follows a child.', 'When Minho opens his umbrella, time stops right there.', 'There\'s a door to another world in the office basement.'],
    'Mystery': ['Every Friday, an unsigned letter lands on Minho\'s desk.', 'No one at the office remembers yesterday.', 'Minho\'s belongings keep appearing in the lost-and-found box, one by one.'],
    'Human·Family': ['Home for the first time in ten years: her father\'s old camera.', 'A granddaughter shops for groceries following her grandmother\'s recipe notebook.', 'On moving day, two brothers visit their childhood secret base.'],
    'Slice of life·Calm': ['A day at the neighbourhood laundry on a rainy day.', 'The people on the first train at dawn.', 'The last day of an old regular restaurant.'],
    'Horror': ['A 13th-floor button appears. No one pressed anything.', 'One more person has appeared in the photo on Minho\'s desk.', 'Working late, Minho\'s monitor shows the office CCTV feed. Someone is standing behind him.'],
  };
  var CONT = ['Things snowball, and Minho scrambles to fix it.', 'Someone unexpected cuts in and turns the tables.', 'In the end, Minho gets one small thing.', 'The next day, something similar starts again in the same spot.'];
  var PART_WAYS = ['Shorter and faster', 'Bring out the dialogue', 'Change the mood'];
  function makeVariants(req, parts) {
    var md = MOODS[st.mood];
    if (parts && parts.length) {
      st.vnote = 'Chosen paragraphs: ' + parts.map(function (i) { return 'S' + (i + 1); }).join(', ') + (req ? ' · request: ' + req : '') + ' · other paragraphs unchanged';
      st.variants = PART_WAYS.map(function (w, k) {
        var pr = st.prose.slice();
        parts.forEach(function (i) { pr[i] = '[' + w + '] ' + (req ? req + ' — ' : '') + st.prose[i]; });
        return { prose: pr, changed: parts.slice() };
      });
    } else if (req) {
      st.vnote = 'Request: ' + req;
      st.variants = KEEP_SEED[md].map(function (t) { var pr = st.prose.slice(); pr[0] = t; return { prose: pr, changed: [0] }; });
    } else {
      var n = [2, 3, 4, 5][st.runtime];
      st.vnote = RUNTIMES[st.runtime][0] + ' · ' + md + ' · material ' + SEEDS[st.seed][0] + ' · scenes ' + n + '';
      st.variants = (st.seed ? NEW_SEED : KEEP_SEED)[md].map(function (t) {
        var pr = [t].concat(CONT.slice(0, n - 1));
        return { prose: pr, changed: pr.map(function (_, i) { return i; }) };
      });
    }
    st.vpick = 0;
  }
  function detectNew() {
    var text = st.prose.join(' ');
    var added = [];
    EXTRA_PEOPLE.forEach(function (p) { if (text.indexOf(p[0]) >= 0 && !st.chars.some(function (c) { return c.n === p[0]; })) { st.chars.push({ n: p[0], d: p[1], states: ['First look'], tone: 0, note: '' }); added.push(p[0]); } });
    EXTRA_PLACES.forEach(function (p) { if (text.indexOf(p[0]) >= 0 && !st.bgs.some(function (b) { return b.n === p[0]; })) { st.bgs.push({ n: p[0], d: p[1], tone: 0 }); added.push(p[0]); } });
    st.newItems = added;
    if (added.length) st.generated = false;
  }
  var ACTS = {
    next1: function () {
      if (!st.file && ideaLen() < MIN_LEN) { st.lenErr = true; return 'E1e'; }
      st.lenErr = false;
      st.pending = recommend;
      return 'E2';
    },
    pickSample: function (i) { var f = SAMPLE_FILES[+i]; return pickFile(f[1], f[0]); },
    clearFile: function () { st.file = null; st.kind = '1-3'; st.rec = null; if (!levelOk(st.level)) st.level = recLevel(); },
    closeFile: function () { st.fileErr = ''; return entryId(); },
    dropFileGo: function () { st.file = null; st.kind = '1-3'; if (ideaLen() < MIN_LEN) { st.lenErr = true; return 'E1e'; } st.pending = recommend; return 'E2'; },
    retryFile: function () { st.file = null; st.kind = '1-3'; st.fileErr = ''; return 'EF'; },
    example: function (i) { st.idea = EXAMPLES[+i][1]; st.lenErr = false; },
    guide: function (i) { st.idea = (st.idea.trim() ? st.idea.replace(/\s+$/, '') + '\n' : '') + GUIDES[+i]; setTimeout(function () { var t = root && root.querySelector('#idea'); if (t) { t.focus(); t.setSelectionRange(t.value.length, t.value.length); } }, 0); },
    confirmStart: function () {
      st.ratioLocked = true;
      if (preserve()) { st.proseLocked = true; return 'W1r'; }
      st.pending = function () {
        var t = st.idea.trim();
        if (!t) return;
        st.title = t === initial().idea ? st.title : (t.split(/[.,\n—]/)[0].split(/\s+/).slice(0, 5).join(' ') || st.title);
        if (t !== initial().idea && !st.file) st.prose = [t.split('\n')[0].replace(/[.]?$/, '.'), 'Things snowball, and the hero scrambles to fix it.', 'In the end the hero gets one small thing and turns away a little changed.'];
      };
      return 'E5';
    },
    send: function (arg) {
      var t = (arg || st.chatDraft).trim(); if (!t) return;
      st.chatDraft = '';
      var on = cur.charAt(0) === 'W' ? 'Writer' : cur.charAt(0) === 'A' ? 'Artist' : 'Storyboard';
      say(on, 'Me', t);
      if (on === 'Writer') {
        if (/다시\s*(써|쓰)|rewrite|write it again/i.test(t)) return 'WC1';
        st.request = t; st.partMode = false;
        st.pending = function () { makeVariants(t); say('Writer', 'Writer', 'Wrote three options as requested. Pick one.'); };
        return 'W2';
      }
      if (on === 'Artist') {
        if (st.acMode) { var m = st.acMode; st.acMode = null; return ACTS.regenObj(m, t); }
        if (/추가|새 인물|새 배경|넣어|\badd\b|new character|new set/i.test(t)) return 'AX';
        if (/이전|돌아가|돌려|전에 만든|previous|go back|revert|back to|earlier/i.test(t) || STYLES.some(function (x) { return t.indexOf(x[0] + '') >= 0 || t.indexOf(x[0] + '') >= 0; })) return 'AY';
        var hit = -1; objs().forEach(function (o, i) { if (hit < 0 && t.indexOf(o.n) >= 0) hit = i; });
        st.target = hit < 0 ? 0 : hit;
        return 'AC1';
      }
      if (st.sbChange) { say('Storyboard', 'Storyboard', 'There are unconfirmed changes. [Apply] or [Revert] them first.'); return 'SG'; }
      return sbAgent(t);

    },
    rewrite: function () {
      st.rw = null; st.request = ''; st.partMode = false;
      var from = cur === 'WC2' ? 'Chat card' : 'Conditions panel';
      st.pending = function () { makeVariants(''); say('Writer', 'Writer', RUNTIMES[st.runtime][0] + ' · ' + MOODS[st.mood] + ' · material ' + SEEDS[st.seed][0] + ' — wrote three options.' + (st.plan === 'A' && from === 'Chat card' ? '' : '')); };
      return 'W2';
    },
    rwOpen: function () { st.rw = st.rw ? null : { runtime: st.runtime, mood: st.mood, seed: st.seed }; },
    rwPick: function (a) { var kv = a.split(':'); st.rw[kv[0]] = +kv[1]; },
    rwClose: function () { st.rw = null; },
    rwApply: function () { var d = st.rw; st.rw = null; st.runtime = d.runtime; st.mood = d.mood; st.seed = d.seed; return ACTS.rewrite(); },
    togglePart: function (i) { i = +i; var k = st.parts.indexOf(i); if (k >= 0) st.parts.splice(k, 1); else st.parts.push(i); st.parts.sort(); st.focusChat = true; },
    sendPart: function () {
      if (!st.parts.length) return;
      st.partNote = st.chatDraft.trim(); st.chatDraft = '';
      say('Writer', 'Me', st.parts.map(function (i) { return 'S' + (i + 1); }).join(', ') + (st.partNote ? ' — ' + st.partNote : ' — polish it'));
      return ACTS.rewritePart();
    },
    cancelPart: function () { st.parts = []; st.chatDraft = ''; return 'W1'; },
    rewritePart: function () {
      if (!st.parts.length) return;
      st.partMode = true;
      var note = st.partNote.trim();
      st.pending = function () { makeVariants(note, st.parts.slice()); say('Writer', 'Writer', st.parts.map(function (i) { return 'S' + (i + 1); }).join(', ') + ' only — three options. The rest is unchanged.'); };
      return 'W2';
    },
    applyVariant: function () {
      var v = st.variants[st.vpick]; if (!v) return 'W1';
      st.prose = v.prose.slice(); st.variants = []; st.parts = []; st.partNote = ''; st.partMode = false;
      say('Writer', 'Writer', 'Option ' + (st.vpick + 1) + ' applied.');
      return 'WP';
    },
    dropVariant: function () { st.variants = []; st.partMode = false; say('Writer', 'Writer', 'Discarded the revision; the original prose stays.'); return 'W1'; },
    openDirect: function () { st.draft = st.prose.slice(); st.titleDraft = st.title; return 'W5'; },
    addScene: function () { st.draft.push(''); },
    saveDirect: function () { st.prose = st.draft.filter(function (p) { return p.trim(); }); if (st.titleDraft && st.titleDraft.trim()) st.title = st.titleDraft.trim(); say('Writer', 'Writer', 'Saved your manual edit to the prose.'); return 'WP'; },
    rwOpenGo: function () { st.rw = { runtime: st.runtime, mood: st.mood, seed: st.seed }; return 'W3'; },
    chatFree: function () { st.focusChat = true; return 'W1'; },
    breakdown: function () { st.back = ''; st.proseLocked = true; st.ents = null; return 'A0'; },

    recheck: function () { if (!st.ents) initEnts(); st.entsBak = JSON.parse(JSON.stringify(st.ents)); st.pick = null; st.adding = false; st.editEnt = -1; return 'WT'; },
    recheckCancel: function () { if (st.entsBak) st.ents = st.entsBak; st.entsBak = null; st.pick = null; st.editEnt = -1; return drawn() ? 'A5' : 'A1'; },
    recheckRewrite: function () { ACTS.recheckCancel(); return drawn() ? 'R2' : 'R1'; },

    extract: function () {
      var oldC = st.chars, oldB = st.bgs, before = oldC.concat(oldB).map(function (o) { return o.n; });

      oldC.concat(oldB).forEach(function (o, k) { o._sn = st.versions.map(function (v) { return v.snap[k]; }); });
      function keep(list, e, d) {
        var same = list.filter(function (x) { return e.aliases.indexOf(x.n) >= 0 || x.n === e.name; });
        var o = same.filter(function (x) { return x.n === e.name; })[0] || same[0];
        if (!o) return { n: e.name, d: d, states: ['First look'], tone: 0, note: '', aliases: e.aliases };

        same.forEach(function (x) {
          if (x === o || !x.hist) return;
          var base = o.hist.length;
          x.hist.forEach(function (h) { o.hist.push(Object.assign({}, h, { from: x.n })); });

          if (e.pic === x.n && x.cur >= 0) { o.cur = base + x.cur; if (o._sn) o._sn[st.ver] = o.cur; }
        });
        o.n = e.name; o.aliases = e.aliases; delete e.pic; return o;
      }
      st.chars = st.ents.filter(function (e) { return e.type === 'char'; }).map(function (e) { return keep(oldC, e, 'A character marked in the prose. The AI fills the description by reading the prose.'); });
      st.bgs = st.ents.filter(function (e) { return e.type === 'place'; }).map(function (e) { return keep(oldB, e, 'A place marked in the prose.'); });
      st.newItems = st.ents.map(function (e) { return e.name; }).filter(function (n) { return before.indexOf(n) < 0; });
      var all = objs(); st.versions.forEach(function (v, vi) { v.snap = all.map(function (o) { return o._sn ? o._sn[vi] : null; }); });
      all.forEach(function (o) { delete o._sn; });
      st.pick = null; st.editEnt = -1; st.entsBak = null;
      if (!drawn()) return 'A1';

      var fresh = all.filter(function (o) { return o.cur < 0; });
      if (!fresh.length) return 'A5';
      st.busyNames = fresh.map(function (o) { return o.n; });
      st.pending = function () {
        var v = st.versions[st.ver];
        objs().forEach(function (o, k) { if (o.cur >= 0) return; o.hist.push({ style: st.style, tone: 0, note: '', v: v.n, r: 0, state: o.isBg ? '' : o.states[0] }); o.cur = o.hist.length - 1; v.snap[k] = o.cur; });
        say('Artist', 'Artist', st.busyNames.join(', ') + ' made in the current style (' + STYLES[st.style][0] + ').'); st.busyNames = null;
      };
      return 'A4';
    },
    pickClear: function () { st.pick = null; st.adding = false; },
    addStart: function () { if (st.pick) st.adding = true; },
    addAs: function (t) {
      var w = st.pick; if (!w) return;
      var e = st.ents.filter(function (x) { return x.aliases.indexOf(w) >= 0; })[0];
      if (!e) st.ents.push({ name: w, type: t, aliases: [w] });
      st.pick = null; st.adding = false;
    },
    entEdit: function (i) { i = +i; st.editEnt = st.editEnt === i ? -1 : i; st.entName = st.editEnt >= 0 ? st.ents[i].name : ''; st.pick = null; st.adding = false; },
    entCancel: function () { st.editEnt = -1; },
    entSave: function () {
      var i = st.editEnt, e = st.ents[i], n = (st.entName || '').trim(); if (!e || !n) return;
      var j = -1; st.ents.forEach(function (x, k) { if (k !== i && x.type === e.type && (x.name === n || x.aliases.indexOf(n) >= 0)) j = k; });
      if (j >= 0) { st.mergeInto = j; return 'WTm'; }
      if (e.aliases.indexOf(n) < 0 && st.prose.join(' ').indexOf(n) >= 0) e.aliases.push(n);
      e.name = n; st.editEnt = -1;
    },
    entDrop: function (i) { st.ents.splice(+i, 1); st.editEnt = -1; },
    mergeCancel: function () { st.mergeInto = -1; return 'WT'; },
    mergeDo: function () {
      var e = st.ents[st.editEnt], t = st.ents[st.mergeInto];
      if (drawn()) { var pe = picOwner(e), pt = picOwner(t); t.pic = pe && pt ? st.mergePic || pt : pt || pe; }
      st.mergePic = null;
      e.aliases.forEach(function (a) { if (t.aliases.indexOf(a) < 0) t.aliases.push(a); });
      st.ents.splice(st.editEnt, 1); st.editEnt = -1; st.mergeInto = -1;
      return 'WT';
    },
    rollback: function (from) { st.proseLocked = false; st.back = from; st.ratioLocked = true; return 'W1'; },
    descEdit: function (i) { st.descEdit = +i; },
    descDone: function () { st.descEdit = -1; },
    generate: function () { st.styleLocked = true; st.pending = function () { newVersion(st.style); st.generated = true; st.newItems = []; say('Artist', 'Artist', STYLES[st.style][0] + ' — made v' + st.versions.length + '. Happy? [Finish]; otherwise [Regenerate], or [Remake] items one by one.'); }; return 'A4'; },
    regenCancel: function () { st.regenStyle = null; return 'A5'; },
    regenAll: function () { var sty = st.regenStyle == null ? st.style : st.regenStyle; st.regenStyle = null; st.pending = function () { st.style = sty; newVersion(sty); say('Artist', 'Artist', STYLES[sty][0] + ' — made v' + st.versions.length + '. Previous versions are under [Load].'); }; return 'A4'; },
    loadVer: function (i) { var v = st.versions[+i]; st.style = v.style; objs().forEach(function (o, k) { if (v.snap[k] != null) o.cur = v.snap[k]; }); st.ver = +i; say('Artist', 'Artist', 'v' + v.n + '(' + STYLES[v.style][0] + ') loaded. Project style is now ' + STYLES[v.style][0] + ' too.'); return 'A5'; },
    objLoad: function (k) { var o = target(); if (o.hist[+k].style !== st.style) return; if (o.sTab > 0) { o.stImg = o.stImg || {}; o.stImg[o.states[o.sTab]] = +k; } else { o.cur = +k; st.versions[st.ver].snap[st.target] = o.cur; } say('Artist', 'Artist', o.n + '\'s previous image loaded.'); return 'A5'; },
    openState: function (a) { var p = a.split(':'), o = objs()[+p[0]], k = +p[1]; ACTS.openTone(p[0]); o.sTab = Math.max(0, k); st.vadd = k < 0; return 'A7'; },
    avar: function (k) { target().sTab = +k; st.dEdit = null; st.histOpen = false; },
    vbase: function () { var o = target(), k = o.sTab, n = o.states.splice(k, 1)[0], old = o.states[0], idx = stIdx(o, 0); o.states.unshift(n); o.stImg = o.stImg || {}; var ni = o.stImg[n]; if (idx >= 0) o.stImg[old] = idx; if (ni != null) { o.cur = ni; delete o.stImg[n]; } o.sTab = 0; say('Artist', 'Artist', o.n + '\'s base look is now "' + n + '".'); },
    vdel: function (k) { var o = target(), n = o.states.splice(+k, 1)[0]; if (o.stImg) delete o.stImg[n]; if (o.sTab >= o.states.length || o.sTab == +k) o.sTab = 0; say('Artist', 'Artist', o.n + '\'s "' + n + '" look deleted.'); },
    vaddOpen: function () { st.vadd = true; st.vaName = ''; st.vaDesc = ''; },
    vaddClose: function () { st.vadd = false; if (st.stateFrom) { var f = st.stateFrom; st.stateFrom = ''; return f; } },
    vaddDo: function (gen) {
      var o = target(), n = (st.vaName || '').trim(); if (!n) return;
      if (o.states.indexOf(n) < 0) o.states.push(n);
      o.sd = o.sd || {}; o.sd[n] = (st.vaDesc || '').trim(); o.noImg = o.noImg || {}; o.noImg[n] = true;
      o.sTab = o.states.indexOf(n); st.vadd = false;
      var w = st.target, from = st.stateFrom;
      if (from && st.shotDraft && st.shotDraft.who.indexOf(w) >= 0) st.shotDraft.ws[w] = o.sTab;
      if (gen !== '1') { say('Artist', 'Artist', o.n + ' got a new look "' + n + '". No image yet.'); if (from) { st.stateFrom = ''; return from; } return; }
      st.rg = { parts: [0], useCur: true, refOff: [] };
      return ACTS.rgGo();
    },
    dEdit: function (k) { st.dEdit = +k; st.dDraft = descOf(target(), +k); },
    dCancel: function () { st.dEdit = null; },
    dSave: function () { var o = target(), k = st.dEdit, has = !!stateH(o, k) && !(k > 0 && o.noImg && o.noImg[o.states[k]]); if (k <= 0) { o.d = st.dDraft; if (has) o.dirty = true; } else { o.sd = o.sd || {}; o.sd[o.states[k]] = st.dDraft; if (has) { o.stale = o.stale || {}; o.stale[o.states[k]] = true; } } st.dEdit = null; },
    roleSet: function (j) { target().role = +j; },
    useSel: function (j) { st.useSel = st.useSel === +j ? null : +j; },
    goShot: function (j) { st.stateFrom = ''; return ACTS.editShot(j); },
    toArtist: function () { st.stateFrom = ''; st.vadd = false; return 'A5'; },
    detailClose: function () { st.dEdit = null; st.histOpen = false; if (st.stateFrom) { var f = st.stateFrom; st.stateFrom = ''; st.vadd = false; return f; } return 'A5'; },
    rgOpen: function () { var o = target(), k = o.isBg ? 0 : o.sTab; o.prompt = descOf(o, k) || o.d; o.traits = []; st.rg = { parts: stateH(o, k) ? [0] : [0], useCur: true, refOff: [] }; st.histOpen = false; return 'A7r'; },
    rgClose: function () { return st.stateFrom ? 'S5' : 'A7'; },
    rgPart: function (j) { j = +j; var p = st.rg.parts; if (j === 0) st.rg.parts = [0]; else { var x = p.indexOf(j); if (x >= 0) p.splice(x, 1); else p.push(j); var z = p.indexOf(0); if (z >= 0 && p.length > 1) p.splice(z, 1); if (!p.length) p.push(0); } },
    rgCur: function () { st.rg.useCur = !st.rg.useCur; },
    rgRef: function (j) { j = +j; var r = st.rg.refOff, x = r.indexOf(j); if (x >= 0) r.splice(x, 1); else r.push(j); },
    rgGo: function () {
      var o = target(), k = o.isBg ? 0 : o.sTab, rg = st.rg || { parts: [0] };
      var mode = rg.parts.indexOf(0) >= 0 ? 'new' : 'edit', note = mode === 'edit' ? rg.parts.map(function (j) { return PARTS[j]; }).join(' · ') + ' only' : '';
      if (k > 0 && o.noImg) delete o.noImg[o.states[k]];
      if (k <= 0) o.dirty = false; else if (o.stale) delete o.stale[o.states[k]];
      return ACTS.regenObj(mode, note);
    },
    regenStale: function () { var o = target(); o.sTab = o.dirty ? 0 : o.states.indexOf(Object.keys(o.stale || {})[0]); st.rg = { parts: [0], useCur: true, refOff: [] }; return ACTS.rgGo(); },
    openTone: function (i) { st.target = +i; st.renaming = false; st.editMode = null; st.histOpen = false; st.stateDraft = ''; return 'A7'; },
    renameStart: function () { st.renaming = true; },
    renameDone: function () { st.renaming = false; },
    sTab: function (k) { target().sTab = +k; st.histOpen = false; },


    toggleTrait: function (t) {
      var o = target(), k = o.traits.indexOf(t);
      if (k >= 0) { o.traits.splice(k, 1); o.prompt = o.prompt.split('@' + t).join('').replace(/\s{2,}/g, ' ').trim(); }
      else { o.traits.push(t); o.prompt = (o.prompt.trim() ? o.prompt.trim() + ' ' : '') + '@' + t; }
    },
    histToggle: function () { st.histOpen = !st.histOpen; },
    traitsFold: function () { st.traitsOpen = !st.traitsOpen; },
    mergePic: function (n) { st.mergePic = n; },
    editMode: function (m) { st.editMode = m; },
    afilter: function (f) { st.afilter = f; },
    addRef: function (key) { var r = refsOf(key); r.push((key === 'style' ? 'style' : 'ref') + '_' + (r.length + 1) + '.jpg'); },
    delRef: function (a) { var kv = a.split(':'); refsOf(kv[0]).splice(+kv[1], 1); },
    acPick: function (m) { st.acMode = m; return m === 'edit' ? 'AC2' : 'AC3'; },
    regenObj: function (mode, note) {
      var t = target(), ti = st.target; st.regenMode = mode;
      var traits = t.traits.slice(), n = note || '', newState = '', from = st.stateFrom;
      st.histOpen = false;
      st.pending = function () {
        var v = st.versions[st.ver] ? st.versions[st.ver].n : 1;
        var r = t.hist.filter(function (h) { return h.v === v; }).length;
        t.hist.push({ style: st.style, tone: traits.indexOf('Horror') >= 0 ? 2 : 0, note: n, traits: traits, model: t.model, v: v, r: r, state: newState || (t.isBg ? '' : t.states[t.sTab]) });

        if (!t.isBg && t.sTab > 0) { t.stImg = t.stImg || {}; t.stImg[t.states[t.sTab]] = t.hist.length - 1; }
        else { t.cur = t.hist.length - 1; if (st.versions[st.ver]) st.versions[st.ver].snap[ti] = t.cur; }
        say(from ? 'Storyboard' : 'Artist', from ? 'Storyboard' : 'Artist', t.n + (t.sTab > 0 ? ' · ' + t.states[t.sTab] : '') + ': ' + (mode === 'edit' ? 'edited from the current image' : 'made new in the same style') + (n ? ' — ' + n : '') + '. The previous image is in the detail history.');
      };
      st.vadd = false;
      return from ? 'S6' : 'A8';
    },
    applyTone: function () {
      var t = target(), ti = st.target, tone = st.toneDraft, tw = st.tweak.trim();
      st.pending = function () {
        var v = st.versions[st.ver] ? st.versions[st.ver].n : 1;
        var r = t.hist.filter(function (h) { return h.v === v; }).length;
        t.hist.push({ style: st.style, tone: tone, note: tw, v: v, r: r }); t.cur = t.hist.length - 1;
        if (st.versions[st.ver]) st.versions[st.ver].snap[ti] = t.cur;
        say('Artist', 'Artist', t.n + ' remade' + (tone ? ' (' + TONES[tone] + ' tone)' : '') + '. The previous image is in the remake window\'s history.');
      };
      return 'A8';
    },
    toBoard: function () {
      if (!canBoard()) { say('Artist', 'Artist', 'Some cast or sets have no image, so Storyboard isn\'t available yet. Make them first.'); return st.versions.length ? 'A5' : 'A1'; }
      if (st.boarded) return 'S1';  // Artist로 돌아왔다가 다시 가면 샷은 그대로
      st.boarded = true;
      st.pending = function () { st.shots.forEach(function (x) { x.fresh = false; x.cand = false; x.chg = false; x.drawn = true; }); say('Storyboard', 'Storyboard', 'Scenes ' + st.scenes.length + ' · shots ' + st.shots.length + ' — split and roughs drawn. Edit a card directly or just tell me.'); };
      return 'S0';
    },
    sbView: function (v) { st.sbView = v; },
    shotMenu: function (i) { st.sbMenu = st.sbMenu === +i ? -1 : +i; },
    shotMove: function (a) {
      var p = a.split(':'), i = +p[0], j = i + +p[1]; st.sbMenu = -1;
      if (j < 0 || j >= st.shots.length) return;
      var x = st.shots[i], y = st.shots[j]; if (x.sc !== y.sc) { x.sc = y.sc; } else { st.shots[i] = y; st.shots[j] = x; }
      say('Storyboard', 'Storyboard', 'Renumbered.');
    },
    shotDup: function (i) { var c = clone(st.shots[+i]); c.fresh = true; st.shots.splice(+i + 1, 0, c); st.sbMenu = -1; },
    shotDel: function (i) { var x = st.shots.splice(+i, 1)[0]; st.sbMenu = -1; st.lastDel = [+i, x]; say('Storyboard', 'Storyboard', 'Shot deleted. Now ' + total() + 's.'); },
    editShot: function (i) { var o = st.shots[+i]; if (o.dirMv == null && o.act == null) { o.dirMv = o.dir || ''; o.act = ''; } st.sbFrame = 0; st.dmode = 'opt'; st.drawTool = 'arrow'; st.memoAt = null; st.memoKind = 'obj'; st.shotSel = +i; st.shotDraft = clone(st.shots[+i]); st.shotTab = 'start'; st.sbMenu = -1; st.ddOpen = ''; return 'S2'; },
    shotTab: function (t) { st.shotTab = t; st.ddOpen = ''; st.drawing = false; st.memoAt = null; },
    dirMode: function (m) { st.dirMode = m; },
    shotWho: function (k) { k = +k; var d = st.shotDraft, j = d.who.indexOf(k); if (j >= 0) d.who.splice(j, 1); else d.who.push(k); },
    redraw: function (i) { var x = st.shots[+i]; st.busyNames = null; st.pending = function () { x.drawn = true; x.fresh = false; }; return 'S3'; },
    drawAll: function () { var xs = st.shots.filter(function (x) { return !x.drawn; }); st.busyNames = null; st.pending = function () { xs.forEach(function (x) { x.drawn = true; x.fresh = false; }); say('Storyboard', 'Storyboard', '' + xs.length + ' unsketched cuts drawn.'); }; return 'S3'; },
    addLine: function () { st.shotDraft.lines.push({ w: 0, t: '' }); },
    delLine: function (i) { st.shotDraft.lines.splice(+i, 1); },
    cancelShot: function () { st.shotDraft = null; st.shotNew = false; st.addAt = null; st.ddOpen = ''; return 'S1'; },

    applyShot: function () {
      var d = st.shotDraft, i = st.shotSel, before = clone(st.shots[i]); st.shotDraft = null;
      if (d.lenI != null) { d.len = LENS[+d.lenI]; delete d.lenI; } ['len', 'size', 'ang', 'move', 'bg'].forEach(function (k) { d[k] = +d[k] || 0; }); if (!d.len) d.len = 1;
      d.lines = d.lines.filter(function (l) { return l.t.trim(); }).map(function (l) { l.w = +l.w; return l; });
      d.dir = [d.dirMv, d.act].filter(function (t) { return t && t.trim(); }).join(' · ');
      var part = st.shotTab === 'start' ? 'Start · direction' : 'Direction';
      d.rv = (before.rv || 0) + 1;
      st.pending = function () { d.drawn = true; st.shots[i] = d; st.cands = [{ i: i, prev: before, what: part + ' redrawn' }]; };
      return 'S3';
    },
    candOk: function () { var cs = st.cands || []; st.cands = null; st.shots.forEach(function (x) { x.chg = false; }); say('Storyboard', 'Storyboard', cs.map(function (c) { return shotLabel(c.i); }).join(', ') + ': new roughs applied. Now ' + total() + 's.'); return 'S1'; },
    candUndo: function () { (st.cands || []).forEach(function (c) { st.shots[c.i] = c.prev; }); st.cands = null; st.shots.forEach(function (x) { x.chg = false; }); say('Storyboard', 'Storyboard', 'Reverted. The previous image stays.'); return 'S1'; },
    candEdit: function () { var c = st.cands[0], cur = st.shots[c.i]; st.shots[c.i] = c.prev; st.cands = null; st.shotSel = c.i; st.shotDraft = clone(cur); delete st.shotDraft.rv; st.shotDraft.rv = c.prev.rv || 0; st.ddOpen = ''; return 'S2'; },
    sbFrame: function (k) { st.sbFrame = +k; },
    drawTool: function (t) { st.drawTool = t; st.memoAt = null; },
    dmode: function (m) { st.dmode = m; st.memoAt = null; },
    edMove: function (j) { st.shotDraft.move = +j; },
    edDur: function (v) { var d = st.shotDraft; d.len = Math.max(1, Math.min(30, d.len + +v)); delete d.lenI; },
    mkKind: function (j) { var m = st.shotDraft.marks[+j]; m.kind = m.kind === 'cam' ? 'obj' : 'cam'; },
    mkDel: function (j) { st.shotDraft.marks.splice(+j, 1); },
    edRegen: function () { var i = st.shotSel, before = clone(st.shots[i]), x = st.shots[i]; x.rv = (x.rv || 0) + 1; st.shotDraft = null; st.pending = function () { st.cands = [{ i: i, prev: before, what: 'Redrew the direction with the same settings' }]; }; return 'S3'; },
    drawStart: function () { st.drawing = true; st.dirEdited = false; st.dirBase = st.shotDraft.dir || ''; st.markBase = (st.shotDraft.marks || []).length; st.drawTool = 'arrow'; st.memoAt = null; },
    drawEnd: function () { st.drawing = false; st.memoAt = null; },
    memoPut: function () { var txt = (st.memoText || '').trim(), at = st.memoAt; if (!at) return; if (txt) st.shotDraft.marks.push({ t: 'memo', x: at.x, y: at.y, text: txt, kind: st.memoKind || 'obj', c: st.drawColor || 'r' }); st.memoAt = null; st.memoText = ''; },
    drawColor: function (c) { st.drawColor = c; },
    memoKind: function (k) { st.memoKind = k; },
    drawUndo: function () { st.shotDraft.marks.pop(); },
    drawClear: function () { st.shotDraft.marks = []; },

    newShot: function (a) {
      var p = String(a || '').split(':'), n = +p[0] || 0;
      st.addAt = n ? { sc: n, k: p[1] != null && p[1] !== '' ? +p[1] : scShots(n).length } : null;
      st.shotDraft = { sc: n || 1, len: 3, size: 3, ang: 0, move: 0, dir: '', desc: '', who: [], ws: {}, bg: n ? st.scenes[n - 1].place : 0, lines: [], drawn: false, light: { pos: 0, temp: 3, bri: 50 } };
      st.shotTab = 'start'; st.shotNew = true; st.ddOpen = ''; return 'S4';
    },
    addAt: function (a) { var p = a.split(':'); st.addAt = { sc: +p[0], k: +p[1] }; st.shotDraft.sc = +p[0]; st.shotDraft.bg = st.scenes[+p[0] - 1].place; },
    ddOpen: function (path) { st.ddOpen = st.ddOpen === path ? '' : path; },
    ddPick: function (a) { var p = a.split('~'); setPath(st, p[0], +p[1]); st.ddOpen = ''; },
    addShot: function () {
      var d = st.shotDraft, at = st.addAt; if (!d || !d.desc.trim() || !at) return;
      if (d.lenI != null) { d.len = LENS[+d.lenI]; delete d.lenI; }
      d.lines = d.lines.filter(function (l) { return l.t.trim(); }).map(function (l) { l.w = +l.w; return l; });
      d.sc = at.sc; d.fresh = true; st.shotDraft = null; st.shotNew = false; st.addAt = null; st.ddOpen = '';
      var list = scShots(at.sc), idx = at.k < list.length ? list[at.k][1] : list.length ? list[list.length - 1][1] + 1 : (function () { var last = -1; st.shots.forEach(function (x, k) { if (x.sc < at.sc) last = k; }); return last + 1; })();
      st.shots.splice(idx, 0, d);
      st.pending = function () { d.drawn = true; say('Storyboard', 'Storyboard', shotLabel(st.shots.indexOf(d)) + ' added and its rough drawn. Now ' + total() + 's.'); };
      return 'S3';
    },
    addScene: function () {
      var a = st.scAdd, at = +a.pos;
      st.shots.forEach(function (x) { if (x.sc > at) x.sc++; });
      st.scenes.splice(at, 0, { place: +a.place, time: +a.time, sum: a.sum.trim() || 'New scene' });
      say('Storyboard', 'Storyboard', 'S' + (at + 1) + ' added. Later scene numbers moved up by one. Add shots with [＋ Shot].');
      st.scAdd = { place: 0, time: 0, sum: '', pos: st.scenes.length };
      return 'S1';
    },
    printSheet: function () { say('Storyboard', 'Storyboard', 'Downloaded the master sheet as PDF (mockup).'); return 'S1'; },


    sbApply: function () {
      var ch = st.sbChange; st.sbChange = null;

      var same = ch && ch.before.length === st.shots.length, cs = [];
      st.shots.forEach(function (x, i) { if (!x.chg) return; if (x.fresh || !same) { x.chg = false; return; } x.rv = (x.rv || 0) + 1; cs.push({ i: i, prev: ch.before[i], what: ch.note.split('. ')[0] }); });
      if (!cs.length) { st.shots.forEach(function (x) { x.chg = false; }); say('Storyboard', 'Storyboard', 'Applied.'); return 'S1'; }
      st.pending = function () { st.cands = cs; }; return 'S3';
    },
    sbUndo: function () { if (st.sbChange) st.shots = st.sbChange.before; st.shots.forEach(function (x) { x.chg = false; }); st.sbChange = null; return 'S1'; },
    stateCancel: function () { var f = st.stateFrom; st.stateFrom = ''; return f || 'S1'; },
    addState: function () {
      var w = +st.stateAdd.who, text = st.stateAdd.text.trim(); if (!text) return;
      st.pending = function () {
        st.chars[w].states.push(text);
        if (st.shotDraft && st.shotDraft.who.indexOf(w) >= 0) st.shotDraft.ws[w] = st.chars[w].states.length - 1;
        say('Storyboard', 'Storyboard', st.chars[w].n + ' got a new look "' + text + '" look added. It shows on the Artist card too.');
      };
      return 'S6';
    },
    skip: function () { return finishBusy(true); },

    jumpStage: function (name) {
      return { Producer: entryId(), Writer: 'W1', Artist: st.versions.length ? 'A5' : 'A1', Storyboard: 'S1', Director: 'D1', Editor: 'D1' }[name];
    },
    reset: function () { var p = st.plan; st = initial(); st.plan = p; return p === 'B' ? 'EB1' : 'E1'; },
    bStart: function () {
      if (!st.file && /예시|example/i.test(st.idea) && ideaLen() < MIN_LEN + 10) { st.idea = ''; st.lenErr = false; return 'EBX'; }
      if (!st.file && ideaLen() < MIN_LEN) { st.lenErr = true; return 'E1e'; }
      st.lenErr = false; st.bAns = {}; st.bPre = {}; st.bHint = ''; st.bSent = true;
      st.pending = function () {
        recommend();
        parseInto(st.idea).forEach(function (k) { st.bPre[k] = true; });
      };
      return 'E2';
    },
    bAnswer: function (a) {
      var kv = a.split(':'), k = kv[0], v = +kv[1];
      if (k === 'ratio') st.ratio = RATIOS[v][0];
      else if (k === 'file') { st.level = v; st.bAns.level = true; st.bAns.file = true; st.bHint = ''; return nextQ(); }
      else st[k] = v;
      st.bAns[k] = true; st.bPre[k] = false; st.bHint = '';
      return nextQ();
    },
    bFileOk: function () { st.bAns.file = true; return nextQ(); },
    focusIdea: function () { setTimeout(function () { var t = root && root.querySelector('#idea'); if (t) t.focus(); }, 0); },
    moreEx: function () { st.exPage = (st.exPage + 1) % Math.ceil(EXAMPLES.length / 3); },
    bReask: function (k) { if (k === 'level' && st.file) k = 'file'; st.bAns[k] = false; st.bPre[k] = false; return BQ_SCREEN[k]; },
    bSend: function () {
      var t = st.chatDraft.trim(); if (!t) return;
      st.chatDraft = '';
      var got = parseInto(t);
      got.forEach(function (k) { st.bPre[k] = false; });
      st.bHint = got.length ? '"' + t + '" — ' + got.map(function (k) { return BQ_NAME[k] + ' ' + ansText(k); }).join(', ') + ' — set.' : '"' + t + '" — I didn\'t quite get that. Pick with the buttons.';
      return got.length ? nextQ() : null;
    },
  };

  function badExtMsg(name) { return '"' + name + '" can\'t be uploaded. Only text files (txt · md · docx · pdf · hwp) or images with text (png · jpg).'; }
  function pickFile(name, kind, size) {
    var ext = (name.split('.').pop() || '').toLowerCase();
    if (kind === 'bad' || (TEXT_EXT.indexOf(ext) < 0 && IMG_EXT.indexOf(ext) < 0)) { st.fileErr = badExtMsg(name); return 'EFe'; }
    if (size > 10 * 1024 * 1024) { st.fileErr = '"' + name + '" is over 10MB. Please upload 10MB or less.'; return 'EFe'; }
    var img = IMG_EXT.indexOf(ext) >= 0;
    st.file = { name: name, image: img, noText: kind === 'notext' };
    st.kind = img ? 'img' : (kind && KINDS[kind] ? kind : ext === 'txt' || ext === 'md' ? '1-3' : '1-1');
    st.fileErr = ''; st.lenErr = false; st.rec = null;
    return entryId();
  }


  var root = null, cur = null, host = {}, timer = null;
  function setPath(obj, path, val) {
    var ks = path.split('.'), o = obj;
    for (var i = 0; i < ks.length - 1; i++) o = o[ks[i]];
    var last = ks[ks.length - 1];
    if (path === 'shotDraft.len') val = +val + 1;
    o[last] = val;
  }
  function getPath(obj, path) { return path.split('.').reduce(function (o, k) { return o == null ? o : o[k]; }, obj); }
  function screenFor(id) { if (SCREENS[id]) return id; var d = DECISION_SCREEN[id]; return typeof d === 'function' ? d() : d || null; }
  function paint() {
    if (!root) return;
    var sid = screenFor(cur);
    var focusId = document.activeElement && root.contains(document.activeElement) ? document.activeElement.getAttribute('data-bind') : null;
    root.innerHTML = sid ? SCREENS[sid]() : '<div class="w-entry"><p class="w-mut">This node has no screen.</p></div>';
    refresh();
    root.querySelectorAll('.w-chat-b').forEach(function (c) { c.scrollTop = c.scrollHeight; });
    if (focusId) { var el = root.querySelector('[data-bind="' + focusId + '"]:not(.w-opt)'); if (el && el.focus) el.focus(); }
    if (st.focusChat) { st.focusChat = false; var fc = root.querySelector('#chat-in'); if (fc) { fc.focus({ preventScroll: true }); return; } }
    if (st.rw) { var po = root.querySelector('.w-rwp .w-opt.on'); if (po) { po.focus({ preventScroll: true }); return; } }
    var dlg = root.querySelector('.w-modal');
    if (dlg && !focusId) { var f = dlg.querySelector('input, textarea, .w-acts .w-btn:last-child'); if (f) f.focus({ preventScroll: true }); }
  }


  function syncTraits() {
    var o = target(); if (!o || !o.traits) return;
    o.traits = o.traits.filter(function (t) { return o.prompt.indexOf('@' + t) >= 0; });
    root.querySelectorAll('[data-act="toggleTrait"]').forEach(function (b) {
      var t = b.getAttribute('data-arg'), on = o.traits.indexOf(t) >= 0;
      b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); b.textContent = (on ? '✓ @' : '＋ ') + t;
    });
  }
  function refresh() {
    var n = ideaLen();
    root.querySelectorAll('[data-count]').forEach(function (el) {
      el.textContent = n + ' chars' + (st.file ? '' : ' · min ' + MIN_LEN + ' chars');
      el.classList.toggle('short', !st.file && n < MIN_LEN);
    });
    root.querySelectorAll('[data-lennow]').forEach(function (el) { el.textContent = n; });
    if (n >= MIN_LEN) root.querySelectorAll('[data-lenerr]').forEach(function (el) { el.hidden = true; });
    root.querySelectorAll('.w-lv').forEach(function (b) { b.disabled = !levelOk(+b.getAttribute('data-val')); });
    root.querySelectorAll('[data-need]').forEach(function (b) {
      var ok = b.getAttribute('data-need').split('|').some(function (p) { var v = getPath(st, p); return typeof v === 'string' ? v.trim() : !!v; });
      b.disabled = !ok;
    });
  }
  function startBusy() {
    clearInterval(timer);
    st.busyStep = 0;
    var steps = (root && root.querySelectorAll('.w-steps li').length) || 3;
    timer = setInterval(function () {
      st.busyStep++;
      if (st.busyStep > steps) { finishBusy(); return; }
      paint();
    }, 650);
  }
  function finishBusy(manual) {
    clearInterval(timer); timer = null;
    if (st.pending) { var p = st.pending; st.pending = null; p(); }
    var nx = BUSY_NEXT[cur]; if (typeof nx === 'function') nx = nx();
    if (nx) { if (manual) return nx; go(nx); }
  }
  function show(id) {
    clearInterval(timer); timer = null;
    cur = id;
    if (id === 'W1' && st.proseLocked) st.proseLocked = false;
    paint();
    if (BUSY_NEXT[id]) startBusy();
  }
  function go(id) { show(id); if (host.onNavigate) host.onNavigate(id); }
  function run(act, arg) {
    var fn = ACTS[act]; if (!fn) return;
    var to = fn(arg);
    if (to) go(to); else paint();
  }

  function mount(el, h) {
    root = el; host = h || {};
    el.addEventListener('click', function (e) {
      var t = e.target;
      if (st.rw && !t.closest('.w-popwrap')) { st.rw = null; paint(); }
      var b = t.closest('[data-act]');
      if (b && !b.disabled) { e.preventDefault(); run(b.getAttribute('data-act'), b.getAttribute('data-arg')); return; }
      var g = t.closest('[data-go]');
      if (g && !g.disabled) { e.preventDefault(); go(g.getAttribute('data-go')); return; }
      var o = t.closest('button[data-bind]');
      if (o) {
        var v = o.hasAttribute('data-sval') ? o.getAttribute('data-sval') : +o.getAttribute('data-val');
        var p = o.getAttribute('data-bind');
        if (p === 'ratio') v = RATIOS[v][0];
        setPath(st, p, v); paint();
      }
    });
    el.addEventListener('input', function (e) {
      var t = e.target, p = t.getAttribute && t.getAttribute('data-bind');
      if (!p || t.tagName === 'BUTTON') return;
      setPath(st, p, (t.tagName === 'SELECT' && t.value !== '' && !isNaN(+t.value)) || t.type === 'range' ? +t.value : t.value);
      if (/\.prompt$/.test(p)) syncTraits();
      if (/^shotDraft\.(dirMv|act|note)$/.test(p) && st.shotTab === 'dir') {

        var go = root.querySelector('.w-acts [data-act="applyShot"]'), hn = root.querySelector('#eddHint'), dirty = dDirty();
        if (go) go.disabled = !dirty; if (hn) hn.textContent = dirty ? 'Applying keeps the start and redraws the direction.' : 'Change something to enable Apply.';
        var dl = root.querySelector('.w-dirlayer'); if (dl) dl.outerHTML = dirLayer(st.shotDraft);
      }
      refresh();
    });
    el.addEventListener('change', function (e) {
      var t = e.target;
      if (t.classList && t.classList.contains('ref-in') && t.files && t.files[0]) { refsOf(t.getAttribute('data-ref')).push(t.files[0].name); t.value = ''; paint(); return; }
      if (t.id === 'file-in' && t.files && t.files[0]) {
        var f = t.files[0]; t.value = '';
        go(pickFile(f.name, null, f.size));
      } else if (t.type === 'range') paint();
      else if (t.getAttribute && t.getAttribute('data-act-change') === 'shotWs') {

        var k = +t.getAttribute('data-arg');
        if (t.value === 'new') { st.stateFrom = cur; st.target = k; objs()[k].sTab = 0; st.vadd = true; st.vaName = ''; st.vaDesc = ''; st.dEdit = null; st.histOpen = false; go('S5'); }
        else st.shotDraft.ws[k] = +t.value;
      }
    });

    var drag = null;
    function svgPt(svg, e) { var r = svg.getBoundingClientRect(); return { x: Math.round((e.clientX - r.left) / r.width * 160), y: Math.round((e.clientY - r.top) / r.height * 90) }; }
    el.addEventListener('pointerdown', function (e) {
      var svg = e.target.closest && e.target.closest('svg[data-draw]'); if (!svg || !st.shotDraft) return;
      e.preventDefault(); var pt = svgPt(svg, e), tool = st.drawTool || 'arrow', c = st.drawColor || 'r';
      if (tool === 'erase') { var g = e.target.closest('[data-mark]'); if (g) { st.shotDraft.marks.splice(+g.getAttribute('data-mark'), 1); paint(); } return; }
      if (st.memoAt) { ACTS.memoPut(); paint(); return; }
      if (tool === 'memo') { st.memoAt = { x: pt.x, y: Math.max(pt.y, 8) }; st.memoText = ''; paint(); var mi = root.querySelector('.w-memo-in input'); if (mi) mi.focus(); return; }
      drag = { svg: svg, x1: pt.x, y1: pt.y, line: svg.querySelector('.w-mk-tmp') };
      if (drag.line) { drag.line.setAttribute('x1', pt.x); drag.line.setAttribute('y1', pt.y); drag.line.setAttribute('x2', pt.x); drag.line.setAttribute('y2', pt.y); drag.line.setAttribute('visibility', 'visible'); }
    });
    el.addEventListener('pointermove', function (e) { if (!drag || !drag.line) return; var pt = svgPt(drag.svg, e); drag.line.setAttribute('x2', pt.x); drag.line.setAttribute('y2', pt.y); });
    window.addEventListener('pointerup', function (e) {
      if (!drag) return; var pt = svgPt(drag.svg, e), d0 = drag; drag = null;
      if (Math.hypot(pt.x - d0.x1, pt.y - d0.y1) < 6) { if (d0.line) d0.line.setAttribute('visibility', 'hidden'); return; }
      st.shotDraft.marks.push({ t: 'arrow', x1: d0.x1, y1: d0.y1, x2: pt.x, y2: pt.y, c: st.drawColor || 'r' }); paint();
    });
    el.addEventListener('mouseup', function (e) {
      if (!e.target.closest || !e.target.closest('.w-tgprose') || e.target.closest('.w-tg')) return;
      var t = String(window.getSelection ? window.getSelection() : '').trim();
      if (t && t.length <= 14 && !/\n/.test(t)) { st.pick = t; st.adding = false; st.editEnt = -1; paint(); }
    });
    el.addEventListener('keydown', function (e) {
      var t = e.target;
      if ((e.key === 'Enter' || e.key === ' ') && t.getAttribute && t.getAttribute('role') === 'button' && t.tagName !== 'BUTTON' && t.getAttribute('data-act')) { e.preventDefault(); run(t.getAttribute('data-act'), t.getAttribute('data-arg')); return; }
      if (e.key === 'Enter' && !e.isComposing && !(e.shiftKey && t.tagName === 'TEXTAREA') && t.getAttribute && t.getAttribute('data-enter')) { e.preventDefault(); run(t.getAttribute('data-enter')); }
      if (e.key === 'Escape' && st.rw) { st.rw = null; paint(); var ob = root.querySelector('[data-act="rwOpen"]'); if (ob) ob.focus(); return; }
      if (e.key === 'Escape' && st.memoAt) { st.memoAt = null; st.memoText = ''; paint(); return; }
      if (e.key === 'Escape' && st.ddOpen) { st.ddOpen = ''; paint(); return; }
      if (e.key === 'Escape') { var c = root.querySelector('.w-acts .w-btn'); if (c) c.click(); }
    });
  }

  window.PROTO = {
    mount: mount, show: show,
    has: function (id) { return !!screenFor(id); },
    screenFor: screenFor,
    reset: function () { var p = st.plan; st = initial(); st.plan = p; show(cur); },
    setPlan: function (p) { st.plan = p; if (cur) show(cur); },
    current: function () { return cur; },
  };
})();

