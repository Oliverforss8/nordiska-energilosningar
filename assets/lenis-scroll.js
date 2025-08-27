/**
 * Lenis Smooth Scroll Implementation
 * Provides smooth scrolling experience across the website
 */

// Initialize Lenis smooth scroll
function initLenis() {
  // Check if Lenis is available
  if (typeof Lenis === 'undefined') {
    console.error('Lenis library not loaded - smooth scroll disabled');
    return;
  }

  console.log('Initializing Lenis smooth scroll...');

  // Add lenis class to html element
  document.documentElement.classList.add('lenis');

  // Add temporary test content if page is too short for scrolling
  const bodyHeight = document.body.scrollHeight;
  const windowHeight = window.innerHeight;
  console.log(`Page height: ${bodyHeight}px, Window height: ${windowHeight}px`);

  if (bodyHeight <= windowHeight * 1.1) {
    console.log('Adding temporary content for scroll testing...');
    const testDiv = document.createElement('div');
    testDiv.innerHTML = `
      <div style="height: 200vh; background: linear-gradient(to bottom, #f0f0f0, #d0d0d0); padding: 50px; text-align: center;">
        <h2 style="margin: 50px 0; font-size: 2em;">Scroll Test Content</h2>
        <p style="margin: 20px 0;">This is temporary content to test smooth scrolling.</p>
        <p style="margin: 20px 0;">You should feel smooth scrolling when scrolling up and down.</p>
        <div style="height: 50px; margin: 100px 0; background: #EBCF2F; border-radius: 10px; display: flex; align-items: center; justify-content: center;">
          <a href="#top" style="color: black; text-decoration: none; font-weight: bold;">Scroll to Top</a>
        </div>
      </div>
    `;
    document.body.appendChild(testDiv);
  }

  // Initialize Lenis
  const lenis = new Lenis({
    duration: 1.2,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
    direction: 'vertical', // vertical, horizontal
    gestureDirection: 'vertical', // vertical, horizontal, both
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  // Listen for the scroll event and log the event data
  lenis.on('scroll', e => {
    // You can add custom scroll events here if needed
    // console.log(e)
  });

  // Use requestAnimationFrame to continuously update the scroll
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  // Handle anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        lenis.scrollTo(target, {
          offset: 0,
          duration: 1.5,
          easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      }
    });
  });

  // Expose lenis to global scope for debugging
  window.lenis = lenis;

  console.log('Lenis smooth scroll initialized successfully!');
}

// Initialize immediately since script is loaded at bottom of body
initLenis();
