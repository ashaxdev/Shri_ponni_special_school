// Mobile navigation drawer
(function () {
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('main-nav');
  const backdrop = document.getElementById('nav-backdrop');
  const closeBtn = document.getElementById('nav-close');

  if (!toggle || !nav || !backdrop) return;

  function openNav() {
    nav.classList.add('open');
    backdrop.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    nav.classList.remove('open');
    backdrop.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', function () {
    const isOpen = nav.classList.contains('open');
    isOpen ? closeNav() : openNav();
  });

  backdrop.addEventListener('click', closeNav);
  if (closeBtn) closeBtn.addEventListener('click', closeNav);

  // Close the drawer whenever a nav link is tapped
  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeNav);
  });

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeNav();
  });

  // Close automatically if the viewport is resized back to desktop
  window.addEventListener('resize', function () {
    if (window.innerWidth > 980) closeNav();
  });
})();

// Scroll-reveal animations — adds .reveal to content blocks and
// fades/slides them in with a small stagger as they enter the viewport.
document.addEventListener('DOMContentLoaded', function () {
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var selectors = [
    '.focus-card', '.value-card', '.vm-card', '.iso-card', '.iso-cert',
    '.diff-item', '.gallery-tile', '.journey-item', '.pillar-item',
    '.pill-stat', '.trust-box'
  ].join(',');

  document.querySelectorAll(selectors).forEach(function (el) {
    el.classList.add('reveal');
  });

  // Stagger by sibling index within each parent
  var seen = new Map();
  document.querySelectorAll(selectors).forEach(function (el) {
    var parent = el.parentElement;
    var i = seen.get(parent) || 0;
    el.style.setProperty('--reveal-delay', (i * 0.08) + 's');
    seen.set(parent, i + 1);
  });

  // Also reveal section headings/eyebrows softly
  document.querySelectorAll('section h2, section .eyebrow').forEach(function (el) {
    el.classList.add('reveal');
  });

  if (prefersReduced || !('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('in-view');
    });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(function (el) {
    observer.observe(el);
  });
});