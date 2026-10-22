/* Events renderer — builds the Events page (and the Home "Live now" banner)
   from window.HSPH_EVENTS (js/events-data.js). All dates/times are IST. */
(function () {
  'use strict';
  var EVENTS = [];                       // filled from js/events-data.js (loaded fresh below)
  var IST_OFFSET_MIN = 330;              // UTC+05:30
  var SESSION_HOURS = 4;                 // a timed session counts as "on" for 4h
  var LIVE_EARLY_MIN = 30;               // show LIVE up to 30 min before start

  var MONTH_EN = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var MONTH_TE = ['జనవరి','ఫిబ్రవరి','మార్చి','ఏప్రిల్','మే','జూన్','జూలై','ఆగస్టు','సెప్టెంబర్','అక్టోబర్','నవంబర్','డిసెంబర్'];
  var DAY_EN = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  var DAY_TE = ['ఆదివారం','సోమవారం','మంగళవారం','బుధవారం','గురువారం','శుక్రవారం','శనివారం'];

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function bi(o) {                       // bilingual spans
    if (o == null) return '';
    if (typeof o === 'string') o = { en: o, te: o };
    return '<span class="english-text">' + esc(o.en) + '</span><span class="telugu-text">' + esc(o.te || o.en) + '</span>';
  }
  function parts(dateStr) { var p = dateStr.split('-'); return { y: +p[0], m: +p[1], d: +p[2] }; }
  function istToUtcMs(dateStr, hhmm) {
    var p = parts(dateStr), h = 0, mi = 0;
    if (hhmm) { h = +hhmm.split(':')[0]; mi = +hhmm.split(':')[1]; }
    return Date.UTC(p.y, p.m - 1, p.d, h, mi) - IST_OFFSET_MIN * 60000;
  }
  function istDateKey(ms) {              // YYYY-MM-DD in IST
    var d = new Date(ms + IST_OFFSET_MIN * 60000);
    return d.getUTCFullYear() + '-' + String(d.getUTCMonth() + 1).padStart(2, '0') + '-' + String(d.getUTCDate()).padStart(2, '0');
  }
  function fmtDate(dateStr) {
    var p = parts(dateStr), wd = new Date(Date.UTC(p.y, p.m - 1, p.d)).getUTCDay();
    return { en: DAY_EN[wd] + ', ' + p.d + ' ' + MONTH_EN[p.m - 1] + ' ' + p.y,
             te: p.d + ' ' + MONTH_TE[p.m - 1] + ' ' + p.y + ', ' + DAY_TE[wd] };
  }
  function fmtRange(a, b) {
    var pa = parts(a), pb = parts(b);
    if (a === b) return fmtDate(a);
    var en = pa.d + ' ' + MONTH_EN[pa.m - 1] + ' – ' + pb.d + ' ' + MONTH_EN[pb.m - 1] + ' ' + pb.y;
    var te = pa.d + ' ' + MONTH_TE[pa.m - 1] + ' – ' + pb.d + ' ' + MONTH_TE[pb.m - 1] + ' ' + pb.y;
    return { en: en, te: te };
  }
  function fmtTime(hhmm) {
    if (!hhmm) return null;
    var h = +hhmm.split(':')[0], m = hhmm.split(':')[1];
    var en = ((h + 11) % 12 + 1) + ':' + m + (h < 12 ? ' AM' : ' PM');
    var part = h < 12 ? 'ఉదయం' : h < 16 ? 'మధ్యాహ్నం' : h < 18 ? 'సాయంత్రం' : 'రాత్రి';
    return { en: en + ' IST', te: part + ' ' + ((h + 11) % 12 + 1) + ':' + m };
  }
  function ytId(url) {
    if (!url) return null;
    var m = url.match(/(?:youtube\.com\/(?:live\/|watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
    return m ? m[1] : null;
  }

  /* ---------- status ---------- */
  // upcoming → (live | now) → done.  'today' only for sessions with no time announced.
  function sessionStatus(s, now) {
    if (s.status) return s.status;                          // manual override
    var start = istToUtcMs(s.date, s.time);
    var end = s.time ? start + SESSION_HOURS * 3600000 : istToUtcMs(s.date, null) + 86400000;
    if (s.live && now >= start - LIVE_EARLY_MIN * 60000 && now < end) return 'live';
    if (now >= end) return 'done';
    if (s.time) return now >= start ? 'now' : 'upcoming';
    return istDateKey(now) === s.date ? 'today' : 'upcoming';
  }
  function recording(s) { return s.video || (s.live && ytId(s.live) ? s.live : null); }
  function programInfo(p, now) {
    var ss = p.sessions.map(function (s) { return { s: s, st: sessionStatus(s, now) }; });
    var first = p.sessions[0].date, last = p.sessions[p.sessions.length - 1].date;
    var done = ss.filter(function (x) { return x.st === 'done'; }).length;
    var live = ss.filter(function (x) { return x.st === 'live'; });
    var state = live.length ? 'live' : done === ss.length ? 'past'
              : (istDateKey(now) >= first ? 'ongoing' : 'upcoming');
    return { ss: ss, first: first, last: last, done: done, live: live, state: state };
  }

  /* ---------- pieces ---------- */
  var CHIP = {
    live:     { cls: 'ev-chip--live',     en: '● Live now',  te: '● ప్రత్యక్ష ప్రసారం' },
    now:      { cls: 'ev-chip--today',    en: 'Happening now', te: 'జరుగుతోంది' },
    today:    { cls: 'ev-chip--today',    en: 'Today',       te: 'ఈ రోజు' },
    upcoming: { cls: 'ev-chip--upcoming', en: 'Upcoming',    te: 'రాబోయే' },
    done:     { cls: 'ev-chip--done',     en: 'Completed',   te: 'పూర్తయింది' }
  };
  var PSTATE = {
    live:     { cls: 'ev-chip--live',     en: '● Live now',   te: '● ప్రత్యక్షం' },
    ongoing:  { cls: 'ev-chip--today',    en: 'In progress',  te: 'జరుగుతోంది' },
    upcoming: { cls: 'ev-chip--upcoming', en: 'Upcoming',     te: 'రాబోయే' },
    past:     { cls: 'ev-chip--done',     en: 'Completed',    te: 'పూర్తయింది' }
  };
  function chip(c) { return '<span class="ev-chip ' + c.cls + '">' + bi(c) + '</span>'; }

  // a link that plays the YouTube video inside the card's top picture (falls back to opening YouTube)
  function playLink(url, cls, label) {
    var id = ytId(url);
    return '<a class="' + cls + '" href="' + esc(url) + '" target="_blank" rel="noopener"' +
           (id ? ' data-play-yt="' + id + '"' : '') + '>' + bi(label) + '</a>';
  }
  function photosBlock(list) {
    if (!list || !list.length) return '';
    return '<div class="ev-photos">' + list.map(function (src) {
      return '<a href="' + esc(src) + '" target="_blank" rel="noopener"><img src="' + esc(src) + '" alt="" loading="lazy"></a>';
    }).join('') + '</div>';
  }

  var expanded = {};                     // program ids where "Show all days" is open
  var UPCOMING_SHOWN = 2;                // upcoming days visible before "Show all"

  function dayRow(x, hide) {
    var s = x.s, st = x.st, t = fmtTime(s.time), rec = recording(s), actions = '';
    if (st === 'live') actions += playLink(s.live, 'ev-btn ev-btn--live', { en: '▶ Watch live', te: '▶ ప్రత్యక్షంగా చూడండి' });
    else if (st === 'done' && rec) actions += playLink(rec, 'ev-btn', { en: '▶ Watch', te: '▶ చూడండి' });
    if (s.poster) actions += '<a class="ev-btn ev-btn--ghost" href="' + esc(s.poster) + '" target="_blank" rel="noopener">' + bi({ en: 'Poster', te: 'పోస్టర్' }) + '</a>';
    if (s.photos && s.photos.length) actions += '<span class="ev-count">📷 ' + s.photos.length + '</span>';
    var details = [];
    if (t) details.push(bi(t));
    if (s.speaker) details.push(bi(s.speaker));
    if (!t && !s.speaker && st !== 'done') details.push('<em>' + bi({ en: 'Details coming soon', te: 'వివరాలు త్వరలో' }) + '</em>');
    return '<li class="ev-day ev-day--' + st + '"' + (hide ? ' hidden' : '') + '>' +
             '<div class="ev-day__main"><strong>' + bi(s.label) + '</strong>' +
             '<span class="ev-day__date">' + bi(fmtDate(s.date)) + '</span></div>' +
             '<div class="ev-day__detail">' + details.join('<span class="ev-dot">·</span>') + '</div>' +
             '<div class="ev-day__right">' + chip(CHIP[st]) + actions + '</div>' +
             (s.collage ? '<a class="ev-collage" href="' + esc(s.collage) + '" target="_blank" rel="noopener">' +
                '<span class="ev-collage__label">' + bi({ en: 'Highlights', te: 'ముఖ్య దృశ్యాలు' }) + '</span>' +
                '<img src="' + esc(s.collage) + '" alt="" loading="lazy"></a>' : '') +
             photosBlock(s.photos) +
           '</li>';
  }

  /* One picture per program card. It shows the poster of the session that matters
     right now and doubles as the video player:
       live session            → its poster, ▶ plays the live stream
       happening now / today   → its poster
       next upcoming (poster)  → its poster
       latest finished         → its poster, ▶ plays its recording
       nothing per-session     → program poster, ▶ plays the latest recording            */
  // returns { src, x (focus session), yt (YouTube id to play), url (YouTube link) }
  function mediaFor(p, info) {
    var ss = info.ss;
    // a finished multi-day program: its own poster, ▶ plays the whole playlist (or Day 1)
    if (isArchive(p, info)) {
      var firstRec = null;
      for (var i = 0; i < ss.length && !firstRec; i++) firstRec = recording(ss[i].s);
      return p.playlist
        ? { src: p.poster, x: null, yt: 'list:' + p.playlist, url: 'https://www.youtube.com/playlist?list=' + p.playlist, archive: true }
        : { src: p.poster, x: null, yt: ytId(firstRec), url: firstRec, archive: true };
    }
    var pick = function (xs) { for (var i = 0; i < xs.length; i++) if (xs[i].s.poster) return xs[i]; return null; };
    var doneDesc = ss.filter(function (x) { return x.st === 'done'; }).reverse();
    var live = ss.filter(function (x) { return x.st === 'live'; })[0];
    if (live) {
      var fallback = pick(doneDesc);
      return { src: live.s.poster || (fallback && fallback.s.poster) || p.poster, x: live,
               yt: ytId(live.s.live), url: live.s.live };
    }
    var cur = pick(ss.filter(function (x) { return x.st === 'now' || x.st === 'today'; })) ||
              pick(ss.filter(function (x) { return x.st === 'upcoming'; })) || pick(doneDesc);
    if (cur) {
      var rec = cur.st === 'done' ? recording(cur.s) : null;
      return { src: cur.s.poster, x: cur, yt: ytId(rec), url: rec };
    }
    var lastRec = doneDesc.filter(function (x) { return recording(x.s); })[0];
    var r = lastRec ? recording(lastRec.s) : null;
    return { src: p.poster, x: lastRec || null, yt: ytId(r), url: r };
  }

  var ICON_YT = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="#FF0000" d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8z"/><path fill="#fff" d="M9.6 15.6 15.8 12 9.6 8.4z"/></svg>';
  var ICON_WA = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3a.4.4 0 0 0 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3z"/></svg>';
  // public counts per program (from js/site.js → site-stats.json); shown once views ≥ PROGRAM_MIN_VIEWS
  var STATS = window.HSPH_STATS || null;
  var PROGRAM_MIN_VIEWS = 1;            // show real counts from the first view
  document.addEventListener('hsph-stats', function (e) { STATS = e.detail; if (EVENTS.length) render(); });
  function fmtN(n) { return Number(n).toLocaleString('en-IN'); }
  function statsLine(p) {
    var s = STATS && STATS.programs && STATS.programs[p.id];
    if (!s || (s.views || 0) < PROGRAM_MIN_VIEWS) return '';
    var shares = s.shares || 0;
    var v = s.views || 0;
    return '<li class="ev-stats">👁 ' + bi({ en: fmtN(v) + (v === 1 ? ' view' : ' views'), te: fmtN(v) + ' వీక్షణలు' }) +
      (shares ? '<span class="ev-dot">·</span>💬 ' + bi({ en: fmtN(shares) + (shares === 1 ? ' WhatsApp share' : ' WhatsApp shares'), te: fmtN(shares) + ' WhatsApp షేర్లు' }) : '') + '</li>';
  }

  var CHANNEL = 'https://www.youtube.com/@pastorpmoses';
  var SITE = 'https://holyspiritprayerhouse.com/events.html';

  function isArchive(p, info) { return info.state === 'past' && p.sessions.length > 1; }
  function dayCount(info) { var d = {}; info.ss.forEach(function (x) { d[x.s.date] = 1; }); return Object.keys(d).length; }

  // picture with everything on it: status badge, ▶, and a caption strip (session · time · speaker)
  function mediaBlock(p, m, info, total) {
    var x = m.x, st = x ? x.st : info.state;
    var badge = x && st !== 'done' ? chip(CHIP[st]) : chip(PSTATE[info.state]);
    var cap = '';
    if (m.archive) {
      var nd = dayCount(info);
      cap = '<div class="ev-media__cap">' +
              '<strong>' + bi({ en: nd + ' days · ' + total + ' sessions', te: nd + ' రోజులు · ' + total + ' కూడికలు' }) + '</strong>' +
              '<span>' + bi(fmtRange(info.first, info.last)) + '</span>' +
              (m.yt ? '<span>▶ ' + bi({ en: 'Every session on YouTube', te: 'అన్ని కూడికలు YouTube లో' }) + '</span>' : '') +
            '</div>';
    } else if (x) {
      var t = fmtTime(x.s.time), when = [];
      if (total > 1) when.push(bi(fmtDate(x.s.date)));
      if (t) when.push(bi(t));
      cap = '<div class="ev-media__cap">' +
              '<strong>' + bi(x.s.label) + '</strong>' +
              (when.length ? '<span>' + when.join(' · ') + '</span>' : '') +
              (x.s.speaker ? '<span>🎤 ' + bi(x.s.speaker) + '</span>' : '') +
            '</div>';
    }
    var inner = '<img src="' + esc(m.src) + '" alt="">' + (m.yt ? '<span class="ev-video__play" aria-hidden="true"></span>' : '') + badge + cap;
    return m.yt
      ? '<div class="ev-media" data-yt="' + m.yt + '" role="button" tabindex="0" aria-label="Play video">' + inner + '</div>'
      : '<div class="ev-media"><a class="ev-media__link" href="' + esc(m.src) + '" target="_blank" rel="noopener" aria-label="Open poster"></a>' + inner + '</div>';
  }

  // one row of actions under the picture: Watch here · YouTube · Share on WhatsApp
  function actionsBlock(p, m) {
    var x = m.x, live = x && x.st === 'live', html = '';
    var list = m.yt && m.yt.indexOf('list:') === 0;
    if (m.yt) html += '<button type="button" class="ev-act ev-act--play" data-play-yt="' + m.yt + '">' +
      bi(live ? { en: '▶ Watch live here', te: '▶ ఇక్కడే ప్రత్యక్షంగా చూడండి' }
         : list ? { en: '▶ Watch all days', te: '▶ అన్ని రోజులు చూడండి' }
         : { en: '▶ Watch here', te: '▶ ఇక్కడే చూడండి' }) + '</button>';
    html += '<a class="ev-act ev-act--yt" href="' + esc(m.url || CHANNEL) + '" target="_blank" rel="noopener">' + ICON_YT +
      bi(list ? { en: 'YouTube playlist', te: 'YouTube ప్లేలిస్ట్' } : m.url ? { en: 'YouTube', te: 'YouTube' } : { en: 'YouTube channel', te: 'YouTube ఛానల్' }) + '</a>';
    var lines = [p.title.te, p.title.en];
    if (x) {
      var t = fmtTime(x.s.time);
      lines.push(x.s.label.en + ' · ' + fmtDate(x.s.date).en + (t ? ' · ' + t.en : ''));
      if (x.s.speaker) lines.push(x.s.speaker.en);
    }
    if (p.place) lines.push(p.place.en);
    if (m.url) lines.push((live ? 'Watch live: ' : 'Watch: ') + m.url);
    lines.push(SITE + '#' + p.id);
    html += '<a class="ev-act ev-act--wa" href="https://wa.me/?text=' + encodeURIComponent(lines.join('\n')) +
      '" target="_blank" rel="noopener">' + ICON_WA + bi({ en: 'Share on WhatsApp', te: 'WhatsApp లో పంపండి' }) + '</a>';
    return '<div class="ev-actions">' + html + '</div>';
  }

  function programCard(p, now) {
    var info = programInfo(p, now), total = p.sessions.length;
    var media = mediaFor(p, info);
    // progress counts DAYS (a day can hold morning + night sessions); a day is
    // complete when all its sessions are done
    var dayDone = {};
    info.ss.forEach(function (x) { dayDone[x.s.date] = (dayDone[x.s.date] !== false) && x.st === 'done'; });
    var days = Object.keys(dayDone), daysDone = days.filter(function (d) { return dayDone[d]; }).length;
    var pct = Math.round(daysDone / days.length * 100);
    var progress = days.length > 1
      ? '<div class="ev-progress"><div class="ev-progress__bar"><span style="width:' + pct + '%"></span></div>' +
        '<span class="ev-progress__txt">' + bi({ en: daysDone + ' of ' + days.length + ' days completed', te: days.length + ' రోజులలో ' + daysDone + ' పూర్తయ్యాయి' }) + '</span></div>'
      : '';
    return '<article class="ev-program ev-program--' + info.state + '" id="' + esc(p.id) + '">' +
      '<div class="ev-program__top">' +
        '<div class="ev-program__left">' + mediaBlock(p, media, info, total) + actionsBlock(p, media) + '</div>' +
        '<div class="ev-program__info">' +
          (p.tagline ? '<span class="section-eyebrow">' + bi(p.tagline) + '</span>' : '') +
          '<h3 class="ev-program__title">' + bi(p.title) + '</h3>' +
          '<ul class="ev-meta">' +
            '<li>📅 ' + bi(fmtRange(info.first, info.last)) + '</li>' +
            (total === 1 && p.sessions[0].time ? '<li>🕙 ' + bi(fmtTime(p.sessions[0].time)) + '</li>' : '') +
            (p.place ? '<li>📍 ' + bi(p.place) + '</li>' : '') +
            (p.hosts ? '<li>🎤 ' + bi(p.hosts) + '</li>' : '') +
            statsLine(p) +
          '</ul>' + (isArchive(p, info) ? preachersBlock(info) : progress) +
          (p.verse ? '<p class="ev-verse">' + bi(p.verse) + '</p>' : '') +
        '</div>' +
      '</div>' + (isArchive(p, info) ? archiveList(p, info) : daysList(p, info)) +
    '</article>';
  }

  // finished program: everyone who preached — church family first (Bishop → Billy Graham → Esthar Roj →
  // Benson → Praneed), then guests in order of first appearance
  var FAMILY = [/Bishop P\. Moses/i, /Billy ?Graham/i, /Esth/i, /Benson/i, /Praneed/i];
  function famRank(sp) { for (var i = 0; i < FAMILY.length; i++) if (FAMILY[i].test(sp.en)) return i; return FAMILY.length; }
  function preachersBlock(info) {
    var seen = {}, list = [];
    info.ss.forEach(function (x) { var sp = x.s.speaker; if (sp && !seen[sp.en]) { seen[sp.en] = 1; list.push(sp); } });
    list = list.map(function (sp, i) { return { sp: sp, i: i, r: famRank(sp) }; })
      .sort(function (a, b) { return a.r - b.r || a.i - b.i; }).map(function (o) { return o.sp; });
    if (!list.length) return '';
    return '<div class="ev-preachers"><span class="ev-preachers__title">' + bi({ en: 'Preachers', te: 'దైవజనులు' }) + '</span>' +
      '<ul>' + list.map(function (sp) { return '<li>' + bi(sp) + '</li>'; }).join('') + '</ul></div>';
  }

  // finished program: Day 1 → last day, one row per day with its Morning / Night side by side
  function archiveList(p, info) {
    var days = [], idx = {};
    info.ss.forEach(function (x) {
      var d = x.s.date;
      if (!(d in idx)) { idx[d] = days.length; days.push([]); }
      days[idx[d]].push(x);
    });
    var rows = days.map(function (g) {
      var lab = g[0].s.label, te = lab.te.split(' ');
      var day = { en: lab.en.split(' · ')[0], te: te.length > 2 ? te.slice(0, -1).join(' ') : lab.te };
      var slots = g.map(function (x) {
        var s = x.s, part = s.label.en.split(' · ')[1], tt = s.label.te.split(' '), rec = recording(s), t = fmtTime(s.time);
        var when = part ? bi({ en: part, te: tt.length > 2 ? tt[tt.length - 1] : part }) : '';
        return '<div class="ev-slot">' +
          '<span class="ev-slot__when">' + when + (t ? '<small>' + bi(t) + '</small>' : '') + '</span>' +
          '<span class="ev-slot__who">' + (s.speaker ? bi(s.speaker) : '') + '</span>' +
          '<span class="ev-slot__act">' +
            (rec ? playLink(rec, 'ev-btn', { en: '▶ Watch', te: '▶ చూడండి' }) : '') +
            (s.poster ? '<a class="ev-btn ev-btn--ghost" href="' + esc(s.poster) + '" target="_blank" rel="noopener">' + bi({ en: 'Poster', te: 'పోస్టర్' }) + '</a>' : '') +
            (s.collage ? '<a class="ev-btn ev-btn--ghost" href="' + esc(s.collage) + '" target="_blank" rel="noopener">📷 ' + bi({ en: 'Highlights', te: 'దృశ్యాలు' }) + '</a>' : '') +
          '</span></div>';
      }).join('');
      var photos = [];
      g.forEach(function (x) { if (x.s.photos) photos = photos.concat(x.s.photos); });
      return '<li class="ev-arch">' +
          '<div class="ev-arch__day"><strong>' + bi(day) + '</strong><span class="ev-day__date">' + bi(fmtDate(g[0].s.date)) + '</span></div>' +
          '<div class="ev-arch__slots">' + slots + '</div>' + photosBlock(photos) +
        '</li>';
    }).join('');
    return '<div class="ev-schedule"><h4 class="ev-group">' + bi({ en: 'Day-by-day schedule', te: 'రోజువారీ కార్యక్రమం' }) + '</h4>' +
      '<ol class="ev-arch-list">' + rows + '</ol></div>';
  }

  // Days grouped by status so what matters now is always on top:
  //   Happening now / Today  →  Coming up (date order)  →  Completed (newest first)
  // Until "Show all days" is tapped, only the next few upcoming and latest few
  // completed days are shown.
  var COMPLETED_SHOWN = 3;
  function daysList(p, info) {
    var open = !!expanded[p.id], hiddenCount = 0, total = info.ss.length;
    if (total === 1) return '<ol class="ev-days">' + dayRow(info.ss[0], false) + '</ol>';

    var nowRows = info.ss.filter(function (x) { return x.st === 'live' || x.st === 'now' || x.st === 'today'; });
    var upRows = info.ss.filter(function (x) { return x.st === 'upcoming'; });
    var doneRows = info.ss.filter(function (x) { return x.st === 'done'; }).reverse();

    function group(rows, title, limit) {
      if (!rows.length) return '';
      var html = rows.map(function (x, i) {
        var hide = !open && limit != null && i >= limit;
        if (hide) hiddenCount++;
        return dayRow(x, hide);
      }).join('');
      return '<h4 class="ev-group">' + bi(title) + '</h4><ol class="ev-days">' + html + '</ol>';
    }
    var hasLive = nowRows.some(function (x) { return x.st === 'live' || x.st === 'now'; });
    var out =
      group(nowRows, hasLive ? { en: 'Happening now', te: 'ఇప్పుడు జరుగుతోంది' } : { en: 'Today', te: 'ఈ రోజు' }, null) +
      group(upRows, { en: 'Coming up', te: 'రాబోయేవి' }, UPCOMING_SHOWN) +
      group(doneRows, { en: 'Completed', te: 'పూర్తయినవి' }, COMPLETED_SHOWN);

    var btn = '';
    if (hiddenCount || open) {
      btn = '<button type="button" class="ev-more" data-ev-more="' + esc(p.id) + '" aria-expanded="' + open + '">' +
        (open ? bi({ en: 'Show fewer days', te: 'తక్కువ రోజులు చూపించు' })
              : bi({ en: 'Show full schedule', te: 'పూర్తి షెడ్యూల్ చూపించు' })) + '</button>';
    }
    return '<div class="ev-schedule">' + out + '</div>' + btn;
  }

  function liveBanner(now) {
    var items = [];
    EVENTS.forEach(function (p) {
      p.sessions.forEach(function (s) {
        if (sessionStatus(s, now) === 'live') items.push({ p: p, s: s });
      });
    });
    if (!items.length) return '';
    return items.map(function (it) {
      return '<div class="ev-live-banner"><div class="container ev-live-banner__inner">' +
        '<span class="ev-live-banner__dot" aria-hidden="true"></span>' +
        '<span class="ev-live-banner__txt"><strong>' + bi({ en: 'LIVE NOW', te: 'ప్రత్యక్ష ప్రసారం' }) + '</strong> ' +
        bi(it.p.title) + ' · ' + bi(it.s.label) + '</span>' +
        '<a class="btn btn-gold" href="' + esc(it.s.live) + '" target="_blank" rel="noopener">' + bi({ en: '▶ Watch live', te: '▶ చూడండి' }) + '</a>' +
        '</div></div>';
    }).join('');
  }

  /* ---------- render ---------- */
  // preview helper: events.html?evnow=2026-10-12T19:30+05:30 shows the page as at that moment
  var override = (location.search.match(/[?&]evnow=([^&]+)/) || [])[1];
  var overrideMs = override ? Date.parse(decodeURIComponent(override)) : NaN;
  function render() {
    var now = isNaN(overrideMs) ? Date.now() : overrideMs;
    var banner = document.getElementById('hsph-live-banner');
    if (banner) banner.innerHTML = liveBanner(now);

    var cur = document.getElementById('ev-current'), rec = document.getElementById('ev-recent');
    if (!cur && !rec) return;
    var current = [], past = [];
    EVENTS.forEach(function (p) { (programInfo(p, now).state === 'past' ? past : current).push(p); });
    // live programs first, then in progress, then upcoming; earliest start first within each
    var RANK = { live: 0, ongoing: 1, upcoming: 2 };
    current.sort(function (a, b) {
      var ra = RANK[programInfo(a, now).state], rb = RANK[programInfo(b, now).state];
      if (ra !== rb) return ra - rb;
      return a.sessions[0].date < b.sessions[0].date ? -1 : 1;
    });
    past.sort(function (a, b) { return a.sessions[a.sessions.length - 1].date > b.sessions[b.sessions.length - 1].date ? -1 : 1; });

    if (cur) {
      cur.innerHTML = current.length ? current.map(function (p) { return programCard(p, now); }).join('')
        : '<p class="ev-empty">' + bi({ en: 'New programs will be announced here soon.', te: 'కొత్త కార్యక్రమాలు త్వరలో ఇక్కడ ప్రకటించబడతాయి.' }) + '</p>';
    }
    if (rec) {
      var sec = rec.closest('section');
      if (sec) sec.hidden = !past.length;
      rec.innerHTML = past.map(function (p) { return programCard(p, now); }).join('');
    }
    observePrograms();
  }

  // ── "program_view": a program card was at least half on screen (counted once per visit)
  var viewedPrograms = {}, viewObserver = null;
  function observePrograms() {
    if (!('IntersectionObserver' in window)) return;
    if (viewObserver) viewObserver.disconnect();
    viewObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var id = en.target.id;
        if (en.isIntersecting && id && !viewedPrograms[id]) {
          viewedPrograms[id] = true;
          if (typeof window.gtag === 'function') window.gtag('event', 'program_view', { program: id, page: location.pathname });
          viewObserver.unobserve(en.target);
        }
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('.ev-program').forEach(function (el) { if (!viewedPrograms[el.id]) viewObserver.observe(el); });
  }

  // ── Google Analytics click counting (anonymous). Shows in GA → Reports → Engagement → Events.
  function track(name, el, extra) {
    if (typeof window.gtag !== 'function') return;
    var card = el.closest && el.closest('.ev-program');
    var params = { program: card ? card.id : 'banner', page: location.pathname };
    for (var k in extra) params[k] = extra[k];
    window.gtag('event', name, params);
  }
  document.addEventListener('click', function (e) {
    var el = e.target.closest && e.target.closest('a, button, .ev-media[data-yt]');
    if (!el) return;
    if (el.closest('.ev-live-banner'))                   track('live_banner_click', el, {});
    else if (el.classList.contains('ev-act--play'))      track('watch_here_click', el, { video: el.getAttribute('data-play-yt') });
    else if (el.classList.contains('ev-act--yt'))        track('youtube_click', el, { url: el.href });
    else if (el.classList.contains('ev-act--wa'))        track('whatsapp_share_click', el, {});
    else if (el.classList.contains('ev-media'))          track('poster_play_click', el, { video: el.getAttribute('data-yt') });
    else if (el.hasAttribute('data-play-yt'))            track('day_watch_click', el, { video: el.getAttribute('data-play-yt') });
    else if (el.classList.contains('ev-more'))           track('show_schedule_click', el, {});
  }, true);

  // Click-to-play YouTube inside the card's top picture (the heavy player loads only
  // when asked). "Watch" buttons play there too instead of adding a second picture.
  function playIn(box, id) {
    if (box.dataset.playing === id) return;
    box.dataset.playing = id;
    var src = id.indexOf('list:') === 0
      ? 'https://www.youtube-nocookie.com/embed/videoseries?list=' + id.slice(5) + '&autoplay=1&rel=0'   // whole playlist
      : 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
    box.innerHTML = '<iframe src="' + src + '" title="Video" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>';
  }
  document.addEventListener('click', function (e) {
    if (!e.target.closest) return;
    var more = e.target.closest('[data-ev-more]');
    if (more) { var pid = more.getAttribute('data-ev-more'); expanded[pid] = !expanded[pid]; render(); return; }
    var link = e.target.closest('[data-play-yt]');
    if (link && !(e.ctrlKey || e.metaKey || e.shiftKey)) {
      var card = link.closest('.ev-program'), box = card && card.querySelector('.ev-media');
      if (box) {
        e.preventDefault();
        playIn(box, link.getAttribute('data-play-yt'));
        box.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    var media = e.target.closest('.ev-media[data-yt]');
    if (media) { e.preventDefault(); playIn(media, media.getAttribute('data-yt')); }
  });
  document.addEventListener('keydown', function (e) {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('.ev-media[data-yt]')) {
      e.preventDefault(); playIn(e.target, e.target.getAttribute('data-yt'));
    }
  });

  // Load the program data fresh (GitHub Pages lets browsers cache files for 10 min,
  // which would delay live links). The minute-stamp keeps it at most ~1 min old.
  function start() {
    EVENTS = window.HSPH_EVENTS || [];
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render); else render();
    // refresh statuses every minute (Upcoming → Live → Completed) without reloading,
    // but never while a video is playing
    setInterval(function () { if (!document.querySelector('.ev-media[data-playing]')) render(); }, 60000);
  }
  if (window.HSPH_EVENTS) { start(); }
  else {
    var tag = document.createElement('script');
    tag.src = 'js/events-data.js?t=' + Math.floor(Date.now() / 60000);
    tag.onload = start; tag.onerror = start;
    document.head.appendChild(tag);
  }
})();
