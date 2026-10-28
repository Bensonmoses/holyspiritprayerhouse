/* books.html: shelf of books (from js/books-data.js) + chapter reader (?book=<slug>&ch=<n>). */
(function () {
  const books = window.HSPH_BOOKS || [];
  const $ = id => document.getElementById(id);
  const esc = s => String(s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const bi = o => o ? `<span class="english-text">${esc(o.en)}</span><span class="telugu-text">${esc(o.te || o.en)}</span>` : '';
  const q = new URLSearchParams(location.search);
  const book = books.find(b => b.slug === q.get('book'));

  function cover(b) {
    return `<a class="bk-card" href="books.html?book=${encodeURIComponent(b.slug)}">
      <div class="bk-cover"><span class="bk-cover__cross">✝</span><span class="bk-cover__title">${bi(b.title)}</span><span class="bk-cover__author">${bi(b.author)}</span></div>
      <div class="bk-card__body"><h3>${bi(b.title)}</h3><p>${bi(b.blurb)}</p>
        <span class="btn btn--primary">${bi({ en: 'Read now', te: 'ఇప్పుడే చదవండి' })}</span></div></a>`;
  }

  function shelf() {
    $('bk-shelf').innerHTML = books.length ? books.map(cover).join('') :
      `<div class="bk-empty"><span class="bk-empty__icon">📖</span>
        <h3>${bi({ en: 'Our first book is coming soon', te: 'మా మొదటి పుస్తకం త్వరలో రాబోతుంది' })}</h3>
        <p>${bi({ en: 'Books written from the messages and prayers of Holy Spirit Prayer House (IPC), free to read here.', te: 'హోలీ స్పిరిట్ ప్రేయర్ హౌస్ (IPC) సందేశాలు, ప్రార్థనల నుండి వ్రాసిన పుస్తకాలు – ఇక్కడ ఉచితంగా చదవండి.' })}</p></div>`;
  }

  function reader(b) {
    const n = Math.min(Math.max(parseInt(q.get('ch') || '0', 10) || 0, 0), b.chapters.length);
    $('bk-shelf-sec').hidden = true; $('bk-reader').hidden = false;
    document.title = `${b.title.en} | Holy Spirit Prayer House (IPC)`;
    const toc = b.chapters.map((c, i) => `<li><a href="books.html?book=${encodeURIComponent(b.slug)}&ch=${i + 1}"${i + 1 === n ? ' aria-current="page"' : ''}>${i + 1}. ${bi(c.title)}</a></li>`).join('');
    let main;
    if (!n) {
      main = `<div class="bk-intro"><h1>${bi(b.title)}</h1><p class="bk-author">${bi(b.author)}</p><p>${bi(b.blurb)}</p>
        <div class="bk-actions"><a class="btn btn--primary" href="books.html?book=${encodeURIComponent(b.slug)}&ch=1">${bi({ en: 'Start reading', te: 'చదవడం ప్రారంభించండి' })}</a>
        ${b.pdf ? `<a class="btn btn--outline" href="${esc(b.pdf)}" download>${bi({ en: 'Download PDF', te: 'PDF డౌన్‌లోడ్' })}</a>` : ''}</div></div>`;
    } else {
      const c = b.chapters[n - 1];
      const share = encodeURIComponent(`${c.title.te || c.title.en} – ${b.title.te || b.title.en}\n${location.href}`);
      main = `<article class="bk-chapter"><span class="section-eyebrow">${bi({ en: `Chapter ${n}`, te: `అధ్యాయం ${n}` })}</span>
        <h1>${bi(c.title)}</h1>${c.verse ? `<blockquote class="bk-verse">${bi(c.verse)}</blockquote>` : ''}
        ${(c.body || []).map(p => `<p>${bi(p)}</p>`).join('')}
        ${c.video ? `<a class="vthumb" data-yt="${esc(c.video.id)}" data-start="${+c.video.start || 0}" aria-label="Watch this message"
          href="https://www.youtube.com/watch?v=${esc(c.video.id)}&t=${+c.video.start || 0}s" target="_blank" rel="noopener">
          <img src="https://i.ytimg.com/vi/${esc(c.video.id)}/hqdefault.jpg" alt="" loading="lazy"></a>` : ''}
        <div class="bk-actions">
          ${n > 1 ? `<a class="btn btn--outline" href="books.html?book=${encodeURIComponent(b.slug)}&ch=${n - 1}">← ${bi({ en: 'Previous', te: 'మునుపటి' })}</a>` : ''}
          ${n < b.chapters.length ? `<a class="btn btn--primary" href="books.html?book=${encodeURIComponent(b.slug)}&ch=${n + 1}">${bi({ en: 'Next chapter', te: 'తదుపరి అధ్యాయం' })} →</a>` : ''}
          <a class="btn btn--outline" href="https://wa.me/?text=${share}" target="_blank" rel="noopener">${bi({ en: 'Share on WhatsApp', te: 'వాట్సాప్‌లో పంపండి' })}</a>
        </div></article>`;
    }
    $('bk-reader').innerHTML = `<div class="container bk-layout"><aside class="bk-toc"><a class="bk-back" href="books.html">← ${bi({ en: 'All books', te: 'అన్ని పుస్తకాలు' })}</a>
      <h2>${bi(b.title)}</h2><ol>${toc}</ol></aside><div class="bk-main">${main}</div></div>`;
  }

  if (book) reader(book); else shelf();
})();
