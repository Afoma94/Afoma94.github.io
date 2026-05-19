(function () {
  'use strict';

  /* ---- Nav: sticky shadow on scroll ---- */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  /* ---- Mobile nav toggle ---- */
  const toggle  = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  toggle.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---- Smooth scroll for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ---- Intersection Observer: fade-in cards ---- */
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('[data-animate]').forEach(function (el) {
    observer.observe(el);
  });

  /* ---- Active nav link on scroll ---- */
  var sections = document.querySelectorAll('section[id]');
  var navAnchors = document.querySelectorAll('.nav__links a');

  window.addEventListener('scroll', function () {
    var scrollPos = window.scrollY + 100;
    sections.forEach(function (section) {
      if (section.offsetTop <= scrollPos && (section.offsetTop + section.offsetHeight) > scrollPos) {
        navAnchors.forEach(function (a) { a.removeAttribute('aria-current'); });
        var active = document.querySelector('.nav__links a[href="#' + section.id + '"]');
        if (active) active.setAttribute('aria-current', 'page');
      }
    });
  }, { passive: true });

})();
