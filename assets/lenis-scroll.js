// Lenis smooth scrolling for Shopify theme
// Import Lenis from CDN and initialize smooth scrolling

let lenisInstance = null;

// Global getter for Lenis instance
const getLenis = () => lenisInstance;

// Initialize Lenis when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
  // Check if Lenis is already loaded
  if (typeof Lenis === 'undefined') {
    // Load Lenis from CDN if not already loaded
    const script = document.createElement('script');
    script.src =
      'https://cdn.jsdelivr.net/gh/studio-freight/lenis@1.0.27/bundled/lenis.min.js';
    script.onload = initLenis;
    document.head.appendChild(script);
  } else {
    initLenis();
  }
});

function initLenis() {
  if (typeof window === 'undefined' || typeof Lenis === 'undefined') return;

  // Create Lenis instance with premium configuration
  lenisInstance = new Lenis({
    duration: 1.2,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential ease-out
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
    infinite: false,
  });

  // Animation frame loop
  function raf(time) {
    if (lenisInstance) {
      lenisInstance.raf(time);
    }
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  // Add smooth scrolling to anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target && lenisInstance) {
        lenisInstance.scrollTo(target, {
          duration: 1.5,
          easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      }
    });
  });

  // Add smooth scrolling to Shopify form submissions
  document.addEventListener('submit', function (e) {
    if (e.target.tagName === 'FORM' && lenisInstance) {
      // Smooth scroll to top after form submission
      setTimeout(() => {
        lenisInstance.scrollTo(0, {
          duration: 1.0,
          easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      }, 100);
    }
  });

  console.log('Lenis smooth scrolling initialized');
}

// Export for use in other scripts
window.getLenis = getLenis;
window.lenisInstance = lenisInstance;
