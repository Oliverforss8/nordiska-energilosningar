document.addEventListener('DOMContentLoaded', function() {
  const slider = document.querySelector('[data-slider]');
  if (!slider) return;

  const slides = slider.querySelectorAll('[data-slide]');
  const prevBtn = slider.querySelector('.hero-slider-prev');
  const nextBtn = slider.querySelector('.hero-slider-next');
  const dots = slider.querySelectorAll('.hero-slider-dot');
  
  let currentSlide = 0;
  const totalSlides = slides.length;
  let autoplayInterval = null;

  if (totalSlides <= 1) return;

  // Get autoplay speed from section settings (passed via data attribute)
  const section = slider.closest('section');
  const autoplaySpeed = section?.dataset?.autoplaySpeed ? parseInt(section.dataset.autoplaySpeed) : 5000;

  function goToSlide(index) {
    // Hide current slide
    slides[currentSlide].style.opacity = '0';
    slides[currentSlide].style.pointerEvents = 'none';
    if (dots[currentSlide]) {
      dots[currentSlide].style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
    }

    // Show new slide
    currentSlide = index;
    slides[currentSlide].style.opacity = '1';
    slides[currentSlide].style.pointerEvents = 'auto';
    if (dots[currentSlide]) {
      dots[currentSlide].style.backgroundColor = 'white';
    }
  }

  function nextSlide() {
    const next = (currentSlide + 1) % totalSlides;
    goToSlide(next);
  }

  function prevSlide() {
    const prev = (currentSlide - 1 + totalSlides) % totalSlides;
    goToSlide(prev);
  }

  function startAutoplay() {
    if (autoplaySpeed > 0) {
      autoplayInterval = setInterval(nextSlide, autoplaySpeed);
    }
  }

  function stopAutoplay() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
    }
  }

  function resetAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  // Event listeners
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetAutoplay();
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetAutoplay();
    });
  }
  
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      goToSlide(index);
      resetAutoplay();
    });
  });

  // Pause autoplay on hover
  slider.addEventListener('mouseenter', stopAutoplay);
  slider.addEventListener('mouseleave', startAutoplay);

  // Start autoplay
  startAutoplay();
});

