// GSAP animations for Nordiska Energilösningar (vanilla JS, Shopify-safe)
// - Uses GSAP core and ScrollTrigger loaded via CDN
// - Initializes on DOMContentLoaded
// - Reinitializes on Shopify section load/unload (design mode)
// - Keeps effects lightweight, responsive, and performance-friendly

(function () {
  'use strict';

  // Minimal configuration: animate hero only by default
  var CONFIG = {
    animateHeroOnly: true,
    enableFlare: false
  };

  // Guard: GSAP must be present
  function gsapReady() {
    return typeof window.gsap !== 'undefined';
  }

  // Register plugins once
  function registerPlugins() {
    if (gsapReady() && window.ScrollTrigger && !gsap.core.globals().ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }
  }

  // Utility: prefers-reduced-motion check
  function motionOK() {
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // Utility: set will-change hints to improve animation performance
  function addWillChangeHints(elements, properties) {
    if (!elements) return;
    var props = Array.isArray(properties) ? properties.join(', ') : properties;
    elements.forEach(function (el) {
      try {
        el.style.willChange = props;
      } catch (_) {
        /* no-op */
      }
    });
  }

  // Utility: split an element's text into word spans, preserving <br> and spaces
  function splitTextIntoWordSpans(container) {
    if (!container || container.dataset && container.dataset.gsapSplit === '1') return [];

    var wordSpans = [];
    var frag = document.createDocumentFragment();

    function processNode(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        var text = node.nodeValue || '';
        // Split and keep spaces by capturing them
        var parts = text.split(/(\s+)/);
        parts.forEach(function (part) {
          if (part === '') return;
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(part));
          } else {
            var span = document.createElement('span');
            span.className = 'gsap-word';
            span.textContent = part;
            frag.appendChild(span);
            wordSpans.push(span);
          }
        });
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.tagName === 'BR') {
          frag.appendChild(document.createElement('br'));
          return;
        }
        // For other inline elements, recurse children
        var childNodes = Array.prototype.slice.call(node.childNodes);
        childNodes.forEach(processNode);
      }
    }

    var children = Array.prototype.slice.call(container.childNodes);
    children.forEach(processNode);

    // Replace content once built
    container.innerHTML = '';
    container.appendChild(frag);
    container.dataset.gsapSplit = '1';
    return wordSpans;
  }

  // Utility: group word spans into visual lines using their top positions
  function groupWordsIntoLines(words) {
    if (!words || !words.length) return [];
    var lines = [];
    var currentLineTop = null;
    var epsilon = 3; // tolerance for line breaks in px
    words.forEach(function (w) {
      var rect = w.getBoundingClientRect();
      if (currentLineTop === null || Math.abs(rect.top - currentLineTop) > epsilon) {
        currentLineTop = rect.top;
        lines.push([w]);
      } else {
        lines[lines.length - 1].push(w);
      }
    });
    return lines;
  }

  // HERO: headline fade+rise, subhead + CTA stagger, optional light flare
  function initHeroAnimations(root) {
    if (!gsapReady() || !motionOK()) return;

    var hero = root.querySelector('.section-hero, section.section-hero, .section-hero *:not(*)');
    // If no explicit wrapper, fallback to typical markup
    if (!hero) {
      hero = root.querySelector('.section-hero') || root;
    }

    // Find elements in hero
    var headline = hero.querySelector('.headline1, h1');
    var subhead = hero.querySelector('.body1, .subheadline, p');
    var ctas = hero.querySelectorAll('a[class*="knapp"], button, .knappetikett');

    // Will-change hints
    addWillChangeHints([headline].filter(Boolean), 'opacity, transform');
    addWillChangeHints(Array.prototype.slice.call(ctas), 'opacity, transform, filter');

    // Intro timeline (smooth, modern)
    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    if (headline) {
      gsap.set(headline, { y: 16, opacity: 0 });
      tl.to(headline, { y: 0, opacity: 1, duration: 0.8 });
    }

    if (ctas.length) {
      gsap.set(ctas, { y: 12, opacity: 0, filter: 'brightness(0.95)' });
      // Buttons enter before description for stronger hierarchy
      tl.to(ctas, { y: 0, opacity: 1, filter: 'brightness(1)', duration: 0.65, stagger: 0.06 }, '-=0.35');
    }

    if (subhead) {
      // Split then animate line-by-line with subtle intra-line stagger
      var words = splitTextIntoWordSpans(subhead);
      if (words.length) {
        // Need layout info to group lines
        var lines = groupWordsIntoLines(words);
        lines.forEach(function (lineWords, index) {
          addWillChangeHints(lineWords, 'opacity, transform');
          gsap.set(lineWords, { y: 10, opacity: 0 });
          tl.to(lineWords, {
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: 'power3.out',
            stagger: { each: 0.01 }
          }, index === 0 ? '-=0.1' : '>-0.3');
        });
      } else {
        // Fallback to whole element if no words detected
        addWillChangeHints([subhead], 'opacity, transform');
        gsap.set(subhead, { y: 12, opacity: 0 });
        tl.to(subhead, { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out' }, '-=0.1');
      }
    }

    // Optional sun-ray / light flare background effect (disabled by default)
    if (CONFIG.enableFlare) {
      // Creates a subtle radial gradient that slowly pans/rotates
      var flareHost = hero.querySelector('[data-flare]');
      if (!flareHost) {
        // Try to use overlay container if present; otherwise create a lightweight layer
        flareHost = document.createElement('div');
        flareHost.setAttribute('data-flare', '');
        Object.assign(flareHost.style, {
          position: 'absolute',
          inset: '0',
          pointerEvents: 'none',
          mixBlendMode: 'screen',
          background: 'radial-gradient(40% 40% at 60% 40%, rgba(255, 245, 200, 0.20) 0%, rgba(255, 245, 200, 0.08) 35%, rgba(255,255,255,0) 70%)',
          transform: 'translate3d(0,0,0)'
        });
        // Ensure hero is positioned
        if (getComputedStyle(hero).position === 'static') {
          hero.style.position = 'relative';
        }
        hero.appendChild(flareHost);
      }

      addWillChangeHints([flareHost], 'transform, opacity, background-position');

      // Gentle looping motion to suggest sunlight energy
      gsap.to(flareHost, {
        duration: 14,
        ease: 'sine.inOut',
        keyframes: [
          { xPercent: -2, yPercent: 1, rotate: -1 },
          { xPercent: 2, yPercent: -2, rotate: 1 },
          { xPercent: 0, yPercent: 0, rotate: 0 },
        ],
        repeat: -1,
        yoyo: true,
      });
    }
  }

  // SCROLL: fade+rise elements as they enter viewport
  function initScrollAnimations(root) {
    if (CONFIG.animateHeroOnly) return;
    if (!gsapReady() || !motionOK() || !window.ScrollTrigger) return;

    registerPlugins();

    // Targets: any element with data-animate or common content wrappers
    var targets = root.querySelectorAll('[data-animate], .section, .layout, .grid-omraden, .content');
    Array.prototype.forEach.call(targets, function (el) {
      // Skip hero headline (already animated)
      if (el.closest && el.closest('.section-hero')) return;

      // Attach once per element
      if (el.__gsapAnimated) return;
      el.__gsapAnimated = true;

      addWillChangeHints([el], 'opacity, transform');

      gsap.fromTo(
        el,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            toggleActions: 'play none none none',
            once: true,
          },
        }
      );
    });
  }

  // HOVER: subtle scale and glow for primary CTA buttons
  function initHoverAnimations(root) {
    if (CONFIG.animateHeroOnly) return;
    if (!gsapReady() || !motionOK()) return;

    var buttons = root.querySelectorAll('a[class*="knapp"], .knappetikett, .button, button');
    Array.prototype.forEach.call(buttons, function (btn) {
      if (btn.__gsapHoverBound) return;
      btn.__gsapHoverBound = true;

      addWillChangeHints([btn], 'transform, filter');

      var hoverIn = function () {
        gsap.to(btn, {
          duration: 0.18,
          ease: 'power2.out',
          scale: 1.03,
          filter: 'drop-shadow(0 6px 16px rgba(235, 207, 47, 0.35))',
        });
      };

      var hoverOut = function () {
        gsap.to(btn, {
          duration: 0.24,
          ease: 'power3.out',
          scale: 1.0,
          filter: 'drop-shadow(0 0 0 rgba(0,0,0,0))',
        });
      };

      btn.addEventListener('mouseenter', hoverIn, { passive: true });
      btn.addEventListener('mouseleave', hoverOut, { passive: true });
      btn.addEventListener('focus', hoverIn, { passive: true });
      btn.addEventListener('blur', hoverOut, { passive: true });
    });
  }

  // Initialize animations for a given root (document or a section container)
  function initAll(root) {
    var scope = root || document;
    try {
      initHeroAnimations(scope);
      // Scroll and hover animations are disabled for a clean, minimal hero-only setup
    } catch (e) {
      // fail-safe: never break the storefront
      if (typeof console !== 'undefined' && console.warn) {
        console.warn('[GSAP Animations] init error:', e);
      }
    }
  }

  // DOM ready init
  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  }

  onReady(function () {
    // Wait for GSAP to be available (loaded via defer)
    var attempts = 0;
    (function waitForGSAP() {
      attempts++;
      if (gsapReady()) {
        registerPlugins();
        initAll(document);
        bindShopifySectionEvents();
      } else if (attempts < 40) {
        // Try for up to ~2s (40 * 50ms)
        setTimeout(waitForGSAP, 50);
      }
    })();
  });

  // Reinitialize on Shopify section events (Theme Editor)
  function bindShopifySectionEvents() {
    var doc = document;
    doc.addEventListener('shopify:section:load', function (evt) {
      if (!evt || !evt.target) return;
      initAll(evt.target);
    });
    doc.addEventListener('shopify:section:unload', function (evt) {
      // Optional: kill ScrollTriggers in this container
      if (!window.ScrollTrigger || !evt || !evt.target) return;
      var triggers = ScrollTrigger.getAll();
      triggers.forEach(function (t) {
        var trig = t.trigger;
        if (trig && evt.target.contains(trig)) {
          t.kill(false);
        }
      });
    });
    doc.addEventListener('shopify:section:select', function (evt) {
      if (!evt || !evt.target) return;
      initAll(evt.target);
    });
    doc.addEventListener('shopify:section:deselect', function (evt) {
      // no-op
    });
    doc.addEventListener('shopify:block:select', function (evt) {
      if (!evt || !evt.target) return;
      initAll(evt.target);
    });
    doc.addEventListener('shopify:block:deselect', function () {
      // no-op
    });
  }
})();


