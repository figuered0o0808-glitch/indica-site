/* ============ INDICA — vitrine ============ */
(function () {
  'use strict';

  /* ---------- i18n (EN dictionary; PT lives in the HTML) ---------- */
  var EN = {
    'nav.about': 'About', 'nav.work': 'Our work', 'nav.productions': 'Productions',
    'nav.pubs': 'Publications', 'nav.platform': 'Platform', 'nav.network': 'Network', 'nav.services': 'Services', 'nav.cta': 'Get in touch',
    'pubs.kicker': 'Our publications',
    'pubs.h2': "INDICA also<br>generates <span class='b'>knowledge</span>.",
    'pubs.lead': 'Beyond campaigns and productions, we publish articles and reports on the influence ecosystem, communication and public opinion.',
    'pubs.serie.label': 'Series',
    'pubs.econ.t': 'The influencer economy',
    'pubs.intro.tag': 'Introduction · 2026',
    'pubs.intro.t': 'The economic design of the influence market',
    'pubs.intro.d': 'Introduction to the series. It describes how the influence market works — who its participants are, what each one gives and receives, where attention and money flow — and explains why this market deserves to be studied with economic theory. It presents the fields the series covers.',
    'pubs.intro.m': 'Francisco Figueiredo · 13 pages',
    'pubs.modelo.tag': 'Paper · 2026',
    'pubs.modelo.t': 'An economic model for the content market on algorithmic social networks',
    'pubs.modelo.d': 'A theory of timing in the dispute for attention: latent demand, active supply and the optimal publication window. It treats attention as a scarce resource and derives the condition that closes the window — when active supply starts growing faster than demand.',
    'pubs.modelo.m': 'Figueiredo · Brandão · Bordinhão · 47 pages',
    'pubs.preco.tag': 'Paper · 2026',
    'pubs.preco.t': 'Price formation in the influence market',
    'pubs.preco.d': "Why the price of sponsored content lies far above its production cost and varies so much across similar creators. Price pays for access to a reputational stock — credibility, affect and legitimacy — and is bargained between a floor, set by the creator's costs and risk, and a ceiling, set by what the advertiser can and wants to pay.",
    'pubs.preco.m': 'Francisco Figueiredo · 36 pages',
    'pubs.analises.t': 'Analyses',
    'pubs.banda.tag': 'Analysis · 2026',
    'pubs.banda.t': 'Whoever pays the piper calls the tune',
    'pubs.banda.d': 'An analysis by INDICA in partnership with Entremídias, the Media Literacy Lab of the Journalism program at UFRRJ, on betting advertising, influencers’ discourse and regulation of the influencer market.',
    'pubs.banda.m': 'Francisco Figueiredo · Cecília Moreyra de Figueiredo · 27 pages',
    'pubs.banda.read': 'Read the analysis (PDF) ↗',
    'pubs.read': 'Read the article (PDF) ↗',
    'pubs.cta.tag': 'Stay in touch', 'pubs.cta.t': 'Want to receive our publications?',
    'pubs.cta.d': 'Get in touch →',
    'hero.lead': "Through the influence market, we stand up for <b class='t--green'>science</b>, <b class='t--blue'>democracy</b> and the <b class='t--pink'>environment</b>. We connect creators, data and narrative to move public opinion around what matters.",
    'hero.cta1': 'Start a project',
    'hero.platform.label': 'For creators and organizations',
    'hero.platform.title': 'INDICA Platform',
    'hero.platform.desc': 'Calls, courses and a library for creators and organizations.',
    'hero.platform.calls': 'Browse calls',
    'hero.platform.library': 'Library',
    'hero.platform.account': 'My account',
    'hero.platform.action': 'Explore the platform',
    'stats.views': 'views', 'stats.influencers': 'influencers', 'stats.followers': 'followers in the network',
    'about.kicker': 'Who we are',
    'about.h2': "An agency born on social<br>media, driven by <span class='b'>causes</span>.",
    'about.lead': 'Founded in 2024, INDICA develops communication strategies focused on producing relevant content and engaging different audiences. We combine influence know-how, data analysis and audiovisual production to turn complex issues into narratives that circulate.',
    'team.francisco': 'Science communicator and digital strategist. An economist (UFRJ), he researches the economics of digital influencers.',
    'team.caio': 'Lawyer and digital communicator, working across geopolitics, economics and the Brazilian State.',
    'team.grp.direcao': 'Leadership', 'team.grp.projetos': 'Projects',
    'team.grp.campanhas': 'Campaigns', 'team.grp.av': 'Audiovisual',
    'role.direcao': 'Leadership', 'role.coord': 'Project Coordinator', 'role.coordf': 'Project Coordinator', 'role.assistproj': 'Project Assistant',
    'role.assistcamp': 'Campaign Assistant', 'role.coordcamp': 'Campaign Coordinator', 'role.assistav': 'Editor & Motion Designer',
    'role.coordav': 'Audiovisual Producer',
    'team.jorge': 'Audiovisual producer focused on coordinating, producing and editing content for digital mobilization and social-impact projects. Law student at UFRJ, researching the realization of the right to education.',
    'team.luiza': 'Digital mobilizer for social impact, she is a lawyer (UFRJ) and a researcher in Human Rights and Biopolitics.',
    'team.artur': 'Public manager (IPPUR/UFRJ) and political strategist. Executive secretary of Núcleo Ypykuéra and founding partner of INDICA.',
    'team.lauanny': 'Political strategist with over 5 years in communication management. Law student at UFRJ, researching public policy and government relations.',
    'team.pedro': 'Geographer (UFRJ), researcher, scriptwriter and project manager.',
    'team.luma': 'Educator (UFF and UMESP) and content creator focused on civic and political education. She leads initiatives that connect learning with community engagement.',
    'team.gabriel': "Researcher and educator. Biologist (UFRJ) with a master's from UERJ, he studies mechanisms for biodiversity conservation.",
    'team.cristal': "Biologist and master's student in Geosciences at UERJ, working on climate change and smart cities, with a focus on urban climatology and climate justice.",
    'team.milena': 'Law student at UNIRIO researching environmental licensing. Works as a campaign assistant in digital communication.',
    'team.matheus': 'Video editor, motion designer and graphic designer, specialized in audiovisual production and visual communication for digital media.',
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
    'case.mural': 'An independent dashboard of the 2026 election: an average of the polls registered with the Electoral Court, candidate dossiers, and search and social media tracking.',
    'case.reinventar': 'A civil society movement from Rio: 20 proposals for the state and a public pledge to monitor those elected.',
    'case.antifake': 'Fighting disinformation with far-reaching narrative — over 19 million organic views.',
    'case.smt': "A mobilization hub that broadens people's participation in politics, with a weekly videocast, a community and a network of influencers.",
    'case.ypykuera': 'A podcast on politics and democracy, gathering experts and leaders from the progressive field.',
    'case.influenciencia': "With Rio's Municipal Department of Science and Technology — over 10 million views.",
    'case.regulamentaai': 'Campaign for AI regulation in Brazil: 8 million organic views and 20k+ signatures.',
    'case.comite': 'An alliance of researchers and communicators defending science and qualified debate.',
    'case.350org': 'An energy campaign with digital creators on Instagram and TikTok, from the electricity bill to the broader debate: over 2 million views.',
    'case.secma': 'A video series on environment and climate that reached over 4 million people.',
    'case.pulitzer': 'Climate awareness: in-person event with 200+ people and 3.5 million views.',
    'case.oeco': 'Adapting environmental reporting to the native format of social media: 3 million views.',
    'case.cop30': 'A hub of influencers for climate mobilization toward COP30, in Belém.',
    'ui.more': 'View details →', 'ui.skip': 'Skip to content',
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
    'form.nome': 'Name', 'form.email': 'Email', 'form.org': 'Organization', 'form.assunto': 'Subject',
    'form.op1': 'Mobilization campaign', 'form.op2': 'Audiovisual production', 'form.op3': 'Social media management',
    'form.op4': 'Press / partnership', 'form.op5': 'Other',
    'form.msg': 'Tell us what you want to communicate', 'form.enviar': 'Send message',
    'form.ok': 'Your message was registered in the INDICA system.',
    'form.privacidade': 'The INDICA team receives these details to follow up on your message.',
    'form.protocolo': 'Reference number:', 'form.guarde': 'Keep this number when following up with the team.',
    'form.nova': 'Send another message', 'form.revisar': 'Review the details',
    'net.kicker': 'Network of communicators',
    'net.h2': "+200 influencers.<br>One <span class='b'>purpose</span>.",
    'net.lead': 'Brazil decides on social media — and our roster of communicators adds up to more than 80 million followers, organized into thematic hubs. We have worked in more than 10 countries, and our network reaches every continent.',
    'net.hub1': 'combined followers across our network of communicators.',
    'net.hub2': 'countries where we have run campaigns.',
    'net.hub3': 'of Brazilians believe social media influences public opinion.',
    'net.hub4': 'have made purchases after recommendations on social media.',
    'net.source': 'Source: Quaest/2025 survey and the Influence.me/2026 Digital Influencers Report.',
    'net.platform.t': 'Do you create content?',
    'net.platform.d': 'Explore opportunities and resources for your work on the INDICA platform.',
    'net.platform.a': 'Explore the platform',
    'part.kicker': 'Partners',
    'part.h2': "Who walks<br>with <span class='b'>us</span>.",
    'part.lead': 'Institutions, media outlets and organizations we have worked with on campaigns, productions and research.',
    'eixos.aria': 'Areas of work',
    'nav.home.aria': 'INDICA — home', 'nav.aria': 'Main navigation', 'nav.burger.aria': 'Open menu', 'ui.close.aria': 'Close',
    'eixos.cta.q': 'Have a similar campaign in mind?',
    'eixos.cta.a': "Let's talk →",
    'contact.h2': "Got a cause to set<br>in <span class='b'>motion</span>?",
    'contact.lead': 'Tell us what you want to communicate. INDICA designs the strategy, the production and the influence network — from briefing to measurement.',
    'footer.tag': 'Democracy · Science · Environment',
    'footer.nav.aria': 'Agency navigation',
    'footer.copy': '© 2026 INDICA. All rights reserved.'
  };

  var currentLang = 'pt';
  var ptCache = new Map();
  var ptHrefCache = new Map();
  var i18nEls = document.querySelectorAll('[data-i18n]');
  var langBtn = document.getElementById('lang');

  function applyLang(lang) {
    i18nEls.forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (!ptCache.has(el)) ptCache.set(el, el.innerHTML);
      if (lang === 'en') { if (EN[key] != null) el.innerHTML = EN[key]; }
      else { el.innerHTML = ptCache.get(el); }
    });
    document.querySelectorAll('[data-en]').forEach(function (el) {
      if (!ptCache.has(el)) ptCache.set(el, el.innerHTML);
      el.innerHTML = (lang === 'en') ? el.getAttribute('data-en') : ptCache.get(el);
    });
    document.querySelectorAll('[data-href-en]').forEach(function (el) {
      if (!ptHrefCache.has(el)) ptHrefCache.set(el, el.getAttribute('href'));
      el.setAttribute('href', (lang === 'en') ? el.getAttribute('data-href-en') : (el.getAttribute('data-href-pt') || ptHrefCache.get(el)));
    });
    document.querySelectorAll('[data-src-en]').forEach(function (el) {
      if (!ptCache.has(el)) ptCache.set(el, el.getAttribute('src'));
      el.setAttribute('src', (lang === 'en') ? el.getAttribute('data-src-en') : ptCache.get(el));
    });
    currentLang = lang;
    document.documentElement.lang = (lang === 'en') ? 'en' : 'pt-BR';
    document.title = (lang === 'en') ? 'INDICA — Communication and influencer marketing agency' : 'INDICA — Agência de comunicação e marketing de influência';
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      if (!ptCache.has(el)) ptCache.set(el, el.getAttribute('aria-label'));
      var k = el.getAttribute('data-i18n-aria');
      el.setAttribute('aria-label', (lang === 'en' && EN[k] != null) ? EN[k] : ptCache.get(el));
    });
    if (langBtn) langBtn.querySelectorAll('[data-l]').forEach(function (s) {
      s.classList.toggle('on', s.getAttribute('data-l') === lang);
    });
    try { localStorage.setItem('indica_lang', lang); } catch (e) {}
    if (typeof refreshCounters === 'function') { try { refreshCounters(); } catch (e) {} }
    if (typeof atualizarContatoIdioma === 'function') atualizarContatoIdioma();
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

  /* ---------- Capítulos dos eixos: índice fixo que acompanha a rolagem ---------- */
  var tabsBar = document.querySelector('.tabs');
  var tabLinks = tabsBar ? [].slice.call(tabsBar.querySelectorAll('.tab')) : [];
  var eixoSecs = [].slice.call(document.querySelectorAll('.eixo'));
  var rootStyle = document.documentElement.style;
  var navEl = document.getElementById('nav');
  function medirBarras() {
    if (navEl) rootStyle.setProperty('--navh', navEl.offsetHeight + 'px');
    if (tabsBar) rootStyle.setProperty('--tabsh', tabsBar.offsetHeight + 'px');
  }
  medirBarras();
  window.addEventListener('resize', medirBarras, { passive: true });
  if (window.ResizeObserver) {
    var roBarras = new ResizeObserver(medirBarras);
    if (navEl) roBarras.observe(navEl);
    if (tabsBar) roBarras.observe(tabsBar);
  }
  function spyEixos() {
    if (!tabsBar) return;
    var navh = navEl ? navEl.offsetHeight : 0;
    var topo = tabsBar.getBoundingClientRect().top;
    tabsBar.classList.toggle('stuck', topo <= navh + 0.5 && window.scrollY > 0);
    var limite = navh + tabsBar.offsetHeight + 4, atual = -1;
    for (var i = 0; i < eixoSecs.length; i++) {
      if (eixoSecs[i].getBoundingClientRect().top <= limite) atual = i;
    }
    // depois do último capítulo, nenhum fica aceso
    var ult = eixoSecs[eixoSecs.length - 1];
    if (ult && ult.getBoundingClientRect().bottom <= limite) atual = -1;
    tabLinks.forEach(function (t, i) {
      var on = i === atual;
      t.classList.toggle('active', on);
      if (on) t.setAttribute('aria-current', 'true'); else t.removeAttribute('aria-current');
    });
  }

  /* ---------- Celular: contador da fileira de campanhas (1 / 5) ---------- */
  [].forEach.call(document.querySelectorAll('.eixo__cases'), function (trilho) {
    var cards = trilho.querySelectorAll('.ecase');
    var rotulo = trilho.parentElement.querySelector('.eixo__caseslabel');
    if (!rotulo || cards.length < 2) return;
    var cont = document.createElement('span');
    cont.className = 'eixo__count';
    cont.setAttribute('aria-hidden', 'true');
    rotulo.appendChild(cont);
    function atualiza() {
      var passo = cards[1].offsetLeft - cards[0].offsetLeft || 1;
      var idx = Math.min(cards.length, Math.round(trilho.scrollLeft / passo) + 1);
      cont.textContent = idx + ' / ' + cards.length;
    }
    trilho.addEventListener('scroll', atualiza, { passive: true });
    trilho.addEventListener('focusin', function (e) {
      var card = e.target.closest ? e.target.closest('.ecase') : null;
      if (!card) return;
      var r = card.getBoundingClientRect(), t = trilho.getBoundingClientRect();
      if (r.left < t.left || r.right > t.right) trilho.scrollTo({ left: card.offsetLeft - cards[0].offsetLeft, behavior: 'auto' });
    });
    window.addEventListener('resize', atualiza, { passive: true });
    atualiza();
  });

  /* ---------- Nav: shadow on scroll ---------- */
  var nav = document.getElementById('nav');
  function onScroll() { if (nav) nav.classList.toggle('scrolled', window.scrollY > 30); }
  onScroll();

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

  /* ---------- Entradas de conteúdo: uma vez, sem retirar a leitura ---------- */
  var motionQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var reducedMotion = motionQuery ? motionQuery.matches : false;
  var pendingReveals = [].slice.call(document.querySelectorAll('.reveal'));
  var revealObserver = null;
  function staggerDelay(el) {
    var sibs = [].filter.call(el.parentElement.children, function (c) {
      return c.classList && c.classList.contains('reveal');
    });
    return Math.min(Math.max(0, sibs.indexOf(el)) * 90, 270);
  }
  function revealEl(el, instant) {
    if (!el || el.classList.contains('in')) return;
    var d = instant || reducedMotion ? 0 : staggerDelay(el);
    el.style.setProperty('--reveal-delay', d + 'ms');
    el.classList.add('in');
    el.classList.remove('reveal-pending');
    if (revealObserver) revealObserver.unobserve(el);
    var i = pendingReveals.indexOf(el);
    if (i !== -1) pendingReveals.splice(i, 1);
    if (d) setTimeout(function () { el.style.removeProperty('--reveal-delay'); }, d + 1050);
  }
  function setupReveals() {
    if (revealObserver) revealObserver.disconnect();
    if (reducedMotion || !window.IntersectionObserver) {
      pendingReveals.slice().forEach(function (el) { revealEl(el, true); });
      return;
    }
    revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { if (entry.isIntersecting) revealEl(entry.target); });
    }, { rootMargin: '0px 0px -40px 0px', threshold: .01 });
    pendingReveals.slice().forEach(function (el) {
      // Tudo o que já está à vista (ou antes de uma âncora) fica disponível imediatamente.
      if (el.getBoundingClientRect().top < window.innerHeight - 40) revealEl(el, true);
      else { el.classList.add('reveal-pending'); revealObserver.observe(el); }
    });
  }
  document.addEventListener('focusin', function (event) {
    var el = event.target.closest ? event.target.closest('.reveal') : null;
    while (el) {
      revealEl(el, true);
      el = el.parentElement ? el.parentElement.closest('.reveal') : null;
    }
  });

  /* ---------- Barra de progresso + scrollspy ---------- */
  var progress = document.getElementById('progress');
  var spyLinks = [].filter.call(document.querySelectorAll('.nav__links a'), function (a) {
    return a.getAttribute('href').charAt(0) === '#' && a.getAttribute('href') !== '#top';
  });
  // todas as seções da página, em ordem; cada uma aponta para o link do menu que a representa (ou nenhum)
  var spySecs = [].slice.call(document.querySelectorAll('main section[id]')).filter(function (s) {
    return !s.closest('.pubs');
  }).map(function (s) {
    var alvo = s.classList.contains('eixo') ? 'atuacao' : s.id;
    var link = null;
    spyLinks.forEach(function (a) { if (a.getAttribute('href') === '#' + alvo) link = a; });
    return { el: s, link: link };
  });
  function onScrollFx() {
    var doc = document.documentElement;
    var max = doc.scrollHeight - window.innerHeight;
    if (progress) progress.style.transform = 'scaleX(' + (max > 0 ? window.scrollY / max : 0) + ')';
    var atualLink = null, lim = (navEl ? navEl.offsetHeight : 60) + 60;
    for (var i = 0; i < spySecs.length; i++) {
      if (spySecs[i].el.getBoundingClientRect().top <= lim) atualLink = spySecs[i].link;
    }
    spyLinks.forEach(function (a) { a.classList.toggle('active', a === atualLink); });
    spyEixos();
    onScroll();
    checkCounters();
  }

  /* ---------- Placas: profundidade com inércia curta, na rolagem nativa ---------- */
  var plateGroups = [];
  var scrollFrame = 0;
  var scrollDirty = true;
  var previousFrame = 0;
  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
  function preparePlates() {
    document.querySelectorAll('.placas').forEach(function (box) {
      var group = { el: box, visible: !window.IntersectionObserver, initialized: false, items: [] };
      box.querySelectorAll('.bl').forEach(function (el) {
        var cs = getComputedStyle(el);
        function value(name, fallback) { var n = parseFloat(cs.getPropertyValue(name)); return isNaN(n) ? fallback : n; }
        group.items.push({ el: el, from: value('--de', 14), to: value('--ate', -14),
          sway: value('--sway', 6), turn: value('--turn', 1.2), x: 0, y: 0, r: 0, tx: 0, ty: 0, tr: 0 });
      });
      plateGroups.push(group);
    });
    if (window.IntersectionObserver) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          plateGroups.forEach(function (group) {
            if (group.el !== entry.target) return;
            group.visible = entry.isIntersecting;
            group.el.classList.toggle('is-tracking', group.visible && !reducedMotion);
          });
        });
        requestScrollFrame();
      }, { rootMargin: '90px 0px', threshold: 0 });
      plateGroups.forEach(function (group) { observer.observe(group.el); });
    }
  }
  function observeAmbientMotion() {
    if (!window.IntersectionObserver) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        entry.target.classList.toggle('motion-offscreen', !entry.isIntersecting);
      });
    });
    document.querySelectorAll('.dots,.marquee').forEach(function (el) { observer.observe(el); });
  }
  function updatePlateTargets() {
    if (reducedMotion) return;
    var height = window.innerHeight;
    plateGroups.forEach(function (group) {
      if (!group.visible) return;
      var rect = group.el.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      var progress = clamp((height - rect.top) / (height + rect.height), 0, 1);
      // A composição é o ponto médio; o giro acompanha a rolagem sem atingir o texto.
      var phase = progress * 2 - 1;
      group.items.forEach(function (plate) {
        plate.tx = phase * plate.sway;
        plate.ty = plate.from + (plate.to - plate.from) * progress;
        plate.tr = phase * plate.turn;
        if (!group.initialized) { plate.x = plate.tx; plate.y = plate.ty; plate.r = plate.tr; }
      });
      group.initialized = true;
    });
  }
  function paintPlates(time) {
    if (reducedMotion) return false;
    var elapsed = previousFrame ? clamp(time - previousFrame, 8, 50) : 16;
    var follow = 1 - Math.exp(-elapsed / 170);
    var unsettled = false;
    plateGroups.forEach(function (group) {
      if (!group.visible || !group.initialized) return;
      group.items.forEach(function (plate) {
        plate.x += (plate.tx - plate.x) * follow;
        plate.y += (plate.ty - plate.y) * follow;
        plate.r += (plate.tr - plate.r) * follow;
        if (Math.abs(plate.tx - plate.x) + Math.abs(plate.ty - plate.y) + Math.abs(plate.tr - plate.r) > .045) unsettled = true;
        var giro = plate.r;
        plate.el.style.transform = 'translate3d(' + plate.x.toFixed(2) + 'px,' + plate.y.toFixed(2) + 'px,0) ' +
          'rotateX(calc(var(--pitch) + ' + (giro * 1.4).toFixed(3) + 'deg)) ' +
          'rotateY(calc(var(--yaw) + ' + (giro * 2.2).toFixed(3) + 'deg)) ' +
          'rotateZ(calc(var(--roll) + ' + giro.toFixed(3) + 'deg))';
      });
    });
    return unsettled;
  }
  function paintScroll(time) {
    scrollFrame = 0;
    if (document.hidden) { previousFrame = 0; return; }
    if (scrollDirty) {
      scrollDirty = false;
      onScrollFx();
      updatePlateTargets();
    }
    var unsettled = paintPlates(time);
    previousFrame = time;
    if (unsettled) scrollFrame = requestAnimationFrame(paintScroll);
    else previousFrame = 0;
  }
  function requestScrollFrame() {
    scrollDirty = true;
    if (!document.hidden && !scrollFrame) scrollFrame = requestAnimationFrame(paintScroll);
  }
  function motionPreferenceChanged() {
    reducedMotion = motionQuery ? motionQuery.matches : false;
    setupReveals();
    plateGroups.forEach(function (group) {
      group.el.classList.toggle('is-tracking', group.visible && !reducedMotion);
      if (reducedMotion) group.items.forEach(function (plate) {
        plate.el.style.removeProperty('transform');
        plate.x = plate.y = plate.r = 0;
      });
    });
    if (reducedMotion) finishCounters();
    requestScrollFrame();
  }
  if (motionQuery) {
    if (motionQuery.addEventListener) motionQuery.addEventListener('change', motionPreferenceChanged);
    else if (motionQuery.addListener) motionQuery.addListener(motionPreferenceChanged);
  }
  document.addEventListener('visibilitychange', function () {
    document.documentElement.classList.toggle('motion-paused', document.hidden);
    if (document.hidden) {
      cancelAnimationFrame(scrollFrame);
      scrollFrame = 0;
      previousFrame = 0;
      finishCounters();
    } else requestScrollFrame();
  });
  window.addEventListener('scroll', requestScrollFrame, { passive: true });
  window.addEventListener('resize', requestScrollFrame, { passive: true });
  window.addEventListener('load', requestScrollFrame, { once: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(requestScrollFrame);

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
        mLogo.hidden = false;
        mLogo.src = logo;
        mLogo.alt = card.getAttribute('data-title') || '';
        mLogo.classList.add('is-visible');
      } else {
        mLogo.classList.remove('is-visible');
        mLogo.removeAttribute('src');
        mLogo.hidden = true;
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

  /* ---------- Contato: sucesso somente após confirmação do sistema ---------- */
  var formContato = document.getElementById('contatoForm');
  var contatoBusy = false, contatoTentativa = null, contatoErro = '';
  var contatoTextos = {
    pt: { enviar: 'Enviar mensagem', enviando: 'Enviando…', tentar: 'Tentar enviar novamente',
      rede: 'Não foi possível confirmar o recebimento. Sua mensagem continua aqui. Tente novamente com os mesmos dados para evitar um envio duplicado.',
      invalido: 'Confira os campos e tente novamente.', limite: 'Muitas tentativas. Aguarde um pouco e tente novamente.',
      revisar: 'A tentativa anterior pode ter chegado ao sistema. Antes de iniciar outro envio, confira se você já recebeu um protocolo nesta página.' },
    en: { enviar: 'Send message', enviando: 'Sending…', tentar: 'Try sending again',
      rede: 'We could not confirm receipt. Your message is still here. Retry with the same details to avoid a duplicate submission.',
      invalido: 'Check the fields and try again.', limite: 'Too many attempts. Please wait a little and try again.',
      revisar: 'The previous attempt may have reached the system. Before starting another submission, check whether this page has already shown a reference number.' }
  };
  function atualizarContatoIdioma() {
    if (!formContato || !contatoTextos) return;
    var textos = contatoTextos[currentLang], b = formContato.querySelector('[type="submit"]');
    formContato.querySelector('[name="idioma"]').value = currentLang;
    formContato.setAttribute('aria-busy', contatoBusy ? 'true' : 'false');
    formContato.querySelectorAll('input:not([type="hidden"]),select,textarea').forEach(function (el) { el.disabled = contatoBusy || Boolean(contatoTentativa); });
    b.disabled = contatoBusy;
    b.textContent = contatoBusy ? textos.enviando : contatoTentativa ? textos.tentar : textos.enviar;
    var erro = document.getElementById('formErro');
    erro.hidden = !contatoErro; erro.textContent = textos[contatoErro] || '';
    document.getElementById('formRevisar').hidden = contatoBusy || !contatoTentativa;
  }
  function novoContatoId() {
    if (window.crypto.randomUUID) return window.crypto.randomUUID();
    var b = new Uint8Array(16); window.crypto.getRandomValues(b); b[6] = (b[6] & 15) | 64; b[8] = (b[8] & 63) | 128;
    var h = Array.from(b, function (x) { return x.toString(16).padStart(2, '0'); }).join('');
    return h.slice(0,8)+'-'+h.slice(8,12)+'-'+h.slice(12,16)+'-'+h.slice(16,20)+'-'+h.slice(20);
  }
  if (formContato) {
    atualizarContatoIdioma();
    formContato.addEventListener('submit', async function (event) {
      event.preventDefault(); if (contatoBusy || !formContato.reportValidity()) return;
      var timer, controller;
      try {
        if (!contatoTentativa) {
          var valor = function (name) { return formContato.elements.namedItem(name).value.trim(); };
          contatoTentativa = { nome: valor('Nome'), email: valor('E-mail').toLowerCase(), organizacao: valor('Organização'),
            assunto: valor('Assunto'), mensagem: valor('Mensagem'), honey: valor('_honey'), origem: 'agencia', idioma: currentLang, envioId: novoContatoId() };
        }
        contatoBusy = true; contatoErro = ''; atualizarContatoIdioma();
        controller = new AbortController(); timer = setTimeout(function () { controller.abort(); }, 30000);
        var destino = formContato.action.replace(/\/formulario\/?$/, '');
        var resposta = await fetch(destino, { method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(contatoTentativa), credentials: 'omit', cache: 'no-store', referrerPolicy: 'no-referrer', signal: controller.signal });
        if (!resposta.ok) {
          if ([400,409,413,422,429].indexOf(resposta.status) !== -1) { contatoTentativa = null; throw new Error(resposta.status === 429 ? 'limite' : 'invalido'); }
          throw new Error('rede');
        }
        var dados = await resposta.json();
        if (dados.ok !== true || typeof dados.protocolo !== 'string' || !dados.protocolo || dados.protocolo.length > 100 || typeof dados.recebidaEm !== 'string' || !Number.isFinite(Date.parse(dados.recebidaEm))) throw new Error('rede');
        contatoTentativa = null; contatoErro = '';
        document.getElementById('formProtocolo').textContent = dados.protocolo;
        formContato.reset(); formContato.hidden = true;
        var ok = document.getElementById('formOk'); ok.hidden = false; ok.focus(); ok.scrollIntoView({ block: 'center' });
      } catch (error) { contatoErro = error.message === 'invalido' ? 'invalido' : error.message === 'limite' ? 'limite' : 'rede'; }
      finally { clearTimeout(timer); contatoBusy = false; atualizarContatoIdioma(); }
    });
    document.getElementById('formRevisar').addEventListener('click', function () {
      if (!window.confirm(contatoTextos[currentLang].revisar)) return;
      contatoTentativa = null; contatoErro = ''; atualizarContatoIdioma(); formContato.querySelector('[name="Nome"]').focus();
    });
    document.getElementById('formNova').addEventListener('click', function () {
      contatoTentativa = null; contatoErro = ''; formContato.hidden = false;
      document.getElementById('formOk').hidden = true; document.getElementById('formProtocolo').textContent = '';
      atualizarContatoIdioma(); formContato.querySelector('[name="Nome"]').focus();
    });
  }

  /* ---------- Count-up stats ---------- */
  var pendingCounters = [].slice.call(document.querySelectorAll('.stat__num'));
  var activeCounters = [];
  function animate(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    if (reducedMotion) { el.textContent = target + sfx(el); return; }
    var counter = { el: el, frame: 0, done: false };
    activeCounters.push(counter);
    var dur = 1250, start = null;
    function step(ts) {
      if (counter.done) return;
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target) + sfx(el);
      if (p < 1) counter.frame = requestAnimationFrame(step);
      else { counter.done = true; activeCounters = activeCounters.filter(function (item) { return item !== counter; }); }
    }
    counter.frame = requestAnimationFrame(step);
  }
  function finishCounters() {
    if (!activeCounters || !pendingCounters) return;
    activeCounters.forEach(function (counter) {
      counter.done = true;
      cancelAnimationFrame(counter.frame);
      counter.el.textContent = counter.el.getAttribute('data-count') + sfx(counter.el);
    });
    activeCounters = [];
    if (reducedMotion) {
      pendingCounters.forEach(function (el) { el.textContent = el.getAttribute('data-count') + sfx(el); });
      pendingCounters = [];
    }
  }
  function sfx(el) {
    return ((currentLang === 'en' ? el.getAttribute('data-suffix-en') : null) || el.getAttribute('data-suffix') || '');
  }
  function refreshCounters() {
    document.querySelectorAll('.stat__num').forEach(function (el) {
      if (pendingCounters.indexOf(el) === -1) el.textContent = el.getAttribute('data-count') + sfx(el);
    });
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

  /* Conteúdo visível sem JS; animações só são habilitadas após a preparação. */
  setupReveals();
  preparePlates();
  observeAmbientMotion();
  onScrollFx();
  requestScrollFrame();
})();
