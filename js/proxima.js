/* ============================================================
   PROXIMA DESIGN SYSTEM, shared behavior (v1.0)
   Zero dependencies. Include once per page:
     <script src="js/proxima.js" defer></script>

   What it wires automatically (only if the elements exist):
     #ink            fixed background ink atmosphere (theme/accent aware)
     #hero-ink       marketing hero blooms (accent aware)
     .tcard canvas   generative texture card thumbnails (accent aware)
     #fab            display options panel (theme / background / accent)
     .xrow           expandable table rows
     .seg .fchip .toggle   demo active-state behavior
     .sw             swatch click-to-copy

   Manual API:
     Proxima.spark(svgEl, opts)   area chart + dotted forecast (+ tooltip)
     Proxima.onRepaint(fn)        register accent/theme repaint hook

   Pages that must stay dark (marketing) declare:
     <html data-proxima-theme="fixed-dark">
   ============================================================ */
(function () {
  'use strict';
  var root = document.documentElement;
  var ACCENTS = ['indigo', 'teal', 'ember', 'lime'];
  var accentNow = 'indigo';
  var painters = [];
  var themeFixed = root.getAttribute('data-proxima-theme') === 'fixed-dark';

  function isLight() { return root.classList.contains('theme-light'); }
  function repaint() { for (var i = 0; i < painters.length; i++) painters[i](isLight(), accentNow); }

  /* ---------- fixed background ink (#ink) ---------- */
  function bloomOn(ctx, x, y, r, color, a) {
    var g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, color.replace('A', a)); g.addColorStop(1, color.replace('A', 0));
    ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }
  var ink = document.getElementById('ink');
  if (ink) {
    var inkCtx = ink.getContext('2d');
    var inkPos = [[240, 140, 520], [1180, 130, 460], [1230, 760, 540], [160, 800, 430], [700, 460, 700]];
    var inkSets = {
      indigo: { dark: [['rgba(87,87,217,A)', .34], ['rgba(141,92,240,A)', .22], ['rgba(87,87,217,A)', .20], ['rgba(47,169,124,A)', .13], ['rgba(43,45,92,A)', .30]],
                light: [['rgba(87,87,217,A)', .16], ['rgba(141,92,240,A)', .13], ['rgba(87,87,217,A)', .11], ['rgba(31,138,99,A)', .09]] },
      teal:   { dark: [['rgba(15,160,175,A)', .28], ['rgba(62,156,214,A)', .18], ['rgba(15,160,175,A)', .16], ['rgba(87,87,217,A)', .11], ['rgba(20,56,62,A)', .30]],
                light: [['rgba(7,147,162,A)', .14], ['rgba(35,128,188,A)', .11], ['rgba(7,147,162,A)', .09], ['rgba(80,80,214,A)', .06]] },
      ember:  { dark: [['rgba(206,118,39,A)', .26], ['rgba(217,92,110,A)', .15], ['rgba(206,118,39,A)', .15], ['rgba(141,92,240,A)', .10], ['rgba(62,38,18,A)', .32]],
                light: [['rgba(176,88,8,A)', .12], ['rgba(210,59,114,A)', .08], ['rgba(176,88,8,A)', .08], ['rgba(87,87,217,A)', .06]] },
      lime:   { dark: [['rgba(157,187,46,A)', .22], ['rgba(47,169,124,A)', .15], ['rgba(157,187,46,A)', .13], ['rgba(87,87,217,A)', .10], ['rgba(42,52,16,A)', .30]],
                light: [['rgba(102,121,10,A)', .11], ['rgba(31,138,99,A)', .09], ['rgba(102,121,10,A)', .08], ['rgba(80,80,214,A)', .05]] }
    };
    painters.push(function (light, accent) {
      inkCtx.clearRect(0, 0, 1400, 900);
      var set = (inkSets[accent] || inkSets.indigo)[light ? 'light' : 'dark'];
      for (var i = 0; i < set.length; i++) bloomOn(inkCtx, inkPos[i][0], inkPos[i][1], inkPos[i][2], set[i][0], set[i][1]);
    });
  }

  /* ---------- marketing hero blooms (#hero-ink) ---------- */
  var hero = document.getElementById('hero-ink');
  if (hero) {
    var heroCtx = hero.getContext('2d');
    var heroPos = [[600, 210, 500], [280, 90, 340], [950, 120, 360], [600, 640, 620]];
    var heroSets = {
      indigo: [['rgba(87,87,217,A)', .5], ['rgba(141,92,240,A)', .34], ['rgba(62,156,214,A)', .22], ['rgba(20,21,40,A)', .9]],
      teal:   [['rgba(15,160,175,A)', .45], ['rgba(62,156,214,A)', .3], ['rgba(87,87,217,A)', .18], ['rgba(12,32,36,A)', .9]],
      ember:  [['rgba(206,118,39,A)', .42], ['rgba(217,92,110,A)', .26], ['rgba(141,92,240,A)', .14], ['rgba(38,22,10,A)', .9]],
      lime:   [['rgba(157,187,46,A)', .38], ['rgba(47,169,124,A)', .24], ['rgba(87,87,217,A)', .14], ['rgba(26,32,10,A)', .9]]
    };
    painters.push(function (light, accent) {
      heroCtx.clearRect(0, 0, 1200, 800);
      var set = heroSets[accent] || heroSets.indigo;
      for (var i = 0; i < set.length; i++) bloomOn(heroCtx, heroPos[i][0], heroPos[i][1], heroPos[i][2], set[i][0], set[i][1]);
    });
  }

  /* ---------- generative texture thumbnails (.tcard canvas) ---------- */
  var tcanvases = document.querySelectorAll('.tcard canvas');
  if (tcanvases.length) {
    var tintSets = {
      indigo: [['rgba(106,106,232,A)', 'rgba(141,92,240,A)'], ['rgba(87,87,217,A)', 'rgba(62,156,214,A)'], ['rgba(141,92,240,A)', 'rgba(87,87,217,A)'], ['rgba(62,156,214,A)', 'rgba(106,106,232,A)']],
      teal:   [['rgba(15,160,175,A)', 'rgba(62,156,214,A)'], ['rgba(43,158,149,A)', 'rgba(87,87,217,A)'], ['rgba(15,160,175,A)', 'rgba(35,128,188,A)'], ['rgba(62,156,214,A)', 'rgba(15,160,175,A)']],
      ember:  [['rgba(206,118,39,A)', 'rgba(217,92,110,A)'], ['rgba(192,100,31,A)', 'rgba(141,92,240,A)'], ['rgba(217,92,110,A)', 'rgba(206,118,39,A)'], ['rgba(230,140,60,A)', 'rgba(192,100,31,A)']],
      lime:   [['rgba(157,187,46,A)', 'rgba(47,169,124,A)'], ['rgba(140,159,43,A)', 'rgba(87,87,217,A)'], ['rgba(157,187,46,A)', 'rgba(31,138,99,A)'], ['rgba(47,169,124,A)', 'rgba(157,187,46,A)']]
    };
    painters.push(function (light, accent) {
      var tints = tintSets[accent] || tintSets.indigo;
      tcanvases.forEach(function (cv, ci) {
        var g = cv.getContext('2d'), Wc = cv.width, Hc = cv.height;
        var pair = tints[ci % tints.length];
        g.fillStyle = '#0C0D17'; g.fillRect(0, 0, Wc, Hc);
        var seed = ci * 7 + 3;
        function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
        for (var b = 0; b < 14; b++) {
          var col = pair[b % 2], cxp = rnd() * Wc, cyp = rnd() * Hc, r = 30 + rnd() * 90;
          var gr = g.createRadialGradient(cxp, cyp, 0, cxp, cyp, r);
          gr.addColorStop(0, col.replace('A', (0.1 + rnd() * 0.22).toFixed(2)));
          gr.addColorStop(1, col.replace('A', 0));
          g.fillStyle = gr; g.fillRect(0, 0, Wc, Hc);
        }
        g.globalAlpha = .14; g.strokeStyle = '#EFF0F8'; g.lineWidth = .6;
        for (var l = 0; l < 9; l++) {
          g.beginPath();
          var y0 = (l + 1) * Hc / 10;
          for (var xx = 0; xx <= Wc; xx += 8) {
            var yy = y0 + Math.sin(xx / 34 + l * 1.7 + ci) * 7 + Math.sin(xx / 13 + l) * 3;
            if (xx === 0) g.moveTo(xx, yy); else g.lineTo(xx, yy);
          }
          g.stroke();
        }
        g.globalAlpha = 1;
      });
    });
  }

  /* ---------- display options FAB ---------- */
  var fab = document.getElementById('fab'), fabBtn = document.getElementById('fab-toggle');
  if (fab && fabBtn) {
    fabBtn.addEventListener('click', function () {
      var open = fab.classList.toggle('open');
      fabBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
  var bInk = document.getElementById('bg-ink'), bFlat = document.getElementById('bg-flat');
  var tDark = document.getElementById('th-dark'), tLight = document.getElementById('th-light');

  function setBg(flat, save) {
    root.classList.toggle('bg-flat', flat);
    if (bInk) bInk.classList.toggle('on', !flat);
    if (bFlat) bFlat.classList.toggle('on', flat);
    if (save !== false) try { localStorage.setItem('proxima-bg', flat ? 'flat' : 'ink'); } catch (e) {}
  }
  function setTheme(light, save) {
    if (themeFixed) light = false;
    root.classList.toggle('theme-light', light);
    if (tDark) tDark.classList.toggle('on', !light);
    if (tLight) tLight.classList.toggle('on', light);
    repaint();
    if (save !== false && !themeFixed) try { localStorage.setItem('proxima-theme', light ? 'light' : 'dark'); } catch (e) {}
  }
  function setAccent(name, save) {
    if (ACCENTS.indexOf(name) < 0) name = 'indigo';
    accentNow = name;
    for (var i = 0; i < ACCENTS.length; i++) {
      root.classList.remove('accent-' + ACCENTS[i]);
      var d = document.getElementById('ac-' + ACCENTS[i]);
      if (d) d.classList.toggle('on', ACCENTS[i] === name);
    }
    if (name !== 'indigo') root.classList.add('accent-' + name);
    repaint();
    if (save !== false) try { localStorage.setItem('proxima-accent', name); } catch (e) {}
  }
  if (bInk) bInk.addEventListener('click', function () { setBg(false); });
  if (bFlat) bFlat.addEventListener('click', function () { setBg(true); });
  if (tDark) tDark.addEventListener('click', function () { setTheme(false); });
  if (tLight) tLight.addEventListener('click', function () { setTheme(true); });
  ACCENTS.forEach(function (a) {
    var d = document.getElementById('ac-' + a);
    if (d) d.addEventListener('click', function () { setAccent(a); });
  });
  /* restore persisted display options */
  var startLight = false, startAccent = 'indigo', startFlat = false;
  try {
    startFlat = localStorage.getItem('proxima-bg') === 'flat';
    startLight = localStorage.getItem('proxima-theme') === 'light';
    startAccent = localStorage.getItem('proxima-accent') || 'indigo';
  } catch (e) {}
  if (startFlat) setBg(true, false);
  setTheme(startLight, false);
  setAccent(startAccent, false);

  /* ---------- expandable rows ---------- */
  document.querySelectorAll('.xrow > button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var row = btn.parentElement, open = row.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  /* ---------- demo active-state behaviors ---------- */
  document.querySelectorAll('.seg').forEach(function (seg) {
    seg.querySelectorAll('button').forEach(function (b) {
      b.addEventListener('click', function () {
        seg.querySelectorAll('button').forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on');
      });
    });
  });
  document.querySelectorAll('[role="group"] .fchip, .demo-row .fchip, .topbar .fchip').forEach(function (c) {
    c.addEventListener('click', function () {
      var scope = c.parentElement.querySelectorAll('.fchip');
      scope.forEach(function (x) { x.classList.remove('on'); });
      c.classList.add('on');
    });
  });
  document.querySelectorAll('.toggle').forEach(function (t) {
    t.addEventListener('click', function () {
      var on = t.classList.toggle('on');
      t.setAttribute('aria-checked', on ? 'true' : 'false');
    });
  });

  /* ---------- swatch click-to-copy ---------- */
  document.querySelectorAll('.sw').forEach(function (sw) {
    if (!sw.dataset.hex) return;
    sw.setAttribute('title', 'Click to copy ' + sw.dataset.hex);
    sw.addEventListener('click', function () {
      if (navigator.clipboard) navigator.clipboard.writeText(sw.dataset.hex);
      var m = sw.querySelector('.meta code'); if (!m) return;
      var old = m.textContent;
      m.textContent = 'copied!'; setTimeout(function () { m.textContent = old; }, 900);
    });
  });

  /* ---------- anchor subnav scrollspy ---------- */
  document.querySelectorAll('.subnav').forEach(function (nav) {
    var links = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]'));
    var targets = links.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); });
    if (!targets.filter(Boolean).length || !window.IntersectionObserver) return;
    var seen = {};
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { seen[e.target.id] = e.isIntersecting; });
      for (var i = 0; i < targets.length; i++) {
        if (targets[i] && seen[targets[i].id]) {
          links.forEach(function (a, j) { a.classList.toggle('on', j === i); });
          break;
        }
      }
    }, { rootMargin: '-80px 0px -55% 0px' });
    targets.forEach(function (t) { if (t) obs.observe(t); });
  });

  /* ---------- unsaved-changes savebar ----------
     Markup contract:  <form data-savebar="#id-of-savebar"> … </form>
     The bar shows "<n> unsaved change(s)" and Save / Discard. Baselines are
     captured on load, so reverting a field by hand also clears its count. */
  function wireSavebar(form) {
    var bar = document.querySelector(form.getAttribute('data-savebar'));
    if (!bar) return;
    var count = bar.querySelector('.n'), saveBtn = bar.querySelector('[data-save]'), discardBtn = bar.querySelector('[data-discard]');
    var fields = Array.prototype.slice.call(form.querySelectorAll('input, select, textarea'));
    var toggles = Array.prototype.slice.call(form.querySelectorAll('.toggle'));
    var segs = Array.prototype.slice.call(form.querySelectorAll('.seg'));
    var base = [];

    function readState() {
      var s = [];
      fields.forEach(function (f) { s.push(f.type === 'checkbox' || f.type === 'radio' ? f.checked : f.value); });
      toggles.forEach(function (t) { s.push(t.classList.contains('on')); });
      segs.forEach(function (g) {
        var on = g.querySelector('button.on');
        s.push(on ? Array.prototype.indexOf.call(g.children, on) : -1);
      });
      return s;
    }
    function snapshot() { base = readState(); }
    function refresh() {
      var now = readState(), n = 0;
      for (var i = 0; i < now.length; i++) if (now[i] !== base[i]) n++;
      bar.classList.remove('saved');
      if (n) {
        count.innerHTML = '<b>' + n + '</b> unsaved change' + (n === 1 ? '' : 's');
        bar.classList.add('on');
      } else {
        bar.classList.remove('on');
      }
    }
    snapshot();
    form.addEventListener('input', refresh);
    form.addEventListener('change', refresh);
    /* .toggle and .seg are buttons handled elsewhere, re-check after their handlers run */
    form.addEventListener('click', function (ev) {
      if (ev.target.closest('.toggle, .seg button')) setTimeout(refresh, 0);
    });
    if (saveBtn) saveBtn.addEventListener('click', function () {
      snapshot();
      count.textContent = 'All changes saved';
      bar.classList.add('saved');
      setTimeout(function () { bar.classList.remove('on'); }, 1600);
    });
    if (discardBtn) discardBtn.addEventListener('click', function () {
      fields.forEach(function (f, i) {
        if (f.type === 'checkbox' || f.type === 'radio') f.checked = base[i]; else f.value = base[i];
      });
      var off = fields.length;
      toggles.forEach(function (t, i) {
        var want = base[off + i];
        t.classList.toggle('on', want);
        t.setAttribute('aria-checked', want ? 'true' : 'false');
      });
      off += toggles.length;
      segs.forEach(function (g, i) {
        var want = base[off + i];
        Array.prototype.forEach.call(g.children, function (b, bi) { b.classList.toggle('on', bi === want); });
      });
      refresh();
    });
  }
  document.querySelectorAll('[data-savebar]').forEach(wireSavebar);

  /* ---------- spark chart builder ---------- */
  var NS = 'http://www.w3.org/2000/svg', gradSeq = 0;
  function spark(svg, opts) {
    if (!svg) return;
    opts = opts || {};
    var actual = opts.actual || [];
    var forecast = opts.forecast || [];
    var all = actual.concat(forecast);
    if (!all.length) return;
    var vb = (svg.getAttribute('viewBox') || '0 0 560 150').split(/\s+/);
    var W = parseFloat(vb[2]), H = parseFloat(vb[3]);
    var PAD = opts.pad != null ? opts.pad : 10;
    var max = opts.max != null ? opts.max : Math.max.apply(null, all) * 1.12;
    var min = opts.min != null ? opts.min : Math.min.apply(null, all) * 0.82;
    function px(i) { return PAD + i * (W - 2 * PAD) / (all.length - 1); }
    function py(v) { return H - PAD - (v - min) * (H - 2 * PAD) / (max - min); }
    function smooth(pts) {
      var d = 'M' + pts[0][0].toFixed(1) + ',' + pts[0][1].toFixed(1);
      for (var i = 1; i < pts.length; i++) {
        var p0 = pts[i - 1], p1 = pts[i], mx = ((p0[0] + p1[0]) / 2).toFixed(1);
        d += 'C' + mx + ',' + p0[1].toFixed(1) + ' ' + mx + ',' + p1[1].toFixed(1) + ' ' + p1[0].toFixed(1) + ',' + p1[1].toFixed(1);
      }
      return d;
    }
    var aPts = actual.map(function (v, i) { return [px(i), py(v)]; });
    var fPts = forecast.map(function (v, i) { return [px(actual.length - 1 + i), py(v)]; });
    if (aPts.length) fPts.unshift(aPts[aPts.length - 1]);
    function el(n, attrs) { var e = document.createElementNS(NS, n); for (var k in attrs) e.setAttribute(k, attrs[k]); svg.appendChild(e); return e; }
    svg.innerHTML = '';
    var gid = 'proxima-sparkfill-' + (++gradSeq);
    var defs = document.createElementNS(NS, 'defs');
    defs.innerHTML = '<linearGradient id="' + gid + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--ch-1)" stop-opacity=".28"/><stop offset="1" style="stop-color:var(--ch-1)" stop-opacity="0"/></linearGradient>';
    svg.appendChild(defs);
    [0.25, 0.5, 0.75].forEach(function (f) {
      el('line', { x1: PAD, x2: W - PAD, y1: (PAD + f * (H - 2 * PAD)).toFixed(1), y2: (PAD + f * (H - 2 * PAD)).toFixed(1), style: 'stroke:var(--gridline)', 'stroke-width': 1 });
    });
    el('path', { d: smooth(aPts) + 'L' + aPts[aPts.length - 1][0].toFixed(1) + ',' + (H - PAD) + 'L' + PAD + ',' + (H - PAD) + 'Z', fill: 'url(#' + gid + ')', stroke: 'none' });
    el('path', { d: smooth(aPts), fill: 'none', style: 'stroke:var(--ch-1)', 'stroke-width': 2, 'stroke-linecap': 'round' });
    if (fPts.length > 1) el('path', { d: smooth(fPts), fill: 'none', style: 'stroke:var(--ch-1)', 'stroke-width': 2, 'stroke-dasharray': '1 6', 'stroke-linecap': 'round', opacity: .8 });
    el('circle', { cx: aPts[aPts.length - 1][0], cy: aPts[aPts.length - 1][1], r: 4, style: 'fill:var(--ch-1);stroke:var(--panel)', 'stroke-width': 2 });

    /* optional threshold rule, dashed amber line across the plot */
    if (opts.threshold != null) {
      var ty = Math.max(PAD, Math.min(H - PAD, py(opts.threshold)));
      el('line', { x1: PAD, x2: W - PAD, y1: ty.toFixed(1), y2: ty.toFixed(1), style: 'stroke:var(--amber)', 'stroke-width': 1.5, 'stroke-dasharray': '5 4', opacity: .9 });
    }

    /* crosshair + tooltip (only when a tooltip element is provided) */
    var tt = opts.tooltip;
    if (!tt) return;
    /* spark() may be called repeatedly (live-preview forms), drop the previous
       listeners so they don't stack up on the same element */
    if (svg._pxHandlers) {
      svg.removeEventListener('mousemove', svg._pxHandlers.move);
      svg.removeEventListener('mouseleave', svg._pxHandlers.leave);
    }
    var cross = el('line', { x1: 0, x2: 0, y1: PAD, y2: H - PAD, style: 'stroke:var(--crosshair)', 'stroke-width': 1, opacity: 0 });
    var dot = el('circle', { r: 4.5, style: 'fill:var(--ch-1);stroke:var(--void)', 'stroke-width': 2, opacity: 0 });
    var wrap = svg.parentElement;
    var unit = opts.unit || '';
    var labelFor = opts.label || function (i) {
      return i < actual.length ? 'day ' + (i + 1) : 'forecast +' + (i - actual.length + 1);
    };
    var onMove = function (ev) {
      var r = svg.getBoundingClientRect();
      var fx = (ev.clientX - r.left) / r.width * W;
      var i = Math.round((fx - PAD) / ((W - 2 * PAD) / (all.length - 1)));
      i = Math.max(0, Math.min(all.length - 1, i));
      var cx = px(i), cy = py(all[i]);
      cross.setAttribute('x1', cx); cross.setAttribute('x2', cx); cross.setAttribute('opacity', 1);
      dot.setAttribute('cx', cx); dot.setAttribute('cy', cy); dot.setAttribute('opacity', 1);
      tt.innerHTML = '<b>' + all[i] + (unit ? '&thinsp;' + unit : '') + '</b> &middot; ' + labelFor(i);
      var wr = wrap.getBoundingClientRect();
      var lx = cx / W * r.width + (r.left - wr.left);
      var ly = cy / H * r.height + (r.top - wr.top);
      tt.style.left = Math.max(4, Math.min(wr.width - tt.offsetWidth - 4, lx - tt.offsetWidth / 2)) + 'px';
      tt.style.top = Math.max(4, ly - tt.offsetHeight - 14) + 'px';
      tt.style.opacity = 1;
    };
    var onLeave = function () {
      cross.setAttribute('opacity', 0); dot.setAttribute('opacity', 0); tt.style.opacity = 0;
    };
    svg.addEventListener('mousemove', onMove);
    svg.addEventListener('mouseleave', onLeave);
    svg._pxHandlers = { move: onMove, leave: onLeave };
  }

  /* ---------- public API ---------- */
  window.Proxima = {
    spark: spark,
    onRepaint: function (fn) { painters.push(fn); fn(isLight(), accentNow); },
    setTheme: setTheme, setAccent: setAccent, setBg: setBg
  };
})();
