document.documentElement.classList.add('js');

    // Menú mobile
    const burger = document.getElementById('burger'), links = document.getElementById('links');
    burger.addEventListener('click', () => { const o = links.classList.toggle('open'); burger.setAttribute('aria-expanded', o) });
    links.addEventListener('click', e => { if (e.target.tagName === 'A') links.classList.remove('open') });

    // Reveal on scroll
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }), { threshold: .15 });
    document.querySelectorAll('.rv').forEach(el => io.observe(el));

    // Roadmap: camino curvo que se dibuja con el scroll + nodos que se encienden
    const road = document.getElementById('road'), steps = [...road.querySelectorAll('.step')];
    const NS = 'http://www.w3.org/2000/svg', svg = document.createElementNS(NS, 'svg'), base = document.createElementNS(NS, 'path'), prog = document.createElementNS(NS, 'path');
    svg.setAttribute('class', 'rpath'); svg.setAttribute('aria-hidden', 'true'); base.setAttribute('class', 'pbase'); prog.setAttribute('class', 'pprog'); svg.append(base, prog); road.prepend(svg);
    let PL = 0, END = 1;

    function drawRoad() {
      const W = road.offsetWidth, H = road.offsetHeight, mob = innerWidth <= 860, pb = road.querySelector('.pb'), pts = [];
      pts.push([mob ? 18 : W / 2, pb.offsetTop + pb.offsetHeight]);
      steps.forEach(s => { const n = s.querySelector('.node'); pts.push([s.offsetLeft + n.offsetLeft + n.offsetWidth / 2, s.offsetTop + n.offsetTop + n.offsetHeight / 2]) });
      END = pts[pts.length - 1][1];
      let d = 'M' + pts[0][0] + ' ' + pts[0][1];
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1], b = pts[i], dy = b[1] - a[1], w = mob ? (i % 2 ? 16 : -16) : 0;
        d += 'C' + (a[0] + w) + ' ' + (a[1] + dy * .4) + ' ' + (b[0] - w) + ' ' + (a[1] + dy * .6) + ' ' + b[0] + ' ' + b[1]
      }
      svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H); svg.setAttribute('width', W); svg.setAttribute('height', H);
      base.setAttribute('d', d); prog.setAttribute('d', d); PL = prog.getTotalLength(); prog.style.strokeDasharray = PL; roadScroll();
    }

    function roadScroll() {
      const r = road.getBoundingClientRect(), vh = innerHeight, y = vh * .6 - r.top;
      if (PL) prog.style.strokeDashoffset = PL * (1 - Math.max(0, Math.min(1, y / END)));
      steps.forEach(s => { const b = s.getBoundingClientRect(); s.classList.toggle('on', b.top + 30 < vh * .6) });
    }

    addEventListener('scroll', roadScroll, { passive: true });
    addEventListener('resize', drawRoad);
    addEventListener('load', drawRoad);
    if (document.fonts) document.fonts.ready.then(drawRoad);
    drawRoad();

    // Carrusel
    const tr = document.getElementById('track'), step = () => tr.querySelector('.t').offsetWidth + 20;
    document.getElementById('next').onclick = () => { tr.scrollBy({ left: step(), behavior: 'smooth' }); if (tr.scrollLeft + tr.clientWidth >= tr.scrollWidth - 10) tr.scrollTo({ left: 0, behavior: 'smooth' }) };
    document.getElementById('prev').onclick = () => tr.scrollBy({ left: -step(), behavior: 'smooth' });

    // FAQ
    document.querySelectorAll('.q button').forEach(b => b.addEventListener('click', () => {
      const q = b.parentElement, o = !q.classList.contains('open');
      document.querySelectorAll('.q.open').forEach(x => { x.classList.remove('open'); x.querySelector('button').setAttribute('aria-expanded', 'false') });
      if (o) { q.classList.add('open'); b.setAttribute('aria-expanded', 'true') }
    }));

    // Video placeholder (accesible por teclado)
    document.querySelector('.video').addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') e.target.click() });

    // Fondo animado: red de nodos
    (() => {
      const c = document.getElementById('net'), x = c.getContext('2d'); let W, H, P = [];
      const rs = () => { W = c.width = c.offsetWidth; H = c.height = c.offsetHeight; const n = Math.min(70, Math.floor(W * H / 22000)); P = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35 })) };
      const d = () => {
        x.clearRect(0, 0, W, H);
        for (let i = 0; i < P.length; i++) {
          const a = P[i]; a.x += a.vx; a.y += a.vy; if (a.x < 0 || a.x > W) a.vx *= -1; if (a.y < 0 || a.y > H) a.vy *= -1;
          x.fillStyle = 'rgba(166,250,88,.8)'; x.beginPath(); x.arc(a.x, a.y, 1.8, 0, 6.283); x.fill();
          for (let j = i + 1; j < P.length; j++) {
            const b = P[j], dx = a.x - b.x, dy = a.y - b.y, m = Math.hypot(dx, dy);
            if (m < 140) { x.strokeStyle = 'rgba(166,250,88,' + (.28 * (1 - m / 140)) + ')'; x.beginPath(); x.moveTo(a.x, a.y); x.lineTo(b.x, b.y); x.stroke() }
          }
        }
        if (!matchMedia('(prefers-reduced-motion:reduce)').matches) requestAnimationFrame(d)
      };
      rs(); d(); addEventListener('resize', rs)
    })();
