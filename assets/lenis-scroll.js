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

  // Initialize Lenis with ultra-smooth settings
  const lenis = new Lenis({
    duration: 2.5, // Longer duration for smoother feel
    easing: t => 1 - Math.pow(1 - t, 4), // Smooth ease-out quartic
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 0.8, // Reduced for more controlled scrolling
    smoothTouch: true, // Enable smooth touch for mobile
    touchMultiplier: 1.5, // Gentle touch scrolling
    infinite: false,
    syncTouch: true, // Better touch responsiveness
    touchInertiaMultiplier: 15, // Smooth touch inertia
    wheelMultiplier: 0.7, // Gentler wheel scrolling
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
          duration: 3.0, // Longer duration for ultra-smooth anchor scrolling
          easing: t => 1 - Math.pow(1 - t, 4), // Matching main easing
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
