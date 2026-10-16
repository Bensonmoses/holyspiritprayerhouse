// Video cards: show a thumbnail first, load the YouTube player only when tapped (keeps pages fast).
// Without JavaScript the thumbnail is a normal link to YouTube.
(function () {
  document.addEventListener('click', function (e) {
    var link = e.target.closest && e.target.closest('a.vthumb[data-yt]');
    if (!link || e.ctrlKey || e.metaKey || e.shiftKey) return;
    e.preventDefault();
    var id = link.getAttribute('data-yt');
    var start = parseInt(link.getAttribute('data-start') || '0', 10);
    var box = document.createElement('div');
    box.className = 'vthumb';
    var f = document.createElement('iframe');
    f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0&modestbranding=1' + (start ? '&start=' + start : '');
    f.title = link.getAttribute('aria-label') || 'YouTube video';
    f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    f.setAttribute('allowfullscreen', '');
    box.appendChild(f);
    link.replaceWith(box);
    if (typeof gtag === 'function') gtag('event', 'video_play', { video_id: id, page: location.pathname });
  });
})();
