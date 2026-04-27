

'use strict';

/* ---- Loader ---- */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (!loader) return;
  setTimeout(() => loader.classList.add('fade-out'), 800);
  setTimeout(() => loader.remove(), 1500);
});

/* ---- Utility ---- */
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

/* ---- Sticky Navbar ---- */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  function updateNavbar() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();
})();

/* ---- Mobile Hamburger ---- */
(function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
})();

/* ---- Smooth scroll for all anchor links ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* ---- Scroll Reveal Animation ---- */
(function initReveal() {
  const revealEls = document.querySelectorAll('.reveal, .section-header, .about-grid, .about-text, .service-card, .gallery-item, .testimonial-card, .contact-info, .contact-form');

  // Add reveal class to section headers if not present
  document.querySelectorAll('.section-header').forEach(el => el.classList.add('reveal'));
  document.querySelectorAll('.about-text').forEach(el => el.classList.add('reveal'));
  document.querySelectorAll('.about-visual').forEach(el => el.classList.add('reveal'));

  const allReveals = document.querySelectorAll('.reveal');

  function checkReveal() {
    const windowHeight = window.innerHeight;
    allReveals.forEach((el, index) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < windowHeight - 80) {
        // Stagger cards in a row
        const delay = el.closest('.services-grid') || el.closest('.gallery-grid')
          ? (Array.from(el.parentNode.children).indexOf(el) * 100)
          : 0;
        setTimeout(() => el.classList.add('visible'), delay);
      }
    });
  }

  window.addEventListener('scroll', checkReveal, { passive: true });
  window.addEventListener('resize', checkReveal);
  // Run once on load
  setTimeout(checkReveal, 200);
})();

/* ---- Gallery Filter ---- */
(function initGallery() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (!filterBtns.length || !galleryItems.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      const filter = this.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const cat = item.getAttribute('data-cat');
        const show = filter === 'all' || cat === filter;

        if (show) {
          item.style.display = '';
          item.style.opacity = '0';
          item.style.transform = 'scale(0.9)';
          // Animate in
          requestAnimationFrame(() => {
            item.style.transition = 'opacity .4s ease, transform .4s ease';
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          });
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.9)';
          setTimeout(() => { item.style.display = 'none'; }, 350);
        }
      });
    });
  });
})();

/* ---- Testimonials Slider ---- */
(function initSlider() {
  const track     = document.getElementById('testimonialTrack');
  const prevBtn   = document.getElementById('prevBtn');
  const nextBtn   = document.getElementById('nextBtn');
  const dotsWrap  = document.getElementById('sliderDots');

  if (!track || !prevBtn || !nextBtn) return;

  const cards = track.querySelectorAll('.testimonial-card');
  let current = 0;
  let autoTimer;

  // Build dots
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.classList.add('slider-dot');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  function getDots() { return dotsWrap.querySelectorAll('.slider-dot'); }

  function goTo(index) {
    current = (index + cards.length) % cards.length;
    track.style.transform = `translateX(calc(-${current * 100}% - ${current * 28}px))`;

    getDots().forEach((d, i) => d.classList.toggle('active', i === current));

    // Restart auto
    clearInterval(autoTimer);
    startAuto();
  }

  function prev() { goTo(current - 1); }
  function next() { goTo(current + 1); }

  function startAuto() {
    autoTimer = setInterval(() => next(), 5000);
  }

  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  // Swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
  });

  // Keyboard support
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });

  startAuto();
})();

/* ---- Contact Form Validation ---- */
(function initForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const fields = {
    name:    { el: document.getElementById('name'),    errEl: document.getElementById('nameError') },
    email:   { el: document.getElementById('email'),   errEl: document.getElementById('emailError') },
    service: { el: document.getElementById('service'), errEl: document.getElementById('serviceError') },
    message: { el: document.getElementById('message'), errEl: document.getElementById('messageError') },
  };
  const successEl = document.getElementById('formSuccess');

  function showError(key, msg) {
    fields[key].el.classList.add('error');
    fields[key].errEl.textContent = msg;
  }
  function clearError(key) {
    fields[key].el.classList.remove('error');
    fields[key].errEl.textContent = '';
  }
  function clearAll() { Object.keys(fields).forEach(clearError); }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Live validation
  Object.keys(fields).forEach(key => {
    const el = fields[key].el;
    el.addEventListener('input', () => {
      if (el.value.trim()) clearError(key);
    });
    el.addEventListener('blur', () => validateField(key));
  });

  function validateField(key) {
    const val = fields[key].el.value.trim();
    if (key === 'name') {
      if (!val) { showError('name', 'Please enter your name.'); return false; }
      if (val.length < 2) { showError('name', 'Name must be at least 2 characters.'); return false; }
    }
    if (key === 'email') {
      if (!val) { showError('email', 'Please enter your email address.'); return false; }
      if (!validateEmail(val)) { showError('email', 'Please enter a valid email address.'); return false; }
    }
    if (key === 'service') {
      if (!val) { showError('service', 'Please select a service.'); return false; }
    }
    if (key === 'message') {
      if (!val) { showError('message', 'Please tell us about your order.'); return false; }
      if (val.length < 10) { showError('message', 'Message is too short. Please provide more details.'); return false; }
    }
    clearError(key);
    return true;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearAll();

    const results = Object.keys(fields).map(key => validateField(key));
    const allValid = results.every(Boolean);

    if (!allValid) return;

    // Simulate submission
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>Sending...</span>';
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      form.reset();
      successEl.classList.add('show');
      setTimeout(() => successEl.classList.remove('show'), 5000);
    }, 1800);
  });
})();

/* ---- Parallax on Hero ---- */
(function initParallax() {
  const hero = document.getElementById('hero');
  if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  function applyParallax() {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      const shapes = hero.querySelectorAll('.hero-shape');
      shapes.forEach((shape, i) => {
        const speed = 0.08 + (i * 0.03);
        shape.style.transform = `translateY(${scrollY * speed}px)`;
      });
    }
  }

  window.addEventListener('scroll', applyParallax, { passive: true });
})();

/* ---- Active nav link on scroll ---- */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  function updateActiveLink() {
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 120) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.style.fontWeight = link.getAttribute('href') === `#${current}` ? '500' : '400';
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
})();

/* ---- Back to top on logo click ---- */
document.querySelector('.nav-logo')?.addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ---- Hover tilt on service cards (desktop) ---- */
(function initCardTilt() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotateX = ((y - cy) / cy) * -4;
      const rotateY = ((x - cx) / cx) *  4;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();
