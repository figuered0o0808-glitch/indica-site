/* INDICA — navegação e filtros. Todo o conteúdo continua legível sem JavaScript. */
(function () {
  'use strict';
  var menu = document.querySelector('.menu-toggle');
  var nav = document.getElementById('main-nav');
  function closeMenu() {
    if (!menu || !nav) return;
    nav.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', menu.dataset.open);
  }
  if (menu && nav) {
    menu.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      menu.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-label', open ? menu.dataset.close : menu.dataset.open);
    });
    nav.querySelectorAll('a').forEach(function (link) { link.addEventListener('click', closeMenu); });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); menu.focus(); }
    });
    document.addEventListener('click', function (event) {
      if (nav.classList.contains('open') && !nav.contains(event.target) && !menu.contains(event.target)) closeMenu();
    });
  }
  var filters = document.querySelectorAll('[data-filter]');
  var projects = document.querySelectorAll('.project-row');
  var count = document.getElementById('work-count');
  var empty = document.querySelector('.filter-empty');
  function filterWork(value) {
    var visible = 0;
    projects.forEach(function (project) {
      var matches = value === 'all' || project.dataset.axis === value;
      project.hidden = !matches;
      if (matches) visible += 1;
    });
    filters.forEach(function (button) { button.setAttribute('aria-pressed', String(button.dataset.filter === value)); });
    if (count) count.textContent = visible;
    if (empty) empty.hidden = visible !== 0;
  }
  filters.forEach(function (button) {
    button.addEventListener('click', function () {
      filterWork(button.dataset.filter);
      var url = new URL(location.href);
      if (button.dataset.filter === 'all') url.searchParams.delete('eixo');
      else url.searchParams.set('eixo', button.dataset.filter);
      history.replaceState(null, '', url.pathname + url.search + url.hash);
    });
  });
  var selectedAxis = new URLSearchParams(location.search).get('eixo');
  if (selectedAxis && ['democracia', 'ciencia', 'meio-ambiente'].includes(selectedAxis) && projects.length) filterWork(selectedAxis);
  if (new URLSearchParams(location.search).get('enviado') === '1') {
    var form = document.getElementById('contatoForm');
    var success = document.getElementById('formOk');
    if (form && success) { form.hidden = true; success.hidden = false; }
  }
  /* Âncoras da versão anterior continuam levando ao conteúdo correspondente. */
  var legacy = { democracia: 'democracia', ciencia: 'ciencia', 'meio-ambiente': 'meio-ambiente' };
  var hash = location.hash.slice(1);
  var english = document.documentElement.lang === 'en';
  if (legacy[hash] && !projects.length) location.replace((english ? '/en' : '') + '/trabalhos/?eixo=' + legacy[hash]);
  if (hash === 'producoes' && !document.getElementById('producoes')) location.replace((english ? '/en' : '') + '/trabalhos/#producoes');
  if (hash === 'rede' && !document.getElementById('rede')) location.replace((english ? '/en' : '') + '/a-indica/#rede');
})();
