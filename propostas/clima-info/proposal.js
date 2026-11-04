(function () {
  'use strict';
  var bar = document.getElementById('proposal-progress');
  var frame = 0;
  function paint() {
    frame = 0;
    var length = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.transform = 'scaleX(' + (length > 0 ? Math.min(1, window.scrollY / length) : 0) + ')';
  }
  function update() { if (!frame) frame = requestAnimationFrame(paint); }
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  paint();
  var links = Array.prototype.slice.call(document.querySelectorAll('.p-chapter-link'));
  if (window.IntersectionObserver) {
    var visible = new Map();
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { visible.set(entry.target.id, entry.isIntersecting); });
      var selected = links.find(function (link) { return visible.get(link.hash.slice(1)); });
      links.forEach(function (link) {
        if (link === selected) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-100px 0px -45% 0px', threshold: 0 });
    links.forEach(function (link) { var section = document.getElementById(link.hash.slice(1)); if (section) observer.observe(section); });
  }
})();
