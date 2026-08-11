// Mobile navigation drawer
(function () {
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('mainNav');
  const backdrop = document.getElementById('navBackdrop');
  const closeBtn = document.getElementById('navClose');

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
    '.diff-item', '.gallery-tile', '.journey-item', '.journey-card', '.pillar-item',
    '.pill-stat', '.trust-box', '.therapy-card'
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

// Gallery lightbox — zoom on click, with prev/next navigation
document.addEventListener('DOMContentLoaded', function () {
  const tiles = Array.from(document.querySelectorAll('.gallery-tile img'));
  if (!tiles.length) return;

  // Build overlay markup once
  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.innerHTML = `
    <button class="lightbox-close" aria-label="Close">&times;</button>
    <button class="lightbox-nav lightbox-prev" aria-label="Previous image">&#10094;</button>
    <div class="lightbox-img-wrap"><img src="" alt=""></div>
    <button class="lightbox-nav lightbox-next" aria-label="Next image">&#10095;</button>
    <div class="lightbox-counter"></div>
  `;
  document.body.appendChild(overlay);

  const imgEl = overlay.querySelector('.lightbox-img-wrap img');
  const counterEl = overlay.querySelector('.lightbox-counter');
  const closeBtn = overlay.querySelector('.lightbox-close');
  const prevBtn = overlay.querySelector('.lightbox-prev');
  const nextBtn = overlay.querySelector('.lightbox-next');

  let currentIndex = 0;

  function show(index) {
    currentIndex = (index + tiles.length) % tiles.length;
    const src = tiles[currentIndex].getAttribute('src');
    const alt = tiles[currentIndex].getAttribute('alt') || '';
    imgEl.setAttribute('src', src);
    imgEl.setAttribute('alt', alt);
    counterEl.textContent = (currentIndex + 1) + ' / ' + tiles.length;
  }

  function openLightbox(index) {
    show(index);
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  tiles.forEach(function (img, i) {
    img.addEventListener('click', function () { openLightbox(i); });
  });

  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', function () { show(currentIndex - 1); });
  nextBtn.addEventListener('click', function () { show(currentIndex + 1); });

  // Click on dark backdrop (not the image itself) closes it
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeLightbox();
  });

  document.addEventListener('keydown', function (e) {
    if (!overlay.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') show(currentIndex - 1);
    if (e.key === 'ArrowRight') show(currentIndex + 1);
  });
});