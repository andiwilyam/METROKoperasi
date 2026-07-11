/* ============================================================
   MetroKSP Landing Page - Main JavaScript
   ============================================================ */

(() => {
  'use strict';

  // ============================================================
  // DOM Elements
  // ============================================================
  const header = document.querySelector('.mk-header');
  const toggler = document.querySelector('.mk-toggler');
  const mobileMenu = document.querySelector('.mk-mobile-menu');
  const mobileLinks = mobileMenu?.querySelectorAll('a');
  const backToTop = document.querySelector('.mk-back-to-top');
  const ctaBanner = document.querySelector('.mk-cta-banner');
  const animatedElements = document.querySelectorAll('.mk-animate, .mk-in-view');

  // ============================================================
  // Mobile Menu Toggle
  // ============================================================
  function initMobileMenu() {
    if (!toggler || !mobileMenu) return;

    toggler.addEventListener('click', () => {
      const isOpen = toggler.getAttribute('aria-expanded') === 'true';
      toggler.setAttribute('aria-expanded', !isOpen);
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    mobileLinks?.forEach(link => {
      link.addEventListener('click', () => {
        toggler.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        toggler.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      }
    });

    // Close on outside click
    mobileMenu.addEventListener('click', (e) => {
      if (e.target === mobileMenu) {
        toggler.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // ============================================================
  // Header Scroll Effect
  // ============================================================
  function initHeaderScroll() {
    if (!header) return;
    let lastScroll = 0;
    const threshold = 50;

    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;

      if (currentScroll > threshold) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      lastScroll = currentScroll;
    }, { passive: true });
  }

  // ============================================================
  // Back to Top Button
  // ============================================================
  function initBackToTop() {
    if (!backToTop) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    }, { passive: true });

    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ============================================================
  // Intersection Observer for Animations
  // ============================================================
  function initScrollAnimations() {
    if (!('IntersectionObserver' in window)) {
      // Fallback: show all immediately
      animatedElements.forEach(el => el.style.opacity = '1');
      return;
    }

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('mk-in-view');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe elements with data-animation or mk-animate classes
    const elementsToAnimate = document.querySelectorAll('[data-animation], .mk-product-card, .mk-testi-card, .mk-app-card, .mk-whyus-content, .mk-check-item, .mk-counter-item, .mk-stat, .mk-float-card, .mk-hero-left, .mk-cta-content > *');
    elementsToAnimate.forEach((el, index) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.7s ease-out, transform 0.7s ease-out';
      el.style.transitionDelay = `${Math.min(index * 50, 300)}ms`;
      observer.observe(el);
    });

    // Counter animation
    const counters = document.querySelectorAll('.counter[data-count]');
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
  }

  function animateCounter(element) {
    const target = parseInt(element.dataset.count, 10);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
      current += step;
      if (current < target) {
        element.textContent = Math.floor(current).toLocaleString();
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target.toLocaleString();
      }
    };
    updateCounter();
  }

  // ============================================================
  // Smooth Scroll for Anchor Links
  // ============================================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const headerHeight = header?.offsetHeight || 0;
          const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
          window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
      });
    });
  }

  // ============================================================
  // Newsletter Form (demo Form Submit
  // ============================================================
  function initNewsletterForm() {
    const form = document.querySelector('.mk-nl-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const button = form.querySelector('button');
      const email = input?.value?.trim();

      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        input?.focus();
        return;
      }

      const originalText = button.textContent;
      button.disabled = true;
      button.textContent = 'Mendaftar...';

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      button.textContent = 'Terdaftar!';
      button.style.background = 'var(--mk-primary)';
      button.style.color = 'var(--mk-white)';
      input.value = '';

      setTimeout(() => {
        button.disabled = false;
        button.textContent = originalText;
        button.style.background = '';
        button.style.color = '';
      }, 3000);
    });
  }

  // ============================================================
  // Parallax for CTA Banner
  // ============================================================
  function initParallax() {
    if (!ctaBanner || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      const rate = scrolled * 0.3;
      ctaBanner.style.backgroundPositionY = `${rate}px`;
    }, { passive: true });
  }

  // ============================================================
  // Active Nav Link on Scroll
  // ============================================================
  function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.mk-nav a, .mk-mobile-menu a');

    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, { rootMargin: '-50% 0px -50% 0px', threshold: 0 });

    sections.forEach(section => observer.observe(section));
  }

  // ============================================================
  // Initialize All
  // ============================================================
  function init() {
    initMobileMenu();
    initHeaderScroll();
    initBackToTop();
    initScrollAnimations();
    initSmoothScroll();
    initNewsletterForm();
    initParallax();
    initActiveNav();

    // Add animation delays to product cards
    document.querySelectorAll('.mk-product-card').forEach((card, i) => {
      card.style.transitionDelay = `${i * 100}ms`;
    });

    document.querySelectorAll('.mk-testi-card').forEach((card, i) => {
      card.style.transitionDelay = `${i * 100}ms`;
    });

    document.querySelectorAll('.mk-app-card').forEach((card, i) => {
      card.style.transitionDelay = `${i * 100}ms`;
    });

    console.log('MetroKSP Landing Page initialized');
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();