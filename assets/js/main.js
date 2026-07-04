/* ============ INDICA — vitrine ============ */
(function () {
  'use strict';

  /* ---------- i18n (EN dictionary; PT lives in the HTML) ---------- */
  var EN = {
    'nav.about': 'About', 'nav.work': 'Our work', 'nav.productions': 'Productions',
    'nav.pubs': 'Publications', 'nav.network': 'Network', 'nav.cta': 'Get in touch',
    'pubs.kicker': 'Our publications',
    'pubs.h2': "INDICA also<br>generates <span class='b'>knowledge</span>.",
    'pubs.lead': 'Beyond campaigns and productions, we publish articles and reports on the influence ecosystem, communication and public opinion.',
    'pubs.a.tag': 'Articles', 'pubs.a.t': 'Analyses and essays',
    'pubs.a.d': 'Reflections on digital influence, democracy, science and climate — from those who operate the market from within.',
    'pubs.r.tag': 'Reports', 'pubs.r.t': 'Data and diagnostics',
    'pubs.r.d': 'Campaign measurement and readings of the influence ecosystem, with our own methodology.',
    'pubs.cta.tag': 'Subscribe', 'pubs.cta.t': 'Want to receive our publications?',
    'pubs.cta.d': 'Get in touch →',
    'hero.lead': "Through the influence market, we stand up for <b class='t--green'>science</b>, <b class='t--blue'>democracy</b> and the <b class='t--pink'>environment</b>. We connect creators, data and narrative to move public opinion around what matters.",
    'hero.cta1': 'Start a project', 'hero.cta2': 'Our work',
    'stats.views': 'views', 'stats.influencers': 'influencers', 'stats.followers': 'followers in the network',
    'about.kicker': 'Who we are',
    'about.h2': "An agency born on social<br>media, driven by <span class='b'>causes</span>.",
    'about.lead': 'Founded in 2024, INDICA develops communication strategies focused on producing relevant content and engaging different audiences. We combine influence know-how, data analysis and audiovisual production to turn complex issues into narratives that circulate.',
    'team.francisco': 'Science communicator and digital strategist. An economist (UFRJ), he researches the economics of digital influencers.',
    'team.caio': 'Lawyer and digital communicator, working across geopolitics, economics and the Brazilian State.',
    'team.grp.direcao': 'Leadership', 'team.grp.projetos': 'Projects',
    'team.grp.campanhas': 'Campaigns', 'team.grp.av': 'Audiovisual',
    'role.direcao': 'Leadership', 'role.coord': 'Project Coordinator', 'role.assistproj': 'Project Assistant',
    'role.assistcamp': 'Campaign Assistant', 'role.av': 'Audiovisual',
    'team.artur': 'Public manager (IPPUR/UFRJ) and political strategist. Executive secretary of Núcleo Ypykuéra and founding partner of INDICA.',
    'team.lauanny': 'Political strategist with over 5 years in communication management. Law student at UFRJ, researching public policy and government relations.',
    'team.pedro': 'Geographer (UFRJ), researcher, scriptwriter and project manager.',
    'team.gabriel': "Researcher and educator. Biologist (UFRJ) with a master's from UERJ, he studies mechanisms for biodiversity conservation.",
    'team.cristal': "Biologist and master's student in Geosciences at UERJ, working on climate change and smart cities, with a focus on urban climatology and climate justice.",
    'team.milena': 'Law student at UNIRIO researching environmental licensing. Works as a campaign assistant in digital communication.',
    'team.matheus': 'Video editor, motion designer and graphic designer, specialized in audiovisual production and visual communication for digital media.',
    'scene.kicker': 'Why influence matters',
    'scene.h2': "Brazil decides<br>on <span class='b'>social media</span>.",
    'scene.lead': 'Digital platforms have become the main gateway to news and content of public interest. The trust placed in creators reveals the strategic potential of influence marketing.',
    'scene.s1': 'of Brazilians access news daily through digital platforms.',
    'scene.s2': 'use social media as their main source of political information.',
    'scene.s3': 'Brazilians are present on social media.',
    'scene.s4': 'use WhatsApp frequently in their daily lives.',
    'scene.s5': 'believe social media influences public opinion.',
    'scene.s6': 'have made purchases after recommendations on social media.',
    'scene.source': 'Source: Quaest/2025 survey and the Influence.me/2026 Digital Influencers Report.',
    'work.kicker': 'Our work',
    'work.h2': "Three pillars,<br>one <span class='b'>strategy</span>.",
    'work.lead': 'We structure our work around three fronts of public impact. Each pillar has its own language, communicators and identity. Explore, in each one, campaigns we have executed for clients and partners.',
    'eixo.caseslabel': "Campaigns we've executed",
    'eixo.democracia.title': 'Democracy',
    'eixo.democracia.desc': 'Human rights, social justice and the fight against disinformation. We broaden access to reliable information and encourage civic participation through accessible, strategically distributed narratives.',
    'eixo.ciencia.title': 'Science',
    'eixo.ciencia.desc': 'Translating complex topics into accessible language. We bring society closer to scientific knowledge and strengthen engagement with outreach, research and innovation.',
    'eixo.meio.title': 'Environment',
    'eixo.meio.desc': 'Environmental and climate communication that connects projects and results to a broad audience. We mobilize audiences around the socio-environmental agenda with our own narrative and aesthetics.',
    'case.antifake': 'Fighting disinformation with far-reaching narrative — over 19 million organic views.',
    'case.ypykuera': 'A podcast on politics and democracy, gathering experts and leaders from the progressive field.',
    'case.influenciencia': "With Rio's Municipal Department of Science and Technology — over 10 million views.",
    'case.regulamentaai': 'Campaign for AI regulation in Brazil: 8 million organic views and 20k+ signatures.',
    'case.comite': 'An alliance of researchers and communicators defending science and qualified debate.',
    'case.secma': 'A video series on environment and climate that reached over 4 million people.',
    'case.pulitzer': 'Climate awareness: in-person event with 200+ people and 3.5 million views.',
    'case.oeco': 'Adapting environmental reporting to the native format of social media: 3 million views.',
    'case.cop30': 'A hub of influencers for climate mobilization toward COP30, in Belém.',
    'ui.more': 'View details →',
    'prod.kicker': 'Audiovisual productions',
    'prod.h2': "Full productions,<br>from script to <span class='b'>cut</span>.",
    'prod.lead': 'We develop podcasts and videocasts — our own and for partners — in formats that bring contemporary topics closer to new audiences.',
    'show.ppg': 'A videocast about the environment, in a conversational format that brings the public closer to environmental topics.',
    'show.almo': 'A videocast dedicated to reflections on art and philosophy, with a sensitive, authorial approach.',
    'show.alma': 'Popular culture and bohemian traditions, exploring their artistic and social expressions.',
    'show.ypykuera': 'A videocast on politics and democracy, gathering leaders and experts from the progressive field.',
    'serv.kicker': 'Our services',
    'serv.h2': "Integrated communication,<br>end to <span class='b'>end</span>.",
    'serv.1.t': 'Audiovisual Production',
    'serv.1.d': 'Original and on-demand content: institutional videos, documentary series, podcasts and pieces for social media and platforms.',
    'serv.2.t': 'Strategic Social Media Management',
    'serv.2.d': "Positioning, content calendar and community management driven by data and each client's goals.",
    'serv.3.t': 'Mobilization Campaigns',
    'serv.3.d': 'From goal-setting to influencer curation and measurement — campaigns that turn reach into action.',
    'serv.4.t': 'Infrastructure & Team',
    'serv.4.d': 'Our own studio and a multidisciplinary team — script, filming, editing, design and strategy — with full execution.',
    'net.kicker': 'Network of communicators',
    'net.h2': "+200 influencers.<br>One <span class='b'>purpose</span>.",
    'net.lead': 'Our roster of communicators adds up to more than 80 million followers, organized into thematic hubs — from Brazil and Latin America to Africa and India.',
    'net.hub1': 'combined followers across our network of communicators.',
    'net.hub2': 'countries where we have already worked, from Latin America to Africa and India.',
    'net.hub3': 'continents reached by our campaigns.',
    'part.kicker': 'Partners',
    'part.h2': "Who walks<br>with <span class='b'>us</span>.",
    'contact.h2': "Got a cause to set<br>in <span class='b'>motion</span>?",
    'contact.lead': 'Tell us what you want to communicate. INDICA designs the strategy, the production and the influence network — from briefing to measurement.',
    'footer.tag': 'Communication with purpose · Democracy · Science · Environment',
    'footer.copy': '© 2026 INDICA. All rights reserved.'
  };

  var currentLang = 'pt';
  var ptCache = new Map();
  var i18nEls = document.querySelectorAll('[data-i18n]');
  var langBtn = document.getElementById('lang');

  function applyLang(lang) {
    i18nEls.forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (!ptCache.has(el)) ptCache.set(el, el.innerHTML);
      if (lang === 'en') { if (EN[key] != null) el.innerHTML = EN[key]; }
      else { el.innerHTML = ptCache.get(el); }
    });
    currentLang = lang;
    document.documentElement.lang = (lang === 'en') ? 'en' : 'pt-BR';
    document.title = (lang === 'en') ? 'INDICA — Communication with purpose' : 'INDICA — Comunicação com propósito';
    if (langBtn) langBtn.querySelectorAll('[data-l]').forEach(function (s) {
      s.classList.toggle('on', s.getAttribute('data-l') === lang);
    });
    try { localStorage.setItem('indica_lang', lang); } catch (e) {}
  }

  if (langBtn) {
    langBtn.addEventListener('click', function () {
      applyLang(currentLang === 'en' ? 'pt' : 'en');
    });
  }
  var saved = null;
  try { saved = localStorage.getItem('indica_lang'); } catch (e) {}
  if (saved === 'en' || saved === 'pt') {
    applyLang(saved);
  } else {
    // primeira visita: detecta o idioma do navegador (não-PT => inglês)
    var navLang = (navigator.language || 'pt').toLowerCase();
    applyLang(navLang.indexOf('pt') === 0 ? 'pt' : 'en');
  }

  /* ---------- Motions (carinhas): fallback estático ---------- */
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) document.body.classList.add('no-motion');
  document.querySelectorAll('video').forEach(function (v) {
    v.addEventListener('error', function () { document.body.classList.add('no-motion'); });
    var src = v.querySelector('source');
    if (src) src.addEventListener('error', function () { document.body.classList.add('no-motion'); });
  });

  /* ---------- Nav: shadow on scroll ---------- */
  var nav = document.getElementById('nav');
  function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 30); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  var burger = document.getElementById('burger');
  var links = document.querySelector('.nav__links');
  burger.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  links.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      links.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Reveal on scroll (escalonado) ---------- */
  var pendingReveals = [].slice.call(document.querySelectorAll('.reveal'));
  function staggerDelay(el) {
    var sibs = [].filter.call(el.parentElement.children, function (c) {
      return c.classList && c.classList.contains('reveal');
    });
    var i = sibs.indexOf(el);
    return Math.min(i > 0 ? i * 85 : 0, 600);
  }
  function revealEl(el) {
    var d = staggerDelay(el);
    el.style.transitionDelay = d + 'ms';
    el.classList.add('in');
    setTimeout(function () { el.style.transitionDelay = ''; }, d + 750);
  }
  function checkReveals() {
    if (!pendingReveals.length) return;
    var ih = window.innerHeight;
    var limit = ih > 0 ? ih * 0.92 : Infinity; // viewport indisponível: revela tudo
    pendingReveals = pendingReveals.filter(function (el) {
      if (el.getBoundingClientRect().top < limit) { revealEl(el); return false; }
      return true;
    });
  }

  /* ---------- Barra de progresso + scrollspy ---------- */
  var progress = document.getElementById('progress');
  var spyLinks = [].filter.call(document.querySelectorAll('.nav__links a'), function (a) {
    return a.getAttribute('href').charAt(0) === '#' && a.getAttribute('href') !== '#top';
  });
  var spyTargets = spyLinks.map(function (a) {
    return document.querySelector(a.getAttribute('href'));
  });
  function onScrollFx() {
    var doc = document.documentElement;
    var max = doc.scrollHeight - window.innerHeight;
    if (progress) progress.style.transform = 'scaleX(' + (max > 0 ? window.scrollY / max : 0) + ')';
    var current = -1;
    for (var i = 0; i < spyTargets.length; i++) {
      if (spyTargets[i] && spyTargets[i].getBoundingClientRect().top <= 120) current = i;
    }
    spyLinks.forEach(function (a, i) { a.classList.toggle('active', i === current); });
    checkReveals();
    checkCounters();
    // garante o loop da carinha rodando quando visível
    var cm = document.querySelector('.contato__motion');
    if (cm && cm.paused && !document.body.classList.contains('no-motion')) {
      var r = cm.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) { var p = cm.play(); if (p && p.catch) p.catch(function(){}); }
    }
  }
  window.addEventListener('scroll', onScrollFx, { passive: true });
  window.addEventListener('resize', onScrollFx, { passive: true });

  /* ---------- Case detail modal ---------- */
  var modal = document.getElementById('modal');
  if (modal) {
    var mLabel = document.getElementById('modalLabel');
    var mMetric = document.getElementById('modalMetric');
    var mMetricLabel = document.getElementById('modalMetricLabel');
    var mTitle = document.getElementById('modalTitle');
    var mDesc = document.getElementById('modalDesc');
    var lastFocus = null;

    function pick(card, base) {
      if (currentLang === 'en') {
        var en = card.getAttribute('data-' + base + '-en');
        if (en != null) return en;
      }
      return card.getAttribute('data-' + base) || '';
    }
    var mLink = document.getElementById('modalLink');
    var mLogo = document.getElementById('modalLogo');
    function openModal(card) {
      var logo = card.getAttribute('data-logo');
      if (logo) {
        mLogo.src = logo;
        mLogo.alt = card.getAttribute('data-title') || '';
        mLogo.classList.add('is-visible');
      } else {
        mLogo.classList.remove('is-visible');
        mLogo.removeAttribute('src');
      }
      var eixo = card.closest('.eixo');
      modal.setAttribute('data-eixo', eixo ? eixo.getAttribute('data-eixo') : 'democracia');
      mLabel.textContent = pick(card, 'label');
      mMetric.textContent = pick(card, 'metric');
      mMetricLabel.textContent = pick(card, 'metriclabel');
      mTitle.textContent = card.getAttribute('data-title') || '';
      mDesc.textContent = pick(card, 'more');
      var url = card.getAttribute('data-url');
      if (url) {
        mLink.href = url;
        mLink.textContent = (currentLang === 'en') ? 'Visit website ↗' : 'Visitar site ↗';
        mLink.classList.add('is-visible');
      } else {
        mLink.classList.remove('is-visible');
      }
      lastFocus = card;
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
      modal.querySelector('.modal__close').focus();
    }
    function closeModal() {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
      if (lastFocus) lastFocus.focus();
    }
    document.querySelectorAll('.ecase').forEach(function (card) {
      card.addEventListener('click', function () { openModal(card); });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(card); }
      });
    });
    modal.querySelectorAll('[data-close]').forEach(function (el) {
      el.addEventListener('click', closeModal);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });
  }

  /* ---------- Count-up stats ---------- */
  var pendingCounters = [].slice.call(document.querySelectorAll('.stat__num'));
  function animate(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var dur = 1400, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  function checkCounters() {
    if (!pendingCounters.length) return;
    var ih = window.innerHeight;
    var limit = ih > 0 ? ih * 0.92 : Infinity;
    pendingCounters = pendingCounters.filter(function (el) {
      if (el.getBoundingClientRect().top < limit) { animate(el); return false; }
      return true;
    });
  }

  /* estado inicial (reveals/contadores/spy já visíveis no load) */
  onScrollFx();
})();
