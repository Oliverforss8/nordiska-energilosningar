document.addEventListener('DOMContentLoaded', function() {
  const slider = document.querySelector('[data-slider]');
  if (!slider) return;

  const slides = slider.querySelectorAll('[data-slide]');
  const prevBtn = slider.querySelector('.hero-slider-prev');
  const nextBtn = slider.querySelector('.hero-slider-next');
  const dots = slider.querySelectorAll('.hero-slider-dot');
  
  let currentSlide = 0;
  const totalSlides = slides.length;

  if (totalSlides <= 1) return;

  function goToSlide(index) {
    // Hide current slide
    slides[currentSlide].style.opacity = '0';
    slides[currentSlide].style.pointerEvents = 'none';
    dots[currentSlide].style.backgroundColor = 'rgba(255, 255, 255, 0.5)';

    // Show new slide
    currentSlide = index;
    slides[currentSlide].style.opacity = '1';
    slides[currentSlide].style.pointerEvents = 'auto';
    dots[currentSlide].style.backgroundColor = 'white';
  }

  function nextSlide() {
    const next = (currentSlide + 1) % totalSlides;
    goToSlide(next);
  }

  function prevSlide() {
    const prev = (currentSlide - 1 + totalSlides) % totalSlides;
    goToSlide(prev);
  }

  // Event listeners
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => goToSlide(index));
  });
});

