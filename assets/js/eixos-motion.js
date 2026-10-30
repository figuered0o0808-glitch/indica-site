/* INDICA: os símbolos ganham movimento; as assinaturas originais permanecem fixas. */
(function () {
  'use strict';

  function iniciar() {
    var cards = Array.prototype.slice.call(document.querySelectorAll('.eixo__logocard'));
    if (!cards.length || !window.fetch || !window.DOMParser) return;
    var preferencia = window.matchMedia('(prefers-reduced-motion: reduce)');
    var estados = [];
    var documentoVisivel = document.visibilityState !== 'hidden';
    var SVG_NS = 'http://www.w3.org/2000/svg';

    function atualizar(estado) {
      var executar = estado.pronto && estado.visivel && documentoVisivel && !preferencia.matches;
      estado.card.setAttribute('data-motion-run', executar ? 'true' : 'false');
      estado.card.setAttribute('data-motion-visible', estado.visivel ? 'true' : 'false');
      if (executar && !estado.entrou) {
        estado.entrou = true;
        estado.card.setAttribute('data-motion-entered', 'true');
      }
      if (!executar && estado.quadro) {
        cancelAnimationFrame(estado.quadro);
        estado.quadro = 0;
        estado.ultimo = 0;
      }
      if (executar && estado.orbita && !estado.quadro) estado.quadro = requestAnimationFrame(function (agora) { orbitar(estado, agora); });
    }

    function orbitar(estado, agora) {
      estado.quadro = 0;
      if (estado.card.getAttribute('data-motion-run') !== 'true') { estado.ultimo = 0; return; }
      if (estado.ultimo) estado.fase = (estado.fase + Math.min(64, agora - estado.ultimo) / 11200) % 1;
      estado.ultimo = agora;
      var ponto = estado.orbita.getPointAtLength(estado.fase * estado.comprimentoOrbita);
      estado.particula.setAttribute('transform', 'translate(' + ponto.x.toFixed(2) + ' ' + ponto.y.toFixed(2) + ')');
      estado.quadro = requestAnimationFrame(function (tempo) { orbitar(estado, tempo); });
    }

    function origem(grupo, padrao) {
      var texto = grupo.getAttribute('data-origin') || padrao;
      var valores = texto ? texto.trim().split(/[ ,]+/).map(Number) : [];
      if (valores.length === 2 && valores.every(Number.isFinite)) return valores;
      var caixa = grupo.getBBox();
      return [caixa.x + caixa.width / 2, caixa.y + caixa.height / 2];
    }

    function envolver(elemento, classe, centro) {
      var grupo = document.createElementNS(SVG_NS, 'g');
      grupo.setAttribute('class', classe);
      grupo.style.transformOrigin = centro[0] + 'px ' + centro[1] + 'px';
      elemento.parentNode.insertBefore(grupo, elemento);
      grupo.appendChild(elemento);
      return grupo;
    }

    function prepararSimbolo(svg, estado) {
      var simbolo = svg.querySelector('[data-layer="symbol"]');
      if (!simbolo) throw new Error('Símbolo ausente');
      if (estado.eixo === 'democracia') {
        ['voice-left', 'voice-right'].forEach(function (nome, indice) {
          var barra = simbolo.querySelector('[data-part="' + nome + '"]');
          if (!barra) return;
          var centro = origem(barra, indice ? '620 70' : '571 290');
          var foco = envolver(barra, 'eixo-motion__focus eixo-motion__voice-focus eixo-motion__voice-focus--' + indice, centro);
          var repouso = envolver(foco, 'eixo-motion__idle eixo-motion__voice eixo-motion__voice--' + indice, centro);
          envolver(repouso, 'eixo-motion__intro eixo-motion__voice-in eixo-motion__voice-in--' + indice, centro);
        });
      }
      if (estado.eixo === 'ciencia') {
        var orbita = simbolo.querySelector('[data-orbit]') || svg.querySelector('[data-orbit]');
        if (orbita) {
          var particula = document.createElementNS(SVG_NS, 'circle');
          particula.setAttribute('class', 'eixo-motion__electron');
          particula.setAttribute('r', '6.5');
          particula.setAttribute('fill', '#c2ee5a');
          particula.setAttribute('stroke', '#5cbf1f');
          particula.setAttribute('stroke-width', '1.5');
          simbolo.appendChild(particula);
          estado.orbita = orbita;
          estado.particula = particula;
          estado.comprimentoOrbita = orbita.getTotalLength();
          var primeiro = orbita.getPointAtLength(estado.fase * estado.comprimentoOrbita);
          particula.setAttribute('transform', 'translate(' + primeiro.x + ' ' + primeiro.y + ')');
        }
        var centroAtomo = origem(simbolo, '768 184');
        var resposta = envolver(simbolo, 'eixo-motion__focus eixo-motion__atom-focus', centroAtomo);
        var precessao = envolver(resposta, 'eixo-motion__idle eixo-motion__atom', centroAtomo);
        envolver(precessao, 'eixo-motion__intro eixo-motion__atom-in', centroAtomo);
      }
      if (estado.eixo === 'meio') {
        Array.prototype.slice.call(svg.querySelectorAll('[data-river]')).forEach(function (rio, indice) {
          ['idle', 'response'].forEach(function (tipo) {
            var luz = rio.cloneNode(true);
            luz.removeAttribute('id');
            luz.removeAttribute('data-river');
            luz.setAttribute('class', 'eixo-motion__river eixo-motion__river--' + tipo);
            luz.setAttribute('fill', 'none');
            luz.setAttribute('stroke', '#f3fff4');
            luz.setAttribute('stroke-width', '5');
            luz.setAttribute('stroke-linecap', 'round');
            luz.setAttribute('pathLength', '1000');
            luz.style.setProperty('--river-delay', (indice * .7) + 's');
            luz.style.setProperty('--river-period', (8.8 + indice * .45) + 's');
            rio.parentNode.insertBefore(luz, rio.nextSibling);
          });
        });
      }
    }

    function tornarIdsUnicos(svg, prefixo) {
      var ids = {};
      Array.prototype.forEach.call(svg.querySelectorAll('[id]'), function (elemento) {
        var antigo = elemento.id;
        ids[antigo] = prefixo + antigo;
        elemento.id = ids[antigo];
      });
      Array.prototype.forEach.call(svg.querySelectorAll('*'), function (elemento) {
        Array.prototype.slice.call(elemento.attributes).forEach(function (atributo) {
          var valor = atributo.value.replace(/url\(#([^)]*)\)/g, function (todo, id) { return ids[id] ? 'url(#' + ids[id] + ')' : todo; });
          if ((atributo.localName === 'href') && valor.charAt(0) === '#' && ids[valor.slice(1)]) valor = '#' + ids[valor.slice(1)];
          if (valor !== atributo.value) elemento.setAttributeNS(atributo.namespaceURI, atributo.name, valor);
        });
      });
    }

    function interagir(estado, ativo) {
      estado.card.setAttribute('data-motion-interacting', ativo ? 'true' : 'false');
    }

    var observador = typeof IntersectionObserver === 'function' ? new IntersectionObserver(function (entradas) {
      entradas.forEach(function (item) {
        var estado = estados.find(function (candidato) { return candidato.card === item.target; });
        if (!estado) return;
        estado.visivel = item.isIntersecting && item.intersectionRatio >= .15;
        atualizar(estado);
      });
    }, { threshold: [0, .15] }) : null;

    cards.forEach(function (card, indice) {
      var imagem = card.querySelector('img');
      var secao = card.closest('[data-eixo]');
      var eixo = secao && secao.getAttribute('data-eixo');
      if (!imagem || !/^(democracia|ciencia|meio)$/.test(eixo || '') || card.hasAttribute('data-motion-status')) return;
      card.setAttribute('data-motion-status', 'loading');
      var estado = { card: card, eixo: eixo, pronto: false, visivel: !observador, entrou: false,
        quadro: 0, ultimo: 0, fase: .08, orbita: null, particula: null, comprimentoOrbita: 0 };
      estados.push(estado);
      if (observador) observador.observe(card);
      card.addEventListener('pointerenter', function (evento) { if (evento.pointerType !== 'touch') interagir(estado, true); });
      card.addEventListener('pointerleave', function () { interagir(estado, false); });
      secao.addEventListener('focusin', function () { interagir(estado, true); });
      secao.addEventListener('focusout', function (evento) { if (!secao.contains(evento.relatedTarget)) interagir(estado, false); });
      var caminho = new URL('motion/eixo-' + eixo + '.svg', imagem.src);
      fetch(caminho.href, { credentials: 'same-origin' }).then(function (resposta) {
        if (!resposta.ok) throw new Error('Arte indisponível');
        return resposta.text();
      }).then(function (texto) {
        var documento = new DOMParser().parseFromString(texto, 'image/svg+xml');
        if (documento.querySelector('parsererror') || documento.documentElement.localName !== 'svg') throw new Error('Arte inválida');
        var svg = document.importNode(documento.documentElement, true);
        tornarIdsUnicos(svg, 'eixo-motion-' + indice + '-');
        svg.setAttribute('class', 'eixo-motion__art');
        svg.removeAttribute('aria-hidden');
        svg.setAttribute('aria-label', imagem.alt);
        svg.setAttribute('role', 'img');
        svg.setAttribute('focusable', 'false');
        svg.setAttribute('preserveAspectRatio', 'xMinYMin meet');
        card.appendChild(svg);
        // A sobreposição acompanha o tamanho real do PNG, sem redesenhar o layout.
        var ajustarTamanho = function () {
          var caixa = imagem.getBoundingClientRect();
          svg.style.width = caixa.width + 'px';
          svg.style.height = caixa.height + 'px';
        };
        ajustarTamanho();
        if (typeof ResizeObserver === 'function') {
          estado.observadorTamanho = new ResizeObserver(ajustarTamanho);
          estado.observadorTamanho.observe(imagem);
        } else window.addEventListener('resize', ajustarTamanho);
        prepararSimbolo(svg, estado);
        requestAnimationFrame(function () {
          estado.pronto = true;
          card.setAttribute('data-motion-ready', 'true');
          card.setAttribute('data-motion-status', 'ready');
          imagem.setAttribute('aria-hidden', 'true');
          atualizar(estado);
        });
      }).catch(function () {
        var arte = card.querySelector('.eixo-motion__art');
        if (arte) arte.remove();
        card.setAttribute('data-motion-status', 'static');
      });
    });

    function atualizarTodos() { estados.forEach(atualizar); }
    function atualizarDocumento() { documentoVisivel = document.visibilityState !== 'hidden'; atualizarTodos(); }
    document.addEventListener('visibilitychange', atualizarDocumento);
    window.addEventListener('pageshow', atualizarDocumento);
    window.addEventListener('pagehide', function () { documentoVisivel = false; atualizarTodos(); });
    if (preferencia.addEventListener) preferencia.addEventListener('change', atualizarTodos);
    else if (preferencia.addListener) preferencia.addListener(atualizarTodos);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar, { once: true });
  else iniciar();
})();
