/* Interactions for Władysław Dąbrowa landing page */

(function () {
  // ─────────── Smooth scroll for anchor links ───────────
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      const navH = 72;
      const y = el.getBoundingClientRect().top + window.pageYOffset - navH + 1;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });

  // ─────────── Scroll-spy nav ───────────
  const navLinks = document.querySelectorAll('.nav-links a[data-target]');
  const sections = Array.from(navLinks)
    .map((l) => document.getElementById(l.dataset.target))
    .filter(Boolean);

  function onScroll() {
    const y = window.scrollY + 120;
    let active = sections[0]?.id;
    for (const s of sections) {
      if (s.offsetTop <= y) active = s.id;
    }
    navLinks.forEach((l) => {
      l.classList.toggle('active', l.dataset.target === active);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ─────────── Reveal on scroll ───────────
  const reveals = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
  );
  reveals.forEach((r) => io.observe(r));

  // ─────────── FAQ accordion (custom — close others) ───────────
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const summary = item.querySelector('.faq-q');
    const answer = item.querySelector('.faq-a-inner');
    if (!summary || !answer) return;
    // Wrap answer for max-height animation
    const wrap = document.createElement('div');
    wrap.className = 'faq-a';
    item.insertBefore(wrap, answer);
    wrap.appendChild(answer);
    item.removeAttribute('open');

    summary.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = item.classList.contains('open');
      faqItems.forEach((other) => {
        if (other !== item) {
          other.classList.remove('open');
          const w = other.querySelector('.faq-a');
          if (w) w.style.maxHeight = '0px';
        }
      });
      if (isOpen) {
        item.classList.remove('open');
        wrap.style.maxHeight = '0px';
      } else {
        item.classList.add('open');
        wrap.style.maxHeight = wrap.scrollHeight + 'px';
      }
    });
  });

  // ─────────── Reviews slider ───────────
  const cards = document.querySelectorAll('.review-card');
  const dots = document.querySelectorAll('.review-dot');
  let revIdx = 0;
  let revTimer = null;

  function showReview(i) {
    revIdx = (i + cards.length) % cards.length;
    cards.forEach((c, j) => c.classList.toggle('active', j === revIdx));
    dots.forEach((d, j) => d.classList.toggle('active', j === revIdx));
  }
  function autoplay() {
    clearInterval(revTimer);
    revTimer = setInterval(() => showReview(revIdx + 1), 6000);
  }
  dots.forEach((d) =>
    d.addEventListener('click', () => {
      showReview(parseInt(d.dataset.idx, 10));
      autoplay();
    })
  );
  document.getElementById('rev-prev')?.addEventListener('click', () => {
    showReview(revIdx - 1);
    autoplay();
  });
  document.getElementById('rev-next')?.addEventListener('click', () => {
    showReview(revIdx + 1);
    autoplay();
  });
  autoplay();

  // ─────────── Gallery filter ───────────
  const filters = document.querySelectorAll('.gallery-filter');
  const items = document.querySelectorAll('.gallery-item');
  filters.forEach((f) => {
    f.addEventListener('click', () => {
      filters.forEach((x) => x.classList.remove('active'));
      f.classList.add('active');
      const cat = f.dataset.filter;
      items.forEach((it) => {
        const match = cat === 'all' || it.dataset.cat === cat;
        it.style.display = match ? '' : 'none';
        it.style.opacity = match ? '' : '0';
      });
    });
  });

  // ─────────── Photo slider ───────────
  (function () {
    const slides = document.querySelectorAll('.ps-slide');
    const thumbs = document.querySelectorAll('.ps-thumb');
    const cur = document.getElementById('ps-cur');
    if (!slides.length) return;
    let psIdx = 0;
    let psTimer = null;
    function show(i) {
      psIdx = (i + slides.length) % slides.length;
      slides.forEach((s, j) => s.classList.toggle('active', j === psIdx));
      thumbs.forEach((t, j) => t.classList.toggle('active', j === psIdx));
      if (cur) cur.textContent = psIdx + 1;
    }
    function auto() { clearInterval(psTimer); psTimer = setInterval(() => show(psIdx + 1), 5000); }
    thumbs.forEach((t) => t.addEventListener('click', () => { show(parseInt(t.dataset.idx, 10)); auto(); }));
    document.getElementById('ps-prev')?.addEventListener('click', () => { show(psIdx - 1); auto(); });
    document.getElementById('ps-next')?.addEventListener('click', () => { show(psIdx + 1); auto(); });
    auto();
  })();

  // ─────────── Before/After slider ───────────
  const ba = document.getElementById('ba1');
  if (ba) {
    const after = ba.querySelector('.ba-after');
    const handle = ba.querySelector('.ba-handle');
    let dragging = false;

    function setPos(clientX) {
      const r = ba.getBoundingClientRect();
      let p = ((clientX - r.left) / r.width) * 100;
      p = Math.max(2, Math.min(98, p));
      after.style.clipPath = `inset(0 0 0 ${p}%)`;
      handle.style.left = p + '%';
    }
    const start = (e) => {
      dragging = true;
      e.preventDefault();
    };
    const move = (e) => {
      if (!dragging) return;
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      setPos(x);
    };
    const end = () => (dragging = false);
    handle.addEventListener('mousedown', start);
    handle.addEventListener('touchstart', start, { passive: false });
    window.addEventListener('mousemove', move);
    window.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('mouseup', end);
    window.addEventListener('touchend', end);
    ba.addEventListener('click', (e) => {
      if (e.target === handle) return;
      const x = e.clientX;
      setPos(x);
    });
  }
})();
