
  // ---------- preloader ----------
  window.addEventListener('load', () => {
    setTimeout(() => {
      const pre = document.getElementById('preloader');
      if (pre) pre.classList.add('hide');
      startHeroTitle();
    }, 1500);
  });

  // ---------- custom cursor ----------
  const ring = document.getElementById('cursorRing');
  const dot = document.getElementById('cursorDot');
  if (ring && dot) {
    let rx=0, ry=0, mx=0, my=0;
    window.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx+'px'; dot.style.top = my+'px';
    });
    function loop(){
      rx += (mx-rx)*0.16; ry += (my-ry)*0.16;
      ring.style.left = rx+'px'; ring.style.top = ry+'px';
      requestAnimationFrame(loop);
    }
    loop();
    document.querySelectorAll('a, button, .tilt-card, .faq-q, .radio-pill, figure').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });
  }

  // ---------- header on scroll ----------
  const header = document.getElementById('siteHeader');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  // ---------- scrollspy (active nav link, same-page anchors only) ----------
  const navLinks = document.querySelectorAll('nav.links a[href^="#"]');
  const spySections = Array.from(navLinks)
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);
  if (spySections.length) {
    const spyIO = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const id = '#' + e.target.id;
          navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === id));
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    spySections.forEach(s => spyIO.observe(s));
  }

  // ---------- floating mobile CTA ----------
  const floatCta = document.getElementById('floatCta');
  const devisSection = document.getElementById('devis');
  if (floatCta && devisSection) {
    window.addEventListener('scroll', () => {
      const past = window.scrollY > window.innerHeight * 0.8;
      const devisRect = devisSection.getBoundingClientRect();
      const inDevis = devisRect.top < window.innerHeight && devisRect.bottom > 0;
      floatCta.classList.toggle('show', past && !inDevis);
    });
  }

  // ---------- reveal on scroll ----------
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  revealEls.forEach(el => io.observe(el));

  // ---------- hero letter-by-letter ----------
  function startHeroTitle(){
    const h1 = document.getElementById('heroTitle');
    if (!h1) return;
    const text = h1.getAttribute('data-text');
    const words = text.split(' ');
    h1.innerHTML = words.map(w => {
      const chars = w.split('').map(c => `<span class="char">${c}</span>`).join('');
      return `<span class="word">${chars}</span>`;
    }).join(' ');
    const chars = h1.querySelectorAll('.char');
    chars.forEach((c,i) => {
      setTimeout(() => c.classList.add('in'), 250 + i*38);
    });
  }

  // ---------- animated counters ----------
  const counters = document.querySelectorAll('.counter');
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting){
        const el = e.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1600;
        const start = performance.now();
        function tick(now){
          const p = Math.min((now-start)/duration, 1);
          const eased = 1 - Math.pow(1-p, 3);
          el.textContent = Math.round(eased*target) + suffix;
          if(p<1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        counterIO.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterIO.observe(c));

  // ---------- mobile nav ----------
  const burger = document.getElementById('burgerBtn');
  const mobileNav = document.getElementById('mobileNav');
  const closeMobile = document.getElementById('closeMobile');
  if (burger && mobileNav && closeMobile) {
    burger.addEventListener('click', () => mobileNav.classList.add('open'));
    closeMobile.addEventListener('click', () => mobileNav.classList.remove('open'));
    mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileNav.classList.remove('open')));
  }

  // ---------- faq accordion ----------
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(other => {
        if (other !== item) { other.classList.remove('open'); other.querySelector('.faq-a').style.maxHeight = null; }
      });
      if (isOpen) { item.classList.remove('open'); a.style.maxHeight = null; }
      else { item.classList.add('open'); a.style.maxHeight = a.scrollHeight + 'px'; }
    });
  });

  // ---------- radio pills ----------
  document.querySelectorAll('.radio-pill input').forEach(r => {
    r.addEventListener('change', () => {
      document.querySelectorAll('.radio-pill').forEach(p => p.classList.remove('active'));
      r.closest('.radio-pill').classList.add('active');
    });
  });

  // ---------- lightbox ----------
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  if (lightbox && lightboxImg && lightboxClose) {
    window.openLightbox = function(src){ lightboxImg.src = src; lightbox.classList.add('open'); };
    lightboxClose.addEventListener('click', () => lightbox.classList.remove('open'));
    lightbox.addEventListener('click', (e) => { if(e.target === lightbox) lightbox.classList.remove('open'); });
  }

  // ---------- form submit (Formspree) ----------
  const form = document.getElementById('devisForm');
  const success = document.getElementById('formSuccess');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalLabel = submitBtn.textContent;
      submitBtn.textContent = 'Envoi en cours...';
      submitBtn.disabled = true;

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });
        if (response.ok) {
          window.location.href = '/merci.html';
        } else {
          alert("Une erreur est survenue lors de l'envoi. Merci de réessayer ou de nous contacter directement par téléphone.");
          submitBtn.textContent = originalLabel;
          submitBtn.disabled = false;
        }
      } catch (err) {
        alert("Une erreur est survenue. Vérifiez votre connexion et réessayez.");
        submitBtn.textContent = originalLabel;
        submitBtn.disabled = false;
      }
    });
  }

  // ---------- tilt cards (magnetic) ----------
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      const cx = x/r.width - 0.5, cy = y/r.height - 0.5;
      card.style.transform = `translateY(-6px) rotateX(${(-cy*6).toFixed(2)}deg) rotateY(${(cx*6).toFixed(2)}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  // ---------- hero parallax on scroll ----------
  const heroImg = document.querySelector('.hero-media img');
  if (heroImg) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if(y < window.innerHeight){
        heroImg.style.opacity = Math.max(1 - y/700, 0);
      }
    });
  }
