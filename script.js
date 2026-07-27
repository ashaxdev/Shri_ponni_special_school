// Scroll-reveal animations — adds .reveal to content blocks and
// fades/slides them in with a small stagger as they enter the viewport.
document.addEventListener('DOMContentLoaded', function () {
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var selectors = [
    '.focus-card', '.value-card', '.vm-card', '.iso-card', '.iso-cert',
    '.diff-item', '.gallery-tile', '.journey-item', '.pillar-item',
    '.pill-stat', '.trust-box'
  ].join(',');

  var groups = {}; // group elements by their parent so we can stagger siblings
  document.querySelectorAll(selectors).forEach(function (el) {
    el.classList.add('reveal');
    var parent = el.parentElement;
    if (!groups[parent] ) { /* noop, using map below */ }
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
