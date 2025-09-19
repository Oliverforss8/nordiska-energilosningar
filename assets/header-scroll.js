document.addEventListener('DOMContentLoaded', function () {
  const header = document.querySelector('[data-header]');

  if (!header) {
    console.log('Header not found');
    return;
  }

  let lastScrollY = window.scrollY;
  let ticking = false;

  function handleScroll() {
    const currentScrollY = window.scrollY;

    // Add scrolled class when user scrolls down
    if (currentScrollY > 50) {
      header.classList.add('scrolled');
      console.log('Added scrolled class');
    } else {
      header.classList.remove('scrolled');
      console.log('Removed scrolled class');
    }

    lastScrollY = currentScrollY;
    ticking = false;
  }

  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(handleScroll);
      ticking = true;
    }
  }

  // Listen for scroll events
  window.addEventListener('scroll', requestTick, { passive: true });

  // Initial check in case page is already scrolled
  handleScroll();

  console.log('Header scroll functionality initialized');
});
